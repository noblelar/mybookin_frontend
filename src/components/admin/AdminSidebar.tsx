'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useAuthContext } from '@/context/AuthContext'

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin/dashboard',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Business Directory',
    href: '/admin/businesses',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 7V3H2v18h20V7H12zM6 19H4v-2h2v2zm0-4H4v-2h2v2zm0-4H4V9h2v2zm0-4H4V5h2v2zm4 12H8v-2h2v2zm0-4H8v-2h2v2zm0-4H8V9h2v2zm0-4H8V5h2v2zm10 12h-8v-2h2v-2h-2v-2h2v-2h-2V9h8v10zm-2-8h-2v2h2v-2zm0 4h-2v2h2v-2z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Financials',
    href: '/admin/financials',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Subscriptions',
    href: '/admin/subscriptions',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-4H9l3-3 3 3h-2v4zm0-8h-2V7h2v2z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'User Management',
    href: '/admin/users',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>
      </svg>
    ),
  },
]

const bottomItems = [
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Support',
    href: '/admin/support',
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" fill="currentColor"/>
      </svg>
    ),
  },
]

interface AdminSidebarProps {
  activePath?: string
  mobileOpen?: boolean
  onMobileClose?: () => void
}

export default function AdminSidebar({ activePath, mobileOpen = false, onMobileClose }: AdminSidebarProps) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { session } = useAuthContext()
  const resolvedActivePath = activePath ?? pathname
  const roles = session?.user.roles.map((role) => role.toUpperCase()) ?? []
  const isSuperAdmin = roles.includes('SUPER_ADMIN')
  const displayName =
    `${session?.user.firstName ?? ''} ${session?.user.lastName ?? ''}`.trim() ||
    session?.user.email ||
    'Admin Core'
  const subtitle = isSuperAdmin ? 'Platform Super Admin' : 'Platform Admin'
  const visibleNavItems = navItems.filter((item) => {
    if (item.href === '/admin/users' || item.href === '/admin/subscriptions') {
      return isSuperAdmin
    }

    return true
  })

  return (
    <>
      {/* Desktop sidebar */}
      <aside className={`
        hidden lg:flex flex-col h-screen bg-white border-r border-slate-200 flex-shrink-0 transition-all duration-200
        ${collapsed ? 'w-[60px]' : 'w-[200px]'}
      `}>
        <SidebarContent
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          resolvedActivePath={resolvedActivePath}
          visibleNavItems={visibleNavItems}
          displayName={displayName}
          subtitle={subtitle}
          onClose={undefined}
        />
      </aside>

      {/* Mobile drawer */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 flex flex-col h-screen w-[240px] bg-white border-r border-slate-200
        transition-transform duration-300 ease-in-out lg:hidden
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent
          collapsed={false}
          setCollapsed={() => {}}
          resolvedActivePath={resolvedActivePath}
          visibleNavItems={visibleNavItems}
          displayName={displayName}
          subtitle={subtitle}
          onClose={onMobileClose}
        />
      </aside>
    </>
  )
}

interface SidebarContentProps {
  collapsed: boolean
  setCollapsed: (v: boolean) => void
  resolvedActivePath: string
  visibleNavItems: typeof navItems
  displayName: string
  subtitle: string
  onClose?: () => void
}

function SidebarContent({
  collapsed,
  setCollapsed,
  resolvedActivePath,
  visibleNavItems,
  displayName,
  subtitle,
  onClose,
}: SidebarContentProps) {
  return (
    <>
      {/* Logo row */}
      <div className="px-4 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <div className="font-black text-[#0B1C30] text-base leading-tight tracking-tight">
            {collapsed ? 'MB' : 'Admin'}
          </div>
          {!collapsed && (
            <div className="text-[9px] font-bold tracking-[1.5px] uppercase text-slate-400 mt-0.5">
              MyBookIns
            </div>
          )}
        </div>
        {/* Desktop collapse toggle */}
        {onClose === undefined && (
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex w-6 h-6 items-center justify-center rounded hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              {collapsed
                ? <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/>
                : <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/>
              }
            </svg>
          </button>
        )}
        {/* Mobile close button */}
        {onClose && (
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
            </svg>
          </button>
        )}
      </div>

      {/* Main Nav */}
      <nav className="flex-1 px-2 py-4 flex flex-col gap-0.5 overflow-y-auto">
        {visibleNavItems.map((item) => {
          const isActive = resolvedActivePath === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center gap-3 px-2 py-2.5 rounded-md text-sm font-semibold transition-colors relative ${
                isActive
                  ? 'bg-[#DCE9FF] text-[#0B1C30] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-0.5 before:bg-blue-600 before:rounded-full'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <span className={`flex-shrink-0 ${isActive ? 'text-[#0B1C30]' : 'text-slate-400'}`}>
                {item.icon}
              </span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-2 pb-3 flex flex-col gap-0.5 border-t border-slate-100 pt-3">
        {bottomItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="flex items-center gap-3 px-2 py-2.5 rounded-md text-sm font-semibold text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors"
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {!collapsed && <span className="truncate">{item.label}</span>}
          </Link>
        ))}

        {/* Admin user */}
        <div className="flex items-center gap-2.5 px-2 py-2.5 mt-1">
          <div className="w-8 h-8 rounded-full bg-[#0B1C30] flex items-center justify-center flex-shrink-0 overflow-hidden">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="white"/>
            </svg>
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-[#0B1C30] truncate">{displayName}</span>
              <span className="text-[10px] text-slate-400 truncate">{subtitle}</span>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
