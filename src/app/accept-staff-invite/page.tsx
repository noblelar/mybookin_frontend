'use client'

import { Suspense, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useAuthContext } from '@/context/AuthContext'
import type { ApiErrorResponse } from '@/types/auth'
import type { AcceptStaffInvitationSuccessResponse } from '@/types/staff'

function AcceptStaffInvitePageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { hasHydrated, isAuthenticated } = useAuthContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const token = searchParams.get('token')?.trim() ?? ''
  const returnUrl = useMemo(() => {
    const query = searchParams.toString()
    return query ? `/accept-staff-invite?${query}` : '/accept-staff-invite'
  }, [searchParams])

  async function handleAcceptInvitation() {
    if (!token) {
      setErrorMessage('This invite link is missing its token. Please request a new invitation.')
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await fetch('/api/staff/invitations/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      })

      const payload = (await response.json()) as AcceptStaffInvitationSuccessResponse | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(
          'message' in payload ? payload.message : 'We could not accept this staff invitation.'
        )
        return
      }

      router.replace((payload as AcceptStaffInvitationSuccessResponse).redirectTo)
      router.refresh()
    } catch {
      setErrorMessage('We could not accept this staff invitation right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-12 text-[#0B1C30]">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
            Team Access
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">Accept Staff Invitation</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Sign in with the same email address that received the invitation, then accept it to join the business team.
          </p>
        </div>

        {!token ? (
          <Alert variant="destructive">
            <AlertTitle>Missing invitation token</AlertTitle>
            <AlertDescription>
              This link is incomplete. Ask the business owner to create a new invitation for you.
            </AlertDescription>
          </Alert>
        ) : null}

        {errorMessage ? (
          <Alert variant="destructive">
            <AlertTitle>Invitation not accepted</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        {!hasHydrated ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
            Checking your session...
          </div>
        ) : !isAuthenticated ? (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-[#0B1C30]">Sign in or create your account first</p>
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
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <p className="text-sm font-semibold text-[#0B1C30]">
              You&apos;re signed in and ready to join this business team.
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Accepting this invitation will attach your account to the business so owners can schedule you for services and shifts.
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

function AcceptStaffInvitePageFallback() {
  return (
    <div className="min-h-screen bg-slate-100 px-4 py-12 text-[#0B1C30]">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
            Team Access
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight">Accept Staff Invitation</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Checking your invitation link...
          </p>
        </div>
      </div>
    </div>
  )
}

export default function AcceptStaffInvitePage() {
  return (
    <Suspense fallback={<AcceptStaffInvitePageFallback />}>
      <AcceptStaffInvitePageContent />
    </Suspense>
  )
}
