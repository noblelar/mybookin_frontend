'use client'

import { useState } from 'react'
import SettlementStats from '@/components/admin/financials/SettlementStats'
import SettlementTable from '@/components/admin/financials/SettlementTable'
import BatchAnalysis from '@/components/admin/financials/BatchAnalysis'

export default function FinancialsPage() {
  const [selectedBatch, setSelectedBatch] = useState<string>('BT-992011')

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className="px-6 pt-5 pb-4">
        {/* Breadcrumb */}
        <div className="flex items-center gap-1.5 text-[10px] font-black tracking-[1.2px] uppercase mb-2">
          <span className="text-slate-400">Admin</span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="#94A3B8"/></svg>
          <span className="text-[#1E40AF]">Financials &amp; Settlements</span>
        </div>

        {/* Title row */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl md:text-3xl font-black text-[#0B1C30] tracking-tight">Settlement Batches</h1>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="flex items-center gap-2 border border-slate-300 rounded px-3 py-1.5 text-xs font-bold text-[#0B1C30] bg-white hover:bg-slate-50 transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor"/>
              </svg>
              Export CSV
            </button>
            <button className="flex items-center gap-2 bg-[#1E40AF] text-white rounded px-3 py-1.5 text-xs font-bold hover:bg-blue-700 transition-colors">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" fill="white"/>
              </svg>
              Create Manual Batch
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 pb-4">
        <SettlementStats />
      </div>

      {/* Main content: Table + Batch Analysis panel */}
      <div className="px-6 pb-6 flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
        {/* Settlement Table */}
        <div className={`bg-white rounded-sm flex flex-col transition-all ${selectedBatch ? 'lg:flex-1' : 'flex-1'}`}>
          <SettlementTable selectedId={selectedBatch} onSelect={setSelectedBatch} />
        </div>

        {/* Batch Analysis Panel */}
        {selectedBatch && (
          <div className="lg:w-[340px] xl:w-[360px] flex-shrink-0 bg-white rounded-sm overflow-hidden flex flex-col" style={{maxHeight: '680px'}}>
            <BatchAnalysis batchId={selectedBatch} onClose={() => setSelectedBatch('')} />
          </div>
        )}
      </div>
    </div>
  )
}
