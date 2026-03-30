'use client'

import { useEffect } from 'react'
import Link from 'next/link'

import AuthErrorAlert from '@/components/auth/AuthErrorAlert'

interface AuthPageErrorProps {
  error: Error & { digest?: string }
  reset: () => void
  backHref: string
}

export default function AuthPageError({ error, reset, backHref }: AuthPageErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#F8F9FF] px-4 py-12">
      <div className="mx-auto flex max-w-xl flex-col gap-6 rounded-3xl bg-white p-8 shadow-sm">
        <AuthErrorAlert
          title="This page hit an unexpected error"
          message={error.message || 'Please try again, or return to the previous authentication step.'}
        />

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex items-center justify-center rounded-xl bg-[#0B1C30] px-5 py-3 text-sm font-black uppercase tracking-[1.2px] text-white transition-colors hover:bg-slate-800"
          >
            Try Again
          </button>
          <Link
            href={backHref}
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-black uppercase tracking-[1.2px] text-[#0B1C30] transition-colors hover:bg-slate-50"
          >
            Back
          </Link>
        </div>
      </div>
    </div>
  )
}
