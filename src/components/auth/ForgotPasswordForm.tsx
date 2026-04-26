'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { FormEvent } from 'react'

import AuthErrorAlert from '@/components/auth/AuthErrorAlert'
import type { ApiErrorResponse } from '@/types/auth'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [fieldError, setFieldError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateEmail = () => {
    const trimmedEmail = email.trim()
    if (!trimmedEmail) {
      return 'Email address is required.'
    }

    if (!emailPattern.test(trimmedEmail)) {
      return 'Enter a valid email address.'
    }

    return null
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextError = validateEmail()
    setFieldError(nextError)
    setFormError(null)
    setSuccessMessage(null)

    if (nextError) {
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch('/api/auth/password-reset/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      })

      const payload = (await response.json().catch(() => ({
        message: 'Unexpected response from the server.',
      }))) as { message?: string } | ApiErrorResponse

      if (!response.ok) {
        setFormError(payload.message || 'Unable to request a password reset right now.')
        return
      }

      setSuccessMessage(
        payload.message || 'If an account with that email exists, a password reset link has been sent.'
      )
    } catch (error) {
      console.error('Forgot password form error:', error)
      setFormError('Unable to reach the server. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full" noValidate>
      <div className="flex flex-col gap-2">
        <h2 className="font-manrope text-3xl font-extrabold text-[#0B1C30] tracking-[-0.5px]">
          Reset Your Password
        </h2>
        <p className="font-inter text-sm font-normal text-[#64748B]">
          Enter the email address you use on MyBookIns and we&apos;ll send you a secure reset link.
        </p>
      </div>

      {formError ? <AuthErrorAlert message={formError} /> : null}

      {successMessage ? (
        <div className="rounded border border-emerald-200 bg-emerald-50 px-4 py-3 font-inter text-sm text-emerald-800">
          {successMessage}
        </div>
      ) : null}

      <div className="flex flex-col gap-2">
        <label
          htmlFor="forgot-password-email"
          className="font-inter text-[10px] font-black uppercase tracking-[1.2px] text-[#0B1C30]"
        >
          Email Address
        </label>
        <input
          id="forgot-password-email"
          name="email"
          type="email"
          value={email}
          onChange={(event) => {
            setEmail(event.target.value)
            setFieldError(null)
            setFormError(null)
          }}
          autoComplete="email"
          placeholder="e.g., alex@email.com"
          aria-invalid={Boolean(fieldError)}
          disabled={isSubmitting}
          className={`w-full font-inter text-sm font-medium text-[#0B1C30] placeholder:text-[#A0A3AB] bg-white border px-4 py-3.5 outline-none transition-colors ${
            fieldError
              ? 'border-red-300 focus:border-red-500'
              : 'border-[rgba(198,198,205,0.40)] focus:border-[#0B1C30]'
          } ${isSubmitting ? 'cursor-not-allowed opacity-60' : ''}`}
        />
        {fieldError ? (
          <p className="font-inter text-xs font-medium text-red-600">{fieldError}</p>
        ) : null}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full font-inter text-sm font-black uppercase tracking-[1.4px] text-white py-4 transition-colors shadow-lg ${
          isSubmitting ? 'cursor-not-allowed bg-slate-500' : 'bg-black hover:bg-gray-900'
        }`}
      >
        {isSubmitting ? 'Sending Reset Link...' : 'Send Reset Link'}
      </button>

      <div className="flex items-center justify-between gap-4 font-inter text-sm text-[#64748B]">
        <Link href="/login" className="font-semibold text-[#0B1C30] hover:underline">
          Back to Login
        </Link>
        <Link href="/register" className="font-semibold text-[#0B1C30] hover:underline">
          Create Account
        </Link>
      </div>
    </form>
  )
}
