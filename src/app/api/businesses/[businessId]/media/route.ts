import { NextRequest, NextResponse } from 'next/server'

import { toBusinessMedia } from '@/lib/server-media'
import { clearAuthCookie, getBackendBaseUrl, getStoredAuthCookie } from '@/lib/server-auth'
import { toApiErrorResponse } from '@/lib/server-business'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  BackendBusinessMediaResponse,
  BusinessMediaListResponse,
  BusinessMediaMutationResponse,
  CreateBusinessMediaPayload,
} from '@/types/media'

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
    const backendURL = getBackendBaseUrl()
    const headers = storedCookie
      ? { Authorization: `Bearer ${storedCookie.accessToken}` }
      : undefined

    const res = await fetch(`${backendURL}/api/v1/businesses/${businessId}/media`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    })

    if (res.status === 401 && storedCookie) {
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

    const media = text.trim().length
      ? (JSON.parse(text) as BackendBusinessMediaResponse[]).map(toBusinessMedia)
      : []

    return NextResponse.json({ media } satisfies BusinessMediaListResponse, { status: res.status })
  } catch (error) {
    console.error('Business media list proxy error:', error)
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
    const storedCookie = await getStoredAuthCookie()
    if (!storedCookie) {
      return NextResponse.json(
        { message: 'Missing auth cookie.' } satisfies ApiErrorResponse,
        { status: 401 }
      )
    }

    const { businessId } = await params
    const body = (await req.json()) as CreateBusinessMediaPayload
    const backendURL = getBackendBaseUrl()

    const res = await fetch(`${backendURL}/api/v1/businesses/${businessId}/media`, {
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

    const media = toBusinessMedia(JSON.parse(text) as BackendBusinessMediaResponse)
    return NextResponse.json(
      {
        message: 'Business media saved successfully.',
        media,
      } satisfies BusinessMediaMutationResponse,
      { status: res.status }
    )
  } catch (error) {
    console.error('Business media create proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
