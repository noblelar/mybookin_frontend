import Link from 'next/link'
import type { ReactNode } from 'react'

import CustomerAuthActions from '@/components/customer/CustomerAuthActions'
import { cn } from '@/lib/utils'

interface CustomerTopBarProps {
  desktopNav?: ReactNode
  desktopSearch?: ReactNode
  mobileSearch?: ReactNode
  mobileLeading?: ReactNode
  maxWidthClassName?: string
  className?: string
}

export default function CustomerTopBar({
  desktopNav,
  desktopSearch,
  mobileSearch,
  mobileLeading,
  maxWidthClassName,
  className,
}: CustomerTopBarProps) {
  return (
    <header className={cn('sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white shadow-sm', className)}>
      <div
        className={cn(
          'mx-auto flex h-14 items-center justify-between gap-3 px-4 md:h-16 md:px-6',
          maxWidthClassName ?? 'max-w-[1280px]'
        )}
      >
        <div className="flex h-8 w-8 items-center justify-center flex-shrink-0 md:hidden">
          {mobileLeading ?? <span aria-hidden="true" className="block h-8 w-8" />}
        </div>

        <Link
          href="/discover"
          className="absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 md:flex-shrink-0"
        >
          <span className="text-base font-black uppercase leading-none tracking-tight text-[#0B1C30] md:text-lg">
            MyBookIns
          </span>
        </Link>

        {desktopNav ? (
          <nav className="hidden flex-1 items-center justify-center gap-1 md:flex">{desktopNav}</nav>
        ) : (
          <div className="hidden flex-1 md:block" />
        )}

        {desktopSearch ? (
          <div className="hidden flex-1 md:flex">{desktopSearch}</div>
        ) : (
          <div className="hidden flex-1 md:block" />
        )}

        <CustomerAuthActions />
      </div>

      {mobileSearch ? <div className="px-4 pb-3 md:hidden">{mobileSearch}</div> : null}
    </header>
  )
}
