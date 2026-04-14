'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import {
  formatBillingTypeLabel,
  formatDateLabel,
} from '@/components/manage_business/settings/settings-utils'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useManageBusinessSettingsContext } from '@/context/ManageBusinessSettingsContext'
import { formatCurrency, getApiErrorMessage } from '@/lib/utils'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  BusinessBillingProfile,
  BusinessBillingProfileDetailResponse,
  OwnerSelectablePricingPlansResponse,
  PlanSelectionPayload,
  PlanSelectionSuccessResponse,
  PricingPlan,
} from '@/types/billing'

export default function ManageBusinessSettingsBillingPage() {
  const { selectedBusiness } = useManageBusinessSettingsContext()

  const [billingProfile, setBillingProfile] = useState<BusinessBillingProfile | null>(null)
  const [availablePricingPlans, setAvailablePricingPlans] = useState<PricingPlan[]>([])
  const [selectedPricingPlanId, setSelectedPricingPlanId] = useState<string>('')
  const [isLoadingBillingProfile, setIsLoadingBillingProfile] = useState(false)
  const [isSubmittingPlanSelection, setIsSubmittingPlanSelection] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedBusiness) {
      setBillingProfile(null)
      setAvailablePricingPlans([])
      setSelectedPricingPlanId('')
      return
    }

    const businessId = selectedBusiness.id
    let ignore = false

    async function loadBillingWorkspace() {
      setIsLoadingBillingProfile(true)
      setErrorMessage(null)
      setSuccessMessage(null)

      try {
        const [profileResponse, plansResponse] = await Promise.all([
          fetch(`/api/businesses/${businessId}/billing-profile`, {
            method: 'GET',
            cache: 'no-store',
          }),
          fetch(`/api/businesses/${businessId}/available-pricing-plans`, {
            method: 'GET',
            cache: 'no-store',
          }),
        ])

        const profilePayload = (await profileResponse.json()) as
          | BusinessBillingProfileDetailResponse
          | ApiErrorResponse
        const plansPayload = (await plansResponse.json()) as
          | OwnerSelectablePricingPlansResponse
          | ApiErrorResponse

        if (ignore) return

        if (!profileResponse.ok) {
          setBillingProfile(null)
          setAvailablePricingPlans([])
          setErrorMessage(
            getApiErrorMessage(profilePayload, 'We could not load your billing profile right now.')
          )
          return
        }

        if (!plansResponse.ok) {
          setBillingProfile((profilePayload as BusinessBillingProfileDetailResponse).profile)
          setAvailablePricingPlans([])
          setErrorMessage(getApiErrorMessage(plansPayload, 'We could not load pricing plans right now.'))
          return
        }

        setBillingProfile((profilePayload as BusinessBillingProfileDetailResponse).profile)
        setAvailablePricingPlans((plansPayload as OwnerSelectablePricingPlansResponse).pricingPlans)
      } catch {
        if (!ignore) {
          setBillingProfile(null)
          setAvailablePricingPlans([])
          setErrorMessage('We could not load your billing workspace right now.')
        }
      } finally {
        if (!ignore) {
          setIsLoadingBillingProfile(false)
        }
      }
    }

    void loadBillingWorkspace()

    return () => {
      ignore = true
    }
  }, [selectedBusiness])

  useEffect(() => {
    if (!billingProfile) {
      setSelectedPricingPlanId('')
      return
    }

    const preferredPlanId = billingProfile.pendingPricingPlanId ?? billingProfile.pricingPlanId
    const hasPreferredPlan = availablePricingPlans.some((plan) => plan.id === preferredPlanId)

    if (hasPreferredPlan) {
      setSelectedPricingPlanId(String(preferredPlanId))
      return
    }

    setSelectedPricingPlanId(availablePricingPlans[0] ? String(availablePricingPlans[0].id) : '')
  }, [availablePricingPlans, billingProfile])

  const billingWorkspaceHref = selectedBusiness
    ? `/manage_business/payouts?businessId=${selectedBusiness.id}`
    : '/manage_business/payouts'

  const selectedPricingPlan = useMemo(() => {
    return (
      availablePricingPlans.find((plan) => plan.id === Number.parseInt(selectedPricingPlanId, 10)) ??
      null
    )
  }, [availablePricingPlans, selectedPricingPlanId])

  const hasPendingPlanChange = Boolean(
    billingProfile?.pendingPricingPlanId && billingProfile.pendingPlanEffectiveAt
  )

  const isCurrentPlanSelection =
    billingProfile !== null &&
    selectedPricingPlan !== null &&
    !hasPendingPlanChange &&
    billingProfile.pricingPlanId === selectedPricingPlan.id

  const isPendingPlanSelection =
    billingProfile !== null &&
    selectedPricingPlan !== null &&
    billingProfile.pendingPricingPlanId === selectedPricingPlan.id

  async function handlePlanSelection() {
    if (!selectedBusiness || !selectedPricingPlanId) return

    setErrorMessage(null)
    setSuccessMessage(null)
    setIsSubmittingPlanSelection(true)

    const payload: PlanSelectionPayload = {
      pricing_plan_id: Number.parseInt(selectedPricingPlanId, 10),
    }

    try {
      const response = await fetch(`/api/businesses/${selectedBusiness.id}/plan-selection`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = (await response.json()) as PlanSelectionSuccessResponse | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(result, 'We could not update the platform plan right now.'))
        return
      }

      const planSelectionResult = result as PlanSelectionSuccessResponse
      setBillingProfile(planSelectionResult.profile)
      setSuccessMessage(planSelectionResult.message)
    } catch {
      setErrorMessage('We could not update the platform plan right now.')
    } finally {
      setIsSubmittingPlanSelection(false)
    }
  }

  if (!selectedBusiness) return null

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        {errorMessage ? (
          <Alert variant="destructive" className="mb-6 rounded-2xl">
            <AlertTitle>Billing issue</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        {successMessage ? (
          <Alert className="mb-6 rounded-2xl">
            <AlertTitle>Plan updated</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        ) : null}

        <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
          Billing
        </p>
        <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">
          Platform plan selection
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
          Choose from the owner-selectable plans published by the super admin. Trial businesses apply
          changes immediately, while paid businesses schedule changes at the next billing boundary.
        </p>

        {isLoadingBillingProfile ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
            Loading plan options...
          </div>
        ) : billingProfile ? (
          <div className="mt-6 grid gap-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                Current plan
              </p>
              <p className="mt-2 text-lg font-bold text-[#0B1C30]">
                {billingProfile.pricingPlanName}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {formatBillingTypeLabel(billingProfile.billingType)} |{' '}
                {formatCurrency(billingProfile.monthlyAmount, billingProfile.currency)} monthly |{' '}
                {formatCurrency(billingProfile.perBookingFee, billingProfile.currency)} per completed
                booking
              </p>
            </div>

            {billingProfile.pendingPricingPlanId && billingProfile.pendingPlanEffectiveAt ? (
              <div className="rounded-2xl border border-blue-200 bg-[#EFF4FF] p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                  Scheduled change
                </p>
                <p className="mt-2 text-sm font-semibold text-[#0B1C30]">
                  {billingProfile.pendingPricingPlanName}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Starts on {formatDateLabel(billingProfile.pendingPlanEffectiveAt)}
                </p>
              </div>
            ) : null}

            <div className="grid gap-3">
              {availablePricingPlans.length ? (
                availablePricingPlans.map((plan) => {
                  const isSelected = selectedPricingPlanId === String(plan.id)
                  const isCurrent = billingProfile.pricingPlanId === plan.id
                  const isPending = billingProfile.pendingPricingPlanId === plan.id

                  return (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPricingPlanId(String(plan.id))}
                      className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
                        isSelected
                          ? 'border-[#0B1C30] bg-[#0B1C30] text-white'
                          : 'border-slate-200 bg-slate-50 text-[#0B1C30] hover:bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-bold">{plan.name}</p>
                          <p
                            className={`mt-1 text-xs ${
                              isSelected ? 'text-slate-200' : 'text-slate-500'
                            }`}
                          >
                            {formatBillingTypeLabel(plan.billingType)}
                          </p>
                        </div>
                        <div className="flex flex-wrap justify-end gap-2">
                          {plan.isDefault ? (
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                                isSelected ? 'bg-white/15 text-white' : 'bg-slate-200 text-slate-700'
                              }`}
                            >
                              Default
                            </span>
                          ) : null}
                          {isCurrent ? (
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                                isSelected
                                  ? 'bg-white/15 text-white'
                                  : 'bg-emerald-100 text-emerald-700'
                              }`}
                            >
                              Current
                            </span>
                          ) : null}
                          {isPending ? (
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${
                                isSelected
                                  ? 'bg-white/15 text-white'
                                  : 'bg-blue-100 text-blue-700'
                              }`}
                            >
                              Scheduled
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <div>
                          <p
                            className={`text-[10px] font-black uppercase tracking-[0.14em] ${
                              isSelected ? 'text-slate-300' : 'text-slate-400'
                            }`}
                          >
                            Monthly
                          </p>
                          <p className="mt-1 text-sm font-semibold">
                            {formatCurrency(plan.monthlyAmount, plan.currency)}
                          </p>
                        </div>
                        <div>
                          <p
                            className={`text-[10px] font-black uppercase tracking-[0.14em] ${
                              isSelected ? 'text-slate-300' : 'text-slate-400'
                            }`}
                          >
                            Per booking
                          </p>
                          <p className="mt-1 text-sm font-semibold">
                            {formatCurrency(plan.perBookingFee, plan.currency)}
                          </p>
                        </div>
                      </div>
                    </button>
                  )
                })
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                  No owner-selectable plans are available right now. A super admin can publish them
                  from the subscriptions console.
                </div>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => void handlePlanSelection()}
                disabled={
                  isSubmittingPlanSelection ||
                  isLoadingBillingProfile ||
                  !selectedPricingPlan ||
                  isCurrentPlanSelection ||
                  isPendingPlanSelection
                }
                className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmittingPlanSelection
                  ? 'Updating plan...'
                  : isPendingPlanSelection
                    ? 'Plan already scheduled'
                    : isCurrentPlanSelection
                      ? 'Current plan selected'
                      : billingProfile.isTrialActive
                        ? 'Apply selected plan now'
                        : 'Schedule selected plan'}
              </button>
              <Link
                href={billingWorkspaceHref}
                className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50"
              >
                Open billing workspace
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
            Billing information is currently unavailable for this business.
          </div>
        )}
      </section>

      <aside className="grid gap-6 self-start">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
            Billing notes
          </p>
          <div className="mt-4 grid gap-3 text-sm leading-relaxed text-slate-500">
            <p>
              Platform pricing is still governed by the super admin. This page is self-serve plan
              selection only.
            </p>
            <p>Scheduled changes keep invoice generation predictable for already-paid businesses.</p>
            <p>For the full billing ledger and invoices, continue into the payouts workspace.</p>
          </div>
        </section>
      </aside>
    </div>
  )
}
