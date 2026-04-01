import { NextRequest, NextResponse } from 'next/server'

import { clearAuthCookie, getBackendBaseUrl, getStoredAuthCookie } from '@/lib/server-auth'
import { toApiErrorResponse } from '@/lib/server-business'
import { toService } from '@/lib/server-service'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  BackendServiceResponse,
  CreateServicePayload,
  ServiceListResponse,
  ServiceMutationResponse,
} from '@/types/service'

const buildUnauthorizedResponse = (message: string) => {
  const response = NextResponse.json({ message } satisfies ApiErrorResponse, { status: 401 })
  clearAuthCookie(response)
  return response
}

export async function GET(
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

    const includeInactive = req.nextUrl.searchParams.get('include_inactive') ?? 'true'
    const backendURL = getBackendBaseUrl()
    const res = await fetch(
      `${backendURL}/api/v1/businesses/${businessId}/services?include_inactive=${encodeURIComponent(includeInactive)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${storedCookie.accessToken}`,
        },
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

    const services = (JSON.parse(text) as BackendServiceResponse[]).map(toService)
    return NextResponse.json({ services } satisfies ServiceListResponse, { status: res.status })
  } catch (error) {
    console.error('Services list proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
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

    const body = (await req.json()) as CreateServicePayload
    const backendURL = getBackendBaseUrl()
    const res = await fetch(`${backendURL}/api/v1/businesses/${businessId}/services`, {
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

    const service = toService(JSON.parse(text) as BackendServiceResponse)
    return NextResponse.json(
      {
        message: 'Service created successfully.',
        service,
      } satisfies ServiceMutationResponse,
      { status: res.status }
    )
  } catch (error) {
    console.error('Service create proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
