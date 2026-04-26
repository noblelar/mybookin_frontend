import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { AUTH_COOKIE_NAME, normalizeRoles, resolveAuthenticatedRedirect } from '@/lib/auth'
import type {
  AuthActionSuccessResponse,
  AuthCookiePayload,
  AuthSession,
  AuthUser,
  BackendAuthResponse,
  BackendUserProfileResponse,
  SessionResponse,
} from '@/types/auth'

const BACKEND_ENV_KEYS = [
  'BACKEND_API_URL',
  'NEXT_PUBLIC_BACKEND_API_URL',
  'NEXT_PUBLIC_BACKEND_WS_URL',
] as const

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
}

export const getBackendBaseUrl = () => {
  const backendUrl = BACKEND_ENV_KEYS.map((key) => process.env[key]).find(
    (value): value is string => typeof value === 'string' && value.trim().length > 0
  )

  if (!backendUrl) {
    throw new Error('Backend URL not configured.')
  }

  return backendUrl.replace(/\/+$/, '')
}

export const toAuthUser = (response: BackendAuthResponse): AuthUser => {
  return {
    userId: response.user_id,
    firstName: response.first_name,
    lastName: response.last_name,
    email: response.email,
    phone: response.phone ?? null,
    authProvider: response.auth_provider,
    authMethods: response.auth_methods ?? [],
    roles: normalizeRoles(response.roles),
    createdAt: response.created_at,
    updatedAt: response.updated_at,
  }
}

export const toAuthSession = (response: BackendAuthResponse): AuthSession => {
  return {
    user: toAuthUser(response),
    expiresAt: response.expires_at,
  }
}

export const mergeStoredAuthWithProfile = (
  profile: BackendUserProfileResponse,
  storedCookie: AuthCookiePayload
): BackendAuthResponse => {
  return {
    ...profile,
    access_token: storedCookie.accessToken,
    token_type: storedCookie.tokenType,
    expires_at: storedCookie.expiresAt,
  }
}

export const parseAuthCookie = (rawCookie: string | undefined) => {
  if (!rawCookie || !rawCookie.trim().length) return null

  try {
    const parsed = JSON.parse(rawCookie) as Partial<AuthCookiePayload>
    if (typeof parsed.accessToken !== 'string' || !parsed.accessToken.trim().length) {
      return null
    }

    if (!parsed.user || typeof parsed.user !== 'object') {
      return null
    }

    return {
      accessToken: parsed.accessToken,
      tokenType: typeof parsed.tokenType === 'string' ? parsed.tokenType : 'Bearer',
      expiresAt: typeof parsed.expiresAt === 'string' ? parsed.expiresAt : '',
      user: {
        ...(parsed.user as AuthUser),
        authMethods: Array.isArray((parsed.user as Partial<AuthUser>).authMethods)
          ? ((parsed.user as Partial<AuthUser>).authMethods as string[])
          : [],
      },
    } satisfies AuthCookiePayload
  } catch {
    return null
  }
}

export const setAuthCookie = (response: NextResponse, authResponse: BackendAuthResponse) => {
  const session = toAuthSession(authResponse)
  const expiresAt = new Date(session.expiresAt)

  response.cookies.set({
    ...cookieOptions,
    name: AUTH_COOKIE_NAME,
    value: JSON.stringify({
      accessToken: authResponse.access_token,
      tokenType: authResponse.token_type,
      expiresAt: session.expiresAt,
      user: session.user,
    } satisfies AuthCookiePayload),
    expires: Number.isNaN(expiresAt.getTime()) ? undefined : expiresAt,
  })
}

export const clearAuthCookie = (response: NextResponse) => {
  response.cookies.set({
    ...cookieOptions,
    name: AUTH_COOKIE_NAME,
    value: '',
    expires: new Date(0),
  })
}

export const getStoredAuthCookie = async () => {
  const cookieStore = await cookies()
  return parseAuthCookie(cookieStore.get(AUTH_COOKIE_NAME)?.value)
}

export const buildAuthSuccessResponse = (
  authResponse: BackendAuthResponse,
  returnUrl?: string | null,
  status = 200
) => {
  const session = toAuthSession(authResponse)
  const response = NextResponse.json(
    {
      message: 'Authenticated successfully.',
      session,
      redirectTo: resolveAuthenticatedRedirect(session.user.roles, returnUrl),
    } satisfies AuthActionSuccessResponse,
    { status }
  )

  setAuthCookie(response, authResponse)
  return response
}

export const buildSessionResponse = (session: AuthSession | null, authenticated: boolean) => {
  return NextResponse.json(
    {
      authenticated,
      session,
    } satisfies SessionResponse,
    { status: 200 }
  )
}
