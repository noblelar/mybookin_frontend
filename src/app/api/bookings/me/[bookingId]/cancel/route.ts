import { NextRequest, NextResponse } from 'next/server'

import { clearAuthCookie, getBackendBaseUrl, getStoredAuthCookie } from '@/lib/server-auth'
import { toApiErrorResponse, toBooking } from '@/lib/server-business'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  BackendBookingResponse,
  BookingMutationResponse,
  CancelBookingPayload,
} from '@/types/booking'

const buildUnauthorizedResponse = (message: string) => {
  const response = NextResponse.json({ message } satisfies ApiErrorResponse, { status: 401 })
  clearAuthCookie(response)
  return response
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ bookingId: string }> }
) {
  try {
    const storedCookie = await getStoredAuthCookie()
    if (!storedCookie) {
      return NextResponse.json(
        { message: 'Missing auth cookie.' } satisfies ApiErrorResponse,
        { status: 401 }
      )
    }

    const { bookingId } = await params
    const body = (await req.json()) as CancelBookingPayload
    const backendURL = getBackendBaseUrl()
    const response = await fetch(`${backendURL}/api/v1/bookings/me/${bookingId}/cancel`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${storedCookie.accessToken}`,
      },
      body: JSON.stringify(body),
      cache: 'no-store',
    })

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
        message: 'Booking cancelled successfully.',
        booking: toBooking(JSON.parse(text) as BackendBookingResponse),
      } satisfies BookingMutationResponse,
      { status: response.status }
    )
  } catch (error) {
    console.error('Customer booking cancel proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
