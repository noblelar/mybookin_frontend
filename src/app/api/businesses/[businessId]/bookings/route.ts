import { NextRequest, NextResponse } from 'next/server'

import { clearAuthCookie, getBackendBaseUrl, getStoredAuthCookie } from '@/lib/server-auth'
import { toApiErrorResponse, toBooking } from '@/lib/server-business'
import type { ApiErrorResponse } from '@/types/auth'
import type { BackendBookingResponse, BusinessBookingsResponse } from '@/types/booking'

const buildUnauthorizedResponse = (message: string) => {
  const response = NextResponse.json({ message } satisfies ApiErrorResponse, { status: 401 })
  clearAuthCookie(response)
  return response
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const storedCookie = await getStoredAuthCookie()
    if (!storedCookie) {
      return NextResponse.json(
        { message: 'Missing auth cookie.' } satisfies ApiErrorResponse,
        { status: 401 }
      )
    }

    const { businessId } = await params
    const backendURL = getBackendBaseUrl()
    const queryString = req.nextUrl.searchParams.toString()
    const endpoint = `${backendURL}/api/v1/businesses/${businessId}/bookings${
      queryString ? `?${queryString}` : ''
    }`

    const res = await fetch(endpoint, {
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

    const bookings = (JSON.parse(text) as BackendBookingResponse[]).map(toBooking)

    return NextResponse.json({ bookings } satisfies BusinessBookingsResponse, {
      status: res.status,
    })
  } catch (error) {
    console.error('Business bookings proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
