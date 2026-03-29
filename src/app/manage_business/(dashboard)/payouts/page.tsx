'use client'

import { useState } from 'react'
import Link from 'next/link'
import ManageBusinessTopBar from '@/components/manage_business/ManageBusinessTopBar'

// ── Sidebar nav items ──────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/manage_business',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.9"/>
        <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.9"/>
        <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.9"/>
        <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.9"/>
      </svg>
    ),
  },
  {
    label: 'Payouts',
    href: '/manage_business/payouts',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="6" width="20" height="13" rx="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="7" cy="15" r="1.5" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Staff',
    href: '/manage_business/staff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M3 19c0-3.314 2.686-6 6-6s6 2.686 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M21 19c0-2.21-1.79-4-4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    label: 'Settings',
    href: '/manage_business/settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
  },
]

// ── Payout history data ────────────────────────────────────────────────────
const PAYOUT_HISTORY = [
  {
    date: 'Oct 17, 2023',
    provider: 'STRIPE',
    amount: '$12,450.00',
    status: 'COMPLETED' as const,
  },
  {
    date: 'Oct 10, 2023',
    provider: 'PAYPAL',
    amount: '$8,120.45',
    status: 'COMPLETED' as const,
  },
  {
    date: 'Oct 03, 2023',
    provider: 'STRIPE',
    amount: '$14,200.00',
    status: 'COMPLETED' as const,
  },
  {
    date: 'Sep 26, 2023',
    provider: 'STRIPE',
    amount: '$9,870.12',
    status: 'PENDING' as const,
  },
]

function StripeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="4" width="20" height="16" rx="2" stroke="#64748B" strokeWidth="1.5"/>
      <path d="M2 9h20" stroke="#64748B" strokeWidth="1.5"/>
      <path d="M6 14h3M15 14h3" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  )
}

function PayPalIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 7h7a4 4 0 010 8H9l-1 5H5L7 7z" stroke="#64748B" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M10 12h6a3 3 0 000-6H9" stroke="#64748B" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>
  )
}

