'use client'

import { Suspense, useMemo, useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { FormEvent } from 'react'

import AuthErrorAlert from '@/components/auth/AuthErrorAlert'
import { useAuthContext } from '@/context/AuthContext'
import type { ApiErrorResponse, AuthActionSuccessResponse } from '@/types/auth'

type LoginFieldErrors = {
  email?: string
  password?: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const EyeOpenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
  </svg>
)

const EyeClosedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 22.99 12C21.26 7.61 16.99 4.5 11.99 4.5C10.59 4.5 9.25 4.75 8.01 5.2L10.17 7.36C10.74 7.13 11.35 7 12 7ZM2 4.27L4.28 6.55L4.74 7.01C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.8 19.08L19.73 22L21 20.73L3.27 3L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8ZM11.84 9.02L14.99 12.17L15.01 12.01C15.01 10.35 13.67 9.01 12.01 9.01L11.84 9.02Z" fill="currentColor"/>
  </svg>
)

const hasAdminAccess = (roles: readonly string[] | undefined) => {
  return roles?.some((role) => {
    const normalizedRole = role.toUpperCase()
    return normalizedRole === 'ADMIN' || normalizedRole === 'SUPER_ADMIN'
  }) ?? false
}

function AdminLoginFormContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { logout, session, setLoading, setSession } = useAuthContext()
  const [isPending, startTransition] = useTransition()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const returnUrl = searchParams.get('returnUrl')
  const standardLoginHref = useMemo(() => {
    if (!returnUrl) return '/login'
    return `/login?returnUrl=${encodeURIComponent(returnUrl)}`
  }, [returnUrl])

  const isBusy = isSubmitting || isPending || isSigningOut
  const hasSignedInNonAdminSession = Boolean(session) && !hasAdminAccess(session?.user.roles)

  const resetErrors = () => {
    setFieldErrors({})
    setFormError(null)
  }

  const validateForm = () => {
    const nextErrors: LoginFieldErrors = {}

    if (!email.trim()) {
      nextErrors.email = 'Email address is required.'
    } else if (!emailPattern.test(email.trim())) {
      nextErrors.email = 'Enter a valid email address.'
    }

    if (!password.trim()) {
      nextErrors.password = 'Password is required.'
    }

    return nextErrors
  }

  async function handleSignOutAndContinue() {
    setIsSigningOut(true)
    setFormError(null)

    try {
      const adminLoginHref = returnUrl
        ? `/admin/login?returnUrl=${encodeURIComponent(returnUrl)}`
        : '/admin/login'
      const result = await logout(adminLoginHref)
      if (!result.success) {
        setFormError(result.message ?? 'We could not sign you out right now.')
      }
    } finally {
      setIsSigningOut(false)
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors = validateForm()
    setFieldErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setFormError('Please review the highlighted fields and try again.')
      return
    }

    setIsSubmitting(true)
    setLoading(true)
    setFormError(null)

    let keepLoaderVisible = false

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          returnUrl: returnUrl ?? '/admin/dashboard',
          portal: 'admin',
        }),
      })

      const payload = (await response.json().catch(() => ({
        message: 'Unexpected response from the server.',
      }))) as AuthActionSuccessResponse | ApiErrorResponse

      if (!response.ok) {
        setFormError(payload.message || 'Unable to sign in right now.')
        return
      }

      const result = payload as AuthActionSuccessResponse
      keepLoaderVisible = true
      setSession(result.session)

      startTransition(() => {
        router.replace(result.redirectTo)
        router.refresh()
      })
    } catch (error) {
      console.error('Admin login form error:', error)
      setFormError('Unable to reach the server. Please try again.')
    } finally {
      setIsSubmitting(false)
      if (!keepLoaderVisible) {
        setLoading(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-6" noValidate>
      <div className="flex flex-col gap-2">
        <h2 className="font-manrope text-3xl font-extrabold tracking-[-0.5px] text-[#0B1C30]">
          Admin Login
        </h2>
        <p className="font-inter text-sm font-normal text-[#64748B]">
          Platform admin access is invite-only. `SUPER_ADMIN` accounts are provisioned via CLI.
        </p>
      </div>

      {hasSignedInNonAdminSession ? (
        <AuthErrorAlert
          title="Signed in with a non-admin account"
          message="You are currently signed in without admin privileges. Sign out before continuing with an admin or super-admin account."
        />
      ) : null}

      {formError ? <AuthErrorAlert message={formError} /> : null}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="admin-login-email"
            className="font-inter text-[10px] font-black uppercase tracking-[1.2px] text-[#0B1C30]"
          >
            Email Address
          </label>
          <input
            id="admin-login-email"
            name="email"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              resetErrors()
            }}
            autoComplete="email"
            placeholder="e.g., admin@mybookins.com"
            aria-invalid={Boolean(fieldErrors.email)}
            disabled={isBusy}
            className={`w-full border bg-white px-4 py-3.5 font-inter text-sm font-medium text-[#0B1C30] outline-none transition-colors placeholder:text-[#A0A3AB] ${
              fieldErrors.email
                ? 'border-red-300 focus:border-red-500'
                : 'border-[rgba(198,198,205,0.40)] focus:border-[#0B1C30]'
            } ${isBusy ? 'cursor-not-allowed opacity-60' : ''}`}
          />
          {fieldErrors.email ? (
            <p className="font-inter text-xs font-medium text-red-600">{fieldErrors.email}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="admin-login-password"
            className="font-inter text-[10px] font-black uppercase tracking-[1.2px] text-[#0B1C30]"
          >
            Password
          </label>
          <div
            className={`relative flex items-center border bg-white transition-colors ${
              fieldErrors.password
                ? 'border-red-300 focus-within:border-red-500'
                : 'border-[rgba(198,198,205,0.40)] focus-within:border-[#0B1C30]'
            } ${isBusy ? 'opacity-60' : ''}`}
          >
            <input
              id="admin-login-password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => {
                setPassword(event.target.value)
                resetErrors()
              }}
              autoComplete="current-password"
              aria-invalid={Boolean(fieldErrors.password)}
              disabled={isBusy}
              className="flex-1 bg-transparent px-4 py-3.5 pr-12 font-inter text-sm font-medium text-[#0B1C30] outline-none placeholder:text-[#A0A3AB]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              disabled={isBusy}
              className={`absolute right-4 text-[#76777D] transition-colors ${
                isBusy ? 'cursor-not-allowed' : 'hover:text-[#0B1C30]'
              }`}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </button>
          </div>
          {fieldErrors.password ? (
            <p className="font-inter text-xs font-medium text-red-600">{fieldErrors.password}</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={isBusy}
          className={`w-full py-4 font-inter text-sm font-black uppercase tracking-[1.4px] text-white shadow-lg transition-colors ${
            isBusy ? 'cursor-not-allowed bg-slate-500' : 'bg-black hover:bg-gray-900'
          }`}
        >
          {isSubmitting || isPending ? 'Signing In...' : 'Access Admin Dashboard'}
        </button>

        {hasSignedInNonAdminSession ? (
          <button
            type="button"
            onClick={handleSignOutAndContinue}
            disabled={isBusy}
            className="w-full border border-[rgba(198,198,205,0.40)] px-4 py-3.5 font-inter text-sm font-semibold text-[#0B1C30] transition-colors hover:border-[#0B1C30] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSigningOut ? 'Signing Out...' : 'Sign Out And Continue'}
          </button>
        ) : null}
      </div>

      <div className="space-y-3 text-center">
        <p className="font-inter text-sm font-normal text-[#64748B]">
          Need the customer app instead?{' '}
          <Link href={standardLoginHref} className="font-bold text-[#0B1C30] hover:underline">
            Use standard login
          </Link>
        </p>
        <p className="font-inter text-xs font-medium uppercase tracking-[1px] text-[#94A3B8]">
          Need admin access? Ask a super admin to create an invitation for your email.
        </p>
      </div>
    </form>
  )
}

function AdminLoginFormFallback() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="h-10 w-40 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-80 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="h-12 animate-pulse rounded bg-slate-100" />
      <div className="h-12 animate-pulse rounded bg-slate-100" />
      <div className="h-14 animate-pulse rounded bg-slate-200" />
    </div>
  )
}

export default function AdminLoginForm() {
  return (
    <Suspense fallback={<AdminLoginFormFallback />}>
      <AdminLoginFormContent />
    </Suspense>
  )
}
