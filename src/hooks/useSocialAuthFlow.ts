'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

import { clearPendingSocialLinkIntent, setPendingSocialLinkIntent } from '@/lib/social-link-intent'
import {
  FirebaseClientConfigError,
  getSocialProviderLabel,
  signInWithFirebaseSocialProvider,
  type SocialProvider,
} from '@/lib/firebase-client'
import { useAuthContext } from '@/context/AuthContext'
import type { ApiErrorResponse, AuthActionSuccessResponse } from '@/types/auth'

type PendingProfileCompletion = {
  provider: SocialProvider
  firebaseIdToken: string
}

type UseSocialAuthFlowOptions = {
  returnUrl?: string | null
}

const buildLinkRequiredHref = (provider: SocialProvider, returnUrl?: string | null) => {
  const params = new URLSearchParams()
  params.set('socialLinkRequired', provider)

  if (returnUrl) {
    params.set('returnUrl', returnUrl)
  }

  return `/login?${params.toString()}`
}

export function useSocialAuthFlow({ returnUrl }: UseSocialAuthFlowOptions) {
  const router = useRouter()
  const { setLoading, setSession } = useAuthContext()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingProfileCompletion, setPendingProfileCompletion] =
    useState<PendingProfileCompletion | null>(null)

  const resetSocialState = () => {
    setError(null)
    setPendingProfileCompletion(null)
  }

  const finalizeAuthSuccess = (result: AuthActionSuccessResponse) => {
    clearPendingSocialLinkIntent()
    setPendingProfileCompletion(null)
    setSession(result.session)
    router.replace(result.redirectTo)
    router.refresh()
  }

  const handleSocialResponse = async (
    provider: SocialProvider,
    exchangeRequest: {
      firebase_id_token: string
      first_name?: string
      last_name?: string
    }
  ) => {
    const response = await fetch('/api/auth/social/exchange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...exchangeRequest,
        returnUrl: returnUrl ?? undefined,
      }),
    })

    const payload = (await response.json().catch(() => ({
      message: 'Unexpected response from the server.',
    }))) as AuthActionSuccessResponse | ApiErrorResponse

    if (!response.ok) {
      const errorResponse = payload as ApiErrorResponse

      if (errorResponse.code === 'ACCOUNT_LINK_REQUIRED') {
        setPendingSocialLinkIntent({
          provider,
          returnUrl,
        })
        router.replace(buildLinkRequiredHref(provider, returnUrl))
        return
      }

      if (errorResponse.code === 'PROFILE_COMPLETION_REQUIRED') {
        setPendingProfileCompletion({
          provider,
          firebaseIdToken: exchangeRequest.firebase_id_token,
        })
        setError(null)
        return
      }

      setError(errorResponse.message || `Unable to continue with ${getSocialProviderLabel(provider)}.`)
      return
    }

    finalizeAuthSuccess(payload as AuthActionSuccessResponse)
  }

  const startSocialAuth = async (provider: SocialProvider) => {
    setIsSubmitting(true)
    setLoading(true)
    setError(null)

    try {
      const { firebaseIdToken } = await signInWithFirebaseSocialProvider(provider)
      await handleSocialResponse(provider, {
        firebase_id_token: firebaseIdToken,
      })
    } catch (caughtError) {
      if (caughtError instanceof FirebaseClientConfigError) {
        setError(caughtError.message)
      } else if (caughtError instanceof Error) {
        setError(caughtError.message || `Unable to continue with ${getSocialProviderLabel(provider)}.`)
      } else {
        setError(`Unable to continue with ${getSocialProviderLabel(provider)}.`)
      }
    } finally {
      setIsSubmitting(false)
      setLoading(false)
    }
  }

  const completeSocialProfile = async (firstName: string, lastName: string) => {
    if (!pendingProfileCompletion) {
      return
    }

    const normalizedFirstName = firstName.trim()
    const normalizedLastName = lastName.trim()
    if (!normalizedFirstName || !normalizedLastName) {
      setError('First name and last name are required to finish social sign-in.')
      return
    }

    setIsSubmitting(true)
    setLoading(true)
    setError(null)

    try {
      await handleSocialResponse(pendingProfileCompletion.provider, {
        firebase_id_token: pendingProfileCompletion.firebaseIdToken,
        first_name: normalizedFirstName,
        last_name: normalizedLastName,
      })
    } finally {
      setIsSubmitting(false)
      setLoading(false)
    }
  }

  return {
    isSubmitting,
    error,
    pendingProfileCompletion,
    startSocialAuth,
    completeSocialProfile,
    resetSocialState,
    setError,
  }
}