export default function PayoutsPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'reports' | 'audit'>('analytics')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const activeNav = '/manage_business/payouts'

  return (
    <div className="flex h-screen overflow-hidden bg-[#F1F5F9] font-inter">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Left Sidebar ──────────────────────────────────────────────────── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 lg:relative lg:z-auto
        flex flex-col w-[148px] bg-white border-r border-slate-200 flex-shrink-0 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Brand area */}
        <div className="px-4 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-8 h-8 bg-[#0B1C30] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-sm">A</span>
            </div>
            <div>
              <p className="text-[11px] font-black text-[#0B1C30] leading-tight">MyBookIns</p>
              <p className="text-[8px] font-bold tracking-[1.5px] uppercase text-slate-400 mt-0.5">Management Suite</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const isActive = activeNav === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-2.5 py-2.5 text-[11px] font-bold transition-colors relative ${
                  isActive
                    ? 'bg-[#EFF4FF] text-[#0B1C30]'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-[#0B1C30] rounded-r" />
                )}
                <span className={isActive ? 'text-[#0B1C30]' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        {/* New Entry CTA */}
        <div className="p-3 border-t border-slate-100">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0B1C30] text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
            </svg>
            New Entry
          </button>
        </div>
      </aside>

      {/* ── Right column ──────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* ── Top Bar ───────────────────────────────────────────────────── */}
        <ManageBusinessTopBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* ── Main scrollable area ───────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-5 md:p-6 flex flex-col gap-5 min-h-full">

            {/* ── Top row: Available + Next Scheduled ─────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-4">

              {/* Available for Payout card */}
              <div className="bg-white border border-slate-200 p-6 flex flex-col justify-between min-h-[160px]">
                <div>
                  <p className="text-[9px] font-black tracking-[0.18em] uppercase text-slate-400 mb-4">
                    Available for Payout
                  </p>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl md:text-5xl font-extrabold text-[#0B1C30] tracking-tight">
                      $42,890.12
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-4">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17l5-5 5 5M7 11l5-5 5 5" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-emerald-500 text-xs font-bold">+12.4% from last period</span>
                </div>
              </div>

              {/* Next Scheduled Payout Date — dark card */}
              <div className="bg-[#0B1C30] p-6 flex flex-col justify-between min-h-[160px]">
                <p className="text-[9px] font-black tracking-[0.18em] uppercase text-slate-400 leading-tight">
                  Next Scheduled Payout<br />Date
                </p>
                <div className="mt-3">
                  <p className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-tight">
                    October 24, 2023
                  </p>
                </div>
                <button className="mt-5 text-[10px] font-black tracking-widest uppercase text-white underline underline-offset-2 hover:no-underline transition-all w-fit">
                  View Schedule
                </button>
              </div>
            </div>

            {/* ── History + Payout Method ──────────────────────────────────── */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-5 items-start">

              {/* ── Payout History ─────────────────────────────────────────── */}
              <div className="bg-white border border-slate-200 flex flex-col">
                {/* History header */}
                <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
                  <h2 className="text-base font-bold text-[#0B1C30] tracking-tight">Payout History</h2>
                  <div className="flex items-center gap-3">
                    {/* Filter icon */}
                    <button className="text-slate-400 hover:text-slate-700 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    {/* Download icon */}
                    <button className="text-slate-400 hover:text-slate-700 transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px]">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="px-5 py-3 text-left text-[9px] font-black tracking-[0.14em] uppercase text-slate-400">Batch_Date</th>
                        <th className="px-5 py-3 text-left text-[9px] font-black tracking-[0.14em] uppercase text-slate-400">Provider</th>
                        <th className="px-5 py-3 text-left text-[9px] font-black tracking-[0.14em] uppercase text-slate-400">Net_Payout_Decimal</th>
                        <th className="px-5 py-3 text-left text-[9px] font-black tracking-[0.14em] uppercase text-slate-400">PayoutStatus</th>
                      </tr>
                    </thead>
                    <tbody>
                      {PAYOUT_HISTORY.map((row, i) => (
                        <tr
                          key={i}
                          className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-5 py-4 text-sm font-medium text-[#0B1C30]">{row.date}</td>
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              {row.provider === 'STRIPE' ? <StripeIcon /> : <PayPalIcon />}
                              <span className="text-xs font-black tracking-widest uppercase text-slate-500">{row.provider}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-sm font-semibold text-[#0B1C30]">{row.amount}</td>
                          <td className="px-5 py-4">
                            {row.status === 'COMPLETED' ? (
                              <span className="text-[10px] font-black tracking-widest uppercase text-emerald-600">
                                {row.status}
                              </span>
                            ) : (
                              <span className="inline-flex px-2.5 py-1 border border-slate-300 text-[10px] font-black tracking-widest uppercase text-slate-500">
                                {row.status}
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* ── Payout Method panel ────────────────────────────────────── */}
              <div className="flex flex-col gap-3">

                {/* Header */}
                <h3 className="text-base font-bold text-[#0B1C30] tracking-tight px-1">Payout Method</h3>

                {/* Card info */}
                <div className="bg-white border border-slate-200 p-4 flex flex-col gap-4">
                  {/* Card icon + label */}
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <rect x="2" y="5" width="20" height="14" rx="2" stroke="#64748B" strokeWidth="1.5"/>
                        <path d="M2 10h20" stroke="#64748B" strokeWidth="1.5"/>
                        <path d="M6 14h4" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                    </div>
                    <span className="text-[10px] font-black tracking-widest uppercase text-slate-500">
                      Business_Billing_Profile
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-slate-100" />

                  {/* Connected account */}
                  <div>
                    <p className="text-[9px] font-black tracking-[0.14em] uppercase text-slate-400 mb-1.5">
                      Connected Account
                    </p>
                    <p className="text-sm font-bold text-[#0B1C30] tracking-widest">
                      •••••••••••• 8821
                    </p>
                  </div>

                  {/* Account holder + status */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-[9px] font-black tracking-[0.14em] uppercase text-slate-400 mb-1">
                        Account Holder
                      </p>
                      <p className="text-xs font-semibold text-[#0B1C30] leading-snug">
                        Sovereign Enterprises LLC
                      </p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black tracking-[0.14em] uppercase text-slate-400 mb-1">
                        Status
                      </p>
                      <div className="flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" stroke="#22c55e" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M22 4L12 14.01l-3-3" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        <span className="text-xs font-black text-emerald-600">Verified</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Change payout method button */}
                <button className="w-full py-3 bg-slate-200 hover:bg-slate-300 transition-colors text-[10px] font-black tracking-widest uppercase text-[#0B1C30] text-center">
                  Change Payout Method
                </button>

                {/* Tax documentation alert */}
                <div className="bg-red-50 border border-red-200 p-4 flex gap-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                    <circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="1.5"/>
                    <path d="M12 8v4M12 16h.01" stroke="#ef4444" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  <div>
                    <p className="text-[10px] font-black tracking-[0.1em] uppercase text-red-600 mb-1">
                      Tax Documentation Required
                    </p>
                    <p className="text-[11px] text-red-500 leading-relaxed">
                      Please upload your Form W-9 by the end of the fiscal month to ensure uninterrupted payouts.
                    </p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </main>

        {/* ── Bottom stats bar ──────────────────────────────────────────────── */}
        <div className="flex-shrink-0 border-t border-slate-200 bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">

            {/* Gross Earnings */}
            <div className="px-5 py-3.5 bg-slate-50">
              <p className="text-[9px] font-black tracking-[0.14em] uppercase text-slate-400 mb-1">
                Gross Earnings
              </p>
              <p className="text-lg font-extrabold text-[#0B1C30] tracking-tight">$51,400.00</p>
            </div>

            {/* Total Fees */}
            <div className="px-5 py-3.5 bg-slate-50">
              <p className="text-[9px] font-black tracking-[0.14em] uppercase text-slate-400 mb-1">
                Total Fees
              </p>
              <p className="text-lg font-extrabold text-[#0B1C30] tracking-tight">($7,212.80)</p>
            </div>

            {/* Tax Reserves */}
            <div className="px-5 py-3.5 flex items-center justify-between gap-4 bg-slate-50">
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-black tracking-[0.14em] uppercase text-slate-400 mb-1">
                  Tax Reserves
                </p>
                <p className="text-xs text-slate-500 leading-snug">
                  Reserved funds for upcoming quarterly filing requirements.
                </p>
              </div>
              <p className="text-lg font-extrabold text-[#0B1C30] tracking-tight flex-shrink-0">$1,297.08</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
