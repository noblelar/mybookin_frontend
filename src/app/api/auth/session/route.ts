import {
  buildSessionResponse,
  clearAuthCookie,
  getStoredAuthCookie,
  getBackendBaseUrl,
  toAuthUser,
} from '@/lib/server-auth'
import type { BackendUserProfileResponse } from '@/types/auth'
import { AUTH_COOKIE_NAME } from '@/lib/auth'

export async function GET() {
  const storedCookie = await getStoredAuthCookie()

  if (!storedCookie) {
    return buildSessionResponse(null, false)
  }

  try {
    const backendURL = getBackendBaseUrl()
    const response = await fetch(`${backendURL}/api/v1/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${storedCookie.accessToken}`,
      },
      cache: 'no-store',
    })

    if (response.status === 401) {
      const unauthenticatedResponse = buildSessionResponse(null, false)
      clearAuthCookie(unauthenticatedResponse)
      return unauthenticatedResponse
    }

    if (!response.ok) {
      const fallbackSession = {
        user: storedCookie.user,
        expiresAt: storedCookie.expiresAt,
      }

      return buildSessionResponse(fallbackSession, true)
    }

    const profile = (await response.json()) as BackendUserProfileResponse
    const refreshedSession = {
      user: toAuthUser({
        ...profile,
        access_token: storedCookie.accessToken,
        token_type: storedCookie.tokenType,
        expires_at: storedCookie.expiresAt,
      }),
      expiresAt: storedCookie.expiresAt,
    }

    const sessionResponse = buildSessionResponse(refreshedSession, true)
    sessionResponse.cookies.set({
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      name: AUTH_COOKIE_NAME,
      value: JSON.stringify({
        accessToken: storedCookie.accessToken,
        tokenType: storedCookie.tokenType,
        expiresAt: storedCookie.expiresAt,
        user: refreshedSession.user,
      }),
      expires: storedCookie.expiresAt ? new Date(storedCookie.expiresAt) : undefined,
    })

    return sessionResponse
  } catch (error) {
    console.error('Session route error:', error)

    const fallbackSession = {
      user: storedCookie.user,
      expiresAt: storedCookie.expiresAt,
    }

    return buildSessionResponse(fallbackSession, true)
  }
}
