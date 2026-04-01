import { NextRequest, NextResponse } from 'next/server'

import { clearAuthCookie, getBackendBaseUrl, getStoredAuthCookie } from '@/lib/server-auth'
import { toApiErrorResponse } from '@/lib/server-business'
import { toService } from '@/lib/server-service'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  BackendServiceResponse,
  ServiceMutationResponse,
  UpdateServiceActivePayload,
} from '@/types/service'

const buildUnauthorizedResponse = (message: string) => {
  const response = NextResponse.json({ message } satisfies ApiErrorResponse, { status: 401 })
  clearAuthCookie(response)
  return response
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ businessId: string; serviceId: string }> }
) {
  try {
    const { businessId, serviceId } = await params
    const storedCookie = await getStoredAuthCookie()
    if (!storedCookie) {
      return NextResponse.json(
        { message: 'Missing auth cookie.' } satisfies ApiErrorResponse,
        { status: 401 }
      )
    }

    const body = (await req.json()) as UpdateServiceActivePayload
    const backendURL = getBackendBaseUrl()
    const res = await fetch(
      `${backendURL}/api/v1/businesses/${businessId}/services/${serviceId}/active`,
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

    const service = toService(JSON.parse(text) as BackendServiceResponse)
    return NextResponse.json(
      {
        message: service.isActive ? 'Service activated successfully.' : 'Service deactivated successfully.',
        service,
      } satisfies ServiceMutationResponse,
      { status: res.status }
    )
  } catch (error) {
    console.error('Service active-state proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
