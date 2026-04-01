import { NextRequest, NextResponse } from 'next/server'

import { toApiErrorResponse } from '@/lib/server-business'
import { getBackendBaseUrl } from '@/lib/server-auth'
import { toStaffMember } from '@/lib/server-staff'
import type { ApiErrorResponse } from '@/types/auth'
import type { BackendStaffMemberResponse, ServiceStaffAssignmentResponse } from '@/types/staff'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string; serviceId: string }> }
) {
  try {
    const { businessId, serviceId } = await params
    const includeInactive = req.nextUrl.searchParams.get('include_inactive')
    const query = new URLSearchParams()
    if (includeInactive?.trim()) {
      query.set('include_inactive', includeInactive.trim())
    }

    const backendURL = getBackendBaseUrl()
    const response = await fetch(
      `${backendURL}/api/v1/businesses/${businessId}/services/${serviceId}/staff-members${
        query.toString() ? `?${query.toString()}` : ''
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
        message: 'Service staff loaded successfully.',
        staffMembers: text.trim().length
          ? (JSON.parse(text) as BackendStaffMemberResponse[]).map(toStaffMember)
          : [],
      } satisfies ServiceStaffAssignmentResponse,
      { status: response.status }
    )
  } catch (error) {
    console.error('Discovery service staff proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
