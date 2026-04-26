'use client'

import { sanitizeReturnUrl } from '@/lib/auth'
import type { SocialProvider } from '@/lib/firebase-client'

const PENDING_SOCIAL_LINK_KEY = 'pending_social_link'

export type PendingSocialLinkIntent = {
  provider: SocialProvider
  returnUrl?: string | null
}

export const getPendingSocialLinkIntent = (): PendingSocialLinkIntent | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const rawValue = window.sessionStorage.getItem(PENDING_SOCIAL_LINK_KEY)
  if (!rawValue) {
    return null
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<PendingSocialLinkIntent>
    if (parsed.provider !== 'google' && parsed.provider !== 'apple') {
      return null
    }

    return {
      provider: parsed.provider,
      returnUrl: sanitizeReturnUrl(parsed.returnUrl),
    }
  } catch {
    return null
  }
}

export const setPendingSocialLinkIntent = (intent: PendingSocialLinkIntent) => {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.setItem(
    PENDING_SOCIAL_LINK_KEY,
    JSON.stringify({
      provider: intent.provider,
      returnUrl: sanitizeReturnUrl(intent.returnUrl),
    } satisfies PendingSocialLinkIntent)
  )
}

export const clearPendingSocialLinkIntent = () => {
  if (typeof window === 'undefined') {
    return
  }

  window.sessionStorage.removeItem(PENDING_SOCIAL_LINK_KEY)
}
