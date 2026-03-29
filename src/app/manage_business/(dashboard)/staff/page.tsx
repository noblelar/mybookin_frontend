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

// ── Staff data ────────────────────────────────────────────────────────────────
const STAFF_MEMBERS = [
  {
    id: 'elena',
    name: 'Elena Moretti',
    role: 'Senior Architect / Lead Ops',
    status: 'ACTIVE' as const,
    servicesCount: 42,
    initials: 'EM',
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/b1300631cb29f01d963d09791de71f8683dafad9?width=150',
    toggleOn: true,
  },
  {
    id: 'marcus',
    name: 'Marcus Chen',
    role: 'Logistics Coordinator',
    status: 'ACTIVE' as const,
    servicesCount: 18,
    initials: 'MC',
    avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/9983a564b8c383cdb8949630f0f164ead3fcfe4f?width=150',
    toggleOn: true,
  },
  {
    id: 'sarah',
    name: 'Sarah Robson',
    role: 'Client Relations',
    status: 'OFFLINE' as const,
    servicesCount: 0,
    initials: 'SR',
    avatar: null,
    toggleOn: false,
  },
]

// ── Weekly schedule ───────────────────────────────────────────────────────────
const WEEK_DAYS = [
  { day: 'MON', date: 24, events: [{ time: '08:00 – 12:00', title: 'Audit Protocol Service', staff: 'E. Moretti', dark: true }] },
  { day: 'TUE', date: 25, events: [{ time: '10:00 – 16:00', title: 'Resource Allocation', staff: 'M. Chen', dark: false }] },
  {
    day: 'WED', date: 26, isToday: true,
    events: [
      { time: '09:00 – 13:00', title: 'Tenant Verification', staff: 'E. Moretti', dark: true },
      { time: '14:00 – 17:00', title: 'Security Check', staff: '', dark: false },
    ],
  },
  { day: 'THU', date: 27, events: [{ time: '08:30 – 17:30', title: 'Full Shift Protocol', staff: 'J. Doe', dark: false }] },
  { day: 'FRI', date: 28, events: [] },
  { day: 'SAT', date: 29, events: [] },
  { day: 'SUN', date: 30, events: [] },
]

