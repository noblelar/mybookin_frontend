'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'

import ManageBusinessShell from '@/components/manage_business/ManageBusinessShell'
import { buildPayoutsSubNavItems } from '@/components/manage_business/workspace/payouts-navigation'
import { formatDateLabel } from '@/components/manage_business/settings/settings-utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { formatCurrency, getApiErrorMessage } from '@/lib/utils'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  BusinessSubscriptionInvoicesResponse,
  SubscriptionInvoice,
} from '@/types/billing'
import type { Business, BusinessListResponse } from '@/types/business'

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

export default function ManageBusinessPayoutsInvoicesPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedBusinessId = searchParams.get('businessId')

  const [businesses, setBusinesses] = useState<Business[]>([])
  const [invoices, setInvoices] = useState<SubscriptionInvoice[]>([])
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true)
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false)
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
      setInvoices([])
      return
    }

    const businessId = selectedBusiness.id
    let ignore = false

    async function loadInvoices() {
      setIsLoadingInvoices(true)
      setErrorMessage(null)

      try {
        const response = await fetch(`/api/businesses/${businessId}/subscription-invoices`, {
          method: 'GET',
          cache: 'no-store',
        })

        const payload = (await response.json()) as
          | BusinessSubscriptionInvoicesResponse
          | ApiErrorResponse
        if (ignore) return

        if (!response.ok) {
          setInvoices([])
          setErrorMessage(
            getApiErrorMessage(payload, 'We could not load your subscription invoices right now.')
          )
          return
        }

        setInvoices((payload as BusinessSubscriptionInvoicesResponse).invoices)
      } catch {
        if (!ignore) {
          setInvoices([])
          setErrorMessage('We could not load your subscription invoices right now.')
        }
      } finally {
        if (!ignore) setIsLoadingInvoices(false)
      }
    }

    void loadInvoices()

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
          <AlertTitle>Invoice issue</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {isLoadingBusinesses ? (
        <div className="grid gap-6">
          <div className="h-36 animate-pulse rounded-[28px] bg-white" />
          <div className="h-[420px] animate-pulse rounded-[28px] bg-white" />
        </div>
      ) : (
        <div className="grid gap-6">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Billing Workspace
                </p>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
                  Invoice ledger
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
                  Review the generated subscription invoices for the active business without the rest of
                  the billing summary getting in the way.
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

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Subscription invoices
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">
                  Billing periods and charge history
                </h2>
              </div>
              {isLoadingInvoices ? (
                <span className="text-xs font-semibold text-slate-400">Loading...</span>
              ) : null}
            </div>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[720px]">
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
                          {formatDateLabel(invoice.billingPeriodStart)} -{' '}
                          {formatDateLabel(invoice.billingPeriodEnd)}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500">
                          <div>{invoice.usageBookingCount} completed bookings</div>
                          <div className="mt-1">
                            {formatCurrency(invoice.monthlyComponentAmount, invoice.currency)} +{' '}
                            {formatCurrency(invoice.usageComponentAmount, invoice.currency)}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm font-bold text-[#0B1C30]">
                          {formatCurrency(invoice.amount, invoice.currency)}
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
          </section>
        </div>
      )}
    </ManageBusinessShell>
  )
}
