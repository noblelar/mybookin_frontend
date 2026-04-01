'use client'

import { useDeferredValue, useEffect, useState } from 'react'

import BusinessBottom from '@/components/admin/businesses/BusinessBottom'
import BusinessFilters from '@/components/admin/businesses/BusinessFilters'
import BusinessStatsRow from '@/components/admin/businesses/BusinessStatsRow'
import BusinessTable from '@/components/admin/businesses/BusinessTable'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  Business,
  BusinessListResponse,
  BusinessStatus,
  BusinessStatusUpdateSuccessResponse,
} from '@/types/business'

type FilterState = {
  category: string
  search: string
  status: 'ALL' | BusinessStatus
}

const INITIAL_FILTERS: FilterState = {
  category: 'ALL',
  search: '',
  status: 'ALL',
}

const matchesSearch = (business: Business, searchValue: string) => {
  if (!searchValue) return true

  const haystack = [
    business.name,
    business.slugUk,
    business.city,
    business.postcode,
    business.email ?? '',
    business.phone ?? '',
  ]
    .join(' ')
    .toLowerCase()

  return haystack.includes(searchValue)
}

const escapeCsvValue = (value: string | null) => {
  const normalizedValue = value ?? ''
  if (normalizedValue.includes(',') || normalizedValue.includes('"') || normalizedValue.includes('\n')) {
    return `"${normalizedValue.replaceAll('"', '""')}"`
  }

  return normalizedValue
}

export default function BusinessModerationClient() {
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null)
  const [updatingBusinessId, setUpdatingBusinessId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const deferredSearch = useDeferredValue(filters.search.trim().toLowerCase())

  async function loadBusinesses(preferredBusinessId?: string | null) {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const response = await fetch('/api/admin/businesses', {
        method: 'GET',
        cache: 'no-store',
      })

      const payload = (await response.json()) as BusinessListResponse | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(
          'message' in payload ? payload.message : 'We could not load business moderation right now.'
        )
        return
      }

      const successPayload = payload as BusinessListResponse
      const nextBusinesses = successPayload.businesses
      setBusinesses(nextBusinesses)
      setSelectedBusinessId((currentValue) => {
        const candidate = preferredBusinessId ?? currentValue
        if (candidate && nextBusinesses.some((business: Business) => business.id === candidate)) {
          return candidate
        }

        return nextBusinesses[0]?.id ?? null
      })
    } catch {
      setErrorMessage('We could not load business moderation right now.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadBusinesses()
  }, [])

  const availableCategories = Array.from(
    new Set(businesses.map((business) => business.category).filter(Boolean))
  ).sort()

  const filteredBusinesses = businesses.filter((business) => {
    if (filters.status !== 'ALL' && business.status !== filters.status) {
      return false
    }

    if (filters.category !== 'ALL' && business.category !== filters.category) {
      return false
    }

    return matchesSearch(business, deferredSearch)
  })

  const selectedBusiness =
    filteredBusinesses.find((business) => business.id === selectedBusinessId) ??
    filteredBusinesses[0] ??
    null

  async function handleStatusChange(business: Business, nextStatus: BusinessStatus) {
    if (business.status === nextStatus) {
      return
    }

    if (
      nextStatus === 'SUSPENDED' &&
      !window.confirm(`Suspend ${business.name} and remove it from public discovery?`)
    ) {
      return
    }

    setUpdatingBusinessId(business.id)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(`/api/admin/businesses/${business.id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: nextStatus }),
      })

      const payload = (await response.json()) as
        | BusinessStatusUpdateSuccessResponse
        | ApiErrorResponse

      if (!response.ok) {
        setErrorMessage(
          'message' in payload ? payload.message : 'We could not update this business right now.'
        )
        return
      }

      const successPayload = payload as BusinessStatusUpdateSuccessResponse
      const updatedBusiness = successPayload.business
      setBusinesses((currentValue) =>
        currentValue.map((item) => (item.id === updatedBusiness.id ? updatedBusiness : item))
      )
      setSelectedBusinessId(updatedBusiness.id)
      setSuccessMessage(successPayload.message)
    } catch {
      setErrorMessage('We could not update this business right now.')
    } finally {
      setUpdatingBusinessId(null)
    }
  }

  function handleRefresh() {
    setSuccessMessage(null)
    void loadBusinesses(selectedBusiness?.id ?? selectedBusinessId)
  }

  function handleExportCsv() {
    if (!filteredBusinesses.length) {
      setErrorMessage('There are no businesses in the current view to export.')
      return
    }

    const rows = [
      ['Name', 'Slug', 'Category', 'Status', 'City', 'Postcode', 'Email', 'Phone', 'Timezone'],
      ...filteredBusinesses.map((business) => [
        business.name,
        business.slugUk,
        business.category,
        business.status,
        business.city,
        business.postcode,
        business.email ?? '',
        business.phone ?? '',
        business.timezone,
      ]),
    ]

    const csv = rows.map((row) => row.map(escapeCsvValue).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')

    anchor.href = url
    anchor.download = 'business-moderation-export.csv'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
    URL.revokeObjectURL(url)

    setSuccessMessage('The current moderation view was exported as CSV.')
  }

  return (
    <>
      {(errorMessage || successMessage) && (
        <div className="px-6 pb-4">
          {errorMessage ? (
            <Alert variant="destructive">
              <AlertTitle>Business moderation needs attention</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <AlertTitle>Moderation updated</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
        </div>
      )}

      <div className="px-6 pb-4">
        <BusinessStatsRow businesses={businesses} isLoading={isLoading} />
      </div>

      <div className="px-6 pb-2">
        <BusinessFilters
          category={filters.category}
          status={filters.status}
          search={filters.search}
          categories={availableCategories}
          isRefreshing={isLoading}
          onCategoryChange={(category) => setFilters((currentValue) => ({ ...currentValue, category }))}
          onStatusChange={(status) => setFilters((currentValue) => ({ ...currentValue, status }))}
          onSearchChange={(search) => setFilters((currentValue) => ({ ...currentValue, search }))}
          onExportCsv={handleExportCsv}
          onRefresh={handleRefresh}
        />
      </div>

      <div className="px-6 pb-4">
        <BusinessTable
          businesses={filteredBusinesses}
          isLoading={isLoading}
          selectedBusinessId={selectedBusiness?.id ?? null}
          updatingBusinessId={updatingBusinessId}
          onSelectBusiness={(business) => setSelectedBusinessId(business.id)}
          onQuickStatusChange={handleStatusChange}
        />
      </div>

      <div className="px-6 pb-6">
        <BusinessBottom
          businesses={businesses}
          selectedBusiness={selectedBusiness}
          isLoading={isLoading}
          updatingBusinessId={updatingBusinessId}
          onRefresh={handleRefresh}
          onStatusChange={handleStatusChange}
        />
      </div>
    </>
  )
}
