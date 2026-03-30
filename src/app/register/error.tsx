'use client'

import AuthPageError from '@/components/auth/AuthPageError'

export default function RegisterError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <AuthPageError error={error} reset={reset} backHref="/register" />
}
