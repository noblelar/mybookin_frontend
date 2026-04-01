import { NextRequest, NextResponse } from 'next/server'

import { toAvailability } from '@/lib/server-availability'
import { getBackendBaseUrl } from '@/lib/server-auth'
import { toApiErrorResponse } from '@/lib/server-business'
import type { ApiErrorResponse } from '@/types/auth'
import type { AvailabilityResponse, BackendAvailabilityResponse } from '@/types/availability'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string; serviceId: string }> }
) {
  try {
    const { businessId, serviceId } = await params
    const query = new URLSearchParams()
    const date = req.nextUrl.searchParams.get('date')
    const staffMemberId = req.nextUrl.searchParams.get('staff_member_id')

    if (date?.trim()) {
      query.set('date', date.trim())
    }
    if (staffMemberId?.trim()) {
      query.set('staff_member_id', staffMemberId.trim())
    }

    const backendURL = getBackendBaseUrl()
    const response = await fetch(
      `${backendURL}/api/v1/businesses/${businessId}/services/${serviceId}/availability?${
        query.toString()
      }`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    )

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
        availability: toAvailability(JSON.parse(text) as BackendAvailabilityResponse),
      } satisfies AvailabilityResponse,
      { status: response.status }
    )
  } catch (error) {
    console.error('Discovery availability proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
