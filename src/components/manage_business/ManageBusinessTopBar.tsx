'use client'

import { useState } from 'react'

interface ManageBusinessTopBarProps {
  activeTab?: 'analytics' | 'reports' | 'audit'
  onTabChange?: (tab: 'analytics' | 'reports' | 'audit') => void
  onMenuClick?: () => void
}

export default function ManageBusinessTopBar({
  activeTab = 'analytics',
  onTabChange,
  onMenuClick,
}: ManageBusinessTopBarProps) {
  return (
    <header className="bg-white border-b border-slate-200 flex-shrink-0">
      <div className="flex items-center h-14 px-6 gap-6">
        {/* Mobile menu button */}
        <button
          className="lg:hidden text-slate-500 hover:text-slate-800 mr-2"
          onClick={onMenuClick}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="currentColor"/>
          </svg>
        </button>

        {/* Brand — "Sovereign Architect with MyBookins" */}
        <span className="font-black text-[#0B1C30] text-sm tracking-tight whitespace-nowrap flex-shrink-0">
          Sovereign Architect <span className="text-[#235AFF]">with</span> MyBookins
        </span>

        {/* Tab nav */}
        <nav className="flex items-center gap-6 flex-1">
          {([
            { key: 'analytics', label: 'Analytics' },
            { key: 'reports', label: 'Reports' },
            { key: 'audit', label: 'Audit Log' },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => onTabChange?.(tab.key)}
              className={`text-[10px] font-black uppercase tracking-[0.12em] pb-0.5 transition-colors ${
                activeTab === tab.key
                  ? 'text-[#0B1C30] border-b-2 border-[#0B1C30]'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <button className="hidden sm:flex text-[10px] font-black uppercase tracking-widest text-[#0B1C30] border border-slate-300 px-3 py-1.5 hover:bg-slate-50 transition-colors">
            Switch Tenant
          </button>
          <button className="relative w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 6.44V9.77" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M12.02 2C8.34 2 5.36 4.98 5.36 8.66V10.76c0 .68-.28 1.7-.63 2.28L3.46 15.16c-.78 1.31-.22 2.77 1.22 3.25C9.44 20 14.61 20 19.39 18.41c1.35-.45 1.93-2.03 1.2-3.25l-1.27-2.12c-.34-.58-.62-1.61-.62-2.28V8.66C18.68 5 15.68 2 12.02 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M15.33 18.82C15.33 20.65 13.83 22.15 12 22.15c-.9 0-1.74-.38-2.34-.98-.6-.6-.99-1.44-.99-2.35" stroke="currentColor" strokeWidth="1.5"/>
            </svg>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>
          <button className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 hover:bg-slate-300 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
