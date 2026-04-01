'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState, type ReactNode } from 'react'

import ManageBusinessTopBar from '@/components/manage_business/ManageBusinessTopBar'
import { cn } from '@/lib/utils'

type ManageBusinessNavPath =
  | '/manage_business'
  | '/manage_business/bookings'
  | '/manage_business/services'
  | '/manage_business/payouts'
  | '/manage_business/staff'
  | '/manage_business/settings'

interface ManageBusinessShellProps {
  activeNav: ManageBusinessNavPath
  children: ReactNode
  topBarTab?: 'analytics' | 'reports' | 'audit'
  contentClassName?: string
}

const NAV_ITEMS = [
  {
    label: 'Dashboard',
    href: '/manage_business',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.9" />
        <rect x="14" y="3" width="7" height="7" rx="1" fill="currentColor" opacity="0.9" />
        <rect x="3" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.9" />
        <rect x="14" y="14" width="7" height="7" rx="1" fill="currentColor" opacity="0.9" />
      </svg>
    ),
  },
  {
    label: 'Bookings',
    href: '/manage_business/bookings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="3" y="5" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 3V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M16 3V7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M3 10H21" stroke="currentColor" strokeWidth="1.5" />
        <rect x="7" y="13" width="4" height="4" rx="0.75" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'Services',
    href: '/manage_business/services',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="5" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="4" y="10" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
        <rect x="4" y="15" width="16" height="4" rx="1" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: 'Payouts',
    href: '/manage_business/payouts',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="6" width="20" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="7" cy="15" r="1.5" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: 'Staff',
    href: '/manage_business/staff',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="9" cy="7" r="3.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M3 19c0-3.314 2.686-6 6-6s6 2.686 6 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <circle cx="17" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M21 19c0-2.21-1.79-4-4-4"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    label: 'Settings',
    href: '/manage_business/settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>
    ),
  },
] as const

export default function ManageBusinessShell({
  activeNav,
  children,
  topBarTab = 'analytics',
  contentClassName,
}: ManageBusinessShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const searchParams = useSearchParams()
  const selectedBusinessId = searchParams.get('businessId')

  const buildNavHref = (href: ManageBusinessNavPath) => {
    if (!selectedBusinessId) {
      return href
    }

    const params = new URLSearchParams()
    params.set('businessId', selectedBusinessId)
    return `${href}?${params.toString()}`
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F1F5F9] font-inter">
      {sidebarOpen ? (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      ) : null}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-[148px] flex-shrink-0 flex-col border-r border-slate-200 bg-white transition-transform duration-300 lg:relative lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="border-b border-slate-100 px-4 pb-4 pt-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center bg-[#0B1C30]">
              <span className="text-sm font-black text-white">A</span>
            </div>
            <div>
              <p className="text-[11px] font-black leading-tight text-[#0B1C30]">MyBookIns</p>
              <p className="mt-0.5 text-[8px] font-bold uppercase tracking-[1.5px] text-slate-400">
                Management Suite
              </p>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto px-2 py-4">
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item.href

            return (
              <Link
                key={item.href}
                href={buildNavHref(item.href)}
                className={cn(
                  'relative flex items-center gap-2.5 px-2.5 py-2.5 text-[11px] font-bold transition-colors',
                  isActive
                    ? 'bg-[#EFF4FF] text-[#0B1C30]'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                )}
              >
                {isActive ? (
                  <span className="absolute bottom-1 left-0 top-1 w-0.5 rounded-r bg-[#0B1C30]" />
                ) : null}
                <span className={isActive ? 'text-[#0B1C30]' : 'text-slate-400'}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-slate-100 p-3">
          <Link
            href="/start-business"
            className="flex w-full items-center justify-center gap-2 bg-[#0B1C30] py-2.5 text-[10px] font-black uppercase tracking-widest text-white transition-colors hover:bg-slate-800"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor" />
            </svg>
            New Entry
          </Link>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <ManageBusinessTopBar
          activeTab={topBarTab}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className={cn('flex-1 overflow-y-auto p-5 md:p-6', contentClassName)}>{children}</main>
      </div>
    </div>
  )
}
