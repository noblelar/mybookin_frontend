'use client'

import type { BusinessStatus } from '@/types/business'

interface BusinessFiltersProps {
  category: string
  categories: string[]
  isRefreshing?: boolean
  search: string
  status: 'ALL' | BusinessStatus
  onCategoryChange: (value: string) => void
  onExportCsv: () => void
  onRefresh: () => void
  onSearchChange: (value: string) => void
  onStatusChange: (value: 'ALL' | BusinessStatus) => void
}

const statusOptions: Array<{ label: string; value: 'ALL' | BusinessStatus }> = [
  { label: 'Any Status', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Suspended', value: 'SUSPENDED' },
]

export default function BusinessFilters({
  category,
  categories,
  isRefreshing = false,
  search,
  status,
  onCategoryChange,
  onExportCsv,
  onRefresh,
  onSearchChange,
  onStatusChange,
}: BusinessFiltersProps) {
  return (
    <div className="bg-white border-b border-slate-100 px-6 py-3 flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black tracking-[1.5px] uppercase text-slate-400">Category:</span>
        <label className="relative">
          <select
            value={category}
            onChange={(event) => onCategoryChange(event.target.value)}
            className="appearance-none border border-slate-200 rounded px-2.5 py-1.5 pr-7 text-xs font-semibold text-[#0B1C30] bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option value="ALL">All Categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M7 10l5 5 5-5z" fill="currentColor" />
          </svg>
        </label>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black tracking-[1.5px] uppercase text-slate-400">Status:</span>
        <label className="relative">
          <select
            value={status}
            onChange={(event) => onStatusChange(event.target.value as 'ALL' | BusinessStatus)}
            className="appearance-none border border-slate-200 rounded px-2.5 py-1.5 pr-7 text-xs font-semibold text-[#0B1C30] bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <svg
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
            width="10"
            height="10"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M7 10l5 5 5-5z" fill="currentColor" />
          </svg>
        </label>
      </div>

      <div className="flex items-center gap-2 min-w-[220px] flex-1 sm:flex-none">
        <span className="text-[10px] font-black tracking-[1.5px] uppercase text-slate-400">Search:</span>
        <label className="relative min-w-[220px] flex-1 sm:flex-none">
          <input
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder="Name, city, postcode..."
            className="w-full border border-slate-200 rounded px-2.5 py-1.5 pl-8 text-xs font-semibold text-[#0B1C30] bg-white hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <svg
            className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400"
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
            <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </label>
      </div>

      <div className="flex-1" />

      <button
        type="button"
        onClick={onExportCsv}
        className="flex items-center gap-2 border border-slate-300 rounded px-3 py-1.5 text-xs font-bold text-[#0B1C30] bg-white hover:bg-slate-50 transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="14,2 14,8 20,8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <line x1="16" y1="13" x2="8" y2="13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <line x1="16" y1="17" x2="8" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <polyline points="10,9 9,9 8,9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
        Export CSV
      </button>
      <button
        type="button"
        onClick={onRefresh}
        disabled={isRefreshing}
        className="flex items-center gap-2 bg-[#1E40AF] text-white rounded px-3 py-1.5 text-xs font-bold hover:bg-blue-700 transition-colors disabled:cursor-not-allowed disabled:opacity-70"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M20 11a8 8 0 1 0 2 5.29" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M20 4v7h-7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        {isRefreshing ? 'Refreshing...' : 'Refresh Queue'}
      </button>
    </div>
  )
}
