import { NextRequest, NextResponse } from 'next/server'

import { buildAuthSuccessResponse, getBackendBaseUrl } from '@/lib/server-auth'
import type { ApiErrorResponse, BackendAuthResponse } from '@/types/auth'

type SocialExchangeProxyRequest = {
  returnUrl?: string
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const requestBody = body ? (JSON.parse(body) as SocialExchangeProxyRequest) : {}
    const backendURL = getBackendBaseUrl()

    const res = await fetch(`${backendURL}/api/v1/auth/social/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
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
          message: json.error || 'Unable to continue with social sign-in.',
          code: json.code,
        } satisfies ApiErrorResponse,
        { status: res.status }
      )
    }

    const authResponse = JSON.parse(text) as BackendAuthResponse
    return buildAuthSuccessResponse(authResponse, requestBody.returnUrl, res.status)
  } catch (error) {
    console.error('Social exchange proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
