import { NextRequest, NextResponse } from 'next/server'

import {
  clearAuthCookie,
  getBackendBaseUrl,
  getStoredAuthCookie,
  setAuthCookie,
  toAuthSession,
} from '@/lib/server-auth'
import { toApiErrorResponse, toBusiness } from '@/lib/server-business'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  BackendBusinessResponse,
  BackendCreateBusinessResponse,
  BusinessListResponse,
  CreateBusinessSuccessResponse,
} from '@/types/business'

const buildUnauthorizedResponse = (message: string) => {
  const response = NextResponse.json({ message } satisfies ApiErrorResponse, { status: 401 })
  clearAuthCookie(response)
  return response
}

export async function GET() {
  try {
    const storedCookie = await getStoredAuthCookie()
    if (!storedCookie) {
      return NextResponse.json(
        { message: 'Missing auth cookie.' } satisfies ApiErrorResponse,
        { status: 401 }
      )
    }

    const backendURL = getBackendBaseUrl()
    const res = await fetch(`${backendURL}/api/v1/businesses/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${storedCookie.accessToken}`,
      },
      cache: 'no-store',
    })

    if (res.status === 401) {
      return buildUnauthorizedResponse('Your session has expired. Please sign in again.')
    }

    const text = await res.text()
    const contentType = res.headers.get('content-type') ?? ''

    if (!res.ok) {
      const json = contentType.includes('application/json')
        ? toApiErrorResponse(JSON.parse(text), 'Request failed.')
        : { message: text || 'Request failed.' }

      return NextResponse.json(json, { status: res.status })
    }

    const businesses = (JSON.parse(text) as BackendBusinessResponse[]).map(toBusiness)

    return NextResponse.json({ businesses } satisfies BusinessListResponse, { status: res.status })
  } catch (error) {
    console.error('Businesses list proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}

export async function POST(req: NextRequest) {
  try {
    const storedCookie = await getStoredAuthCookie()
    if (!storedCookie) {
      return NextResponse.json(
        { message: 'Missing auth cookie.' } satisfies ApiErrorResponse,
        { status: 401 }
      )
    }

    const body = await req.text()
    const backendURL = getBackendBaseUrl()
    const res = await fetch(`${backendURL}/api/v1/businesses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${storedCookie.accessToken}`,
      },
      body,
      cache: 'no-store',
    })

    if (res.status === 401) {
      return buildUnauthorizedResponse('Your session has expired. Please sign in again.')
    }

    const text = await res.text()
    const contentType = res.headers.get('content-type') ?? ''

    if (!res.ok) {
      const json = contentType.includes('application/json')
        ? toApiErrorResponse(JSON.parse(text), 'Request failed.')
        : { message: text || 'Request failed.' }

      return NextResponse.json(json, { status: res.status })
    }

    const payload = JSON.parse(text) as BackendCreateBusinessResponse
    const response = NextResponse.json(
      {
        message: 'Business created successfully.',
        business: toBusiness(payload.business),
        session: toAuthSession(payload.auth),
        redirectTo: '/manage_business',
      } satisfies CreateBusinessSuccessResponse,
      { status: res.status }
    )

    setAuthCookie(response, payload.auth)
    return response
  } catch (error) {
    console.error('Business create proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
