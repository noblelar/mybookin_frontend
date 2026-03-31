import { NextResponse } from 'next/server'

import { clearAuthCookie, getBackendBaseUrl, getStoredAuthCookie } from '@/lib/server-auth'
import { toApiErrorResponse } from '@/lib/server-business'
import { toAdminInvitation, toAdminUser } from '@/lib/server-admin'
import type { ApiErrorResponse } from '@/types/auth'
import type { AdminAccessSummaryResponse, BackendAdminAccessSummaryResponse } from '@/types/admin'

const buildUnauthorizedResponse = (message: string) => {
  const response = NextResponse.json({ message } satisfies ApiErrorResponse, { status: 401 })
  clearAuthCookie(response)
  return response
}

export async function GET() {
  try {
    const storedCookie = await getStoredAuthCookie()
    if (!storedCookie) {
      return NextResponse.json(
        { message: 'Missing auth cookie.' } satisfies ApiErrorResponse,
        { status: 401 }
      )
    }

    const backendURL = getBackendBaseUrl()
    const res = await fetch(`${backendURL}/api/v1/admin/access`, {
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

    const payload = JSON.parse(text) as BackendAdminAccessSummaryResponse
    return NextResponse.json(
      {
        admins: payload.admins.map(toAdminUser),
        invitations: payload.invitations.map((invitation) => toAdminInvitation(invitation)),
      } satisfies AdminAccessSummaryResponse,
      { status: res.status }
    )
  } catch (error) {
    console.error('Admin access proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
