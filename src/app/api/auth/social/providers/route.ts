import { NextResponse } from 'next/server'

import { getBackendBaseUrl, getStoredAuthCookie } from '@/lib/server-auth'
import type { ApiErrorResponse, SocialProvidersResponse } from '@/types/auth'

export async function GET() {
  const storedCookie = await getStoredAuthCookie()
  if (!storedCookie) {
    return NextResponse.json(
      { message: 'You need to sign in to view linked social providers.' } satisfies ApiErrorResponse,
      { status: 401 }
    )
  }

  try {
    const backendURL = getBackendBaseUrl()

    const res = await fetch(`${backendURL}/api/v1/auth/social/providers`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${storedCookie.accessToken}`,
      },
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
          message: json.error || 'Unable to load linked social providers.',
          code: json.code,
        } satisfies ApiErrorResponse,
        { status: res.status }
      )
    }

    return NextResponse.json(JSON.parse(text) as SocialProvidersResponse, { status: 200 })
  } catch (error) {
    console.error('Social providers proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
