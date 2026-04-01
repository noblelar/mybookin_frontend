import { NextResponse } from 'next/server'

import { clearAuthCookie, getBackendBaseUrl, getStoredAuthCookie } from '@/lib/server-auth'
import { toApiErrorResponse } from '@/lib/server-business'
import type { ApiErrorResponse } from '@/types/auth'

const buildUnauthorizedResponse = (message: string) => {
  const response = NextResponse.json({ message } satisfies ApiErrorResponse, { status: 401 })
  clearAuthCookie(response)
  return response
}

export async function DELETE(
  _req: Request,
  {
    params,
  }: { params: Promise<{ businessId: string; staffMemberId: string; timeOffId: string }> }
) {
  try {
    const { businessId, staffMemberId, timeOffId } = await params
    const storedCookie = await getStoredAuthCookie()
    if (!storedCookie) {
      return NextResponse.json(
        { message: 'Missing auth cookie.' } satisfies ApiErrorResponse,
        { status: 401 }
      )
    }

    const backendURL = getBackendBaseUrl()
    const res = await fetch(
      `${backendURL}/api/v1/businesses/${businessId}/staff-members/${staffMemberId}/time-off/${timeOffId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${storedCookie.accessToken}`,
        },
        cache: 'no-store',
      }
    )

    if (res.status === 401) {
      return buildUnauthorizedResponse('Your session has expired. Please sign in again.')
    }

    if (!res.ok) {
      const text = await res.text()
      const contentType = res.headers.get('content-type') ?? ''
      const json = contentType.includes('application/json')
        ? toApiErrorResponse(JSON.parse(text), 'Request failed.')
        : { message: text || 'Request failed.' }
      return NextResponse.json(json, { status: res.status })
    }

    return NextResponse.json({ message: 'Time off deleted successfully.' }, { status: 200 })
  } catch (error) {
    console.error('Time-off delete proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
