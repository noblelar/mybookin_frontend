import { NextRequest, NextResponse } from 'next/server'

import { clearAuthCookie, getBackendBaseUrl, getStoredAuthCookie } from '@/lib/server-auth'
import { toApiErrorResponse, toBusiness } from '@/lib/server-business'
import type { ApiErrorResponse } from '@/types/auth'
import type { BackendBusinessResponse, BusinessListResponse } from '@/types/business'

const buildUnauthorizedResponse = (message: string) => {
  const response = NextResponse.json({ message } satisfies ApiErrorResponse, { status: 401 })
  clearAuthCookie(response)
  return response
}

export async function GET(req: NextRequest) {
  try {
    const storedCookie = await getStoredAuthCookie()
    if (!storedCookie) {
      return NextResponse.json(
        { message: 'Missing auth cookie.' } satisfies ApiErrorResponse,
        { status: 401 }
      )
    }

    const backendURL = getBackendBaseUrl()
    const backendSearchParams = new URLSearchParams()

    for (const key of ['status', 'category', 'city', 'postcode', 'search']) {
      const value = req.nextUrl.searchParams.get(key)
      if (value && value.trim().length) {
        backendSearchParams.set(key, value)
      }
    }

    const query = backendSearchParams.toString()
    const res = await fetch(
      `${backendURL}/api/v1/admin/businesses${query ? `?${query}` : ''}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${storedCookie.accessToken}`,
        },
        cache: 'no-store',
      }
    )

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
    console.error('Admin businesses proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
