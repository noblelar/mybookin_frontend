'use client'

import { useState } from 'react'

interface Business {
  id: string
  name: string
  entityId: string
  category: string
  categoryColor: string
  billingStatus: 'Paid' | 'Overdue' | 'Trialing'
  pricingPlan: string
  provider: 'Stripe' | 'PayPal' | 'Internal'
  moderation: 'ACTIVE' | 'SUSPENDED'
  icon: string
}

const businesses: Business[] = [
  {
    id: '1',
    name: 'Vortex Logistics Group',
    entityId: 'ID: VL-99201',
    category: 'Supply Chain',
    categoryColor: 'bg-blue-100 text-blue-700',
    billingStatus: 'Paid',
    pricingPlan: 'Enterprise Tier',
    provider: 'Stripe',
    moderation: 'ACTIVE',
    icon: 'logistics',
  },
  {
    id: '2',
    name: 'Aether Health Systems',
    entityId: 'ID: AH-44312',
    category: 'Healthcare',
    categoryColor: 'bg-pink-100 text-pink-700',
    billingStatus: 'Overdue',
    pricingPlan: 'Pro Monthly',
    provider: 'PayPal',
    moderation: 'SUSPENDED',
    icon: 'health',
  },
  {
    id: '3',
    name: 'Ignite Tech Solutions',
    entityId: 'ID: IT-11827',
    category: 'SaaS / Cloud',
    categoryColor: 'bg-purple-100 text-purple-700',
    billingStatus: 'Paid',
    pricingPlan: 'Startup Plan',
    provider: 'Stripe',
    moderation: 'ACTIVE',
    icon: 'tech',
  },
  {
    id: '4',
    name: 'Summit Realty Partners',
    entityId: 'ID: SR-00912',
    category: 'Real Estate',
    categoryColor: 'bg-orange-100 text-orange-700',
    billingStatus: 'Trialing',
    pricingPlan: 'Free Trial',
    provider: 'Internal',
    moderation: 'ACTIVE',
    icon: 'realty',
  },
  {
    id: '5',
    name: 'Roast & Co. Retail',
    entityId: 'ID: RC-88721',
    category: 'Hospitality',
    categoryColor: 'bg-amber-100 text-amber-700',
    billingStatus: 'Paid',
    pricingPlan: 'SMB Standard',
    provider: 'Stripe',
    moderation: 'SUSPENDED',
    icon: 'retail',
  },
]

function BusinessIcon({ type }: { type: string }) {
  if (type === 'logistics') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" fill="#94A3B8"/></svg>
  )
  if (type === 'health') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" fill="#94A3B8"/></svg>
  )
  if (type === 'tech') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" fill="#94A3B8"/></svg>
  )
  if (type === 'realty') return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill="#94A3B8"/></svg>
  )
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 4H4v2h16V4zm1 10v-2l-1-5H4l-1 5v2h1v6h10v-6h4v6h2v-6h1zm-9 4H6v-4h6v4z" fill="#94A3B8"/></svg>
  )
}

function ProviderIcon({ provider }: { provider: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="2" y="5" width="20" height="14" rx="2" stroke="#94A3B8" strokeWidth="1.5"/><path d="M2 10h20" stroke="#94A3B8" strokeWidth="1.5"/></svg>
      <span className="text-xs text-slate-500">{provider}</span>
    </div>
  )
}

function Toggle({ active }: { active: boolean }) {
  return (
    <button className={`relative w-8 h-4 rounded-full transition-colors ${active ? 'bg-[#1E40AF]' : 'bg-slate-300'}`}>
      <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white shadow transition-all ${active ? 'left-4.5 translate-x-0' : 'left-0.5'}`} style={{left: active ? 'calc(100% - 14px)' : '2px'}} />
    </button>
  )
}

export default function BusinessTable() {
  const [page, setPage] = useState(1)
  const total = 1284

  return (
    <div className="bg-white rounded-sm overflow-hidden">
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-3 text-[10px] font-black tracking-[1.2px] uppercase text-slate-400 whitespace-nowrap">Business Entity</th>
              <th className="text-left px-4 py-3 text-[10px] font-black tracking-[1.2px] uppercase text-slate-400 whitespace-nowrap">Category</th>
              <th className="text-left px-4 py-3 text-[10px] font-black tracking-[1.2px] uppercase text-slate-400 whitespace-nowrap">Billing Status</th>
              <th className="text-left px-4 py-3 text-[10px] font-black tracking-[1.2px] uppercase text-slate-400 whitespace-nowrap">Pricing Plan</th>
              <th className="text-left px-4 py-3 text-[10px] font-black tracking-[1.2px] uppercase text-slate-400 whitespace-nowrap">Provider</th>
              <th className="text-left px-4 py-3 text-[10px] font-black tracking-[1.2px] uppercase text-slate-400 whitespace-nowrap">Moderation</th>
              <th className="text-left px-4 py-3 text-[10px] font-black tracking-[1.2px] uppercase text-slate-400 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {businesses.map((biz) => (
              <tr key={biz.id} className="hover:bg-slate-50 transition-colors">
                {/* Business Entity */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center flex-shrink-0">
                      <BusinessIcon type={biz.icon} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#0B1C30]">{biz.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{biz.entityId}</div>
                    </div>
                  </div>
                </td>

                {/* Category */}
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${biz.categoryColor}`}>
                    {biz.category}
                  </span>
                </td>

                {/* Billing Status */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      biz.billingStatus === 'Paid' ? 'bg-emerald-500' :
                      biz.billingStatus === 'Overdue' ? 'bg-red-500' :
                      'bg-slate-400'
                    }`} />
                    <span className="text-sm text-slate-700">{biz.billingStatus}</span>
                  </div>
                </td>

                {/* Pricing Plan */}
                <td className="px-4 py-3">
                  <span className="text-sm font-semibold text-[#0B1C30]">{biz.pricingPlan}</span>
                </td>

                {/* Provider */}
                <td className="px-4 py-3">
                  <ProviderIcon provider={biz.provider} />
                </td>

                {/* Moderation */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Toggle active={biz.moderation === 'ACTIVE'} />
                    <span className={`text-[10px] font-black tracking-[1px] uppercase ${
                      biz.moderation === 'ACTIVE' ? 'text-[#1E40AF]' : 'text-slate-400'
                    }`}>
                      {biz.moderation}
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/></svg>
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors text-slate-400 hover:text-red-500">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" fill="currentColor"/></svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-t border-slate-100 px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Showing 1 to 5 of {total.toLocaleString()} results</span>
          <span className="text-slate-300">|</span>
          <span>Rows per page:</span>
          <select className="border border-slate-200 rounded px-1.5 py-0.5 text-xs font-semibold text-[#0B1C30] bg-white focus:outline-none">
            <option>5</option>
            <option>10</option>
            <option>25</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40" disabled>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z" fill="currentColor"/></svg>
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40" disabled>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded bg-[#1E40AF] text-white text-xs font-bold">
            {page}
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50" onClick={() => setPage(p => p + 1)}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/></svg>
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z" fill="currentColor"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
