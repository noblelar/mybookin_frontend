import { NextRequest, NextResponse } from 'next/server'

import { toBusinessBillingProfile } from '@/lib/server-billing'
import { toApiErrorResponse } from '@/lib/server-business'
import { clearAuthCookie, getBackendBaseUrl, getStoredAuthCookie } from '@/lib/server-auth'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  BackendBusinessBillingProfileResponse,
  BusinessBillingProfileMutationSuccessResponse,
} from '@/types/billing'

const buildUnauthorizedResponse = (message: string) => {
  const response = NextResponse.json({ message } satisfies ApiErrorResponse, { status: 401 })
  clearAuthCookie(response)
  return response
}

export async function PUT(
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
    const backendURL = getBackendBaseUrl()
    const body = await req.text()
    const res = await fetch(`${backendURL}/api/v1/admin/business-billing-profiles/${businessId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${storedCookie.accessToken}`,
      },
      body,
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

    const payload = JSON.parse(text) as { profile: BackendBusinessBillingProfileResponse }
    return NextResponse.json(
      {
        message: 'Billing profile updated successfully.',
        profile: toBusinessBillingProfile(payload.profile),
      } satisfies BusinessBillingProfileMutationSuccessResponse,
      { status: res.status }
    )
  } catch (error) {
    console.error('Business billing profile update proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
