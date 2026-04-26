'use client'

import Link from 'next/link'
import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import type { FormEvent } from 'react'

import AuthErrorAlert from '@/components/auth/AuthErrorAlert'
import type { ApiErrorResponse } from '@/types/auth'

type PasswordFieldErrors = {
  password?: string
  confirmPassword?: string
}

function ResetPasswordFormContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')?.trim() ?? ''
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<PasswordFieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const nextErrors: PasswordFieldErrors = {}

    if (!token) {
      setFormError('This password reset link is missing a token. Request a new reset email and try again.')
      return nextErrors
    }

    if (!password.trim()) {
      nextErrors.password = 'New password is required.'
    } else if (password.trim().length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }

    if (!confirmPassword.trim()) {
      nextErrors.confirmPassword = 'Please confirm your new password.'
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Passwords do not match.'
    }

    return nextErrors
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setFormError(null)
    setSuccessMessage(null)

    const nextErrors = validateForm()
    setFieldErrors(nextErrors)

    if (!token || Object.keys(nextErrors).length > 0) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/password-reset/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          new_password: password.trim(),
        }),
      })

      const payload = (await response.json().catch(() => ({
        message: 'Unexpected response from the server.',
      }))) as { message?: string } | ApiErrorResponse

      if (!response.ok) {
        setFormError(payload.message || 'Unable to reset your password right now.')
        return
      }

      setSuccessMessage(
        payload.message || 'Password reset successful. You can now sign in with your new password.'
      )
      setPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('Reset password form error:', error)
      setFormError('Unable to reach the server. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full" noValidate>
      <div className="flex flex-col gap-2">
        <h2 className="font-manrope text-3xl font-extrabold text-[#0B1C30] tracking-[-0.5px]">
          Choose A New Password
        </h2>
        <p className="font-inter text-sm font-normal text-[#64748B]">
          Set a new password for your MyBookIns account and head back into the platform.
        </p>
      </div>

      {formError ? <AuthErrorAlert message={formError} /> : null}

      {successMessage ? (
        <div className="rounded border border-emerald-200 bg-emerald-50 px-4 py-3 font-inter text-sm text-emerald-800">
          {successMessage}
        </div>
      ) : null}

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="reset-password"
            className="font-inter text-[10px] font-black uppercase tracking-[1.2px] text-[#0B1C30]"
          >
            New Password
          </label>
          <input
            id="reset-password"
            name="password"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setFieldErrors((current) => ({ ...current, password: undefined }))
              setFormError(null)
            }}
            autoComplete="new-password"
            disabled={isSubmitting}
            className={`w-full font-inter text-sm font-medium text-[#0B1C30] placeholder:text-[#A0A3AB] bg-white border px-4 py-3.5 outline-none transition-colors ${
              fieldErrors.password
                ? 'border-red-300 focus:border-red-500'
                : 'border-[rgba(198,198,205,0.40)] focus:border-[#0B1C30]'
            } ${isSubmitting ? 'cursor-not-allowed opacity-60' : ''}`}
          />
          {fieldErrors.password ? (
            <p className="font-inter text-xs font-medium text-red-600">{fieldErrors.password}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="reset-confirm-password"
            className="font-inter text-[10px] font-black uppercase tracking-[1.2px] text-[#0B1C30]"
          >
            Confirm Password
          </label>
          <input
            id="reset-confirm-password"
            name="confirm_password"
            type="password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value)
              setFieldErrors((current) => ({ ...current, confirmPassword: undefined }))
              setFormError(null)
            }}
            autoComplete="new-password"
            disabled={isSubmitting}
            className={`w-full font-inter text-sm font-medium text-[#0B1C30] placeholder:text-[#A0A3AB] bg-white border px-4 py-3.5 outline-none transition-colors ${
              fieldErrors.confirmPassword
                ? 'border-red-300 focus:border-red-500'
                : 'border-[rgba(198,198,205,0.40)] focus:border-[#0B1C30]'
            } ${isSubmitting ? 'cursor-not-allowed opacity-60' : ''}`}
          />
          {fieldErrors.confirmPassword ? (
            <p className="font-inter text-xs font-medium text-red-600">{fieldErrors.confirmPassword}</p>
          ) : null}
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitting || !token}
        className={`w-full font-inter text-sm font-black uppercase tracking-[1.4px] text-white py-4 transition-colors shadow-lg ${
          isSubmitting || !token ? 'cursor-not-allowed bg-slate-500' : 'bg-black hover:bg-gray-900'
        }`}
      >
        {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
      </button>

      <div className="flex items-center justify-between gap-4 font-inter text-sm text-[#64748B]">
        <Link href="/forgot-password" className="font-semibold text-[#0B1C30] hover:underline">
          Request New Link
        </Link>
        <Link href="/login" className="font-semibold text-[#0B1C30] hover:underline">
          Back to Login
        </Link>
      </div>
    </form>
  )
}

function ResetPasswordFormFallback() {
  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-col gap-2">
        <div className="h-10 w-52 animate-pulse rounded bg-slate-200" />
        <div className="h-4 w-72 animate-pulse rounded bg-slate-100" />
      </div>
      <div className="h-12 animate-pulse rounded bg-slate-100" />
      <div className="h-12 animate-pulse rounded bg-slate-100" />
      <div className="h-14 animate-pulse rounded bg-slate-200" />
    </div>
  )
}

export default function ResetPasswordForm() {
  return (
    <Suspense fallback={<ResetPasswordFormFallback />}>
      <ResetPasswordFormContent />
    </Suspense>
  )
}
