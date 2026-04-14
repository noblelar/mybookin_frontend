import { NextRequest, NextResponse } from 'next/server'

import { toResource } from '@/lib/server-resource'
import { clearAuthCookie, getBackendBaseUrl, getStoredAuthCookie } from '@/lib/server-auth'
import { toApiErrorResponse } from '@/lib/server-business'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  BackendResourceResponse,
  ResourceMutationResponse,
  UpdateResourceActivePayload,
} from '@/types/resource'

const buildUnauthorizedResponse = (message: string) => {
  const response = NextResponse.json({ message } satisfies ApiErrorResponse, { status: 401 })
  clearAuthCookie(response)
  return response
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string; resourceId: string }> }
) {
  try {
    const { businessId, resourceId } = await params
    const storedCookie = await getStoredAuthCookie()
    if (!storedCookie) {
      return NextResponse.json(
        { message: 'Missing auth cookie.' } satisfies ApiErrorResponse,
        { status: 401 }
      )
    }

    const body = (await req.json()) as UpdateResourceActivePayload
    const backendURL = getBackendBaseUrl()
    const res = await fetch(
      `${backendURL}/api/v1/businesses/${businessId}/resources/${resourceId}/active`,
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

    const resource = toResource(JSON.parse(text) as BackendResourceResponse)
    return NextResponse.json(
      {
        message: body.is_active ? 'Resource activated successfully.' : 'Resource deactivated successfully.',
        resource,
      } satisfies ResourceMutationResponse,
      { status: res.status }
    )
  } catch (error) {
    console.error('Resource active toggle proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
