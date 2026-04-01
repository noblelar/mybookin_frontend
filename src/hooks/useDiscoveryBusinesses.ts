'use client'

import { useEffect, useState } from 'react'

import { getApiErrorMessage } from '@/lib/utils'
import type { ApiErrorResponse } from '@/types/auth'
import type { DiscoveryBusinessListResponse, DiscoveryBusinessSummary } from '@/types/discovery'

interface UseDiscoveryBusinessesOptions {
  category?: string | null
  search?: string | null
  city?: string | null
  postcode?: string | null
}

export function useDiscoveryBusinesses(options: UseDiscoveryBusinessesOptions = {}) {
  const [businesses, setBusinesses] = useState<DiscoveryBusinessSummary[]>([])
  const [availableCategories, setAvailableCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function loadBusinesses() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const params = new URLSearchParams()
        if (options.category && options.category !== 'ALL') {
          params.set('category', options.category)
        }
        if (options.search?.trim()) {
          params.set('search', options.search.trim())
        }
        if (options.city?.trim()) {
          params.set('city', options.city.trim())
        }
        if (options.postcode?.trim()) {
          params.set('postcode', options.postcode.trim())
        }

        const response = await fetch(
          `/api/discovery/businesses${params.toString() ? `?${params.toString()}` : ''}`,
          {
            method: 'GET',
            cache: 'no-store',
          }
        )

        const payload = (await response.json()) as DiscoveryBusinessListResponse | ApiErrorResponse
        if (ignore) return

        if (!response.ok) {
          setBusinesses([])
          setAvailableCategories([])
          setErrorMessage(
            getApiErrorMessage(payload, 'We could not load the discovery catalog right now.')
          )
          return
        }

        const result = payload as DiscoveryBusinessListResponse
        setBusinesses(result.businesses)
        setAvailableCategories(result.availableCategories)
      } catch {
        if (!ignore) {
          setBusinesses([])
          setAvailableCategories([])
          setErrorMessage('We could not load the discovery catalog right now.')
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    void loadBusinesses()

    return () => {
      ignore = true
    }
  }, [options.category, options.city, options.postcode, options.search])

  return {
    businesses,
    availableCategories,
    isLoading,
    errorMessage,
  }
}
