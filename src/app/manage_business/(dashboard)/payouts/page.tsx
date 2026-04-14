'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import ManageBusinessShell from '@/components/manage_business/ManageBusinessShell'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { buildPayoutsSubNavItems } from '@/components/manage_business/workspace/payouts-navigation'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  BusinessBillingProfile,
  BusinessBillingProfileDetailResponse,
  BusinessSubscriptionInvoicesResponse,
  SubscriptionInvoice,
} from '@/types/billing'
import type { Business, BusinessListResponse } from '@/types/business'

const getApiErrorMessage = (payload: unknown, fallback: string) => {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'message' in payload &&
    typeof payload.message === 'string' &&
    payload.message.trim().length
  ) {
    return payload.message
  }

  if (
    typeof payload === 'object' &&
    payload !== null &&
    'error' in payload &&
    typeof payload.error === 'string' &&
    payload.error.trim().length
  ) {
    return payload.error
  }

  return fallback
}

const formatMoney = (value: string) => {
  const numeric = Number.parseFloat(value)
  if (Number.isNaN(numeric)) return value

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2,
  }).format(numeric)
}

const formatDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(date)
}

const formatBillingType = (value: string) => {
  switch (value) {
    case 'PAY_AS_YOU_GO':
      return 'Pay as you go'
    case 'HYBRID':
      return 'Hybrid'
    case 'MONTHLY':
      return 'Monthly'
    default:
      return value
  }
}

const getInvoiceStatusClassName = (status: string) => {
  switch (status.toUpperCase()) {
    case 'PAID':
      return 'bg-emerald-100 text-emerald-700'
    case 'OVERDUE':
      return 'bg-red-100 text-red-600'
    case 'VOID':
      return 'bg-slate-200 text-slate-600'
    case 'DRAFT':
      return 'bg-slate-100 text-slate-600'
    default:
      return 'bg-amber-100 text-amber-700'
  }
}

const getPayoutStatusLabel = (profile: BusinessBillingProfile | null) => {
  if (!profile) return 'Unavailable'
  if (profile.isPayoutsEnabled) return 'Enabled'
  return 'Disabled'
}

function ManageBusinessPayoutsPageContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedBusinessId = searchParams.get('businessId')

  const [businesses, setBusinesses] = useState<Business[]>([])
  const [profile, setProfile] = useState<BusinessBillingProfile | null>(null)
  const [invoices, setInvoices] = useState<SubscriptionInvoice[]>([])
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true)
  const [isLoadingBilling, setIsLoadingBilling] = useState(false)
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
        const response = await fetch('/api/businesses', {
          method: 'GET',
          cache: 'no-store',
        })

        const payload = (await response.json()) as BusinessListResponse | ApiErrorResponse
        if (ignore) return

        if (!response.ok) {
          setErrorMessage(getApiErrorMessage(payload, 'We could not load your businesses right now.'))
          setBusinesses([])
          return
        }

        setBusinesses((payload as BusinessListResponse).businesses)
      } catch {
        if (!ignore) {
          setErrorMessage('We could not load your businesses right now.')
          setBusinesses([])
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
      setInvoices([])
      return
    }

    let ignore = false

    async function loadBilling() {
      setIsLoadingBilling(true)

      try {
        const [profileResponse, invoicesResponse] = await Promise.all([
          fetch(`/api/businesses/${selectedBusiness.id}/billing-profile`, {
            method: 'GET',
            cache: 'no-store',
          }),
          fetch(`/api/businesses/${selectedBusiness.id}/subscription-invoices`, {
            method: 'GET',
            cache: 'no-store',
          }),
        ])

        const profilePayload = (await profileResponse.json()) as
          | BusinessBillingProfileDetailResponse
          | ApiErrorResponse
        const invoicesPayload = (await invoicesResponse.json()) as
          | BusinessSubscriptionInvoicesResponse
          | ApiErrorResponse

        if (ignore) return

        if (!profileResponse.ok) {
          setErrorMessage(
            getApiErrorMessage(profilePayload, 'We could not load your billing profile right now.')
          )
          setProfile(null)
          setInvoices([])
          return
        }

        if (!invoicesResponse.ok) {
          setErrorMessage(
            getApiErrorMessage(invoicesPayload, 'We could not load your billing invoices right now.')
          )
          setProfile((profilePayload as BusinessBillingProfileDetailResponse).profile)
          setInvoices([])
          return
        }

        setProfile((profilePayload as BusinessBillingProfileDetailResponse).profile)
        setInvoices((invoicesPayload as BusinessSubscriptionInvoicesResponse).invoices)
      } catch {
        if (!ignore) {
          setErrorMessage('We could not load your billing workspace right now.')
          setProfile(null)
          setInvoices([])
        }
      } finally {
        if (!ignore) setIsLoadingBilling(false)
      }
    }

    void loadBilling()

    return () => {
      ignore = true
    }
  }, [selectedBusiness])

  return (
    <ManageBusinessShell
      activeNav="/manage_business/payouts"
      subNavItems={buildPayoutsSubNavItems(selectedBusiness?.id ?? null)}
      activeSubNav={pathname}
    >
      {errorMessage ? (
        <Alert variant="destructive" className="mb-6 rounded-2xl">
          <AlertTitle>Billing issue</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {isLoadingBusinesses ? (
        <div className="grid gap-6">
          <div className="h-36 animate-pulse rounded-[28px] bg-white" />
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="h-[380px] animate-pulse rounded-[28px] bg-white" />
            <div className="h-[320px] animate-pulse rounded-[28px] bg-white" />
          </div>
        </div>
      ) : !businesses.length ? (
        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
            Billing Workspace
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
            No businesses found
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
            Create your first business to view billing plans, payout readiness, and subscription
            invoices from this workspace.
          </p>
        </section>
      ) : (
        <div className="grid gap-6">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Billing Workspace
                </p>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
                  {selectedBusiness?.name}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
                  Review your current platform plan, trial window, payout readiness, and generated
                  invoices. This page is the owner-side billing mirror of the super-admin pricing
                  console.
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
          </section>

          <section className="grid gap-4 md:grid-cols-3">
            <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                Current plan
              </p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
                {profile?.pricingPlanName ?? 'Unavailable'}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {profile ? formatBillingType(profile.billingType) : 'Plan data is still loading.'}
              </p>
              {profile?.pendingPricingPlanName && profile.pendingPlanEffectiveAt ? (
                <p className="mt-2 text-xs font-semibold text-[#1E40AF]">
                  Scheduled next: {profile.pendingPricingPlanName} on{' '}
                  {formatDate(profile.pendingPlanEffectiveAt)}
                </p>
              ) : null}
            </article>

            <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                Platform rate
              </p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
                {profile ? formatMoney(profile.monthlyAmount) : '--'}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {profile ? `${formatMoney(profile.perBookingFee)} per completed booking` : 'Usage pricing unavailable.'}
              </p>
            </article>

            <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                Payout readiness
              </p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
                {getPayoutStatusLabel(profile)}
              </p>
              <p className="mt-2 text-sm text-slate-500">
                {profile
                  ? `${profile.payoutProvider}${profile.payoutAccountRef ? ` • ${profile.payoutAccountRef}` : ''}`
                  : 'Payout connection unavailable.'}
              </p>
            </article>
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Invoice history
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">
                    Subscription ledger
                  </h2>
                </div>
                {isLoadingBilling ? (
                  <span className="text-xs font-semibold text-slate-400">Loading...</span>
                ) : null}
              </div>

              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[680px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-4 py-3 text-left text-[9px] font-black uppercase tracking-[1.2px] text-slate-400">
                        Invoice
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-black uppercase tracking-[1.2px] text-slate-400">
                        Billing period
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-black uppercase tracking-[1.2px] text-slate-400">
                        Usage
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-black uppercase tracking-[1.2px] text-slate-400">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-black uppercase tracking-[1.2px] text-slate-400">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {invoices.length ? (
                      invoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td className="px-4 py-3">
                            <div className="text-sm font-bold text-[#0B1C30]">
                              {invoice.pricingPlanName}
                            </div>
                            <div className="text-[10px] text-slate-400">{invoice.id}</div>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">
                            {formatDate(invoice.billingPeriodStart)} - {formatDate(invoice.billingPeriodEnd)}
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">
                            <div>{invoice.usageBookingCount} completed bookings</div>
                            <div className="mt-1">
                              {formatMoney(invoice.monthlyComponentAmount)} +{' '}
                              {formatMoney(invoice.usageComponentAmount)}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm font-bold text-[#0B1C30]">
                            {formatMoney(invoice.amount)}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`rounded-sm px-2 py-1 text-[10px] font-bold ${getInvoiceStatusClassName(
                                invoice.status
                              )}`}
                            >
                              {invoice.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-500">
                          No invoices have been generated for this business yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </article>

            <aside className="grid gap-6 self-start">
              <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Trial window
                </p>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Start
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#0B1C30]">
                      {profile ? formatDate(profile.trialStartAt) : 'Unavailable'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      End
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#0B1C30]">
                      {profile ? formatDate(profile.trialEndAt) : 'Unavailable'}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Status
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#0B1C30]">
                      {profile?.isTrialActive ? 'Trial active' : 'Trial complete'}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-slate-200 bg-[#EFF4FF] p-6 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                  Billing notes
                </p>
                <div className="mt-4 grid gap-3 text-sm leading-relaxed text-slate-500">
                  <p>
                    Completed bookings are what drive usage-based invoice charges for this business.
                  </p>
                  <p>
                    Payout batches are still a later phase, but this page already shows whether the
                    business is configured to receive them.
                  </p>
                  <p>
                    Plan changes and trial overrides are controlled by the platform billing console.
                  </p>
                </div>
              </section>
            </aside>
          </section>
        </div>
      )}
    </ManageBusinessShell>
  )
}

function ManageBusinessPayoutsPageFallback() {
  return (
    <div className="min-h-screen bg-[#F1F5F9] p-5 md:p-6">
      <div className="grid gap-6">
        <div className="h-36 animate-pulse rounded-[28px] bg-white" />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="h-[380px] animate-pulse rounded-[28px] bg-white" />
          <div className="h-[320px] animate-pulse rounded-[28px] bg-white" />
        </div>
      </div>
    </div>
  )
}

export default function ManageBusinessPayoutsPage() {
  return (
    <Suspense fallback={<ManageBusinessPayoutsPageFallback />}>
      <ManageBusinessPayoutsPageContent />
    </Suspense>
  )
}
