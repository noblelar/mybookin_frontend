'use client'

import { useState } from 'react'
import Link from 'next/link'
import ManageBusinessTopBar from '@/components/manage_business/ManageBusinessTopBar'

// ── Sidebar nav ──────────────────────────────────────────────────────────────
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

// ── Operating hours data ─────────────────────────────────────────────────────
const OPERATING_HOURS = [
  { day: 'MON', open: '08:00', close: '20:00', enabled: true },
  { day: 'TUE', open: '08:00', close: '20:00', enabled: true },
  { day: 'WED', open: '08:00', close: '20:00', enabled: true },
  { day: 'THU', open: '08:00', close: '20:00', enabled: true },
  { day: 'FRI', open: '08:00', close: '22:00', enabled: true },
  { day: 'SAT', open: '10:00', close: '18:00', enabled: true },
  { day: 'SUN', open: '', close: '', enabled: false },
]

// ── Resource pool data ───────────────────────────────────────────────────────
const RESOURCES = [
  {
    id: 'zenith',
    name: 'Zenith Chamber',
    capacity: 1,
    tags: ['ROOM', 'CLIMATE-CONTROLLED'],
  },
  {
    id: 'reform',
    name: 'Reform Station A1',
    capacity: 2,
    tags: ['EQUIPMENT'],
  },
]

