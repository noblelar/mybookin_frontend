import { NextRequest, NextResponse } from 'next/server'

import { clearAuthCookie, getBackendBaseUrl, getStoredAuthCookie } from '@/lib/server-auth'
import { toApiErrorResponse, toBooking } from '@/lib/server-business'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  BackendBookingResponse,
  BookingMutationResponse,
  CreateBookingPayload,
} from '@/types/booking'

const buildUnauthorizedResponse = (message: string) => {
  const response = NextResponse.json({ message } satisfies ApiErrorResponse, { status: 401 })
  clearAuthCookie(response)
  return response
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string; serviceId: string }> }
) {
  try {
    const storedCookie = await getStoredAuthCookie()
    if (!storedCookie) {
      return NextResponse.json(
        { message: 'Please sign in to complete this booking.' } satisfies ApiErrorResponse,
        { status: 401 }
      )
    }

    const { businessId, serviceId } = await params
    const body = (await req.json()) as CreateBookingPayload
    const backendURL = getBackendBaseUrl()
    const response = await fetch(
      `${backendURL}/api/v1/businesses/${businessId}/services/${serviceId}/bookings`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedCookie.accessToken}`,
        },
        body: JSON.stringify(body),
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
        message: 'Booking created successfully.',
        booking: toBooking(JSON.parse(text) as BackendBookingResponse),
      } satisfies BookingMutationResponse,
      { status: response.status }
    )
  } catch (error) {
    console.error('Discovery create booking proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
