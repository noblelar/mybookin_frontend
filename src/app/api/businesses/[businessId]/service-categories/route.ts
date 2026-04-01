import { NextRequest, NextResponse } from 'next/server'

import { clearAuthCookie, getBackendBaseUrl, getStoredAuthCookie } from '@/lib/server-auth'
import { toApiErrorResponse } from '@/lib/server-business'
import { toServiceCategory } from '@/lib/server-service'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  BackendServiceCategoryResponse,
  CreateServiceCategoryPayload,
  ServiceCategoryListResponse,
  ServiceCategoryMutationResponse,
} from '@/types/service'

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
    const res = await fetch(`${backendURL}/api/v1/businesses/${businessId}/service-categories`, {
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

    const categories = (JSON.parse(text) as BackendServiceCategoryResponse[]).map(toServiceCategory)
    return NextResponse.json(
      { categories } satisfies ServiceCategoryListResponse,
      { status: res.status }
    )
  } catch (error) {
    console.error('Service categories proxy error:', error)
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

    const body = (await req.json()) as CreateServiceCategoryPayload
    const backendURL = getBackendBaseUrl()
    const res = await fetch(`${backendURL}/api/v1/businesses/${businessId}/service-categories`, {
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

    const category = toServiceCategory(JSON.parse(text) as BackendServiceCategoryResponse)
    return NextResponse.json(
      {
        message: 'Service category created successfully.',
        category,
      } satisfies ServiceCategoryMutationResponse,
      { status: res.status }
    )
  } catch (error) {
    console.error('Service category create proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