// ── Service categories ───────────────────────────────────────────────────────
const SERVICE_CATEGORIES = [
  {
    id: 'holistic',
    name: 'Holistic Therapy',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: 'structural',
    name: 'Structural Training',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'reports' | 'audit'>('analytics')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const activeNav = '/manage_business/settings'

  // Form state
  const [businessName, setBusinessName] = useState('Lux Wellness Collective')
  const [phone, setPhone] = useState('+1 (555) 098-2341')
  const [description, setDescription] = useState(
    'A premium wellness and recovery studio focusing on architectural design principles and holistic health for sovereign professionals.'
  )
  const [hours, setHours] = useState(OPERATING_HOURS)

  const toggleDay = (index: number) => {
    setHours(prev => prev.map((h, i) => i === index ? { ...h, enabled: !h.enabled } : h))
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F1F5F9] font-inter">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 lg:relative lg:z-auto
        flex flex-col w-[148px] bg-white border-r border-slate-200 flex-shrink-0 transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="px-4 pt-5 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#0B1C30] flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-sm">A</span>
            </div>
            <div>
              <p className="text-[11px] font-black text-[#0B1C30] leading-tight">MyBookIns</p>
              <p className="text-[8px] font-bold tracking-[1.5px] uppercase text-slate-400 mt-0.5">Management Suite</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 px-2 py-4 flex flex-col gap-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const isActive = activeNav === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-2.5 py-2.5 text-[11px] font-bold transition-colors relative ${
                  isActive ? 'bg-[#EFF4FF] text-[#0B1C30]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                {isActive && <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-[#0B1C30] rounded-r" />}
                <span className={isActive ? 'text-[#0B1C30]' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-3 border-t border-slate-100">
          <button className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#0B1C30] text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-colors">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
            </svg>
            New Entry
          </button>
        </div>
      </aside>

      {/* ── Main ─────────────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <ManageBusinessTopBar activeTab={activeTab} onTabChange={setActiveTab} onMenuClick={() => setSidebarOpen(true)} />

        {/* Scrollable area */}
        <div className="flex-1 overflow-y-auto flex flex-col">
          <main className="flex-1 p-5 md:p-6">

            {/* ── Breadcrumb ────────────────────────────────────────────────── */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[9px] font-black tracking-[0.18em] uppercase text-slate-400">Architectural Control</span>
              <span className="text-slate-300">/</span>
              <span className="text-[9px] font-black tracking-[0.18em] uppercase text-slate-400">Configuration V2.4</span>
            </div>

            {/* ── Page Title ────────────────────────────────────────────────── */}
            <div className="mb-6">
              <h1 className="font-manrope text-3xl md:text-4xl font-extrabold text-[#0B1C30] tracking-tight leading-none mb-2">
                Tenant Settings
              </h1>
              <p className="text-sm text-slate-500 max-w-xl">
                Define the core structural identity and operational parameters for the sovereign entity. These settings cascade across all user interactions.
              </p>
            </div>

            {/* ── Two-column grid ───────────────────────────────────────────── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-6">

              {/* ── Left column ─────────────────────────────────────────────── */}
              <div className="flex flex-col gap-5">

                {/* Profile & Identity */}
                <div className="bg-white border border-slate-200 p-6 flex flex-col gap-5">
                  <h2 className="text-base font-extrabold text-[#0B1C30] tracking-tight">Profile &amp; Identity</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Business Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black tracking-[0.18em] uppercase text-slate-400">Business Name</label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={e => setBusinessName(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 bg-white text-sm text-[#0B1C30] font-medium focus:outline-none focus:border-[#0B1C30] transition-colors"
                      />
                    </div>
                    {/* Phone Number */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[9px] font-black tracking-[0.18em] uppercase text-slate-400">Phone Number</label>
                      <input
                        type="text"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 bg-white text-sm text-[#0B1C30] font-medium focus:outline-none focus:border-[#0B1C30] transition-colors"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[9px] font-black tracking-[0.18em] uppercase text-slate-400">Description</label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2.5 border border-slate-200 bg-white text-sm text-[#0B1C30] font-medium focus:outline-none focus:border-[#0B1C30] transition-colors resize-none"
                    />
                  </div>

                  <div className="border-t border-slate-100" />
                </div>

                {/* Media Assets */}
                <div className="bg-white border border-slate-200 p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-extrabold text-[#0B1C30] tracking-tight">Media Assets</h2>
                    <span className="text-[10px] text-slate-400 font-medium">Recommended: 2400×1600px PNG</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* Brand Logo upload */}
                    <div className="border-2 border-dashed border-slate-200 bg-slate-50 flex flex-col items-center justify-center gap-2 py-8 cursor-pointer hover:border-slate-400 transition-colors">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-slate-400">
                        <rect x="3" y="5" width="18" height="15" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                        <circle cx="8.5" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M3 17l4-4 3 3 3-3 5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 3v4M13 5h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      <span className="text-[9px] font-black tracking-[0.18em] uppercase text-slate-400">Brand Logo</span>
                    </div>

                    {/* Main Gallery */}
                    <div className="relative overflow-hidden cursor-pointer group">
                      <div className="w-full h-full min-h-[120px] bg-slate-200">
                        <img
                          src="https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?w=400"
                          alt="Main gallery"
                          className="w-full h-full object-cover"
                          style={{ minHeight: '120px' }}
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/30 flex items-end justify-end p-3">
                        <span className="text-[9px] font-black tracking-[0.18em] uppercase text-white">Main Gallery</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Categories */}
                <div className="bg-white border border-slate-200 p-6 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-extrabold text-[#0B1C30] tracking-tight">Service Categories</h2>
                    <button className="text-[10px] font-black tracking-widest uppercase text-[#0B1C30] hover:text-slate-500 transition-colors">
                      + Add Category
                    </button>
                  </div>

                  <div className="flex flex-col gap-2">
                    {SERVICE_CATEGORIES.map(cat => (
                      <div
                        key={cat.id}
                        className="flex items-center gap-3 px-4 py-3 bg-[#F8FAFC] border border-slate-100"
                      >
                        <span className="text-slate-500">{cat.icon}</span>
                        <span className="text-sm font-semibold text-[#0B1C30]">{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Right column ─────────────────────────────────────────────── */}
              <div className="flex flex-col gap-5">

                {/* Operating Hours */}
                <div className="bg-[#EFF4FF] border border-slate-200 p-5 flex flex-col gap-3">
                  <h2 className="text-base font-extrabold text-[#0B1C30] tracking-tight">Operating Hours</h2>

                  <div className="flex flex-col gap-1">
                    {hours.map((h, i) => (
                      <div key={h.day} className="flex items-center gap-2 py-1.5 border-b border-slate-200/60 last:border-0">
                        {/* Day label */}
                        <span className="w-9 text-[10px] font-black tracking-widest uppercase text-slate-500 flex-shrink-0">{h.day}</span>

                        {/* Time fields or CLOSED */}
                        {h.enabled ? (
                          <div className="flex items-center gap-1.5 flex-1">
                            <input
                              type="text"
                              value={h.open}
                              onChange={e => setHours(prev => prev.map((x, j) => j === i ? { ...x, open: e.target.value } : x))}
                              className="w-14 px-2 py-1 bg-white border border-slate-200 text-xs text-[#0B1C30] font-semibold text-center focus:outline-none focus:border-[#0B1C30]"
                            />
                            <span className="text-slate-400 text-xs">—</span>
                            <input
                              type="text"
                              value={h.close}
                              onChange={e => setHours(prev => prev.map((x, j) => j === i ? { ...x, close: e.target.value } : x))}
                              className="w-14 px-2 py-1 bg-white border border-slate-200 text-xs text-[#0B1C30] font-semibold text-center focus:outline-none focus:border-[#0B1C30]"
                            />
                          </div>
                        ) : (
                          <span className="flex-1 text-xs font-black tracking-widest uppercase text-slate-400">Closed</span>
                        )}

                        {/* Checkbox */}
                        <button
                          onClick={() => toggleDay(i)}
                          className={`w-5 h-5 flex items-center justify-center flex-shrink-0 border transition-colors ${
                            h.enabled
                              ? 'bg-[#0B1C30] border-[#0B1C30]'
                              : 'bg-white border-slate-300 hover:border-slate-400'
                          }`}
                        >
                          {h.enabled && (
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                              <path d="M5 12l5 5L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resource Pool */}
                <div className="bg-white border border-slate-200 p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-extrabold text-[#0B1C30] tracking-tight">Resource Pool</h2>
                    <span className="px-2.5 py-1 bg-[#0B1C30] text-white text-[9px] font-black tracking-widest uppercase">
                      3 Active
                    </span>
                  </div>

                  <div className="flex flex-col gap-3">
                    {RESOURCES.map(resource => (
                      <div key={resource.id} className="p-3 border border-slate-200 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-extrabold text-[#0B1C30]">{resource.name}</span>
                          <span className="text-[9px] font-black tracking-widest uppercase text-slate-400">
                            Capacity: {resource.capacity}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {resource.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-0.5 bg-slate-100 text-[8px] font-black tracking-widest uppercase text-slate-500"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full py-2.5 border border-slate-300 text-[10px] font-black uppercase tracking-widest text-[#0B1C30] hover:bg-slate-50 transition-colors">
                    Configure New Resource
                  </button>
                </div>
              </div>
            </div>
          </main>

          {/* ── Bottom Action Bar ────────────────────────────────────────────── */}
          <div className="border-t border-slate-200 bg-white px-6 py-4 flex items-center justify-end gap-4 flex-shrink-0">
            <button className="px-6 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-[#0B1C30] transition-colors">
              Discard Draft
            </button>
            <button className="px-8 py-2.5 bg-[#0B1C30] text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-colors">
              Commit Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
