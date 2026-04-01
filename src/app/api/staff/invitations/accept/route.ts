import { NextRequest, NextResponse } from 'next/server'

import { clearAuthCookie, getBackendBaseUrl, getStoredAuthCookie } from '@/lib/server-auth'
import { toApiErrorResponse } from '@/lib/server-business'
import { toStaffInvitation, toStaffMember } from '@/lib/server-staff'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  AcceptStaffInvitationSuccessResponse,
  BackendAcceptStaffInvitationResponse,
} from '@/types/staff'

const buildUnauthorizedResponse = (message: string) => {
  const response = NextResponse.json({ message } satisfies ApiErrorResponse, { status: 401 })
  clearAuthCookie(response)
  return response
}

export async function POST(req: NextRequest) {
  try {
    const storedCookie = await getStoredAuthCookie()
    if (!storedCookie) {
      return NextResponse.json(
        { message: 'Missing auth cookie.' } satisfies ApiErrorResponse,
        { status: 401 }
      )
    }

    const body = await req.text()
    const backendURL = getBackendBaseUrl()
    const res = await fetch(`${backendURL}/api/v1/staff/invitations/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${storedCookie.accessToken}`,
      },
      body,
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

    const payload = JSON.parse(text) as BackendAcceptStaffInvitationResponse
    return NextResponse.json(
      {
        message: 'Staff invitation accepted successfully.',
        invitation: toStaffInvitation(payload.invitation),
        staffMember: toStaffMember(payload.staff_member),
        redirectTo: '/discover',
      } satisfies AcceptStaffInvitationSuccessResponse,
      { status: res.status }
    )
  } catch (error) {
    console.error('Accept staff invitation proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
