'use client'

import { Suspense, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useAuthContext } from '@/context/AuthContext'
import type { ApiErrorResponse, AuthActionSuccessResponse } from '@/types/auth'

function AcceptAdminInvitePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { hasHydrated, isAuthenticated, session, setSession } = useAuthContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const token = searchParams.get('token')?.trim() ?? ''
  const returnUrl = useMemo(() => {
    const query = searchParams.toString()
    return query ? `/accept-admin-invite?${query}` : '/accept-admin-invite'
  }, [searchParams])

  const isAlreadyAdmin =
    session?.user.roles.some((role) => {
      const normalizedRole = role.toUpperCase()
      return normalizedRole === 'ADMIN' || normalizedRole === 'SUPER_ADMIN'
    }) ?? false

  async function handleAcceptInvitation() {
    if (!token) {
      setErrorMessage('This invite link is missing its token. Please request a new invitation.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await fetch('/api/admin/invitations/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      })

      const payload = (await response.json()) as AuthActionSuccessResponse | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(
          'message' in payload ? payload.message : 'We could not accept this admin invitation.'
        )
        return
      }

      const successPayload = payload as AuthActionSuccessResponse
      setSession(successPayload.session)
      router.replace(successPayload.redirectTo)
      router.refresh()
    } catch {
      setErrorMessage('We could not accept this admin invitation right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-12 text-[#0B1C30]">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
            Platform Access
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">Accept Admin Invitation</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Admin access is invite-only. Sign in with the same email address that received the
            invitation, then accept it to enter the platform admin workspace.
          </p>
        </div>

        {!token && (
          <Alert variant="destructive">
            <AlertTitle>Missing invitation token</AlertTitle>
            <AlertDescription>
              This link is incomplete. Ask a super admin to create a new invitation for you.
            </AlertDescription>
          </Alert>
        )}

        {errorMessage && (
          <Alert variant="destructive">
            <AlertTitle>Invitation not accepted</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        )}

        {!hasHydrated && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
            Checking your session...
          </div>
        )}

        {hasHydrated && !isAuthenticated && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-[#0B1C30]">
              Sign in or create your account first
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              We&apos;ll bring you straight back to this invitation once your session is ready.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link
                href={`/login?returnUrl=${encodeURIComponent(returnUrl)}`}
                className="inline-flex rounded-full bg-[#0B1C30] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#16314f]"
              >
                Sign in
              </Link>
              <Link
                href={`/register?returnUrl=${encodeURIComponent(returnUrl)}`}
                className="inline-flex rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Create account
              </Link>
            </div>
          </div>
        )}

        {hasHydrated && isAuthenticated && token && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-[#0B1C30]">
              Signed in as {session?.user.email ?? 'your account'}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {isAlreadyAdmin
                ? 'This account already has admin access. You can still accept the invite if it was sent to this same email address.'
                : 'Accepting this invitation will add the ADMIN role to your account immediately.'}
            </p>
            <button
              type="button"
              onClick={handleAcceptInvitation}
              disabled={isSubmitting}
              className="mt-4 inline-flex rounded-full bg-[#0B1C30] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#16314f] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? 'Accepting...' : 'Accept invitation'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function AcceptAdminInvitePageFallback() {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-12 text-[#0B1C30]">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
            Platform Access
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">Accept Admin Invitation</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Checking your invitation link...
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AcceptAdminInvitePage() {
  return (
    <Suspense fallback={<AcceptAdminInvitePageFallback />}>
      <AcceptAdminInvitePageContent />
    </Suspense>
  )
}
