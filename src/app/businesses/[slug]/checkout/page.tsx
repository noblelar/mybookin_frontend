'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { use } from 'react'

import CustomerTopBar from '@/components/customer/CustomerTopBar'

const serviceData: Record<string, {
  name: string
  tier: string
  date: string
  time: string
  serviceRate: number
  adminFee: number
  image: string
}> = {
  'classic-haircut': {
    name: 'Classic Haircut',
    tier: 'Standard Tier Service',
    date: 'Oct 24, 2024',
    time: '14:00 GMT',
    serviceRate: 35,
    adminFee: 5,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/d508ac7f547631f26d8bd728c36d889f72ae660e?width=400',
  },
  'full-grooming-package': {
    name: 'Full Grooming Package',
    tier: 'Premium Tier Service',
    date: 'Oct 24, 2024',
    time: '14:00 GMT',
    serviceRate: 85,
    adminFee: 10,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/d508ac7f547631f26d8bd728c36d889f72ae660e?width=400',
  },
  'hair-coloring': {
    name: 'Hair Coloring',
    tier: 'Premium Tier Service',
    date: 'Oct 24, 2024',
    time: '14:00 GMT',
    serviceRate: 120,
    adminFee: 15,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/d508ac7f547631f26d8bd728c36d889f72ae660e?width=400',
  },
  'default': {
    name: 'Consultation: Vision Blueprint',
    tier: 'Premium Tier Service',
    date: 'Oct 24, 2024',
    time: '14:00 GMT',
    serviceRate: 1250,
    adminFee: 45,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/d508ac7f547631f26d8bd728c36d889f72ae660e?width=400',
  },
}

type PaymentMethod = 'stripe' | 'paypal' | 'bank'
type PaymentPurpose = 'full' | 'deposit'

