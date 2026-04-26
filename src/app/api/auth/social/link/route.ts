import { NextRequest, NextResponse } from 'next/server'

import {
  getBackendBaseUrl,
  getStoredAuthCookie,
  mergeStoredAuthWithProfile,
  setAuthCookie,
  toAuthSession,
} from '@/lib/server-auth'
import type {
  ApiErrorResponse,
  BackendUserProfileResponse,
  SocialLinkSuccessResponse,
} from '@/types/auth'

export async function POST(req: NextRequest) {
  const storedCookie = await getStoredAuthCookie()
  if (!storedCookie) {
    return NextResponse.json(
      { message: 'You need to sign in before linking a social account.' } satisfies ApiErrorResponse,
      { status: 401 }
    )
  }

  try {
    const body = await req.text()
    const backendURL = getBackendBaseUrl()

    const res = await fetch(`${backendURL}/api/v1/auth/social/link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${storedCookie.accessToken}`,
      },
      body,
      cache: 'no-store',
    })

    const text = await res.text()
    const contentType = res.headers.get('content-type') ?? ''

    if (!res.ok) {
      const json = contentType.includes('application/json')
        ? (JSON.parse(text) as { error?: string; code?: string })
        : { error: text || 'Request failed.' }

      return NextResponse.json(
        {
          message: json.error || 'Unable to link the social account.',
          code: json.code,
        } satisfies ApiErrorResponse,
        { status: res.status }
      )
    }

    const profile = JSON.parse(text) as BackendUserProfileResponse
    const mergedAuthResponse = mergeStoredAuthWithProfile(profile, storedCookie)
    const session = toAuthSession(mergedAuthResponse)

    const response = NextResponse.json(
      {
        message: 'Social account linked successfully.',
        session,
      } satisfies SocialLinkSuccessResponse,
      { status: 200 }
    )

    setAuthCookie(response, mergedAuthResponse)
    return response
  } catch (error) {
    console.error('Social link proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
