'use client'

import { useState } from 'react'

export default function BusinessFilters() {
  const [category, setCategory] = useState('All Categories')
  const [status, setStatus] = useState('Any Status')
  const [provider, setProvider] = useState('All Providers')

  return (
    <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-3 flex-wrap">
      {/* Category Filter */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black tracking-[1.5px] uppercase text-slate-400">Category:</span>
        <button className="flex items-center gap-1 border border-slate-200 rounded px-2.5 py-1.5 text-xs font-semibold text-[#0B1C30] bg-white hover:bg-slate-50 transition-colors">
          {category}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M7 10l5 5 5-5z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black tracking-[1.5px] uppercase text-slate-400">Status:</span>
        <button className="flex items-center gap-1 border border-slate-200 rounded px-2.5 py-1.5 text-xs font-semibold text-[#0B1C30] bg-white hover:bg-slate-50 transition-colors">
          {status}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M7 10l5 5 5-5z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      {/* Provider Filter */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black tracking-[1.5px] uppercase text-slate-400">Provider:</span>
        <button className="flex items-center gap-1 border border-slate-200 rounded px-2.5 py-1.5 text-xs font-semibold text-[#0B1C30] bg-white hover:bg-slate-50 transition-colors">
          {provider}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path d="M7 10l5 5 5-5z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Actions */}
      <button className="flex items-center gap-2 border border-slate-300 rounded px-3 py-1.5 text-xs font-bold text-[#0B1C30] bg-white hover:bg-slate-50 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Export CSV
      </button>
      <button className="flex items-center gap-2 bg-[#1E40AF] text-white rounded px-3 py-1.5 text-xs font-bold hover:bg-blue-700 transition-colors">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
        New Business
      </button>
    </div>
  )
}