export default function CheckoutPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const [paymentPurpose, setPaymentPurpose] = useState<PaymentPurpose>('full')
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)

  // Use default service data
  const service = serviceData['default']
  const total = service.serviceRate + service.adminFee
  const depositAmount = Math.round(total * 0.20)
  const amountDue = paymentPurpose === 'full' ? total : depositAmount

  return (
    <div className="min-h-screen bg-[#EFF4FF]">
      <CustomerTopBar />
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">

          {/* Left Column — Booking Summary */}
          <div className="flex flex-col gap-8">
            {/* Back link */}
            <Link
              href={`/businesses/${slug}`}
              className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-slate-500 hover:text-slate-800 transition w-fit"
            >
              <svg width="16" height="16" viewBox="0 0 20 14" fill="none">
                <path d="M7 14L0 7L7 0L8.4 1.4L3.825 6H20V8H3.825L8.425 12.6L7 14Z" fill="currentColor"/>
              </svg>
              Back to Project Details
            </Link>

            {/* Title */}
            <div>
              <h1 className="font-manrope text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                Finalize Architecture
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                Confirm your reservation details and select a payment method to secure your architectural consultation.
              </p>
            </div>

            {/* Service Card */}
            <div className="flex items-center gap-4 bg-white border border-slate-200 p-4 shadow-sm">
              <div className="w-20 h-20 flex-shrink-0 overflow-hidden bg-slate-100">
                <Image
                  src={service.image}
                  alt={service.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                  {service.tier}
                </span>
                <h2 className="font-manrope font-bold text-slate-900 text-base leading-snug">
                  {service.name}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-slate-400">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                      <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                      <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                      <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    {service.date}
                  </span>
                  <span className="flex items-center gap-1 text-xs text-slate-500">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="text-slate-400">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    {service.time}
                  </span>
                </div>
              </div>
            </div>

            {/* Pricing Breakdown */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <span className="text-sm text-slate-500">Service Rate</span>
                <span className="text-sm font-semibold text-slate-900">
                  £ {service.serviceRate.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <span className="text-sm text-slate-500">Administrative Fee</span>
                <span className="text-sm font-semibold text-slate-900">
                  £ {service.adminFee.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-black uppercase tracking-wider text-slate-900">Total Due</span>
                <div className="text-right">
                  <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    £ {amountDue.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mt-0.5">
                    Currency: GBP Sterling
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column — Payment Intent */}
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="font-manrope text-2xl font-bold text-slate-900 mb-1">Payment Intent</h2>
              <p className="text-slate-500 text-sm">Select your preferred payment structure and method.</p>
            </div>

            {/* Payment Purpose Toggle */}
            <div>
              <p className="text-[10px] font-black tracking-[0.12em] uppercase text-slate-500 mb-3">
                Payment Purpose
              </p>
              <div className="flex border border-slate-200 bg-white overflow-hidden">
                <button
                  onClick={() => setPaymentPurpose('full')}
                  className={`flex-1 py-3 text-sm font-bold tracking-wide transition ${
                    paymentPurpose === 'full'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Pay in Full
                </button>
                <button
                  onClick={() => setPaymentPurpose('deposit')}
                  className={`flex-1 py-3 text-sm font-bold tracking-wide transition border-l border-slate-200 ${
                    paymentPurpose === 'deposit'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'bg-slate-50 text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Pay Deposit (20%)
                </button>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <p className="text-[10px] font-black tracking-[0.12em] uppercase text-slate-500 mb-3">
                Select Method
              </p>
              <div className="flex flex-col gap-3">

                {/* Stripe */}
                <button
                  onClick={() => setSelectedMethod('stripe')}
                  className={`flex items-center gap-4 p-4 bg-white border transition text-left w-full group ${
                    selectedMethod === 'stripe'
                      ? 'border-slate-900 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div className="w-10 h-10 flex-shrink-0 bg-[#EFF4FF] flex items-center justify-center">
                    <svg width="20" height="16" viewBox="0 0 24 16" fill="none">
                      <rect x="0" y="0" width="24" height="16" rx="2" fill="#635BFF"/>
                      <rect x="2" y="6" width="8" height="2" rx="1" fill="white"/>
                      <rect x="12" y="4" width="10" height="2" rx="1" fill="white"/>
                      <rect x="12" y="8" width="6" height="2" rx="1" fill="white"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-sm">Stripe</p>
                    <p className="text-xs text-slate-400 mt-0.5">Credit, Debit, Apple Pay, Google Pay</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 20 14" fill="none" className="text-slate-400 group-hover:text-slate-700 transition flex-shrink-0">
                    <path d="M13 14L11.575 12.6L16.175 8H0V6H16.175L11.6 1.4L13 0L20 7L13 14Z" fill="currentColor"/>
                  </svg>
                </button>

                {/* PayPal */}
                <button
                  onClick={() => setSelectedMethod('paypal')}
                  className={`flex items-center gap-4 p-4 bg-white border transition text-left w-full group ${
                    selectedMethod === 'paypal'
                      ? 'border-slate-900 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div className="w-10 h-10 flex-shrink-0 bg-[#EFF4FF] flex items-center justify-center">
                    <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
                      <path d="M14.5 4C14.5 6.48528 12.4853 8.5 10 8.5H6L4.5 16H1L4 0H10C12.4853 0 14.5 1.51472 14.5 4Z" fill="#003087"/>
                      <path d="M17 6C17 8.48528 14.9853 10.5 12.5 10.5H8.5L7 18H3.5L6.5 2H12.5C14.9853 2 17 3.51472 17 6Z" fill="#009CDE"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-sm">PayPal</p>
                    <p className="text-xs text-slate-400 mt-0.5">Pay in 3, PayPal Credit, or Balance</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 20 14" fill="none" className="text-slate-400 group-hover:text-slate-700 transition flex-shrink-0">
                    <path d="M13 14L11.575 12.6L16.175 8H0V6H16.175L11.6 1.4L13 0L20 7L13 14Z" fill="currentColor"/>
                  </svg>
                </button>

                {/* Direct Bank Transfer */}
                <button
                  onClick={() => setSelectedMethod('bank')}
                  className={`flex items-center gap-4 p-4 bg-white border transition text-left w-full group ${
                    selectedMethod === 'bank'
                      ? 'border-slate-900 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <div className="w-10 h-10 flex-shrink-0 bg-[#EFF4FF] flex items-center justify-center">
                    <svg width="20" height="18" viewBox="0 0 22 18" fill="none">
                      <path d="M11 0L22 6V8H0V6L11 0Z" fill="#64748B"/>
                      <rect x="2" y="9" width="3" height="6" fill="#64748B"/>
                      <rect x="7" y="9" width="3" height="6" fill="#64748B"/>
                      <rect x="12" y="9" width="3" height="6" fill="#64748B"/>
                      <rect x="17" y="9" width="3" height="6" fill="#64748B"/>
                      <rect x="0" y="16" width="22" height="2" fill="#64748B"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-slate-900 text-sm">Direct Bank Transfer</p>
                    <p className="text-xs text-slate-400 mt-0.5">BACS, CHAPS, or International SWIFT</p>
                  </div>
                  <svg width="16" height="16" viewBox="0 0 20 14" fill="none" className="text-slate-400 group-hover:text-slate-700 transition flex-shrink-0">
                    <path d="M13 14L11.575 12.6L16.175 8H0V6H16.175L11.6 1.4L13 0L20 7L13 14Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>

            {/* Confirm Button */}
            <div className="flex flex-col items-center gap-3 mt-2">
              <button
                disabled={!selectedMethod}
                className={`w-full flex items-center justify-center gap-3 py-4 font-bold tracking-wide text-sm uppercase transition ${
                  selectedMethod
                    ? 'bg-slate-900 text-white hover:bg-slate-700 cursor-pointer'
                    : 'bg-slate-300 text-slate-400 cursor-not-allowed'
                }`}
              >
                Confirm and Proceed
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
              <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-slate-400">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
                </svg>
                AES-256 Bit Secure Encryption
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
