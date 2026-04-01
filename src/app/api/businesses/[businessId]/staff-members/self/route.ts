import { NextRequest, NextResponse } from 'next/server'

import { clearAuthCookie, getBackendBaseUrl, getStoredAuthCookie } from '@/lib/server-auth'
import { toApiErrorResponse } from '@/lib/server-business'
import { toStaffMember } from '@/lib/server-staff'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  BackendStaffMemberResponse,
  StaffSelfMutationResponse,
  StaffSelfStatusResponse,
} from '@/types/staff'

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
    const res = await fetch(`${backendURL}/api/v1/businesses/${businessId}/staff-members/self`, {
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
    if (res.status === 404) {
      const json = contentType.includes('application/json')
        ? toApiErrorResponse(JSON.parse(text), 'Request failed.')
        : { message: text || 'Request failed.' }

      if (json.message.toLowerCase() === 'staff member not found') {
        return NextResponse.json(
          { exists: false, staffMember: null } satisfies StaffSelfStatusResponse,
          { status: 200 }
        )
      }

      return NextResponse.json(json, { status: res.status })
    }

    if (!res.ok) {
      const json = contentType.includes('application/json')
        ? toApiErrorResponse(JSON.parse(text), 'Request failed.')
        : { message: text || 'Request failed.' }
      return NextResponse.json(json, { status: res.status })
    }

    const staffMember = toStaffMember(JSON.parse(text) as BackendStaffMemberResponse)
    return NextResponse.json(
      { exists: true, staffMember } satisfies StaffSelfStatusResponse,
      { status: res.status }
    )
  } catch (error) {
    console.error('Owner self-staff status proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}

export async function POST(
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
    const res = await fetch(`${backendURL}/api/v1/businesses/${businessId}/staff-members/self`, {
      method: 'POST',
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

    const staffMember = toStaffMember(JSON.parse(text) as BackendStaffMemberResponse)
    return NextResponse.json(
      {
        message: staffMember.isActive
          ? 'You are now listed as staff for this business.'
          : 'Owner staff membership updated.',
        staffMember,
      } satisfies StaffSelfMutationResponse,
      { status: res.status }
    )
  } catch (error) {
    console.error('Owner self-staff create proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}

export async function DELETE(
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
    const res = await fetch(`${backendURL}/api/v1/businesses/${businessId}/staff-members/self`, {
      method: 'DELETE',
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

    const staffMember = toStaffMember(JSON.parse(text) as BackendStaffMemberResponse)
    return NextResponse.json(
      {
        message: 'You have been removed from the bookable staff roster for this business.',
        staffMember,
      } satisfies StaffSelfMutationResponse,
      { status: res.status }
    )
  } catch (error) {
    console.error('Owner self-staff delete proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
