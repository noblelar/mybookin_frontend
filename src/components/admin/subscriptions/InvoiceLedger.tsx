'use client'

import { useState } from 'react'

interface Invoice {
  id: string
  merchant: string
  merchantId: string
  billingPeriod: string
  plan: 'Starter' | 'Growth' | 'Enterprise'
  amount: string
  status: 'Paid' | 'Overdue' | 'Pending'
  avatar: string
}

const invoices: Invoice[] = [
  {
    id: '#INV-88219',
    merchant: 'Vertex Logistics',
    merchantId: 'id: vtx_992',
    billingPeriod: 'Oct 01 - Oct 31',
    plan: 'Growth',
    amount: '$1,240.50',
    status: 'Paid',
    avatar: 'VL',
  },
  {
    id: '#INV-88220',
    merchant: 'Aura Design',
    merchantId: 'id: aur_441',
    billingPeriod: 'Oct 01 - Oct 31',
    plan: 'Starter',
    amount: '$42.00',
    status: 'Overdue',
    avatar: 'AD',
  },
  {
    id: '#INV-88221',
    merchant: 'Swift Cloud',
    merchantId: 'id: swf_129',
    billingPeriod: 'Oct 01 - Oct 31',
    plan: 'Growth',
    amount: '$849.20',
    status: 'Pending',
    avatar: 'SC',
  },
  {
    id: '#INV-88222',
    merchant: 'Zenith Partners',
    merchantId: 'id: zen_667',
    billingPeriod: 'Oct 01 - Oct 31',
    plan: 'Enterprise',
    amount: '$4,500.00',
    status: 'Paid',
    avatar: 'ZP',
  },
]

const planStyle: Record<Invoice['plan'], string> = {
  Starter:    'bg-slate-100 text-slate-600',
  Growth:     'bg-blue-100 text-[#1E40AF]',
  Enterprise: 'bg-[#0B1C30] text-white',
}

const statusStyle: Record<Invoice['status'], string> = {
  Paid:    'bg-emerald-100 text-emerald-700',
  Overdue: 'bg-red-100 text-red-600',
  Pending: 'bg-amber-100 text-amber-700',
}

const avatarColors = ['bg-blue-200', 'bg-purple-200', 'bg-cyan-200', 'bg-slate-200']

export default function InvoiceLedger() {
  const [page, setPage] = useState(1)

  return (
    <div className="bg-white rounded-sm">
      {/* Header */}
      <div className="px-5 py-4 flex items-start justify-between gap-4 flex-wrap border-b border-slate-100">
        <div>
          <h2 className="text-lg font-black text-[#0B1C30] tracking-tight">Invoice Ledger</h2>
          <p className="text-xs text-slate-400 mt-0.5">Real-time tracking of platform fee collection and payouts.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 border border-slate-200 rounded px-3 py-1.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" fill="currentColor"/></svg>
            Filter
          </button>
          <button className="flex items-center gap-2 border border-slate-200 rounded px-3 py-1.5 text-xs font-bold text-slate-600 bg-white hover:bg-slate-50 transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor"/></svg>
            Export CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-3 text-[9px] font-black tracking-[1.2px] uppercase text-slate-400">Invoice ID</th>
              <th className="text-left px-4 py-3 text-[9px] font-black tracking-[1.2px] uppercase text-slate-400">Merchant Entity</th>
              <th className="text-left px-4 py-3 text-[9px] font-black tracking-[1.2px] uppercase text-slate-400">Billing Period</th>
              <th className="text-left px-4 py-3 text-[9px] font-black tracking-[1.2px] uppercase text-slate-400">Plan</th>
              <th className="text-left px-4 py-3 text-[9px] font-black tracking-[1.2px] uppercase text-slate-400">Amount Due</th>
              <th className="text-left px-4 py-3 text-[9px] font-black tracking-[1.2px] uppercase text-slate-400">Status</th>
              <th className="text-left px-4 py-3 text-[9px] font-black tracking-[1.2px] uppercase text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {invoices.map((inv, i) => (
              <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3">
                  <button className="text-[#1E40AF] text-xs font-bold hover:underline">{inv.id}</button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded flex items-center justify-center text-[10px] font-black text-slate-600 flex-shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                      {inv.avatar}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#0B1C30]">{inv.merchant}</div>
                      <div className="text-[10px] text-slate-400">{inv.merchantId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{inv.billingPeriod}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-sm ${planStyle[inv.plan]}`}>
                    {inv.plan}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm font-bold text-[#0B1C30]">{inv.amount}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-sm ${statusStyle[inv.status]}`}>
                    {inv.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1">
                    {inv.status === 'Overdue' ? (
                      <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" fill="currentColor"/></svg>
                      </button>
                    ) : (
                      <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/></svg>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-t border-slate-100 px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        <span className="text-[11px] text-slate-400">Showing 1-4 of 1,284 invoices</span>
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>
          </button>
          {[1, 2, 3].map(n => (
            <button key={n} onClick={() => setPage(n)} className={`w-7 h-7 flex items-center justify-center rounded text-xs font-bold ${page === n ? 'bg-[#1E40AF] text-white' : 'border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>{n}</button>
          ))}
          <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50" onClick={() => setPage(p => p + 1)}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