// ── Service topology ──────────────────────────────────────────────────────────
const SERVICES = [
  {
    id: 'security',
    name: 'Security & Compliance',
    type: 'Critical Service',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    staff: [
      { name: 'Elena Moretti', role: 'PRIMARY', avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/b1300631cb29f01d963d09791de71f8683dafad9?width=150' },
      { name: 'Marcus Chen', role: 'BACKUP', avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/9983a564b8c383cdb8949630f0f164ead3fcfe4f?width=150' },
    ],
  },
  {
    id: 'infra',
    name: 'Infrastructure Bridge',
    type: 'Core Service',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <circle cx="5" cy="12" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="19" cy="6" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <circle cx="19" cy="18" r="2" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 12h5M14 7l3 4M14 17l3-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
    staff: [
      { name: 'Marcus Chen', role: 'PRIMARY', avatar: 'https://api.builder.io/api/v1/image/assets/TEMP/9983a564b8c383cdb8949630f0f164ead3fcfe4f?width=150' },
    ],
  },
  {
    id: 'data',
    name: 'Data Architecture',
    type: 'Internal Service',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="13" y="3" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="3" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
        <rect x="13" y="13" width="8" height="8" rx="1" stroke="currentColor" strokeWidth="1.5"/>
      </svg>
    ),
    staff: [],
  },
]

// ── Toggle component ──────────────────────────────────────────────────────────
function Toggle({ on }: { on: boolean }) {
  return (
    <div className={`relative w-9 h-5 rounded-full transition-colors flex-shrink-0 ${on ? 'bg-[#0B1C30]' : 'bg-slate-200'}`}>
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? 'left-4' : 'left-0.5'}`} />
    </div>
  )
}

export default function StaffPage() {
  const [activeTab, setActiveTab] = useState<'analytics' | 'reports' | 'audit'>('analytics')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [scheduleView, setScheduleView] = useState<'weekly' | 'monthly'>('weekly')
  const activeNav = '/manage_business/staff'

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

        <main className="flex-1 overflow-y-auto">
          <div className="p-5 md:p-6 flex flex-col gap-6">

            {/* ── Page Header ──────────────────────────────────────────────── */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex gap-4 items-start">
                <div className="w-1 self-stretch bg-[#0B1C30] flex-shrink-0 rounded-sm" />
                <div>
                  <h1 className="font-manrope text-3xl md:text-4xl font-extrabold text-[#0B1C30] tracking-tight leading-none">
                    Staff Governance
                  </h1>
                  <p className="text-sm text-slate-500 mt-2">
                    Orchestrate resources and service assignments across the business tenant.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <button className="px-4 py-2.5 border border-slate-300 text-[10px] font-black uppercase tracking-widest text-[#0B1C30] hover:bg-slate-50 transition-colors">
                  Export Directory
                </button>
                <button className="px-4 py-2.5 bg-[#0B1C30] text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-800 transition-colors">
                  Add Employee
                </button>
              </div>
            </div>

            {/* ── Metrics + Staff Cards ─────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] lg:grid-cols-[220px_1fr] gap-0 bg-white border border-slate-200 overflow-hidden">

              {/* Metrics panel */}
              <div className="p-5 border-b md:border-b-0 md:border-r border-slate-200">
                <p className="text-[9px] font-black tracking-[0.18em] uppercase text-slate-400 mb-3">Metrics</p>
                <p className="text-5xl font-extrabold text-[#0B1C30] tracking-tight leading-none mb-1">24</p>
                <p className="text-xs text-slate-500 mb-5">Total Active Staff</p>
                <div className="flex flex-col gap-3 border-t border-slate-100 pt-4">
                  {[
                    { label: 'Admin Level', value: '04' },
                    { label: 'Operations', value: '12' },
                    { label: 'On-Call', value: '08' },
                  ].map(row => (
                    <div key={row.label} className="flex items-center justify-between">
                      <span className="text-xs text-slate-500">{row.label}</span>
                      <span className="text-sm font-extrabold text-[#0B1C30]">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Staff cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-200">
                {STAFF_MEMBERS.map(member => (
                  <div key={member.id} className="p-5 flex flex-col gap-4">
                    {/* Status badge + photo */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-shrink-0">
                        {member.avatar ? (
                          <img
                            src={member.avatar}
                            alt={member.name}
                            className="w-14 h-14 object-cover grayscale"
                          />
                        ) : (
                          <div className="w-14 h-14 bg-slate-200 flex items-center justify-center">
                            <span className="text-sm font-extrabold text-slate-500">{member.initials}</span>
                          </div>
                        )}
                      </div>
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-black tracking-widest uppercase ${
                        member.status === 'ACTIVE'
                          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${member.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                        {member.status}
                      </span>
                    </div>

                    {/* Name + role */}
                    <div>
                      <p className="text-sm font-extrabold text-[#0B1C30] leading-tight">{member.name}</p>
                      <p className="text-[10px] font-black tracking-[0.1em] uppercase text-slate-400 mt-0.5">{member.role}</p>
                    </div>

                    {/* Services + toggle */}
                    <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100">
                      <span className="text-xs text-slate-500">
                        {member.servicesCount} Services Assigned
                      </span>
                      <Toggle on={member.toggleOn} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Shift Governance Grid ─────────────────────────────────────── */}
            <div className="bg-white border border-slate-200">
              {/* Grid header */}
              <div className="px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100">
                <h2 className="text-base font-bold text-[#0B1C30] tracking-tight">Shift Governance Grid</h2>
                <div className="flex items-center gap-3">
                  {/* View toggle */}
                  <div className="flex border border-slate-300 overflow-hidden">
                    {(['weekly', 'monthly'] as const).map(v => (
                      <button
                        key={v}
                        onClick={() => setScheduleView(v)}
                        className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest transition-colors ${
                          scheduleView === v ? 'bg-[#0B1C30] text-white' : 'bg-white text-slate-500 hover:text-slate-800'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                  {/* Date nav */}
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                    <button className="hover:text-[#0B1C30] transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                    <span className="whitespace-nowrap text-[#0B1C30]">Oct 24 – Oct 30</span>
                    <button className="hover:text-[#0B1C30] transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {/* Calendar grid */}
              <div className="overflow-x-auto">
                <div className="min-w-[640px] grid grid-cols-7 divide-x divide-slate-100">
                  {WEEK_DAYS.map(day => (
                    <div key={day.day} className="flex flex-col min-h-[280px]">
                      {/* Day header */}
                      <div className={`px-3 py-3 text-center border-b border-slate-100 ${day.isToday ? 'bg-[#EFF4FF]' : ''}`}>
                        <p className="text-[9px] font-black tracking-widest uppercase text-slate-400">{day.day}</p>
                        <p className={`text-lg font-extrabold leading-tight mt-0.5 ${day.isToday ? 'text-[#0B1C30]' : 'text-slate-700'}`}>
                          {day.date}
                        </p>
                      </div>

                      {/* Events */}
                      <div className="flex-1 p-2 flex flex-col gap-2">
                        {day.events.map((event, ei) => (
                          <div
                            key={ei}
                            className={`px-2.5 py-2 rounded-sm ${
                              event.dark
                                ? 'bg-[#0B1C30] text-white'
                                : 'bg-slate-100 text-[#0B1C30] border border-slate-200'
                            }`}
                          >
                            <p className={`text-[9px] font-bold mb-1 ${event.dark ? 'text-slate-300' : 'text-slate-400'}`}>
                              {event.time}
                            </p>
                            <p className={`text-xs font-extrabold leading-tight ${event.dark ? 'text-white' : 'text-[#0B1C30]'}`}>
                              {event.title}
                            </p>
                            {event.staff && (
                              <p className={`text-[9px] font-medium mt-1 ${event.dark ? 'text-slate-400' : 'text-slate-500'}`}>
                                Staff: {event.staff}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ── Service Assignment Topology ───────────────────────────────── */}
            <div>
              <h2 className="text-base font-bold text-[#0B1C30] tracking-tight mb-4">Service Assignment Topology</h2>
              <div className="bg-white border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                  {SERVICES.map(service => (
                    <div key={service.id} className="p-5 flex flex-col gap-4">
                      {/* Service header */}
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#0B1C30] flex items-center justify-center text-white flex-shrink-0">
                          {service.icon}
                        </div>
                        <div>
                          <p className="text-sm font-extrabold text-[#0B1C30] leading-tight">{service.name}</p>
                          <p className="text-[9px] font-black tracking-[0.12em] uppercase text-slate-400 mt-0.5">{service.type}</p>
                        </div>
                      </div>

                      {/* Staff list */}
                      <div className="flex flex-col gap-2 border-t border-slate-100 pt-3">
                        {service.staff.length > 0 ? (
                          service.staff.map(s => (
                            <div key={s.name} className="flex items-center justify-between border-b border-slate-50 pb-2 last:border-0 last:pb-0">
                              <div className="flex items-center gap-2">
                                <img
                                  src={s.avatar}
                                  alt={s.name}
                                  className="w-6 h-6 rounded-full object-cover grayscale"
                                />
                                <span className="text-xs font-semibold text-[#0B1C30]">{s.name}</span>
                              </div>
                              <span className={`text-[9px] font-black tracking-widest uppercase ${
                                s.role === 'PRIMARY' ? 'text-emerald-600' : 'text-slate-400'
                              }`}>
                                {s.role}
                              </span>
                            </div>
                          ))
                        ) : (
                          <button className="text-[10px] font-black tracking-widest uppercase text-slate-400 hover:text-[#0B1C30] transition-colors text-left">
                            Assign Staff +
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
