import { NextRequest, NextResponse } from 'next/server'

import { clearAuthCookie, getBackendBaseUrl, getStoredAuthCookie } from '@/lib/server-auth'
import { toApiErrorResponse } from '@/lib/server-business'
import { toStaffMember } from '@/lib/server-staff'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  BackendStaffMemberResponse,
  StaffMutationResponse,
  UpdateStaffMemberActivePayload,
} from '@/types/staff'

const buildUnauthorizedResponse = (message: string) => {
  const response = NextResponse.json({ message } satisfies ApiErrorResponse, { status: 401 })
  clearAuthCookie(response)
  return response
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string; staffMemberId: string }> }
) {
  try {
    const { businessId, staffMemberId } = await params
    const storedCookie = await getStoredAuthCookie()
    if (!storedCookie) {
      return NextResponse.json(
        { message: 'Missing auth cookie.' } satisfies ApiErrorResponse,
        { status: 401 }
      )
    }

    const body = (await req.json()) as UpdateStaffMemberActivePayload
    const backendURL = getBackendBaseUrl()
    const res = await fetch(
      `${backendURL}/api/v1/businesses/${businessId}/staff-members/${staffMemberId}/active`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${storedCookie.accessToken}`,
        },
        body: JSON.stringify(body),
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

    const staffMember = toStaffMember(JSON.parse(text) as BackendStaffMemberResponse)
    return NextResponse.json(
      {
        message: staffMember.isActive
          ? 'Staff member activated successfully.'
          : 'Staff member deactivated successfully.',
        staffMember,
      } satisfies StaffMutationResponse,
      { status: res.status }
    )
  } catch (error) {
    console.error('Staff member active-state proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
