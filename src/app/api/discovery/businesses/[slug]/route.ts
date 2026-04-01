import { NextResponse } from 'next/server'

import { getBackendBaseUrl } from '@/lib/server-auth'
import { toApiErrorResponse, toBusiness } from '@/lib/server-business'
import { toService, toServiceCategory } from '@/lib/server-service'
import { toStaffMember } from '@/lib/server-staff'
import type { ApiErrorResponse } from '@/types/auth'
import type { BackendBusinessResponse } from '@/types/business'
import type { DiscoveryBusinessDetailResponse } from '@/types/discovery'
import type { BackendServiceCategoryResponse, BackendServiceResponse } from '@/types/service'
import type { BackendStaffMemberResponse } from '@/types/staff'

const fetchJsonText = async (url: string) => {
  const response = await fetch(url, {
    method: 'GET',
    cache: 'no-store',
  })

  const text = await response.text()
  const contentType = response.headers.get('content-type') ?? ''

  return {
    response,
    text,
    contentType,
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const backendURL = getBackendBaseUrl()

    const listResult = await fetchJsonText(`${backendURL}/api/v1/businesses`)
    if (!listResult.response.ok) {
      const json = listResult.contentType.includes('application/json')
        ? toApiErrorResponse(JSON.parse(listResult.text), 'Request failed.')
        : { message: listResult.text || 'Request failed.' }

      return NextResponse.json(json, { status: listResult.response.status })
    }

    const businesses = listResult.text.trim().length
      ? (JSON.parse(listResult.text) as BackendBusinessResponse[])
      : []

    const matchedBusiness = businesses.find(
      (business) => business.slug_uk.toLowerCase() === slug.trim().toLowerCase()
    )

    if (!matchedBusiness) {
      return NextResponse.json(
        { message: 'Business not found.' } satisfies ApiErrorResponse,
        { status: 404 }
      )
    }

    const businessId = matchedBusiness.id
    const [businessResult, categoriesResult, servicesResult, staffResult] = await Promise.all([
      fetchJsonText(`${backendURL}/api/v1/businesses/${businessId}`),
      fetchJsonText(`${backendURL}/api/v1/businesses/${businessId}/service-categories`),
      fetchJsonText(`${backendURL}/api/v1/businesses/${businessId}/services`),
      fetchJsonText(`${backendURL}/api/v1/businesses/${businessId}/staff-members`),
    ])

    for (const result of [businessResult, categoriesResult, servicesResult, staffResult]) {
      if (!result.response.ok) {
        const json = result.contentType.includes('application/json')
          ? toApiErrorResponse(JSON.parse(result.text), 'Request failed.')
          : { message: result.text || 'Request failed.' }

        return NextResponse.json(json, { status: result.response.status })
      }
    }

    return NextResponse.json(
      {
        business: toBusiness(JSON.parse(businessResult.text) as BackendBusinessResponse),
        categories: categoriesResult.text.trim().length
          ? (JSON.parse(categoriesResult.text) as BackendServiceCategoryResponse[]).map(
              toServiceCategory
            )
          : [],
        services: servicesResult.text.trim().length
          ? (JSON.parse(servicesResult.text) as BackendServiceResponse[]).map(toService)
          : [],
        staffMembers: staffResult.text.trim().length
          ? (JSON.parse(staffResult.text) as BackendStaffMemberResponse[]).map(toStaffMember)
          : [],
      } satisfies DiscoveryBusinessDetailResponse,
      { status: 200 }
    )
  } catch (error) {
    console.error('Discovery business detail proxy error:', error)
    return NextResponse.json(
      { message: 'Unexpected error.' } satisfies ApiErrorResponse,
      { status: 500 }
    )
  }
}
