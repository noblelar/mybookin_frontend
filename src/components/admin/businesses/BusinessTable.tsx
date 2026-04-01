'use client'

import { useState } from 'react'

import type { Business, BusinessStatus } from '@/types/business'

interface BusinessTableProps {
  businesses: Business[]
  isLoading?: boolean
  selectedBusinessId: string | null
  updatingBusinessId: string | null
  onQuickStatusChange: (business: Business, nextStatus: BusinessStatus) => void
  onSelectBusiness: (business: Business) => void
}

const formatDate = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

const getStatusClasses = (status: BusinessStatus) => {
  if (status === 'ACTIVE') {
    return 'bg-emerald-50 text-emerald-700'
  }

  if (status === 'SUSPENDED') {
    return 'bg-red-50 text-red-700'
  }

  return 'bg-amber-50 text-amber-700'
}

const getCategoryClasses = (category: string) => {
  switch (category) {
    case 'BARBER':
      return 'bg-blue-100 text-blue-700'
    case 'HAIR':
      return 'bg-pink-100 text-pink-700'
    case 'NAILS':
      return 'bg-purple-100 text-purple-700'
    case 'RESTAURANT':
      return 'bg-amber-100 text-amber-700'
    case 'TUTOR':
      return 'bg-emerald-100 text-emerald-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

const getQuickAction = (status: BusinessStatus): { label: string; nextStatus: BusinessStatus } => {
  if (status === 'ACTIVE') {
    return { label: 'Suspend', nextStatus: 'SUSPENDED' }
  }

  return { label: 'Approve', nextStatus: 'ACTIVE' }
}

function BusinessIcon({ category }: { category: string }) {
  return (
    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center flex-shrink-0 text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">
      {category.slice(0, 2)}
    </div>
  )
}

export default function BusinessTable({
  businesses,
  isLoading = false,
  selectedBusinessId,
  updatingBusinessId,
  onQuickStatusChange,
  onSelectBusiness,
}: BusinessTableProps) {
  const [page, setPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const total = businesses.length
  const totalPages = Math.max(1, Math.ceil(total / rowsPerPage))
  const currentPage = Math.min(page, totalPages)
  const startIndex = (currentPage - 1) * rowsPerPage
  const paginatedBusinesses = businesses.slice(startIndex, startIndex + rowsPerPage)

  return (
    <div className="bg-white rounded-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-3 text-[10px] font-black tracking-[1.2px] uppercase text-slate-400 whitespace-nowrap">Business Entity</th>
              <th className="text-left px-4 py-3 text-[10px] font-black tracking-[1.2px] uppercase text-slate-400 whitespace-nowrap">Category</th>
              <th className="text-left px-4 py-3 text-[10px] font-black tracking-[1.2px] uppercase text-slate-400 whitespace-nowrap">Submitted</th>
              <th className="text-left px-4 py-3 text-[10px] font-black tracking-[1.2px] uppercase text-slate-400 whitespace-nowrap">Location</th>
              <th className="text-left px-4 py-3 text-[10px] font-black tracking-[1.2px] uppercase text-slate-400 whitespace-nowrap">Contact</th>
              <th className="text-left px-4 py-3 text-[10px] font-black tracking-[1.2px] uppercase text-slate-400 whitespace-nowrap">Moderation</th>
              <th className="text-left px-4 py-3 text-[10px] font-black tracking-[1.2px] uppercase text-slate-400 whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {isLoading ? (
              Array.from({ length: rowsPerPage }).map((_, index) => (
                <tr key={`placeholder-${index}`}>
                  <td className="px-4 py-4" colSpan={7}>
                    <div className="h-10 animate-pulse rounded bg-slate-100" />
                  </td>
                </tr>
              ))
            ) : paginatedBusinesses.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-center text-sm text-slate-500" colSpan={7}>
                  No businesses match the current moderation filters.
                </td>
              </tr>
            ) : (
              paginatedBusinesses.map((business) => {
                const isSelected = business.id === selectedBusinessId
                const quickAction = getQuickAction(business.status)
                const isUpdating = updatingBusinessId === business.id

                return (
                  <tr
                    key={business.id}
                    className={`transition-colors ${
                      isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => onSelectBusiness(business)}
                        className="flex items-center gap-2.5 text-left"
                      >
                        <BusinessIcon category={business.category} />
                        <div>
                          <div className="text-sm font-bold text-[#0B1C30]">{business.name}</div>
                          <div className="text-[10px] text-slate-400 font-medium">
                            slug: {business.slugUk}
                          </div>
                        </div>
                      </button>
                    </td>

                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded ${getCategoryClasses(business.category)}`}>
                        {business.category}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <span className="text-sm font-semibold text-[#0B1C30]">
                        {formatDate(business.createdAt)}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="text-sm text-slate-700">{business.city}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{business.postcode}</div>
                    </td>

                    <td className="px-4 py-3">
                      <div className="text-sm text-slate-700">{business.email ?? 'No email provided'}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{business.phone ?? 'No phone provided'}</div>
                    </td>

                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-black tracking-[1px] uppercase ${getStatusClasses(
                          business.status
                        )}`}
                      >
                        {business.status}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => onSelectBusiness(business)}
                          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700"
                          aria-label={`Review ${business.name}`}
                        >
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" stroke="currentColor" strokeWidth="2" />
                            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          onClick={() => onQuickStatusChange(business, quickAction.nextStatus)}
                          disabled={isUpdating}
                          className="inline-flex items-center rounded-full border border-slate-200 px-3 py-1.5 text-[11px] font-bold text-[#0B1C30] transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isUpdating ? 'Saving...' : quickAction.label}
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-slate-100 px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>
            Showing {total === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + rowsPerPage, total)} of{' '}
            {total.toLocaleString()} results
          </span>
          <span className="text-slate-300">|</span>
          <span>Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(event) => {
              const nextRowsPerPage = Number(event.target.value)
              setRowsPerPage(nextRowsPerPage)
              setPage(1)
            }}
            className="border border-slate-200 rounded px-1.5 py-0.5 text-xs font-semibold text-[#0B1C30] bg-white focus:outline-none"
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={25}>25</option>
          </select>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40"
            onClick={() => setPage(1)}
            disabled={currentPage === 1}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M18.41 16.59L13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z" fill="currentColor"/></svg>
          </button>
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40"
            onClick={() => setPage((currentValue) => Math.max(1, Math.min(currentValue, totalPages) - 1))}
            disabled={currentPage === 1}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded bg-[#1E40AF] text-white text-xs font-bold">
            {currentPage}
          </button>
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40"
            onClick={() => setPage((currentValue) => Math.min(totalPages, Math.min(currentValue, totalPages) + 1))}
            disabled={currentPage >= totalPages}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/></svg>
          </button>
          <button
            type="button"
            className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40"
            onClick={() => setPage(totalPages)}
            disabled={currentPage >= totalPages}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z" fill="currentColor"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
