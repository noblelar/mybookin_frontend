import { NextRequest, NextResponse } from 'next/server'

import { toPricingPlan } from '@/lib/server-billing'
import { toApiErrorResponse } from '@/lib/server-business'
import { clearAuthCookie, getBackendBaseUrl, getStoredAuthCookie } from '@/lib/server-auth'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  BackendPricingPlanResponse,
  PricingPlanMutationSuccessResponse,
} from '@/types/billing'

const buildUnauthorizedResponse = (message: string) => {
  const response = NextResponse.json({ message } satisfies ApiErrorResponse, { status: 401 })
  clearAuthCookie(response)
  return response
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ planId: string }> }
) {
  try {
    const storedCookie = await getStoredAuthCookie()
    if (!storedCookie) {
      return NextResponse.json(
        { message: 'Missing auth cookie.' } satisfies ApiErrorResponse,
        { status: 401 }
      )
    }

    const { planId } = await params
    const backendURL = getBackendBaseUrl()
    const body = await req.text()
    const res = await fetch(`${backendURL}/api/v1/admin/pricing-plans/${planId}`, {
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

    const payload = JSON.parse(text) as { plan: BackendPricingPlanResponse }
    return NextResponse.json(
      {
        message: 'Pricing plan updated successfully.',
        plan: toPricingPlan(payload.plan),
      } satisfies PricingPlanMutationSuccessResponse,
      { status: res.status }
    )
  } catch (error) {
    console.error('Pricing plan update proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
