'use client'

import { useState } from 'react'
import Link from 'next/link'

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

// ── Timeline entries ────────────────────────────────────────────────────────
const TIMELINE = [
  {
    time: '09:00 AM',
    name: 'Alexander Thorne',
    service: 'Signature Therapy Service',
    duration: '90 min',
    assignedTo: 'Sarah Jenkins',
    status: 'confirmed' as const,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="#94a3b8"/>
      </svg>
    ),
  },
  {
    time: '11:30 AM',
    name: 'Elena Rodriguez',
    service: 'Private Personal Training',
    duration: '60 min',
    assignedTo: 'Marcus Chen',
    status: 'confirmed' as const,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M20.57 14.86L22 13.43 20.57 12 17 15.57 8.43 7 12 3.43 10.57 2 9.14 3.43 7.71 2 5.57 4.14 4.14 2.71 2.71 4.14l1.43 1.43L2 7.71l1.43 1.43L2 10.57 3.43 12 7 8.43 15.57 17 12 20.57 13.43 22l1.43-1.43L16.29 22l2.14-2.14 1.43 1.43 1.43-1.43-1.43-1.43L22 16.29l-1.43-1.43z" fill="#94a3b8"/>
      </svg>
    ),
  },
  {
    time: '01:15 PM',
    name: 'Corporate Group (8)',
    service: 'Exclusive Lounge Access',
    duration: '4 Hours',
    assignedTo: 'Concierge Team',
    status: 'draft' as const,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z" fill="#94a3b8"/>
      </svg>
    ),
  },
]

