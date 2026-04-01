import { NextRequest, NextResponse } from 'next/server'

import { clearAuthCookie, getBackendBaseUrl, getStoredAuthCookie } from '@/lib/server-auth'
import { toApiErrorResponse } from '@/lib/server-business'
import { buildStaffInviteUrl, toStaffInvitation, toStaffMember, toUserSummary } from '@/lib/server-staff'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  BackendOnboardStaffResponse,
  OnboardStaffByEmailPayload,
  OnboardStaffSuccessResponse,
} from '@/types/staff'

const buildUnauthorizedResponse = (message: string) => {
  const response = NextResponse.json({ message } satisfies ApiErrorResponse, { status: 401 })
  clearAuthCookie(response)
  return response
}

export async function POST(
  req: NextRequest,
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

    const body = (await req.json()) as OnboardStaffByEmailPayload
    const backendURL = getBackendBaseUrl()
    const res = await fetch(`${backendURL}/api/v1/businesses/${businessId}/staff-members/onboard`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${storedCookie.accessToken}`,
      },
      body: JSON.stringify(body),
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

    const payload = JSON.parse(text) as BackendOnboardStaffResponse
    const invitation =
      payload.invitation && payload.outcome === 'INVITATION_CREATED'
        ? toStaffInvitation(
            payload.invitation,
            payload.token ? buildStaffInviteUrl(req.nextUrl.origin, payload.token) : undefined
          )
        : payload.invitation
          ? toStaffInvitation(payload.invitation)
          : null

    return NextResponse.json(
      {
        message:
          payload.outcome === 'INVITATION_CREATED'
            ? 'Staff invitation created successfully.'
            : payload.outcome === 'STAFF_MEMBER_EXISTS'
              ? 'This account is already attached to the business.'
              : 'Staff member attached successfully.',
        outcome: payload.outcome,
        user: payload.user ? toUserSummary(payload.user) : null,
        staffMember: payload.staff_member ? toStaffMember(payload.staff_member) : null,
        invitation,
      } satisfies OnboardStaffSuccessResponse,
      { status: res.status }
    )
  } catch (error) {
    console.error('Staff onboarding proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
