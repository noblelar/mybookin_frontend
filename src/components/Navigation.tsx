'use client'

import Link from 'next/link'

import AuthUserMenu from '@/components/auth/AuthUserMenu'
import { useAuthContext } from '@/context/AuthContext'

export default function Navigation() {
  const { hasHydrated, isAuthenticated, session } = useAuthContext()
  const hasOwnerRole =
    session?.user.roles.some((role) => role.toUpperCase() === 'BUSINESS_OWNER') ?? false
  const businessHref = hasOwnerRole ? '/manage_business' : '/start-business'

  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'rgba(248, 250, 252, 0.80)',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-4 md:px-6">
        <Link
          href="/"
          className="font-inter text-sm font-black tracking-tight text-[#0B1C30] flex-shrink-0 whitespace-nowrap md:text-lg"
        >
          MyBookIns
        </Link>

        <ul className="m-0 hidden list-none items-center gap-8 p-0 md:flex">
          <li>
            <Link
              href="/discover"
              className="border-b-2 border-[#0F172A] pb-1 font-inter text-sm font-bold tracking-[-0.025em] text-[#0F172A]"
            >
              Discover
            </Link>
          </li>
          <li>
            <a
              href="#"
              className="font-inter text-sm font-bold tracking-[-0.025em] text-[#64748B] transition-colors hover:text-[#0F172A]"
            >
              How it Works
            </a>
          </li>
          <li>
            <Link
              href={businessHref}
              className="font-inter text-sm font-bold tracking-[-0.025em] text-[#64748B] transition-colors hover:text-[#0F172A]"
            >
              {hasOwnerRole ? 'Manage Business' : 'For Businesses'}
            </Link>
          </li>
          <li>
            <a
              href="#"
              className="font-inter text-sm font-bold tracking-[-0.025em] text-[#64748B] transition-colors hover:text-[#0F172A]"
            >
              Pricing
            </a>
          </li>
        </ul>

        <div className="flex items-center gap-2 md:gap-3">
          {!hasHydrated ? (
            <>
              <div className="h-9 w-20 animate-pulse rounded-full bg-slate-100" />
              <div className="h-9 w-28 animate-pulse rounded-full bg-slate-100" />
            </>
          ) : isAuthenticated ? (
            <>
              <Link
                href="/discover"
                className="inline-flex h-9 items-center justify-center rounded-full border border-slate-200 px-3 text-xs font-bold uppercase tracking-[0.1em] text-[#0F172A] transition-colors hover:bg-slate-50 md:px-4 md:text-sm"
              >
                Explore
              </Link>
              <Link
                href="/bookings"
                className="hidden h-9 items-center justify-center rounded-full border border-slate-200 px-4 text-sm font-bold uppercase tracking-[0.1em] text-[#64748B] transition-colors hover:bg-slate-50 hover:text-[#0F172A] md:inline-flex"
              >
                Bookings
              </Link>
              <AuthUserMenu
                wrapperClassName="pl-0"
                avatarButtonClassName="h-10 w-10 bg-[#0B1C30]"
                avatarInnerClassName="bg-transparent text-xs text-white"
              />
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="inline-flex h-9 items-center justify-center rounded-full border border-slate-200 px-3 font-inter text-xs font-bold uppercase tracking-[0.1em] text-[#64748B] transition-colors hover:border-slate-300 hover:text-[#0F172A] md:px-4 md:text-sm"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="inline-flex h-9 items-center justify-center rounded-full bg-black px-3 font-inter text-xs font-bold uppercase tracking-[0.1em] text-white shadow-md transition-colors hover:bg-gray-900 md:px-6 md:text-sm"
              >
                <span className="md:hidden">Create</span>
                <span className="hidden md:inline">Create Account</span>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="h-px bg-[rgba(226,232,240,0.50)]" />
    </nav>
  )
}
