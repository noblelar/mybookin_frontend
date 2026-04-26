import { NextRequest, NextResponse } from 'next/server'

import { getBackendBaseUrl } from '@/lib/server-auth'
import type { ApiErrorResponse } from '@/types/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const backendURL = getBackendBaseUrl()

    const res = await fetch(`${backendURL}/api/v1/auth/password-reset/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      cache: 'no-store',
    })

    const text = await res.text()
    const contentType = res.headers.get('content-type') ?? ''

    if (!res.ok) {
      const json = contentType.includes('application/json')
        ? (JSON.parse(text) as ApiErrorResponse)
        : { message: text || 'Request failed.' }

      return NextResponse.json(json, { status: res.status })
    }

    const payload = contentType.includes('application/json')
      ? JSON.parse(text)
      : { message: 'Password reset successful. You can now sign in with your new password.' }

    return NextResponse.json(payload, { status: res.status })
  } catch (error) {
    console.error('Password reset confirm proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
