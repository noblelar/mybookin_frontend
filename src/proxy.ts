import * as jose from 'jose'
import { NextRequest, NextResponse } from 'next/server'

import {
  AUTH_COOKIE_NAME,
  buildLoginRedirectPath,
  getRolesFromPayload,
  GUEST_ONLY_PATHS,
  getDefaultRedirectForRoles,
  resolveAuthenticatedRedirect,
  type AccessMap,
  routeAccessMap,
} from '@/lib/auth'

const getSecretKey = () => {
  const secret = process.env.JWT_SECRET
  if (!secret) throw new Error('JWT_SECRET is not set')
  return new TextEncoder().encode(secret)
}

const PUBLIC_EXACT = new Set<string>(['/', '/login', '/register', '/admin/login', '/discover', '/find', '/accept-staff-invite'])
const PUBLIC_PREFIXES = ['/businesses', '/_next', '/favicon', '/assets', '/images', '/api/auth', '/api/health']

const isPublicPath = (pathname: string) => {
  if (PUBLIC_EXACT.has(pathname)) return true
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

const parseAccessTokenFromCookie = (
  rawCookie: string | undefined,
  extractAccessToken?: boolean
) => {
  if (!rawCookie || !rawCookie.trim().length) return null
  if (!extractAccessToken) return rawCookie

  try {
    const parsed = JSON.parse(rawCookie) as { accessToken?: string }
    return typeof parsed.accessToken === 'string' && parsed.accessToken.length > 0
      ? parsed.accessToken
      : null
  } catch {
    return null
  }
}

const verifyJwt = async (token: string) => {
  try {
    const { payload } = await jose.jwtVerify(token, getSecretKey())
    return payload
  } catch {
    return null
  }
}

const redirectIfValidToken = async (
  req: NextRequest,
  cookieName: string,
  extractAccessToken = false,
  returnUrl?: string | null
) => {
  const token = parseAccessTokenFromCookie(req.cookies.get(cookieName)?.value, extractAccessToken)
  if (!token) return null

  const payload = await verifyJwt(token)
  if (!payload) return null

  const redirectTo = resolveAuthenticatedRedirect(getRolesFromPayload(payload), returnUrl)
  return NextResponse.redirect(new URL(redirectTo, req.url))
}

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  const returnUrl = pathname + search

  if (isPublicPath(pathname)) {
    if (pathname === '/admin/login') {
      const token = parseAccessTokenFromCookie(req.cookies.get(AUTH_COOKIE_NAME)?.value, true)
      if (token) {
        const payload = await verifyJwt(token)
        if (payload) {
          const roles = getRolesFromPayload(payload)
          if (roles.some((role) => role.toUpperCase() === 'ADMIN' || role.toUpperCase() === 'SUPER_ADMIN')) {
            const redirectTo = resolveAuthenticatedRedirect(roles, req.nextUrl.searchParams.get('returnUrl'))
            return NextResponse.redirect(new URL(redirectTo, req.url))
          }
        }
      }
    }

    if (GUEST_ONLY_PATHS.has(pathname)) {
      const redirect = await redirectIfValidToken(
        req,
        AUTH_COOKIE_NAME,
        true,
        req.nextUrl.searchParams.get('returnUrl')
      )
      if (redirect) return redirect
    }

    return NextResponse.next()
  }

  const bucket = routeAccessMap.find((item) => pathname.startsWith(item.prefix))
  if (!bucket) {
    return NextResponse.next()
  }

  const rawCookie = req.cookies.get(bucket.cookieName)?.value
  const accessToken = parseAccessTokenFromCookie(rawCookie, bucket.extractAccessToken)

  let payload: object | null = null
  if (accessToken) {
    payload = await verifyJwt(accessToken)
  }

  if (!payload) {
    if (pathname.startsWith('/admin/')) {
      const params = new URLSearchParams({ returnUrl })
      return NextResponse.redirect(new URL(`/admin/login?${params.toString()}`, req.url))
    }

    return NextResponse.redirect(new URL(buildLoginRedirectPath(returnUrl), req.url))
  }

  const roles = getRolesFromPayload(payload)
  if (!hasRouteAccess(bucket, roles)) {
    return NextResponse.redirect(new URL(getDefaultRedirectForRoles(roles), req.url))
  }

  return NextResponse.next()
}

const hasRouteAccess = (bucket: AccessMap, roles: readonly string[]) => {
  return bucket.allowedRoles.some((allowedRole) =>
    roles.some((role) => role.toUpperCase() === allowedRole.toUpperCase())
  )
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/manage_business/:path*',
    '/start-business/:path*',
    '/bookings/:path*',
    '/profile/:path*',
    '/login',
    '/register',
  ],
}
