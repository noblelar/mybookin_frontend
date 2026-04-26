'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import AuthErrorAlert from '@/components/auth/AuthErrorAlert'
import { useAuthContext } from '@/context/AuthContext'
import { resolveAuthenticatedRedirect } from '@/lib/auth'
import {
  FirebaseClientConfigError,
  getSocialProviderLabel,
  signInWithFirebaseSocialProvider,
  type SocialProvider,
} from '@/lib/firebase-client'
import {
  clearPendingSocialLinkIntent,
  getPendingSocialLinkIntent,
  type PendingSocialLinkIntent,
} from '@/lib/social-link-intent'
import type { ApiErrorResponse, SocialLinkSuccessResponse } from '@/types/auth'

type IntentState = PendingSocialLinkIntent | null | undefined

export default function SocialLinkPageClient() {
  const router = useRouter()
  const { hasHydrated, session, setLoading, setSession } = useAuthContext()
  const [intent, setIntent] = useState<IntentState>(undefined)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    setIntent(getPendingSocialLinkIntent())
  }, [])

  useEffect(() => {
    if (!hasHydrated) {
      return
    }

    if (!session) {
      router.replace('/login?returnUrl=/link-social')
      return
    }

    if (intent === null) {
      router.replace(resolveAuthenticatedRedirect(session.user.roles))
      return
    }
  }, [hasHydrated, intent, router, session])

  if (!hasHydrated || intent === undefined) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-xl items-center justify-center px-6 py-16">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#0B1C30] border-t-transparent" />
      </div>
    )
  }

  if (!session || !intent) {
    return null
  }

  const providerLabel = getSocialProviderLabel(intent.provider)

  const handleCancel = () => {
    clearPendingSocialLinkIntent()
    router.replace(intent.returnUrl ?? resolveAuthenticatedRedirect(session.user.roles))
    router.refresh()
  }

  const handleLink = async (provider: SocialProvider) => {
    setIsSubmitting(true)
    setLoading(true)
    setError(null)

    try {
      const { firebaseIdToken } = await signInWithFirebaseSocialProvider(provider)
      const response = await fetch('/api/auth/social/link', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firebase_id_token: firebaseIdToken,
        }),
      })

      const payload = (await response.json().catch(() => ({
        message: 'Unexpected response from the server.',
      }))) as SocialLinkSuccessResponse | ApiErrorResponse

      if (!response.ok) {
        setError((payload as ApiErrorResponse).message || `Unable to link ${providerLabel}.`)
        return
      }

      const result = payload as SocialLinkSuccessResponse
      clearPendingSocialLinkIntent()
      setSession(result.session)
      router.replace(intent.returnUrl ?? resolveAuthenticatedRedirect(result.session.user.roles))
      router.refresh()
    } catch (caughtError) {
      if (caughtError instanceof FirebaseClientConfigError) {
        setError(caughtError.message)
      } else if (caughtError instanceof Error) {
        setError(caughtError.message || `Unable to link ${providerLabel}.`)
      } else {
        setError(`Unable to link ${providerLabel}.`)
      }
    } finally {
      setIsSubmitting(false)
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center justify-center px-6 py-16">
      <div className="w-full rounded-[28px] border border-[rgba(11,28,48,0.10)] bg-white p-8 shadow-[0_30px_90px_rgba(11,28,48,0.08)]">
        <div className="flex flex-col gap-3">
          <p className="font-inter text-[10px] font-black uppercase tracking-[1.5px] text-[#64748B]">
            Confirm Social Link
          </p>
          <h1 className="font-manrope text-3xl font-extrabold tracking-[-0.7px] text-[#0B1C30]">
            Connect {providerLabel} to your existing account
          </h1>
          <p className="max-w-2xl font-inter text-sm leading-6 text-[#64748B]">
            You already signed in with email, so the last step is confirming your {providerLabel}
            account. We&apos;ll link it to <span className="font-semibold text-[#0B1C30]">{session.user.email}</span>{' '}
            and keep your current roles and session exactly as they are.
          </p>
        </div>

        {error ? <AuthErrorAlert className="mt-6" message={error} /> : null}

        <div className="mt-8 rounded-2xl border border-[rgba(11,28,48,0.08)] bg-[#F8FAFC] p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-[rgba(198,198,205,0.45)] bg-white px-4 py-3">
              <p className="font-inter text-[10px] font-black uppercase tracking-[1.2px] text-[#64748B]">
                Local Account
              </p>
              <p className="mt-1 font-inter text-sm font-semibold text-[#0B1C30]">
                {session.user.email}
              </p>
            </div>
            <div className="rounded-xl border border-[rgba(198,198,205,0.45)] bg-white px-4 py-3">
              <p className="font-inter text-[10px] font-black uppercase tracking-[1.2px] text-[#64748B]">
                Social Provider
              </p>
              <p className="mt-1 font-inter text-sm font-semibold text-[#0B1C30]">{providerLabel}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => void handleLink(intent.provider)}
            disabled={isSubmitting}
            className={`flex-1 px-4 py-4 font-inter text-sm font-black uppercase tracking-[1.4px] text-white transition-colors ${
              isSubmitting ? 'cursor-not-allowed bg-slate-500' : 'bg-black hover:bg-gray-900'
            }`}
          >
            {isSubmitting ? `Linking ${providerLabel}...` : `Continue With ${providerLabel}`}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isSubmitting}
            className={`px-4 py-4 font-inter text-sm font-bold uppercase tracking-[1.2px] text-[#0B1C30] transition-colors ${
              isSubmitting
                ? 'cursor-not-allowed opacity-60'
                : 'border border-[rgba(198,198,205,0.50)] bg-white hover:bg-slate-50'
            }`}
          >
            Skip For Now
          </button>
        </div>
      </div>
    </div>
  )
}