export default function ManageBusinessDashboard() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'reports' | 'audit'>('analytics')
  const [viewMode, setViewMode] = useState<'comfortable' | 'architect'>('architect')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const activeNav = '/manage_business'

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
              <p className="text-[11px] font-black text-[#0B1C30] leading-tight">Sovereign Admin</p>
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
        <header className="bg-white border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center h-14 px-6 gap-6">
            {/* Mobile menu button */}
            <button
              className="lg:hidden text-slate-500 hover:text-slate-800 mr-2"
              onClick={() => setSidebarOpen(true)}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" fill="currentColor"/>
              </svg>
            </button>

            {/* Brand */}
            <span className="font-black text-[#0B1C30] text-sm tracking-tight whitespace-nowrap flex-shrink-0">
              Sovereign Architect
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
                  onClick={() => setActiveTab(tab.key)}
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

        {/* ── Main scrollable area ───────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-5 md:p-8 flex flex-col gap-5 min-h-full">

            {/* Sub-entity badge + heading + toggle */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <div className="inline-flex bg-[#0B1C30] px-3 py-1 mb-3">
                  <span className="text-[9px] font-black tracking-[0.14em] uppercase text-teal-300">
                    Sub-Entity: Meridian Luxury Suites
                  </span>
                </div>
                <h1 className="font-manrope text-3xl md:text-4xl font-extrabold text-[#0B1C30] tracking-tight leading-none">
                  Operational Overview
                </h1>
              </div>

              {/* View toggle */}
              <div className="flex border border-slate-300 overflow-hidden flex-shrink-0 self-start">
                <button
                  onClick={() => setViewMode('comfortable')}
                  className={`px-4 py-2 text-[9px] font-black tracking-widest uppercase transition-colors ${
                    viewMode === 'comfortable'
                      ? 'bg-[#0B1C30] text-white'
                      : 'bg-white text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Comfortable
                </button>
                <button
                  onClick={() => setViewMode('architect')}
                  className={`px-4 py-2 text-[9px] font-black tracking-widest uppercase border-l border-slate-300 transition-colors ${
                    viewMode === 'architect'
                      ? 'bg-[#0B1C30] text-white'
                      : 'bg-white text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Architect
                </button>
              </div>
            </div>

            {/* ── Two-column layout (main + right panel) ─────────────────── */}
            <div className="flex flex-col xl:flex-row gap-5 items-start">

              {/* ── Left / main ───────────────────────────────────────────── */}
              <div className="flex-1 min-w-0 flex flex-col gap-5">

                {/* Stats row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 border border-slate-200 bg-white overflow-hidden">
                  {/* Stat 1 — Total Revenue */}
                  <div className="p-5 border-r border-slate-200">
                    <p className="text-[9px] font-black tracking-[0.14em] uppercase text-slate-400 mb-3">
                      Total Revenue<br />(Month)
                    </p>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-extrabold text-[#0B1C30] tracking-tight">$42,850.00</span>
                      <span className="text-xs font-bold text-emerald-500">+12.4%</span>
                    </div>
                    <div className="w-20 h-0.5 bg-[#0B1C30] mt-3" />
                  </div>

                  {/* Stat 2 — Pending Bookings */}
                  <div className="p-5 border-r border-slate-200">
                    <p className="text-[9px] font-black tracking-[0.14em] uppercase text-slate-400 mb-3">
                      Pending Bookings
                    </p>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-extrabold text-[#0B1C30] tracking-tight">18</span>
                      <span className="text-xs font-medium text-slate-500">Requires action</span>
                    </div>
                    <div className="flex gap-1 mt-3">
                      {[1,2,3,4,5].map(i => (
                        <div key={i} className={`h-1 flex-1 ${i <= 3 ? 'bg-[#0B1C30]' : 'bg-slate-200'}`} />
                      ))}
                    </div>
                  </div>

                  {/* Stat 3 — Active Staff */}
                  <div className="p-5">
                    <p className="text-[9px] font-black tracking-[0.14em] uppercase text-slate-400 mb-3">
                      Active Staff
                    </p>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-2xl font-extrabold text-[#0B1C30] tracking-tight">12</span>
                      <span className="text-xs font-medium text-slate-500">On-site today</span>
                    </div>
                    <div className="flex items-center gap-1 mt-3">
                      {['#94a3b8', '#64748b', '#475569'].map((c, i) => (
                        <div
                          key={i}
                          className="w-6 h-6 rounded-full border-2 border-white -ml-1 first:ml-0 flex items-center justify-center"
                          style={{ background: c }}
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="white"/>
                          </svg>
                        </div>
                      ))}
                      <span className="text-[9px] font-black text-slate-500 ml-1">+9</span>
                    </div>
                  </div>
                </div>

                {/* Timeline section */}
                <div className="bg-white border border-slate-200">
                  {/* Timeline header */}
                  <div className="px-5 py-4 flex items-center justify-between border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <h2 className="text-[10px] font-black tracking-[0.14em] uppercase text-[#0B1C30]">
                        Today&apos;s Timeline
                      </h2>
                      <span className="text-[10px] font-medium text-slate-400">— October 24, 2023</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#0B1C30]" />
                        <span className="text-[9px] font-black tracking-widest uppercase text-slate-500">Confirmed</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full border border-slate-400" />
                        <span className="text-[9px] font-black tracking-widest uppercase text-slate-400">Draft</span>
                      </div>
                    </div>
                  </div>

                  {/* Timeline entries */}
                  <div className="divide-y divide-slate-100">
                    {TIMELINE.map((entry, idx) => (
                      <div key={idx} className="flex items-center px-5 py-4 gap-4 hover:bg-slate-50 transition-colors group">
                        {/* Time */}
                        <div className="w-[72px] flex-shrink-0">
                          <span className={`text-[10px] font-black tracking-wide ${
                            entry.status === 'confirmed' ? 'text-[#0B1C30]' : 'text-slate-400'
                          }`}>
                            {entry.time}
                          </span>
                        </div>

                        {/* Entry card */}
                        <div className={`flex-1 flex items-center gap-3 px-4 py-3 border ${
                          entry.status === 'confirmed' ? 'border-slate-200' : 'border-dashed border-slate-200'
                        }`}>
                          {/* Status bar (confirmed only) */}
                          {entry.status === 'confirmed' && (
                            <div className="w-0.5 h-8 bg-[#0B1C30] flex-shrink-0" />
                          )}

                          {/* Icon */}
                          <div className="w-8 h-8 bg-[#F1F5F9] flex items-center justify-center flex-shrink-0">
                            {entry.icon}
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[#0B1C30] truncate">{entry.name}</p>
                            <p className="text-[10px] font-medium text-slate-400 truncate">
                              {entry.service} • {entry.duration}
                            </p>
                          </div>

                          {/* Assigned to */}
                          <div className="text-right flex-shrink-0">
                            <p className="text-[8px] font-black tracking-widest uppercase text-slate-400">Assigned To</p>
                            <p className={`text-xs font-bold ${
                              entry.status === 'confirmed' ? 'text-[#0B1C30]' : 'text-slate-400'
                            }`}>
                              {entry.assignedTo}
                            </p>
                          </div>

                          {/* Menu */}
                          <button className="w-6 h-6 flex flex-col items-center justify-center gap-0.5 text-slate-300 hover:text-slate-500 transition-colors flex-shrink-0">
                            {[0,1,2].map(i => (
                              <span key={i} className="w-1 h-1 rounded-full bg-current" />
                            ))}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Load more */}
                  <div className="p-4 border-t border-dashed border-slate-200">
                    <button className="w-full py-3 text-[9px] font-black tracking-[0.16em] uppercase text-slate-500 border border-dashed border-slate-300 hover:border-slate-400 hover:text-slate-700 transition-colors">
                      Load Full Evening Schedule
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Right Panel ───────────────────────────────────────────── */}
              <div className="flex flex-col gap-4 w-full xl:w-[220px] flex-shrink-0">

                {/* Quick Actions */}
                <div className="bg-[#EFF4FF] border border-slate-200 p-4 flex flex-col gap-3">
                  <p className="text-[9px] font-black tracking-[0.14em] uppercase text-slate-500 mb-1">
                    Quick Actions
                  </p>

                  {/* Manual Booking - primary */}
                  <button className="flex items-center gap-2.5 w-full bg-[#0B1C30] text-white px-3 py-2.5 hover:bg-slate-800 transition-colors text-left">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="white" strokeWidth="1.5"/>
                      <path d="M16 2v4M8 2v4M3 10h18" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M12 14v4M10 16h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span className="text-[9px] font-black tracking-widest uppercase">Manual Booking</span>
                  </button>

                  {/* Mark Time-Off */}
                  <button className="flex items-center gap-2.5 w-full bg-white border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition-colors text-left">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                      <rect x="3" y="4" width="18" height="18" rx="2" stroke="#0B1C30" strokeWidth="1.5"/>
                      <path d="M16 2v4M8 2v4M3 10h18" stroke="#0B1C30" strokeWidth="1.5" strokeLinecap="round"/>
                      <path d="M9 14l2 2 4-4" stroke="#0B1C30" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-[9px] font-black tracking-widest uppercase text-[#0B1C30]">Mark Time-Off</span>
                  </button>

                  {/* Daily Report */}
                  <button className="flex items-center gap-2.5 w-full bg-white border border-slate-200 px-3 py-2.5 hover:bg-slate-50 transition-colors text-left">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                      <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" stroke="#0B1C30" strokeWidth="1.5" strokeLinejoin="round"/>
                      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="#0B1C30" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span className="text-[9px] font-black tracking-widest uppercase text-[#0B1C30]">Daily Report</span>
                  </button>
                </div>

                {/* Facility Capacity */}
                <div className="bg-white border border-slate-200 p-4 flex flex-col gap-3">
                  <p className="text-[9px] font-black tracking-[0.14em] uppercase text-slate-500">
                    Facility Capacity
                  </p>
                  {[
                    { label: 'Main Hall', value: 84 },
                    { label: 'Suite B', value: 42 },
                  ].map(f => (
                    <div key={f.label} className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <button className="flex-1 text-left text-[9px] font-black tracking-widest uppercase bg-[#EFF4FF] text-[#0B1C30] px-2.5 py-2 hover:bg-[#DCE9FF] transition-colors">
                          {f.label} — {f.value}%
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Property Location */}
                <div className="bg-white border border-slate-200 overflow-hidden">
                  {/* Map image placeholder */}
                  <div className="relative h-28 bg-slate-200 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-300 to-slate-400 flex items-center justify-center">
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-slate-500">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="currentColor"/>
                      </svg>
                    </div>
                    <button className="absolute top-2 right-2 w-6 h-6 bg-white/80 flex items-center justify-center hover:bg-white transition-colors">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                        <path d="M14 3h7v7M10 14L21 3M3 21l7-7M3 10V3h7" stroke="#0B1C30" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </div>

                  <div className="p-3">
                    <p className="text-[8px] font-black tracking-[0.14em] uppercase text-slate-400 mb-0.5">
                      Property Location
                    </p>
                    <p className="text-xs font-bold text-[#0B1C30]">Downtown Meridian District</p>

                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="text-[8px] font-black tracking-widest uppercase text-slate-400">Status: Online</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
