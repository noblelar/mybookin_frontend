import { NextRequest, NextResponse } from 'next/server'

import { clearAuthCookie, getBackendBaseUrl, getStoredAuthCookie } from '@/lib/server-auth'
import { toApiErrorResponse } from '@/lib/server-business'
import { toStaffInvitation } from '@/lib/server-staff'
import type { ApiErrorResponse } from '@/types/auth'
import type { BackendStaffInvitationResponse, StaffInvitationListResponse } from '@/types/staff'

const buildUnauthorizedResponse = (message: string) => {
  const response = NextResponse.json({ message } satisfies ApiErrorResponse, { status: 401 })
  clearAuthCookie(response)
  return response
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ businessId: string }> }
) {
  try {
    const { businessId } = await params
    const storedCookie = await getStoredAuthCookie()
    if (!storedCookie) {
      return NextResponse.json(
        { message: 'Missing auth cookie.' } satisfies ApiErrorResponse,
        { status: 401 }
      )
    }

    const backendURL = getBackendBaseUrl()
    const res = await fetch(`${backendURL}/api/v1/businesses/${businessId}/staff-invitations`, {
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

    const invitations = (JSON.parse(text) as BackendStaffInvitationResponse[]).map((invitation) =>
      toStaffInvitation(invitation)
    )
    return NextResponse.json(
      { invitations } satisfies StaffInvitationListResponse,
      { status: res.status }
    )
  } catch (error) {
    console.error('Staff invitations proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
