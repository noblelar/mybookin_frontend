import { NextRequest, NextResponse } from 'next/server'

import { toBusinessBillingProfile } from '@/lib/server-billing'
import { toApiErrorResponse } from '@/lib/server-business'
import { clearAuthCookie, getBackendBaseUrl, getStoredAuthCookie } from '@/lib/server-auth'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  BackendBusinessBillingProfileResponse,
  PlanSelectionState,
  PlanSelectionSuccessResponse,
} from '@/types/billing'

const buildUnauthorizedResponse = (message: string) => {
  const response = NextResponse.json({ message } satisfies ApiErrorResponse, { status: 401 })
  clearAuthCookie(response)
  return response
}

const getSelectionMessage = (selectionState: string, effectiveAt: string | null) => {
  switch (selectionState) {
    case 'APPLIED':
      return 'Your platform plan was updated immediately.'
    case 'SCHEDULED':
      return effectiveAt
        ? `Your plan change is scheduled for ${new Date(effectiveAt).toLocaleDateString('en-GB', {
            dateStyle: 'medium',
          })}.`
        : 'Your plan change has been scheduled for the next billing boundary.'
    default:
      return 'This business is already on that plan.'
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
    const backendURL = getBackendBaseUrl()
    const body = await req.text()
    const res = await fetch(`${backendURL}/api/v1/businesses/${businessId}/plan-selection`, {
      method: 'POST',
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

    const payload = JSON.parse(text) as {
      profile: BackendBusinessBillingProfileResponse
      selection_state: string
      effective_at?: string | null
    }
    const effectiveAt = payload.effective_at ?? null

    return NextResponse.json(
      {
        message: getSelectionMessage(payload.selection_state, effectiveAt),
        profile: toBusinessBillingProfile(payload.profile),
        selectionState: payload.selection_state as PlanSelectionState,
        effectiveAt,
      } satisfies PlanSelectionSuccessResponse,
      { status: res.status }
    )
  } catch (error) {
    console.error('Business plan selection proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
