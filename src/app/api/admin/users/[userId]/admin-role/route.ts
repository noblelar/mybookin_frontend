import { NextRequest, NextResponse } from 'next/server'

import { clearAuthCookie, getBackendBaseUrl, getStoredAuthCookie } from '@/lib/server-auth'
import { toApiErrorResponse } from '@/lib/server-business'
import { toAdminUser } from '@/lib/server-admin'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  AdminRoleRemovalSuccessResponse,
  BackendRemoveAdminRoleResponse,
} from '@/types/admin'

const buildUnauthorizedResponse = (message: string) => {
  const response = NextResponse.json({ message } satisfies ApiErrorResponse, { status: 401 })
  clearAuthCookie(response)
  return response
}

type RouteContext = {
  params: Promise<{
    userId: string
  }>
}

export async function DELETE(_req: NextRequest, context: RouteContext) {
  try {
    const storedCookie = await getStoredAuthCookie()
    if (!storedCookie) {
      return NextResponse.json(
        { message: 'Missing auth cookie.' } satisfies ApiErrorResponse,
        { status: 401 }
      )
    }

    const { userId } = await context.params
    const backendURL = getBackendBaseUrl()
    const res = await fetch(`${backendURL}/api/v1/admin/users/${userId}/admin`, {
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

    const payload = JSON.parse(text) as BackendRemoveAdminRoleResponse
    return NextResponse.json(
      {
        message: 'Admin access removed successfully.',
        user: toAdminUser(payload.user),
      } satisfies AdminRoleRemovalSuccessResponse,
      { status: res.status }
    )
  } catch (error) {
    console.error('Admin role removal proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
