'use client'

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  AdminBillingSummaryResponse,
  BillingType,
  BusinessBillingProfile,
  BusinessBillingProfileMutationPayload,
  BusinessBillingProfileMutationSuccessResponse,
  InvoiceProvider,
  InvoiceStatus,
  PricingPlan,
  PricingPlanMutationPayload,
  PricingPlanMutationSuccessResponse,
  SubscriptionInvoiceCreatePayload,
  SubscriptionInvoiceCreateSuccessResponse,
} from '@/types/billing'

type PlanFormState = {
  name: string
  billingType: BillingType
  monthlyAmount: string
  perBookingFee: string
  currency: 'GBP'
  isActive: boolean
  isDefault: boolean
  isOwnerSelectable: boolean
}

type BillingProfileFormState = {
  pricingPlanId: string
  trialStartAt: string
  trialEndAt: string
  isTrialActive: boolean
  payoutProvider: string
  payoutAccountRef: string
  isPayoutsEnabled: boolean
}

type InvoiceFormState = {
  businessId: string
  billingPeriodStart: string
  billingPeriodEnd: string
  provider: InvoiceProvider
  providerRef: string
  status: InvoiceStatus
}

const BILLING_TYPE_OPTIONS: Array<{ value: BillingType; label: string }> = [
  { value: 'PAY_AS_YOU_GO', label: 'Pay as you go' },
  { value: 'HYBRID', label: 'Hybrid' },
  { value: 'MONTHLY', label: 'Monthly only' },
]

const PAYOUT_PROVIDER_OPTIONS = ['NONE', 'STRIPE', 'PAYPAL', 'MANUAL'] as const
const INVOICE_PROVIDER_OPTIONS = ['INTERNAL', 'STRIPE', 'PAYPAL', 'MANUAL'] as const

const createPlanFormState = (plan?: PricingPlan | null): PlanFormState => ({
  name: plan?.name ?? '',
  billingType: (plan?.billingType ?? 'PAY_AS_YOU_GO') as BillingType,
  monthlyAmount: plan?.monthlyAmount ?? '0.00',
  perBookingFee: plan?.perBookingFee ?? '0.00',
  currency: 'GBP',
  isActive: plan?.isActive ?? true,
  isDefault: plan?.isDefault ?? false,
  isOwnerSelectable: plan?.isOwnerSelectable ?? true,
})

const createBillingProfileFormState = (
  profile?: BusinessBillingProfile | null
): BillingProfileFormState => ({
  pricingPlanId: profile ? String(profile.pricingPlanId) : '',
  trialStartAt: profile ? profile.trialStartAt.slice(0, 10) : '',
  trialEndAt: profile ? profile.trialEndAt.slice(0, 10) : '',
  isTrialActive: profile?.isTrialActive ?? true,
  payoutProvider: profile?.payoutProvider ?? 'NONE',
  payoutAccountRef: profile?.payoutAccountRef ?? '',
  isPayoutsEnabled: profile?.isPayoutsEnabled ?? false,
})

const createInvoiceFormState = (businessId = ''): InvoiceFormState => {
  const now = new Date()
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0))

  return {
    businessId,
    billingPeriodStart: start.toISOString().slice(0, 10),
    billingPeriodEnd: end.toISOString().slice(0, 10),
    provider: 'INTERNAL',
    providerRef: '',
    status: 'PENDING',
  }
}

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

