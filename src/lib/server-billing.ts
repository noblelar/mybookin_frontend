import type {
  AdminBillingSummaryResponse,
  BackendAdminBillingSummaryResponse,
  BackendBusinessBillingProfileResponse,
  BackendPricingPlanResponse,
  BackendSubscriptionInvoiceResponse,
  BusinessBillingProfile,
  PricingPlan,
  SubscriptionInvoice,
} from '@/types/billing'

export const toPricingPlan = (plan: BackendPricingPlanResponse): PricingPlan => {
  return {
    id: plan.id,
    name: plan.name,
    billingType: plan.billing_type as PricingPlan['billingType'],
    monthlyAmount: plan.monthly_amount,
    perBookingFee: plan.per_booking_fee,
    currency: plan.currency,
    isActive: plan.is_active,
    isDefault: plan.is_default,
    isOwnerSelectable: plan.is_owner_selectable,
    createdAt: plan.created_at,
    updatedAt: plan.updated_at,
  }
}

export const toBusinessBillingProfile = (
  profile: BackendBusinessBillingProfileResponse
): BusinessBillingProfile => {
  return {
    id: profile.id,
    businessId: profile.business_id,
    businessName: profile.business_name,
    businessStatus: profile.business_status,
    pricingPlanId: profile.pricing_plan_id,
    pricingPlanName: profile.pricing_plan_name,
    billingType: profile.billing_type as BusinessBillingProfile['billingType'],
    monthlyAmount: profile.monthly_amount,
    perBookingFee: profile.per_booking_fee,
    currency: profile.currency,
    pendingPricingPlanId: profile.pending_pricing_plan_id ?? null,
    pendingPricingPlanName: profile.pending_pricing_plan_name ?? null,
    pendingBillingType: (profile.pending_billing_type as BusinessBillingProfile['pendingBillingType']) ?? null,
    pendingMonthlyAmount: profile.pending_monthly_amount ?? null,
    pendingPerBookingFee: profile.pending_per_booking_fee ?? null,
    pendingCurrency: profile.pending_currency ?? null,
    pendingPlanEffectiveAt: profile.pending_plan_effective_at ?? null,
    trialStartAt: profile.trial_start_at,
    trialEndAt: profile.trial_end_at,
    isTrialActive: profile.is_trial_active,
    payoutProvider: profile.payout_provider,
    payoutAccountRef: profile.payout_account_ref ?? null,
    isPayoutsEnabled: profile.is_payouts_enabled,
    createdAt: profile.created_at,
    updatedAt: profile.updated_at,
  }
}

export const toSubscriptionInvoice = (
  invoice: BackendSubscriptionInvoiceResponse
): SubscriptionInvoice => {
  return {
    id: invoice.id,
    businessId: invoice.business_id,
    businessName: invoice.business_name,
    pricingPlanId: invoice.pricing_plan_id,
    pricingPlanName: invoice.pricing_plan_name,
    provider: invoice.provider,
    providerRef: invoice.provider_ref ?? null,
    amount: invoice.amount,
    monthlyComponentAmount: invoice.monthly_component_amount,
    usageComponentAmount: invoice.usage_component_amount,
    usageBookingCount: invoice.usage_booking_count,
    currency: invoice.currency,
    status: invoice.status,
    billingPeriodStart: invoice.billing_period_start,
    billingPeriodEnd: invoice.billing_period_end,
    createdAt: invoice.created_at,
    updatedAt: invoice.updated_at,
  }
}

export const toAdminBillingSummary = (
  payload: BackendAdminBillingSummaryResponse
): AdminBillingSummaryResponse => {
  return {
    pricingPlans: payload.pricing_plans.map(toPricingPlan),
    billingProfiles: payload.billing_profiles.map(toBusinessBillingProfile),
    invoices: payload.invoices.map(toSubscriptionInvoice),
  }
}
