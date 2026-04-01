import { NextRequest, NextResponse } from 'next/server'

import { normalizeRoles } from '@/lib/auth'
import { buildAuthSuccessResponse, clearAuthCookie, getBackendBaseUrl } from '@/lib/server-auth'
import type { ApiErrorResponse, BackendAuthResponse } from '@/types/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const requestBody = body
      ? (JSON.parse(body) as { returnUrl?: string; portal?: 'admin' | 'app' })
      : {}
    const backendURL = getBackendBaseUrl()

    const res = await fetch(`${backendURL}/api/v1/auth/login`, {
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

    const authResponse = JSON.parse(text) as BackendAuthResponse
    if (requestBody.portal === 'admin') {
      const roles = normalizeRoles(authResponse.roles)
      const isAdminPortalUser = roles.some((role) => role === 'ADMIN' || role === 'SUPER_ADMIN')
      if (!isAdminPortalUser) {
        const response = NextResponse.json(
          {
            message: 'This account does not have admin access. Use the standard login page instead.',
          } satisfies ApiErrorResponse,
          { status: 403 }
        )
        clearAuthCookie(response)
        return response
      }
    }

    return buildAuthSuccessResponse(authResponse, requestBody.returnUrl, res.status)
  } catch (error) {
    console.error('Login proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