const getBusinessStatusClassName = (status: string) => {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return 'bg-emerald-100 text-emerald-700'
    case 'PENDING':
      return 'bg-amber-100 text-amber-700'
    case 'SUSPENDED':
      return 'bg-red-100 text-red-600'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

export default function SubscriptionsClient() {
  const [summary, setSummary] = useState<AdminBillingSummaryResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSavingPlan, setIsSavingPlan] = useState(false)
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [isCreatingInvoice, setIsCreatingInvoice] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [selectedPlanId, setSelectedPlanId] = useState<number | 'new'>('new')
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>('')
  const [planFormState, setPlanFormState] = useState<PlanFormState>(createPlanFormState())
  const [billingProfileFormState, setBillingProfileFormState] = useState<BillingProfileFormState>(
    createBillingProfileFormState()
  )
  const [invoiceFormState, setInvoiceFormState] = useState<InvoiceFormState>(createInvoiceFormState())

  const loadSummary = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/billing/summary', {
        method: 'GET',
        cache: 'no-store',
      })
      const payload = (await response.json()) as AdminBillingSummaryResponse | ApiErrorResponse

      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(payload, 'We could not load billing data right now.'))
        setSummary(null)
        return
      }

      setSummary(payload as AdminBillingSummaryResponse)
    } catch {
      setErrorMessage('We could not load billing data right now.')
      setSummary(null)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadSummary()
  }, [])

  const pricingPlans = useMemo(() => summary?.pricingPlans ?? [], [summary])
  const billingProfiles = useMemo(() => summary?.billingProfiles ?? [], [summary])
  const invoices = useMemo(() => summary?.invoices ?? [], [summary])

  const selectedPlan = useMemo(() => {
    if (selectedPlanId === 'new') return null
    return pricingPlans.find((plan) => plan.id === selectedPlanId) ?? null
  }, [pricingPlans, selectedPlanId])

  const selectedBillingProfile = useMemo(() => {
    return billingProfiles.find((profile) => profile.businessId === selectedBusinessId) ?? null
  }, [billingProfiles, selectedBusinessId])

  useEffect(() => {
    if (!pricingPlans.length) {
      setSelectedPlanId('new')
      setPlanFormState(createPlanFormState())
      return
    }

    if (selectedPlanId !== 'new' && !pricingPlans.some((plan) => plan.id === selectedPlanId)) {
      setSelectedPlanId(pricingPlans[0].id)
    }
  }, [pricingPlans, selectedPlanId])

  useEffect(() => {
    setPlanFormState(createPlanFormState(selectedPlan))
  }, [selectedPlan])

  useEffect(() => {
    if (!billingProfiles.length) {
      setSelectedBusinessId('')
      setBillingProfileFormState(createBillingProfileFormState())
      setInvoiceFormState(createInvoiceFormState())
      return
    }

    if (!selectedBusinessId || !billingProfiles.some((profile) => profile.businessId === selectedBusinessId)) {
      setSelectedBusinessId(billingProfiles[0].businessId)
    }
  }, [billingProfiles, selectedBusinessId])

  useEffect(() => {
    setBillingProfileFormState(createBillingProfileFormState(selectedBillingProfile))
    setInvoiceFormState((currentValue) => ({
      ...currentValue,
      businessId: selectedBillingProfile?.businessId ?? '',
    }))
  }, [selectedBillingProfile])

  const invoiceTotal = useMemo(() => {
    return invoices.reduce((accumulator, invoice) => accumulator + Number.parseFloat(invoice.amount), 0)
  }, [invoices])

  const monthlyRecurringRevenue = useMemo(() => {
    return billingProfiles.reduce(
      (accumulator, profile) => accumulator + Number.parseFloat(profile.monthlyAmount),
      0
    )
  }, [billingProfiles])

  const averagePerBookingFee = useMemo(() => {
    if (!billingProfiles.length) return 0
    const total = billingProfiles.reduce(
      (accumulator, profile) => accumulator + Number.parseFloat(profile.perBookingFee),
      0
    )
    return total / billingProfiles.length
  }, [billingProfiles])

  const planDistribution = useMemo(() => {
    return pricingPlans.map((plan) => {
      const users = billingProfiles.filter((profile) => profile.pricingPlanId === plan.id).length
      const total = billingProfiles.length || 1
      return {
        plan,
        users,
        pct: Math.round((users / total) * 100),
      }
    })
  }, [billingProfiles, pricingPlans])

  const visibleInvoices = useMemo(() => {
    if (!selectedBusinessId) return invoices
    return invoices.filter((invoice) => invoice.businessId === selectedBusinessId)
  }, [invoices, selectedBusinessId])

  const handlePlanFieldChange =
    (field: keyof PlanFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const target = event.target
      setPlanFormState((currentValue) => ({
        ...currentValue,
        [field]:
          target instanceof HTMLInputElement && target.type === 'checkbox'
            ? target.checked
            : target.value,
      }))
    }

  const handleBillingProfileFieldChange =
    (field: keyof BillingProfileFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const target = event.target
      setBillingProfileFormState((currentValue) => ({
        ...currentValue,
        [field]:
          target instanceof HTMLInputElement && target.type === 'checkbox'
            ? target.checked
            : target.value,
      }))
    }

  const handleInvoiceFieldChange =
    (field: keyof InvoiceFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setInvoiceFormState((currentValue) => ({
        ...currentValue,
        [field]: event.target.value,
      }))
    }

  const handleCreateNewPlan = () => {
    setSelectedPlanId('new')
    setPlanFormState(createPlanFormState())
  }

  const handleSavePlan = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)
    setIsSavingPlan(true)

    const payload: PricingPlanMutationPayload = {
      name: planFormState.name.trim(),
      billing_type: planFormState.billingType,
      monthly_amount: planFormState.monthlyAmount.trim(),
      per_booking_fee: planFormState.perBookingFee.trim(),
      currency: planFormState.currency,
      is_active: planFormState.isActive,
      is_default: planFormState.isDefault,
      is_owner_selectable: planFormState.isOwnerSelectable,
    }

    try {
      const isCreate = selectedPlanId === 'new'
      const response = await fetch(
        isCreate ? '/api/admin/pricing-plans' : `/api/admin/pricing-plans/${selectedPlanId}`,
        {
          method: isCreate ? 'POST' : 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      )

      const result = (await response.json()) as PricingPlanMutationSuccessResponse | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(result, 'We could not save the pricing plan right now.'))
        return
      }

      setSuccessMessage((result as PricingPlanMutationSuccessResponse).message)
      await loadSummary()
      setSelectedPlanId((result as PricingPlanMutationSuccessResponse).plan.id)
    } catch {
      setErrorMessage('We could not save the pricing plan right now.')
    } finally {
      setIsSavingPlan(false)
    }
  }

  const handleSaveBillingProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!selectedBusinessId) return

    setErrorMessage(null)
    setSuccessMessage(null)
    setIsSavingProfile(true)

    const payload: BusinessBillingProfileMutationPayload = {
      pricing_plan_id: Number.parseInt(billingProfileFormState.pricingPlanId, 10),
      trial_start_at: billingProfileFormState.trialStartAt,
      trial_end_at: billingProfileFormState.trialEndAt,
      is_trial_active: billingProfileFormState.isTrialActive,
      payout_provider: billingProfileFormState.payoutProvider,
      payout_account_ref: billingProfileFormState.payoutAccountRef.trim() || null,
      is_payouts_enabled: billingProfileFormState.isPayoutsEnabled,
    }

    try {
      const response = await fetch(`/api/admin/business-billing-profiles/${selectedBusinessId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = (await response.json()) as
        | BusinessBillingProfileMutationSuccessResponse
        | ApiErrorResponse

      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(result, 'We could not update the billing profile right now.'))
        return
      }

      setSuccessMessage((result as BusinessBillingProfileMutationSuccessResponse).message)
      await loadSummary()
    } catch {
      setErrorMessage('We could not update the billing profile right now.')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleCreateInvoice = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!invoiceFormState.businessId) return

    setErrorMessage(null)
    setSuccessMessage(null)
    setIsCreatingInvoice(true)

    const payload: SubscriptionInvoiceCreatePayload = {
      business_id: invoiceFormState.businessId,
      billing_period_start: invoiceFormState.billingPeriodStart,
      billing_period_end: invoiceFormState.billingPeriodEnd,
      provider: invoiceFormState.provider,
      provider_ref: invoiceFormState.providerRef.trim() || null,
      status: invoiceFormState.status,
    }

    try {
      const response = await fetch('/api/admin/subscription-invoices', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const result = (await response.json()) as
        | SubscriptionInvoiceCreateSuccessResponse
        | ApiErrorResponse

      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(result, 'We could not create the invoice right now.'))
        return
      }

      setSuccessMessage((result as SubscriptionInvoiceCreateSuccessResponse).message)
      await loadSummary()
    } catch {
      setErrorMessage('We could not create the invoice right now.')
    } finally {
      setIsCreatingInvoice(false)
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className="px-6 pb-4 pt-5">
        <div className="mb-1 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-black tracking-tight text-[#0B1C30] md:text-3xl">
            Pricing Architecture
          </h1>
          <span className="rounded-sm border border-emerald-200 bg-emerald-100 px-2.5 py-1 text-[9px] font-black uppercase tracking-[1.5px] text-emerald-700">
            Super Admin
          </span>
        </div>
        <p className="max-w-3xl text-sm text-slate-500">
          Configure platform pricing plans, manage business billing profiles, and generate
          subscription invoices from completed booking activity without leaving the admin suite.
        </p>
      </div>

      <div className="px-6">
        {errorMessage ? (
          <Alert variant="destructive" className="mb-5 rounded-2xl">
            <AlertTitle>Billing issue</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        {successMessage ? (
          <Alert className="mb-5 rounded-2xl">
            <AlertTitle>Billing updated</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        ) : null}
      </div>

      {isLoading ? (
        <div className="grid gap-5 px-6 pb-6">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,420px)_1fr]">
            <div className="h-[520px] animate-pulse rounded-sm bg-white" />
            <div className="h-[520px] animate-pulse rounded-sm bg-white" />
          </div>
          <div className="h-[440px] animate-pulse rounded-sm bg-white" />
        </div>
      ) : (
        <>
          <div className="px-6 pb-5">
            <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,420px)_1fr]">
              <form
                onSubmit={handleSavePlan}
                className="overflow-hidden rounded-sm border border-slate-200 bg-white"
              >
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"
                        fill="#1E40AF"
                      />
                    </svg>
                    <h2 className="text-base font-black tracking-tight text-[#0B1C30]">
                      Plan Configuration
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={handleCreateNewPlan}
                    className="text-[10px] font-black uppercase tracking-[1.8px] text-[#1E40AF]"
                  >
                    New plan
                  </button>
                </div>

                <div className="flex flex-col gap-5 px-5 py-5">
                  <label className="grid gap-2">
                    <span className="text-[9px] font-black uppercase tracking-[1.5px] text-slate-400">
                      Active plan
                    </span>
                    <select
                      value={selectedPlanId}
                      onChange={(event) =>
                        setSelectedPlanId(
                          event.target.value === 'new' ? 'new' : Number.parseInt(event.target.value, 10)
                        )
                      }
                      className="h-11 rounded-sm border border-slate-200 bg-white px-3 text-sm font-medium text-[#0B1C30] outline-none focus:border-[#1E40AF]"
                    >
                      <option value="new">Create a new pricing plan</option>
                      {pricingPlans.map((plan) => (
                        <option key={plan.id} value={plan.id}>
                          {plan.name}
                          {plan.isDefault ? ' (Default)' : ''}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="grid gap-2">
                    <span className="text-[9px] font-black uppercase tracking-[1.5px] text-slate-400">
                      Plan identity
                    </span>
                    <input
                      type="text"
                      value={planFormState.name}
                      onChange={handlePlanFieldChange('name')}
                      className="h-11 rounded-sm border border-slate-200 bg-white px-3 text-sm font-medium text-[#0B1C30] outline-none focus:border-[#1E40AF]"
                    />
                  </label>

                  <label className="grid gap-2">
                    <span className="text-[9px] font-black uppercase tracking-[1.5px] text-slate-400">
                      Billing type
                    </span>
                    <select
                      value={planFormState.billingType}
                      onChange={handlePlanFieldChange('billingType')}
                      className="h-11 rounded-sm border border-slate-200 bg-white px-3 text-sm font-medium text-[#0B1C30] outline-none focus:border-[#1E40AF]"
                    >
                      {BILLING_TYPE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </label>

                  <div className="grid grid-cols-2 gap-3">
                    <label className="grid gap-2">
                      <span className="text-[9px] font-black uppercase tracking-[1.5px] text-slate-400">
                        Monthly retainer (GBP)
                      </span>
                      <input
                        type="text"
                        value={planFormState.monthlyAmount}
                        onChange={handlePlanFieldChange('monthlyAmount')}
                        className="h-11 rounded-sm border border-slate-200 bg-white px-3 text-sm font-medium text-[#0B1C30] outline-none focus:border-[#1E40AF]"
                      />
                    </label>
                    <label className="grid gap-2">
                      <span className="text-[9px] font-black uppercase tracking-[1.5px] text-slate-400">
                        Per booking fee (GBP)
                      </span>
                      <input
                        type="text"
                        value={planFormState.perBookingFee}
                        onChange={handlePlanFieldChange('perBookingFee')}
                        className="h-11 rounded-sm border border-slate-200 bg-white px-3 text-sm font-medium text-[#0B1C30] outline-none focus:border-[#1E40AF]"
                      />
                    </label>
                  </div>

                  <div className="grid gap-2">
                    <span className="text-[9px] font-black uppercase tracking-[1.5px] text-slate-400">
                      Plan controls
                    </span>
                    <div className="grid gap-2">
                      <label className="flex items-center justify-between rounded-sm bg-slate-50 px-3 py-2.5 text-sm font-medium text-[#0B1C30]">
                        <span>Plan is active</span>
                        <input
                          type="checkbox"
                          checked={planFormState.isActive}
                          onChange={handlePlanFieldChange('isActive')}
                          className="h-4 w-4 rounded border-slate-300 text-[#1E40AF] focus:ring-[#1E40AF]"
                        />
                      </label>
                      <label className="flex items-center justify-between rounded-sm bg-slate-50 px-3 py-2.5 text-sm font-medium text-[#0B1C30]">
                        <span>Use as default plan for new businesses</span>
                        <input
                          type="checkbox"
                          checked={planFormState.isDefault}
                          onChange={handlePlanFieldChange('isDefault')}
                          className="h-4 w-4 rounded border-slate-300 text-[#1E40AF] focus:ring-[#1E40AF]"
                        />
                      </label>
                      <label className="flex items-center justify-between rounded-sm bg-slate-50 px-3 py-2.5 text-sm font-medium text-[#0B1C30]">
                        <span>Owner can self-select this plan</span>
                        <input
                          type="checkbox"
                          checked={planFormState.isOwnerSelectable}
                          onChange={handlePlanFieldChange('isOwnerSelectable')}
                          className="h-4 w-4 rounded border-slate-300 text-[#1E40AF] focus:ring-[#1E40AF]"
                        />
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSavingPlan}
                    className="w-full rounded-sm bg-[#1E40AF] py-3.5 text-[10px] font-black uppercase tracking-[2px] text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSavingPlan
                      ? 'Saving plan...'
                      : selectedPlanId === 'new'
                        ? 'Create pricing plan'
                        : 'Commit plan changes'}
                  </button>
                </div>
              </form>

              <div className="overflow-hidden rounded-sm border border-slate-200 bg-white">
                <div className="border-b border-slate-100 px-5 py-4">
                  <h2 className="text-base font-black tracking-tight text-[#0B1C30]">
                    Ecosystem Distribution
                  </h2>
                </div>

                <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
                  <div className="px-4 py-4">
                    <div className="mb-1 text-[9px] font-black uppercase tracking-[1.2px] text-slate-400">
                      Active merchants
                    </div>
                    <div className="text-2xl font-black leading-tight tracking-tight text-[#0B1C30]">
                      {billingProfiles.length}
                    </div>
                    <div className="mt-1 text-[11px] font-semibold text-emerald-600">
                      {billingProfiles.filter((profile) => profile.isTrialActive).length} on trial
                    </div>
                  </div>
                  <div className="px-4 py-4">
                    <div className="mb-1 text-[9px] font-black uppercase tracking-[1.2px] text-slate-400">
                      Monthly MRR
                    </div>
                    <div className="text-2xl font-black leading-tight tracking-tight text-[#0B1C30]">
                      {formatMoney(monthlyRecurringRevenue.toFixed(2))}
                    </div>
                    <div className="mt-1 text-[11px] font-semibold text-[#1E40AF]">
                      Recurring baseline
                    </div>
                  </div>
                  <div className="px-4 py-4">
                    <div className="mb-1 text-[9px] font-black uppercase tracking-[1.2px] text-slate-400">
                      Avg. fee / booking
                    </div>
                    <div className="text-2xl font-black leading-tight tracking-tight text-[#0B1C30]">
                      {formatMoney(averagePerBookingFee.toFixed(2))}
                    </div>
                    <div className="mt-1 text-[11px] font-semibold text-slate-400">
                      Across live profiles
                    </div>
                  </div>
                </div>

                <div className="px-5 py-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-[1.5px] text-slate-400">
                      Tier Utilization
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {formatMoney(invoiceTotal.toFixed(2))} invoiced
                    </span>
                  </div>

                  <div className="flex flex-col gap-4">
                    {planDistribution.map(({ plan, users, pct }, index) => (
                      <div key={plan.id}>
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="flex items-center gap-2 text-xs font-semibold text-[#0B1C30]">
                            <span>
                              {plan.name} ({formatBillingType(plan.billingType)})
                            </span>
                            {plan.isOwnerSelectable ? (
                              <span className="rounded-sm bg-[#EFF4FF] px-1.5 py-0.5 text-[9px] font-black uppercase tracking-[1px] text-[#1E40AF]">
                                Self-serve
                              </span>
                            ) : null}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            {users} Businesses
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full ${
                              index % 3 === 0
                                ? 'bg-slate-400'
                                : index % 3 === 1
                                  ? 'bg-[#1E40AF]'
                                  : 'bg-emerald-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleSaveBillingProfile} className="mt-6 grid gap-3 border-t border-slate-100 pt-5">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-[1.5px] text-slate-400">
                        Billing profile controls
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Point a business to the right plan, control trial windows, and gate payout
                        readiness from one place.
                      </p>
                    </div>

                    <label className="grid gap-2">
                      <span className="text-[9px] font-black uppercase tracking-[1.2px] text-slate-400">
                        Business
                      </span>
                      <select
                        value={selectedBusinessId}
                        onChange={(event) => setSelectedBusinessId(event.target.value)}
                        className="h-10 rounded-sm border border-slate-200 bg-white px-3 text-sm font-medium text-[#0B1C30] outline-none focus:border-[#1E40AF]"
                      >
                        {billingProfiles.map((profile) => (
                          <option key={profile.businessId} value={profile.businessId}>
                            {profile.businessName}
                          </option>
                        ))}
                      </select>
                    </label>

                    {selectedBillingProfile ? (
                      <div className="flex flex-wrap gap-2">
                        <span
                          className={`rounded-sm px-2 py-1 text-[10px] font-bold ${getBusinessStatusClassName(
                            selectedBillingProfile.businessStatus
                          )}`}
                        >
                          {selectedBillingProfile.businessStatus}
                        </span>
                        <span className="rounded-sm bg-slate-100 px-2 py-1 text-[10px] font-bold text-slate-600">
                          {selectedBillingProfile.pricingPlanName}
                        </span>
                      </div>
                    ) : null}

                    <label className="grid gap-2">
                      <span className="text-[9px] font-black uppercase tracking-[1.2px] text-slate-400">
                        Assigned plan
                      </span>
                      <select
                        value={billingProfileFormState.pricingPlanId}
                        onChange={handleBillingProfileFieldChange('pricingPlanId')}
                        className="h-10 rounded-sm border border-slate-200 bg-white px-3 text-sm font-medium text-[#0B1C30] outline-none focus:border-[#1E40AF]"
                      >
                        {pricingPlans
                          .filter((plan) => plan.isActive)
                          .map((plan) => (
                            <option key={plan.id} value={plan.id}>
                              {plan.name}
                            </option>
                          ))}
                      </select>
                    </label>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="grid gap-2">
                        <span className="text-[9px] font-black uppercase tracking-[1.2px] text-slate-400">
                          Trial start
                        </span>
                        <input
                          type="date"
                          value={billingProfileFormState.trialStartAt}
                          onChange={handleBillingProfileFieldChange('trialStartAt')}
                          className="h-10 rounded-sm border border-slate-200 bg-white px-3 text-sm font-medium text-[#0B1C30] outline-none focus:border-[#1E40AF]"
                        />
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[9px] font-black uppercase tracking-[1.2px] text-slate-400">
                          Trial end
                        </span>
                        <input
                          type="date"
                          value={billingProfileFormState.trialEndAt}
                          onChange={handleBillingProfileFieldChange('trialEndAt')}
                          className="h-10 rounded-sm border border-slate-200 bg-white px-3 text-sm font-medium text-[#0B1C30] outline-none focus:border-[#1E40AF]"
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="flex items-center justify-between rounded-sm bg-slate-50 px-3 py-2.5 text-xs font-semibold text-[#0B1C30]">
                        <span>Trial active</span>
                        <input
                          type="checkbox"
                          checked={billingProfileFormState.isTrialActive}
                          onChange={handleBillingProfileFieldChange('isTrialActive')}
                          className="h-4 w-4 rounded border-slate-300 text-[#1E40AF] focus:ring-[#1E40AF]"
                        />
                      </label>
                      <label className="flex items-center justify-between rounded-sm bg-slate-50 px-3 py-2.5 text-xs font-semibold text-[#0B1C30]">
                        <span>Payouts enabled</span>
                        <input
                          type="checkbox"
                          checked={billingProfileFormState.isPayoutsEnabled}
                          onChange={handleBillingProfileFieldChange('isPayoutsEnabled')}
                          className="h-4 w-4 rounded border-slate-300 text-[#1E40AF] focus:ring-[#1E40AF]"
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <label className="grid gap-2">
                        <span className="text-[9px] font-black uppercase tracking-[1.2px] text-slate-400">
                          Payout provider
                        </span>
                        <select
                          value={billingProfileFormState.payoutProvider}
                          onChange={handleBillingProfileFieldChange('payoutProvider')}
                          className="h-10 rounded-sm border border-slate-200 bg-white px-3 text-sm font-medium text-[#0B1C30] outline-none focus:border-[#1E40AF]"
                        >
                          {PAYOUT_PROVIDER_OPTIONS.map((provider) => (
                            <option key={provider} value={provider}>
                              {provider}
                            </option>
                          ))}
                        </select>
                      </label>
                      <label className="grid gap-2">
                        <span className="text-[9px] font-black uppercase tracking-[1.2px] text-slate-400">
                          Account reference
                        </span>
                        <input
                          type="text"
                          value={billingProfileFormState.payoutAccountRef}
                          onChange={handleBillingProfileFieldChange('payoutAccountRef')}
                          className="h-10 rounded-sm border border-slate-200 bg-white px-3 text-sm font-medium text-[#0B1C30] outline-none focus:border-[#1E40AF]"
                        />
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSavingProfile || !selectedBusinessId}
                      className="rounded-sm bg-[#0B1C30] py-3 text-[10px] font-black uppercase tracking-[2px] text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSavingProfile ? 'Saving profile...' : 'Update billing profile'}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>

          <div className="px-6 pb-6">
            <div className="rounded-sm bg-white">
              <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
                <div>
                  <h2 className="text-lg font-black tracking-tight text-[#0B1C30]">
                    Invoice Ledger
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-400">
                    Generate billing records directly from live business profiles and completed
                    booking usage.
                  </p>
                </div>

                <form onSubmit={handleCreateInvoice} className="grid gap-2 sm:grid-cols-5">
                  <select
                    value={invoiceFormState.businessId}
                    onChange={handleInvoiceFieldChange('businessId')}
                    className="h-9 min-w-[170px] rounded border border-slate-200 px-3 text-xs font-bold text-slate-600"
                  >
                    {billingProfiles.map((profile) => (
                      <option key={profile.businessId} value={profile.businessId}>
                        {profile.businessName}
                      </option>
                    ))}
                  </select>
                  <input
                    type="date"
                    value={invoiceFormState.billingPeriodStart}
                    onChange={handleInvoiceFieldChange('billingPeriodStart')}
                    className="h-9 rounded border border-slate-200 px-3 text-xs font-bold text-slate-600"
                  />
                  <input
                    type="date"
                    value={invoiceFormState.billingPeriodEnd}
                    onChange={handleInvoiceFieldChange('billingPeriodEnd')}
                    className="h-9 rounded border border-slate-200 px-3 text-xs font-bold text-slate-600"
                  />
                  <select
                    value={invoiceFormState.provider}
                    onChange={handleInvoiceFieldChange('provider')}
                    className="h-9 rounded border border-slate-200 px-3 text-xs font-bold text-slate-600"
                  >
                    {INVOICE_PROVIDER_OPTIONS.map((provider) => (
                      <option key={provider} value={provider}>
                        {provider}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    disabled={isCreatingInvoice || !invoiceFormState.businessId}
                    className="rounded bg-[#1E40AF] px-3 text-[10px] font-black uppercase tracking-[1.4px] text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isCreatingInvoice ? 'Generating...' : 'Create invoice'}
                  </button>
                </form>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px]">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50">
                      <th className="px-4 py-3 text-left text-[9px] font-black uppercase tracking-[1.2px] text-slate-400">
                        Business
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-black uppercase tracking-[1.2px] text-slate-400">
                        Billing period
                      </th>
                      <th className="px-4 py-3 text-left text-[9px] font-black uppercase tracking-[1.2px] text-slate-400">
                        Plan
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
                    {visibleInvoices.length ? (
                      visibleInvoices.map((invoice) => (
                        <tr key={invoice.id} className="transition-colors hover:bg-slate-50">
                          <td className="px-4 py-3">
                            <div className="text-sm font-bold text-[#0B1C30]">
                              {invoice.businessName}
                            </div>
                            <div className="text-[10px] text-slate-400">{invoice.id}</div>
                          </td>
                          <td className="px-4 py-3 text-xs text-slate-500">
                            {formatDate(invoice.billingPeriodStart)} - {formatDate(invoice.billingPeriodEnd)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-sm font-bold text-[#0B1C30]">
                              {invoice.pricingPlanName}
                            </div>
                            <div className="text-[10px] text-slate-400">{invoice.provider}</div>
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
                        <td colSpan={6} className="px-4 py-8 text-center text-sm text-slate-500">
                          No invoices have been generated for the current filter yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
