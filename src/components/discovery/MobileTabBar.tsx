'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useAuthContext } from '@/context/AuthContext'

const tabs = [
  {
    id: 'home',
    href: '/discover',
    label: 'Home',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill={active ? 'white' : '#64748B'}/>
      </svg>
    ),
  },
  {
    id: 'bookings',
    href: '/bookings',
    label: 'Bookings',
    requiresAuth: true,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" fill={active ? '#64748B' : '#64748B'}/>
      </svg>
    ),
  },
  {
    id: 'profile',
    href: '/profile',
    label: 'Profile',
    requiresAuth: true,
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill={active ? '#64748B' : '#64748B'}/>
      </svg>
    ),
  },
]

export default function MobileTabBar() {
  const pathname = usePathname()
  const { hasHydrated, isAuthenticated } = useAuthContext()

  return (
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white md:hidden">
      <div className="flex h-16 items-center justify-around px-4">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href
          const href =
            tab.requiresAuth && !isAuthenticated
              ? `/login?returnUrl=${encodeURIComponent(tab.href)}`
              : tab.href

          if (!hasHydrated) {
            return (
              <div key={tab.id} className="flex flex-1 flex-col items-center gap-1 py-2 opacity-60">
                <div className={isActive ? 'flex h-8 w-12 items-center justify-center rounded-full bg-[#0B1C30]' : 'flex h-8 w-12 items-center justify-center'}>
                  {tab.icon(isActive)}
                </div>
                <span className={`text-[10px] font-semibold ${isActive ? 'text-[#0B1C30]' : 'text-slate-400'}`}>
                  {tab.label}
                </span>
              </div>
            )
          }

          return (
            <Link key={tab.id} href={href} className="flex flex-1 flex-col items-center gap-1 py-2">
              {isActive ? (
                <div className="flex h-8 w-12 items-center justify-center rounded-full bg-[#0B1C30]">
                  {tab.icon(true)}
                </div>
              ) : (
                <div className="flex h-8 w-12 items-center justify-center">
                  {tab.icon(false)}
                </div>
              )}
              <span className={`text-[10px] font-semibold ${isActive ? 'text-[#0B1C30]' : 'text-slate-400'}`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
