import type { JWTPayload } from 'jose'

import type { AuthRole } from '@/types/auth'

export const AUTH_COOKIE_NAME = 'auth_token'

export type AccessMap = {
  prefix: string
  cookieName: string
  allowedRoles: AuthRole[]
  extractAccessToken?: boolean
}

export const routeAccessMap: AccessMap[] = [
  {
    prefix: '/admin',
    cookieName: AUTH_COOKIE_NAME,
    allowedRoles: ['ADMIN'],
    extractAccessToken: true,
  },
  {
    prefix: '/manage_business',
    cookieName: AUTH_COOKIE_NAME,
    allowedRoles: ['BUSINESS_OWNER'],
    extractAccessToken: true,
  },
  {
    prefix: '/start-business',
    cookieName: AUTH_COOKIE_NAME,
    allowedRoles: ['CUSTOMER', 'BUSINESS_OWNER'],
    extractAccessToken: true,
  },
  {
    prefix: '/bookings',
    cookieName: AUTH_COOKIE_NAME,
    allowedRoles: ['CUSTOMER'],
    extractAccessToken: true,
  },
  {
    prefix: '/profile',
    cookieName: AUTH_COOKIE_NAME,
    allowedRoles: ['CUSTOMER'],
    extractAccessToken: true,
  },
]

export const GUEST_ONLY_PATHS = new Set<string>(['/login', '/register'])

const PUBLIC_EXACT = new Set<string>(['/', '/login', '/register', '/discover', '/find'])
const PUBLIC_PREFIXES = [
  '/businesses',
  '/_next',
  '/favicon',
  '/assets',
  '/images',
  '/api/auth',
  '/api/health',
]

export const isPublicPath = (pathname: string) => {
  if (PUBLIC_EXACT.has(pathname)) return true
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export const normalizeRoles = (roles: readonly string[] | null | undefined): AuthRole[] => {
  return [...new Set((roles ?? []).map((role) => role.trim().toUpperCase()).filter(Boolean))]
}

export const getRolesFromPayload = (payload: JWTPayload | unknown): AuthRole[] => {
  if (typeof payload !== 'object' || payload === null) {
    return []
  }

  const rawPayload = payload as Record<string, unknown>

  if (Array.isArray(rawPayload.roles)) {
    return normalizeRoles(rawPayload.roles.filter((value): value is string => typeof value === 'string'))
  }

  if (typeof rawPayload.role === 'string') {
    return normalizeRoles([rawPayload.role])
  }

  return []
}

export const sanitizeReturnUrl = (returnUrl: string | null | undefined) => {
  if (!returnUrl || typeof returnUrl !== 'string') return null

  const trimmed = returnUrl.trim()
  if (!trimmed.startsWith('/') || trimmed.startsWith('//')) return null

  return trimmed
}

const extractPathname = (pathnameOrUrl: string) => {
  try {
    return new URL(pathnameOrUrl, 'https://mybookins.local').pathname
  } catch {
    return pathnameOrUrl.split('?')[0] ?? '/'
  }
}

export const hasAllowedRole = (currentRoles: readonly string[], allowedRoles: readonly string[]) => {
  const normalizedRoles = normalizeRoles(currentRoles)
  return allowedRoles.some((allowedRole) => normalizedRoles.includes(allowedRole.toUpperCase()))
}

export const canAccessPath = (pathnameOrUrl: string, roles: readonly string[]) => {
  const pathname = extractPathname(pathnameOrUrl)

  if (GUEST_ONLY_PATHS.has(pathname)) return false
  if (isPublicPath(pathname)) return true

  const bucket = routeAccessMap.find((item) => pathname.startsWith(item.prefix))
  if (!bucket) return true

  return hasAllowedRole(roles, bucket.allowedRoles)
}

export const getDefaultRedirectForRoles = (roles: readonly string[]) => {
  const normalizedRoles = normalizeRoles(roles)

  if (normalizedRoles.includes('ADMIN')) return '/admin/dashboard'
  if (normalizedRoles.includes('BUSINESS_OWNER')) return '/manage_business'
  if (normalizedRoles.includes('CUSTOMER')) return '/discover'

  return '/'
}

export const resolveAuthenticatedRedirect = (
  roles: readonly string[],
  returnUrl?: string | null
) => {
  const safeReturnUrl = sanitizeReturnUrl(returnUrl)

  if (safeReturnUrl && canAccessPath(safeReturnUrl, roles)) {
    return safeReturnUrl
  }

  return getDefaultRedirectForRoles(roles)
}

export const buildLoginRedirectPath = (returnUrl?: string | null) => {
  const safeReturnUrl = sanitizeReturnUrl(returnUrl)
  if (!safeReturnUrl) return '/login'

  const params = new URLSearchParams({ returnUrl: safeReturnUrl })
  return `/login?${params.toString()}`
}
