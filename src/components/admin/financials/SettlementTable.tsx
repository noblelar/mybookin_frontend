'use client'

import { useState } from 'react'

interface Batch {
  id: string
  date: string
  runTime: string
  amount: string
  status: 'COMPLETED' | 'PENDING' | 'FAILED'
}

const batches: Batch[] = [
  { id: 'BT-992011', date: 'Oct 24, 2023', runTime: '23:59:02 EST', amount: '$142,500.00', status: 'COMPLETED' },
  { id: 'BT-992010', date: 'Oct 23, 2023', runTime: '23:58:15 EST', amount: '$128,420.50', status: 'COMPLETED' },
  { id: 'BT-992009', date: 'Oct 22, 2023', runTime: '14:12:44 EST', amount: '$8,200.00',   status: 'PENDING' },
  { id: 'BT-992008', date: 'Oct 22, 2023', runTime: '23:59:59 EST', amount: '$245,000.00', status: 'FAILED' },
]

const statusStyle: Record<Batch['status'], string> = {
  COMPLETED: 'bg-emerald-500 text-white',
  PENDING:   'bg-slate-200 text-slate-600',
  FAILED:    'bg-red-500 text-white',
}

interface Props {
  selectedId: string
  onSelect: (id: string) => void
}

export default function SettlementTable({ selectedId, onSelect }: Props) {
  const [page, setPage] = useState(1)

  return (
    <div className="bg-white flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
        <span className="text-[10px] font-black tracking-[1.5px] uppercase text-slate-500">Recent Settlement Cycles</span>
        <button className="text-slate-400 hover:text-slate-600">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M3 18h6v-2H3v2zM3 6v2h18V6H3zm0 7h12v-2H3v2z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full min-w-[480px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-2.5 text-[9px] font-black tracking-[1.2px] uppercase text-slate-400">Batch ID</th>
              <th className="text-left px-4 py-2.5 text-[9px] font-black tracking-[1.2px] uppercase text-slate-400">Batch Date</th>
              <th className="text-left px-4 py-2.5 text-[9px] font-black tracking-[1.2px] uppercase text-slate-400">Run Time</th>
              <th className="text-left px-4 py-2.5 text-[9px] font-black tracking-[1.2px] uppercase text-slate-400">Amount</th>
              <th className="text-left px-4 py-2.5 text-[9px] font-black tracking-[1.2px] uppercase text-slate-400">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {batches.map((batch) => (
              <tr
                key={batch.id}
                onClick={() => onSelect(batch.id)}
                className={`cursor-pointer transition-colors hover:bg-blue-50 ${selectedId === batch.id ? 'bg-[#EFF4FF]' : ''}`}
              >
                <td className="px-4 py-3">
                  <button className="text-[#1E40AF] text-xs font-bold hover:underline text-left">
                    {batch.id}
                  </button>
                </td>
                <td className="px-4 py-3 text-xs text-slate-600">{batch.date}</td>
                <td className="px-4 py-3 text-xs text-slate-500 font-mono">{batch.runTime}</td>
                <td className="px-4 py-3 text-sm font-bold text-[#0B1C30]">{batch.amount}</td>
                <td className="px-4 py-3">
                  <span className={`text-[9px] font-black tracking-widest uppercase px-2 py-1 rounded-sm ${statusStyle[batch.status]}`}>
                    {batch.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-t border-slate-100 px-4 py-3 flex items-center justify-between gap-2 flex-wrap">
        <span className="text-[11px] text-slate-400">Showing 1-10 of 244 batches</span>
        <div className="flex items-center gap-1">
          <button
            className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40"
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>
          </button>
          {[1, 2, 3].map((n) => (
            <button
              key={n}
              onClick={() => setPage(n)}
              className={`w-6 h-6 flex items-center justify-center rounded text-xs font-bold transition-colors ${page === n ? 'bg-[#1E40AF] text-white' : 'border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
            >
              {n}
            </button>
          ))}
          <button
            className="w-6 h-6 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50"
            onClick={() => setPage(p => p + 1)}
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
