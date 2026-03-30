'use client'

import type { FormEvent } from 'react'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import AuthErrorAlert from '@/components/auth/AuthErrorAlert'
import FormInput from './FormInput'
import PasswordInput from './PasswordInput'
import SocialAuthButton from './SocialAuthButton'
import { useAuthContext } from '@/context/AuthContext'
import type { ApiErrorResponse, AuthActionSuccessResponse } from '@/types/auth'

type RegisterFormState = {
  firstName: string
  lastName: string
  email: string
  phone: string
  password: string
}

type RegisterFieldErrors = Partial<Record<keyof RegisterFormState, string>>

const initialFormState: RegisterFormState = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function AccountDetailsForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { setLoading, setSession } = useAuthContext()
  const [isPending, startTransition] = useTransition()
  const [formState, setFormState] = useState<RegisterFormState>(initialFormState)
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const returnUrl = searchParams.get('returnUrl')
  const loginHref = returnUrl ? `/login?returnUrl=${encodeURIComponent(returnUrl)}` : '/login'

  const isBusy = isSubmitting || isPending

  const updateField = (field: keyof RegisterFormState, value: string) => {
    setFormState((current) => ({ ...current, [field]: value }))
    setFieldErrors((current) => ({ ...current, [field]: undefined }))
    setFormError(null)
  }

  const validateForm = () => {
    const nextErrors: RegisterFieldErrors = {}

    if (!formState.firstName.trim()) nextErrors.firstName = 'First name is required.'
    if (!formState.lastName.trim()) nextErrors.lastName = 'Last name is required.'
    if (!formState.email.trim()) {
      nextErrors.email = 'Email address is required.'
    } else if (!emailPattern.test(formState.email.trim())) {
      nextErrors.email = 'Enter a valid email address.'
    }
    if (!formState.password.trim()) {
      nextErrors.password = 'Password is required.'
    } else if (formState.password.trim().length < 6) {
      nextErrors.password = 'Password must be at least 6 characters.'
    }

    return nextErrors
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
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: formState.firstName.trim(),
          last_name: formState.lastName.trim(),
          email: formState.email.trim(),
          phone: formState.phone.trim() ? formState.phone.trim() : null,
          password: formState.password,
          returnUrl: returnUrl ?? undefined,
        }),
      })

      const payload = (await response.json().catch(() => ({
        message: 'Unexpected response from the server.',
      }))) as AuthActionSuccessResponse | ApiErrorResponse

      if (!response.ok) {
        setFormError(payload.message || 'Unable to create your account right now.')
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
      console.error('Register form error:', error)
      setFormError('Unable to reach the server. Please try again.')
    } finally {
      setIsSubmitting(false)
      if (!keepLoaderVisible) {
        setLoading(false)
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full" noValidate>
      {formError ? <AuthErrorAlert message={formError} /> : null}

      <div className="flex flex-col sm:flex-row gap-4">
        <FormInput
          id="first-name"
          name="first_name"
          label="First Name"
          placeholder="e.g. Julian"
          value={formState.firstName}
          onChange={(event) => updateField('firstName', event.target.value)}
          autoComplete="given-name"
          required
          error={fieldErrors.firstName}
          disabled={isBusy}
        />
        <FormInput
          id="last-name"
          name="last_name"
          label="Last Name"
          placeholder="e.g. Vane"
          value={formState.lastName}
          onChange={(event) => updateField('lastName', event.target.value)}
          autoComplete="family-name"
          required
          error={fieldErrors.lastName}
          disabled={isBusy}
        />
      </div>

      <FormInput
        id="email"
        name="email"
        label="Email Address"
        type="email"
        placeholder="julian.vane@architect.com"
        value={formState.email}
        onChange={(event) => updateField('email', event.target.value)}
        autoComplete="email"
        required
        error={fieldErrors.email}
        disabled={isBusy}
      />

      <FormInput
        id="phone"
        name="phone"
        label="Phone Number"
        type="tel"
        placeholder="+44 (0) 7700 900000"
        value={formState.phone}
        onChange={(event) => updateField('phone', event.target.value)}
        autoComplete="tel"
        disabled={isBusy}
      />

      <PasswordInput
        id="password"
        name="password"
        label="Create Password"
        placeholder="Min. 6 characters"
        value={formState.password}
        onChange={(event) => updateField('password', event.target.value)}
        autoComplete="new-password"
        required
        error={fieldErrors.password}
        disabled={isBusy}
      />

      <button
        type="submit"
        disabled={isBusy}
        className={`w-full font-inter text-sm font-black uppercase tracking-[1.4px] text-white py-4 transition-colors shadow-xl ${
          isBusy ? 'cursor-not-allowed bg-slate-500' : 'bg-black hover:bg-gray-900'
        }`}
      >
        {isBusy ? 'Initializing Account...' : 'Initialize Account'}
      </button>

      <p className="font-inter text-sm font-normal text-[#64748B] text-center">
        Already have an account?{' '}
        <Link href={loginHref} className="font-bold text-[#0B1C30] hover:underline">
          Sign In
        </Link>
      </p>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-[rgba(198,198,205,0.40)]" />
        <span className="font-inter text-[10px] font-black uppercase tracking-[1.4px] text-[#76777D]">
          Or Continue With
        </span>
        <div className="flex-1 h-px bg-[rgba(198,198,205,0.40)]" />
      </div>

      <div className="flex gap-3">
        <SocialAuthButton provider="google" disabled={isBusy} />
        <SocialAuthButton provider="apple" disabled={isBusy} />
      </div>
    </form>
  )
}
