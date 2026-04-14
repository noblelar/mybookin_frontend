'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

import { getApiErrorMessage } from '@/lib/utils'
import type { ApiErrorResponse } from '@/types/auth'
import type { Business, BusinessListResponse } from '@/types/business'

type ManageBusinessSettingsContextValue = {
  businesses: Business[]
  selectedBusiness: Business | null
  selectedBusinessId: string | null
  isLoadingBusinesses: boolean
  businessLoadError: string | null
  updateSelectedBusinessId: (businessId: string) => void
}

const ManageBusinessSettingsContext = createContext<ManageBusinessSettingsContextValue | null>(null)

export function ManageBusinessSettingsProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedBusinessId = searchParams.get('businessId')

  const [businesses, setBusinesses] = useState<Business[]>([])
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true)
  const [businessLoadError, setBusinessLoadError] = useState<string | null>(null)

  const updateSelectedBusinessId = (businessId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('businessId', businessId)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  useEffect(() => {
    let ignore = false

    async function loadBusinesses() {
      setIsLoadingBusinesses(true)
      setBusinessLoadError(null)

      try {
        const response = await fetch('/api/businesses', {
          method: 'GET',
          cache: 'no-store',
        })

        const payload = (await response.json()) as BusinessListResponse | ApiErrorResponse
        if (ignore) return

        if (!response.ok) {
          setBusinesses([])
          setBusinessLoadError(getApiErrorMessage(payload, 'We could not load your businesses right now.'))
          return
        }

        setBusinesses((payload as BusinessListResponse).businesses)
      } catch {
        if (!ignore) {
          setBusinesses([])
          setBusinessLoadError('We could not load your businesses right now.')
        }
      } finally {
        if (!ignore) {
          setIsLoadingBusinesses(false)
        }
      }
    }

    void loadBusinesses()

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    if (!businesses.length) return

    const hasValidSelectedBusiness = selectedBusinessId
      ? businesses.some((business) => business.id === selectedBusinessId)
      : false

    if (!hasValidSelectedBusiness) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('businessId', businesses[0].id)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }, [businesses, pathname, router, searchParams, selectedBusinessId])

  const selectedBusiness = useMemo(() => {
    return businesses.find((business) => business.id === selectedBusinessId) ?? businesses[0] ?? null
  }, [businesses, selectedBusinessId])

  return (
    <ManageBusinessSettingsContext.Provider
      value={{
        businesses,
        selectedBusiness,
        selectedBusinessId,
        isLoadingBusinesses,
        businessLoadError,
        updateSelectedBusinessId,
      }}
    >
      {children}
    </ManageBusinessSettingsContext.Provider>
  )
}

export function useManageBusinessSettingsContext() {
  const context = useContext(ManageBusinessSettingsContext)

  if (!context) {
    throw new Error(
      'useManageBusinessSettingsContext must be used within ManageBusinessSettingsProvider'
    )
  }

  return context
}
