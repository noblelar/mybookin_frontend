'use client'

import { useEffect, useState } from 'react'

import { getApiErrorMessage } from '@/lib/utils'
import type { ApiErrorResponse } from '@/types/auth'
import type { DiscoveryBusinessDetailResponse } from '@/types/discovery'

export function useDiscoveryBusinessDetail(slug: string) {
  const [detail, setDetail] = useState<DiscoveryBusinessDetailResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function loadDetail() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const response = await fetch(`/api/discovery/businesses/${encodeURIComponent(slug)}`, {
          method: 'GET',
          cache: 'no-store',
        })

        const payload = (await response.json()) as DiscoveryBusinessDetailResponse | ApiErrorResponse
        if (ignore) return

        if (!response.ok) {
          setDetail(null)
          setErrorMessage(getApiErrorMessage(payload, 'We could not load this business right now.'))
          return
        }

        setDetail(payload as DiscoveryBusinessDetailResponse)
      } catch {
        if (!ignore) {
          setDetail(null)
          setErrorMessage('We could not load this business right now.')
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    if (!slug.trim().length) {
      setDetail(null)
      setIsLoading(false)
      setErrorMessage('Business not found.')
      return
    }

    void loadDetail()

    return () => {
      ignore = true
    }
  }, [slug])

  return {
    detail,
    isLoading,
    errorMessage,
  }
}
