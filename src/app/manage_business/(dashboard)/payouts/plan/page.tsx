'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import ManageBusinessShell from '@/components/manage_business/ManageBusinessShell'
import { buildPayoutsSubNavItems } from '@/components/manage_business/workspace/payouts-navigation'
import {
  formatBillingTypeLabel,
  formatDateLabel,
} from '@/components/manage_business/settings/settings-utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { formatCurrency, getApiErrorMessage } from '@/lib/utils'
import type { ApiErrorResponse } from '@/types/auth'
import type { BusinessBillingProfile, BusinessBillingProfileDetailResponse } from '@/types/billing'
import type { Business, BusinessListResponse } from '@/types/business'

export default function ManageBusinessPayoutsPlanPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedBusinessId = searchParams.get('businessId')

  const [businesses, setBusinesses] = useState<Business[]>([])
  const [profile, setProfile] = useState<BusinessBillingProfile | null>(null)
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const updateSelectedBusinessId = (businessId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('businessId', businessId)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  useEffect(() => {
    let ignore = false

    async function loadBusinesses() {
      setIsLoadingBusinesses(true)

      try {
        const response = await fetch('/api/businesses', { method: 'GET', cache: 'no-store' })
        const payload = (await response.json()) as BusinessListResponse | ApiErrorResponse
        if (ignore) return

        if (!response.ok) {
          setBusinesses([])
          setErrorMessage(getApiErrorMessage(payload, 'We could not load your businesses right now.'))
          return
        }

        setBusinesses((payload as BusinessListResponse).businesses)
      } catch {
        if (!ignore) {
          setBusinesses([])
          setErrorMessage('We could not load your businesses right now.')
        }
      } finally {
        if (!ignore) setIsLoadingBusinesses(false)
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

  useEffect(() => {
    if (!selectedBusiness) {
      setProfile(null)
      return
    }

    const businessId = selectedBusiness.id
    let ignore = false

    async function loadProfile() {
      setIsLoadingProfile(true)
      setErrorMessage(null)

      try {
        const response = await fetch(`/api/businesses/${businessId}/billing-profile`, {
          method: 'GET',
          cache: 'no-store',
        })

        const payload = (await response.json()) as
          | BusinessBillingProfileDetailResponse
          | ApiErrorResponse
        if (ignore) return

        if (!response.ok) {
          setProfile(null)
          setErrorMessage(getApiErrorMessage(payload, 'We could not load the billing profile right now.'))
          return
        }

        setProfile((payload as BusinessBillingProfileDetailResponse).profile)
      } catch {
        if (!ignore) {
          setProfile(null)
          setErrorMessage('We could not load the billing profile right now.')
        }
      } finally {
        if (!ignore) setIsLoadingProfile(false)
      }
    }

    void loadProfile()

    return () => {
      ignore = true
    }
  }, [selectedBusiness])

  const settingsBillingHref = selectedBusiness
    ? `/manage_business/settings/billing?businessId=${selectedBusiness.id}`
    : '/manage_business/settings/billing'

  return (
    <ManageBusinessShell
      activeNav="/manage_business/payouts"
      subNavItems={buildPayoutsSubNavItems(selectedBusiness?.id ?? null)}
      activeSubNav={pathname}
    >
      {errorMessage ? (
        <Alert variant="destructive" className="mb-6 rounded-2xl">
          <AlertTitle>Plan issue</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {isLoadingBusinesses ? (
        <div className="grid gap-6">
          <div className="h-36 animate-pulse rounded-[28px] bg-white" />
          <div className="h-[420px] animate-pulse rounded-[28px] bg-white" />
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Billing Workspace
                </p>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
                  Plan summary
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
                  Keep the current platform plan and any scheduled changes in view, then jump to the
                  billing settings tab when you want to change plan selection.
                </p>
              </div>

              <label className="grid gap-2 text-sm font-medium text-slate-700 sm:min-w-[280px]">
                Active business
                <select
                  value={selectedBusiness?.id ?? ''}
                  onChange={(event) => updateSelectedBusinessId(event.target.value)}
                  className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                >
                  {businesses.map((business) => (
                    <option key={business.id} value={business.id}>
                      {business.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {isLoadingProfile ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                Loading plan summary...
              </div>
            ) : profile ? (
              <div className="mt-6 grid gap-4">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Current plan
                  </p>
                  <p className="mt-3 text-2xl font-extrabold tracking-tight text-[#0B1C30]">
                    {profile.pricingPlanName}
                  </p>
                  <p className="mt-2 text-sm text-slate-500">
                    {formatBillingTypeLabel(profile.billingType)} |{' '}
                    {formatCurrency(profile.monthlyAmount, profile.currency)} monthly |{' '}
                    {formatCurrency(profile.perBookingFee, profile.currency)} per completed booking
                  </p>
                </div>

                {profile.pendingPricingPlanName && profile.pendingPlanEffectiveAt ? (
                  <div className="rounded-2xl border border-blue-200 bg-[#EFF4FF] p-5">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                      Scheduled next
                    </p>
                    <p className="mt-3 text-lg font-bold text-[#0B1C30]">
                      {profile.pendingPricingPlanName}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Starts on {formatDateLabel(profile.pendingPlanEffectiveAt)}
                    </p>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3 border-t border-slate-100 pt-6">
                  <Link
                    href={settingsBillingHref}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    Open plan selection
                  </Link>
                </div>
              </div>
            ) : (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                Billing profile data is currently unavailable for this business.
              </div>
            )}
          </section>

          <aside className="grid gap-6 self-start">
            {profile ? (
              <section className="rounded-[28px] border border-slate-200 bg-[#EFF4FF] p-6 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                  Trial window
                </p>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Start
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#0B1C30]">
                      {formatDateLabel(profile.trialStartAt)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      End
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#0B1C30]">
                      {formatDateLabel(profile.trialEndAt)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Trial status
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#0B1C30]">
                      {profile.isTrialActive ? 'Trial active' : 'Trial complete'}
                    </p>
                  </div>
                </div>
              </section>
            ) : null}
          </aside>
        </div>
      )}
    </ManageBusinessShell>
  )
}
