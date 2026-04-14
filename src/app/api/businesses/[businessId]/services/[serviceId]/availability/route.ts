import { NextRequest, NextResponse } from 'next/server'

import { clearAuthCookie, getBackendBaseUrl, getStoredAuthCookie } from '@/lib/server-auth'
import { toAvailability } from '@/lib/server-availability'
import { toApiErrorResponse } from '@/lib/server-business'
import type { BackendAvailabilityResponse, AvailabilityResponse } from '@/types/availability'
import type { ApiErrorResponse } from '@/types/auth'

const buildUnauthorizedResponse = (message: string) => {
  const response = NextResponse.json({ message } satisfies ApiErrorResponse, { status: 401 })
  clearAuthCookie(response)
  return response
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string; serviceId: string }> }
) {
  try {
    const { businessId, serviceId } = await params
    const storedCookie = await getStoredAuthCookie()
    if (!storedCookie) {
      return NextResponse.json(
        { message: 'Missing auth cookie.' } satisfies ApiErrorResponse,
        { status: 401 }
      )
    }

    const date = req.nextUrl.searchParams.get('date')
    const staffMemberId = req.nextUrl.searchParams.get('staff_member_id')
    const paramsQuery = new URLSearchParams()
    if (date) paramsQuery.set('date', date)
    if (staffMemberId) paramsQuery.set('staff_member_id', staffMemberId)
    paramsQuery.set('include_timeline', 'true')

    const backendURL = getBackendBaseUrl()
    const query = paramsQuery.toString()
    const res = await fetch(
      `${backendURL}/api/v1/businesses/${businessId}/services/${serviceId}/availability?${query}`,
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

    const availability = toAvailability(JSON.parse(text) as BackendAvailabilityResponse)
    return NextResponse.json(
      { availability } satisfies AvailabilityResponse,
      { status: res.status }
    )
  } catch (error) {
    console.error('Availability proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
