import { NextRequest, NextResponse } from 'next/server'

import { clearAuthCookie, getBackendBaseUrl, getStoredAuthCookie } from '@/lib/server-auth'
import { toApiErrorResponse, toBooking } from '@/lib/server-business'
import type { ApiErrorResponse } from '@/types/auth'
import type { BackendBookingResponse, BookingListResponse } from '@/types/booking'

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

    const query = new URLSearchParams()
    for (const key of ['status', 'date_from', 'date_to']) {
      const value = req.nextUrl.searchParams.get(key)
      if (value?.trim()) {
        query.set(key, value.trim())
      }
    }

    const backendURL = getBackendBaseUrl()
    const response = await fetch(
      `${backendURL}/api/v1/bookings/me${query.toString() ? `?${query.toString()}` : ''}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${storedCookie.accessToken}`,
        },
        cache: 'no-store',
      }
    )

    if (response.status === 401) {
      return buildUnauthorizedResponse('Your session has expired. Please sign in again.')
    }

    const text = await response.text()
    const contentType = response.headers.get('content-type') ?? ''
    if (!response.ok) {
      const json = contentType.includes('application/json')
        ? toApiErrorResponse(JSON.parse(text), 'Request failed.')
        : { message: text || 'Request failed.' }
      return NextResponse.json(json, { status: response.status })
    }

    return NextResponse.json(
      {
        bookings: text.trim().length
          ? (JSON.parse(text) as BackendBookingResponse[]).map(toBooking)
          : [],
      } satisfies BookingListResponse,
      { status: response.status }
    )
  } catch (error) {
    console.error('Customer bookings proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
