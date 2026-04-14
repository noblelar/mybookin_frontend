export type BillingType = 'MONTHLY' | 'PAY_AS_YOU_GO' | 'HYBRID'
export type BillingCurrency = 'GBP' | string
export type PayoutProvider = 'NONE' | 'STRIPE' | 'PAYPAL' | 'MANUAL' | string
export type InvoiceProvider = 'INTERNAL' | 'STRIPE' | 'PAYPAL' | 'MANUAL' | string
export type InvoiceStatus = 'DRAFT' | 'PENDING' | 'PAID' | 'OVERDUE' | 'VOID' | string

export interface BackendPricingPlanResponse {
  id: number
  name: string
  billing_type: string
  monthly_amount: string
  per_booking_fee: string
  currency: string
  is_active: boolean
  is_default: boolean
  is_owner_selectable: boolean
  created_at: string
  updated_at: string
}

export interface BackendBusinessBillingProfileResponse {
  id: string
  business_id: string
  business_name: string
  business_status: string
  pricing_plan_id: number
  pricing_plan_name: string
  billing_type: string
  monthly_amount: string
  per_booking_fee: string
  currency: string
  pending_pricing_plan_id?: number | null
  pending_pricing_plan_name?: string | null
  pending_billing_type?: string | null
  pending_monthly_amount?: string | null
  pending_per_booking_fee?: string | null
  pending_currency?: string | null
  pending_plan_effective_at?: string | null
  trial_start_at: string
  trial_end_at: string
  is_trial_active: boolean
  payout_provider: string
  payout_account_ref?: string | null
  is_payouts_enabled: boolean
  created_at: string
  updated_at: string
}

export interface BackendSubscriptionInvoiceResponse {
  id: string
  business_id: string
  business_name: string
  pricing_plan_id: number
  pricing_plan_name: string
  provider: string
  provider_ref?: string | null
  amount: string
  monthly_component_amount: string
  usage_component_amount: string
  usage_booking_count: number
  currency: string
  status: string
  billing_period_start: string
  billing_period_end: string
  created_at: string
  updated_at: string
}

export interface BackendAdminBillingSummaryResponse {
  pricing_plans: BackendPricingPlanResponse[]
  billing_profiles: BackendBusinessBillingProfileResponse[]
  invoices: BackendSubscriptionInvoiceResponse[]
}

export interface PricingPlan {
  id: number
  name: string
  billingType: BillingType
  monthlyAmount: string
  perBookingFee: string
  currency: BillingCurrency
  isActive: boolean
  isDefault: boolean
  isOwnerSelectable: boolean
  createdAt: string
  updatedAt: string
}

export interface BusinessBillingProfile {
  id: string
  businessId: string
  businessName: string
  businessStatus: string
  pricingPlanId: number
  pricingPlanName: string
  billingType: BillingType
  monthlyAmount: string
  perBookingFee: string
  currency: BillingCurrency
  pendingPricingPlanId: number | null
  pendingPricingPlanName: string | null
  pendingBillingType: BillingType | null
  pendingMonthlyAmount: string | null
  pendingPerBookingFee: string | null
  pendingCurrency: BillingCurrency | null
  pendingPlanEffectiveAt: string | null
  trialStartAt: string
  trialEndAt: string
  isTrialActive: boolean
  payoutProvider: PayoutProvider
  payoutAccountRef: string | null
  isPayoutsEnabled: boolean
  createdAt: string
  updatedAt: string
}

export interface SubscriptionInvoice {
  id: string
  businessId: string
  businessName: string
  pricingPlanId: number
  pricingPlanName: string
  provider: InvoiceProvider
  providerRef: string | null
  amount: string
  monthlyComponentAmount: string
  usageComponentAmount: string
  usageBookingCount: number
  currency: BillingCurrency
  status: InvoiceStatus
  billingPeriodStart: string
  billingPeriodEnd: string
  createdAt: string
  updatedAt: string
}

export interface AdminBillingSummaryResponse {
  pricingPlans: PricingPlan[]
  billingProfiles: BusinessBillingProfile[]
  invoices: SubscriptionInvoice[]
}

export interface PricingPlanMutationPayload {
  name: string
  billing_type: BillingType
  monthly_amount: string
  per_booking_fee: string
  currency: BillingCurrency
  is_active: boolean
  is_default: boolean
  is_owner_selectable: boolean
}

export interface PricingPlanMutationSuccessResponse {
  message: string
  plan: PricingPlan
}

export interface BusinessBillingProfileMutationPayload {
  pricing_plan_id: number
  trial_start_at: string
  trial_end_at: string
  is_trial_active: boolean
  payout_provider: PayoutProvider
  payout_account_ref: string | null
  is_payouts_enabled: boolean
}

export interface BusinessBillingProfileMutationSuccessResponse {
  message: string
  profile: BusinessBillingProfile
}

export interface SubscriptionInvoiceCreatePayload {
  business_id: string
  billing_period_start: string
  billing_period_end: string
  provider: InvoiceProvider
  provider_ref: string | null
  status: InvoiceStatus
}

export interface SubscriptionInvoiceCreateSuccessResponse {
  message: string
  invoice: SubscriptionInvoice
}

export interface BusinessBillingProfileDetailResponse {
  profile: BusinessBillingProfile
}

export interface BusinessSubscriptionInvoicesResponse {
  invoices: SubscriptionInvoice[]
}

export interface OwnerSelectablePricingPlansResponse {
  pricingPlans: PricingPlan[]
}

export interface PlanSelectionPayload {
  pricing_plan_id: number
}

export type PlanSelectionState = 'APPLIED' | 'SCHEDULED' | 'UNCHANGED'

export interface PlanSelectionSuccessResponse {
  message: string
  profile: BusinessBillingProfile
  selectionState: PlanSelectionState
  effectiveAt: string | null
}
