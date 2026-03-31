'use client'

import Link from 'next/link'
import { LogOut } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useAuthContext } from '@/context/AuthContext'
import { cn } from '@/lib/utils'

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrator',
  BUSINESS_OWNER: 'Business Owner',
  CUSTOMER: 'Customer',
}

interface AuthUserMenuProps {
  showInlineDetails?: boolean
  wrapperClassName?: string
  nameClassName?: string
  roleClassName?: string
  avatarButtonClassName?: string
  avatarInnerClassName?: string
  menuClassName?: string
}

const toTitleCase = (value: string) => {
  return value
    .toLowerCase()
    .split(/[\s_]+/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
}

const getDisplayName = (
  user: {
    firstName?: string | null
    lastName?: string | null
    email?: string | null
  } | null
) => {
  const firstName = user?.firstName?.trim() ?? ''
  const lastName = user?.lastName?.trim() ?? ''
  const fullName = `${firstName} ${lastName}`.trim()

  if (fullName) return fullName
  if (user?.email) return user.email.split('@')[0] ?? 'Account'
  return 'Account'
}

const getInitials = (displayName: string) => {
  const segments = displayName
    .split(/\s+/)
    .map((segment) => segment.trim())
    .filter(Boolean)

  if (segments.length === 0) return 'AC'
  if (segments.length === 1) return segments[0].slice(0, 2).toUpperCase()

  return `${segments[0][0] ?? ''}${segments[1][0] ?? ''}`.toUpperCase()
}

const getPrimaryRoleLabel = (roles: readonly string[] | undefined) => {
  const primaryRole = roles?.[0]?.trim().toUpperCase() ?? ''
  if (!primaryRole) return 'Authenticated User'

  return ROLE_LABELS[primaryRole] ?? toTitleCase(primaryRole)
}

export default function AuthUserMenu({
  showInlineDetails = false,
  wrapperClassName,
  nameClassName,
  roleClassName,
  avatarButtonClassName,
  avatarInnerClassName,
  menuClassName,
}: AuthUserMenuProps) {
  const pathname = usePathname()
  const { isLoading, logout, session } = useAuthContext()
  const [openPathname, setOpenPathname] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)

  const displayName = getDisplayName(session?.user ?? null)
  const roleLabel = getPrimaryRoleLabel(session?.user.roles)
  const initials = getInitials(displayName)
  const isOpen = openPathname === pathname
  const hasOwnerRole =
    session?.user.roles.some((role) => role.toUpperCase() === 'BUSINESS_OWNER') ?? false
  const businessHref = hasOwnerRole ? '/manage_business' : '/start-business'
  const businessLabel = hasOwnerRole ? 'Manage business' : 'List your business'

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpenPathname(null)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpenPathname(null)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  async function handleLogout() {
    setErrorMessage(null)

    const result = await logout()
    if (!result.success) {
      setErrorMessage(result.message ?? 'We could not sign you out right now.')
      return
    }

    setOpenPathname(null)
  }

  return (
    <div ref={rootRef} className={cn('relative flex items-center gap-2 pl-1', wrapperClassName)}>
      {showInlineDetails && (
        <div className="hidden text-right md:block">
          <div className={cn('text-sm font-bold leading-tight text-[#0B1C30]', nameClassName)}>
            {displayName}
          </div>
          <div className={cn('text-[10px] uppercase tracking-wide text-slate-400', roleClassName)}>
            {roleLabel}
          </div>
        </div>
      )}

      <button
        type="button"
        aria-label="Open account menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        onClick={() => {
          setErrorMessage(null)
          setOpenPathname((currentValue) => (currentValue === pathname ? null : pathname))
        }}
        className={cn(
          'flex h-9 w-9 items-center justify-center overflow-hidden rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0B1C30]/20',
          avatarButtonClassName
        )}
      >
        <div
          className={cn(
            'flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-600 to-slate-800 text-xs font-black uppercase tracking-wide text-white',
            avatarInnerClassName
          )}
        >
          {initials}
        </div>
      </button>

      {isOpen && (
        <div
          role="menu"
          className={cn(
            'absolute right-0 top-full z-50 mt-3 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-900/10',
            menuClassName
          )}
        >
          <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
            <p className="text-sm font-semibold text-[#0B1C30]">{displayName}</p>
            <p className="mt-1 text-xs text-slate-500">{session?.user.email ?? 'Authenticated session'}</p>
            <div className="mt-3 inline-flex rounded-full bg-white px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-500">
              {roleLabel}
            </div>
          </div>

          {errorMessage && (
            <Alert variant="destructive" className="mt-3 rounded-xl px-3 py-2.5">
              <AlertTitle className="text-xs">Unable to log out</AlertTitle>
              <AlertDescription className="text-xs">{errorMessage}</AlertDescription>
            </Alert>
          )}

          <Link
            href={businessHref}
            role="menuitem"
            onClick={() => setOpenPathname(null)}
            className="mt-3 flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <span>{businessLabel}</span>
            <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
              {hasOwnerRole ? 'Owner' : 'Upgrade'}
            </span>
          </Link>

          <button
            type="button"
            role="menuitem"
            onClick={handleLogout}
            disabled={isLoading}
            className="mt-3 flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>Log out</span>
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  )
}
