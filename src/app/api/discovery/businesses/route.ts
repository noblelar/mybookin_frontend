import { NextRequest, NextResponse } from 'next/server'

import { getBackendBaseUrl } from '@/lib/server-auth'
import { toApiErrorResponse, toBusiness } from '@/lib/server-business'
import { toService } from '@/lib/server-service'
import type { ApiErrorResponse } from '@/types/auth'
import type { BackendBusinessResponse } from '@/types/business'
import type { DiscoveryBusinessListResponse, DiscoveryBusinessSummary } from '@/types/discovery'
import type { BackendServiceResponse } from '@/types/service'

const fetchPublicServices = async (backendURL: string, businessId: string) => {
  const response = await fetch(`${backendURL}/api/v1/businesses/${businessId}/services`, {
    method: 'GET',
    cache: 'no-store',
  })

  if (!response.ok) {
    return []
  }

  const text = await response.text()
  if (!text.trim().length) {
    return []
  }

  return (JSON.parse(text) as BackendServiceResponse[]).map(toService)
}

const toDiscoverySummary = async (
  backendURL: string,
  businessPayload: BackendBusinessResponse
): Promise<DiscoveryBusinessSummary> => {
  const business = toBusiness(businessPayload)
  const services = await fetchPublicServices(backendURL, business.id)
  const startingPrice = services.length
    ? [...services]
        .sort(
          (leftValue, rightValue) =>
            Number.parseFloat(leftValue.priceAmount) - Number.parseFloat(rightValue.priceAmount)
        )[0]?.priceAmount ?? null
    : null

  return {
    business,
    activeServiceCount: services.length,
    startingPrice,
    featuredServiceName: services[0]?.name ?? null,
  }
}

export async function GET(req: NextRequest) {
  try {
    const backendURL = getBackendBaseUrl()
    const params = new URLSearchParams()

    for (const key of ['category', 'city', 'postcode', 'search']) {
      const value = req.nextUrl.searchParams.get(key)
      if (value?.trim()) {
        params.set(key, value.trim())
      }
    }

    const response = await fetch(
      `${backendURL}/api/v1/businesses${params.toString() ? `?${params.toString()}` : ''}`,
      {
        method: 'GET',
        cache: 'no-store',
      }
    )

    const text = await response.text()
    const contentType = response.headers.get('content-type') ?? ''
    if (!response.ok) {
      const json = contentType.includes('application/json')
        ? toApiErrorResponse(JSON.parse(text), 'Request failed.')
        : { message: text || 'Request failed.' }

      return NextResponse.json(json, { status: response.status })
    }

    const rawBusinesses = text.trim().length ? (JSON.parse(text) as BackendBusinessResponse[]) : []
    const businesses = await Promise.all(
      rawBusinesses.map((businessPayload) => toDiscoverySummary(backendURL, businessPayload))
    )

    const orderedBusinesses = businesses.sort((leftValue, rightValue) => {
      if (leftValue.activeServiceCount === 0 && rightValue.activeServiceCount > 0) return 1
      if (rightValue.activeServiceCount === 0 && leftValue.activeServiceCount > 0) return -1
      return leftValue.business.name.localeCompare(rightValue.business.name)
    })

    return NextResponse.json(
      {
        businesses: orderedBusinesses,
        availableCategories: [...new Set(rawBusinesses.map((business) => business.category))].sort(),
      } satisfies DiscoveryBusinessListResponse,
      { status: response.status }
    )
  } catch (error) {
    console.error('Discovery businesses proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
