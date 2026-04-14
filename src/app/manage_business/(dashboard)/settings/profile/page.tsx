'use client'

import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useManageBusinessSettingsContext } from '@/context/ManageBusinessSettingsContext'
import {
  buildTimezoneGroups,
  dedupeTimezones,
  getSupportedTimezoneValues,
  getTimezoneOptionLabel,
} from '@/lib/timezones'
import { getApiErrorMessage } from '@/lib/utils'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  BusinessUpdateSuccessResponse,
  UpdateBusinessRequestPayload,
} from '@/types/business'
import {
  createInitialSettingsFormState,
  normalizeOptionalValue,
  SETTINGS_CATEGORY_OPTIONS,
  toSettingsFormState,
  type SettingsFormState,
} from '@/components/manage_business/settings/settings-utils'

export default function ManageBusinessSettingsProfilePage() {
  const { selectedBusiness } = useManageBusinessSettingsContext()

  const [formState, setFormState] = useState<SettingsFormState>(createInitialSettingsFormState)
  const [timezoneOptions, setTimezoneOptions] = useState<string[]>([])
  const [detectedTimezone, setDetectedTimezone] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const options = getSupportedTimezoneValues()
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone?.trim() || null

    setTimezoneOptions(dedupeTimezones([...options, timezone]))
    setDetectedTimezone(timezone)
  }, [])

  useEffect(() => {
    if (!selectedBusiness) {
      setFormState(createInitialSettingsFormState())
      return
    }

    setFormState(toSettingsFormState(selectedBusiness))
    setSuccessMessage(null)
    setErrorMessage(null)
  }, [selectedBusiness])

  const timezoneGroups = useMemo(() => {
    return buildTimezoneGroups(timezoneOptions, detectedTimezone, formState.timezone)
  }, [detectedTimezone, formState.timezone, timezoneOptions])

  const handleFieldChange =
    (field: keyof SettingsFormState) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setFormState((currentValue) => ({
        ...currentValue,
        [field]: event.target.value,
      }))
    }

  const handleUseDetectedTimezone = () => {
    if (!detectedTimezone) return

    setFormState((currentValue) => ({
      ...currentValue,
      timezone: detectedTimezone,
    }))
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedBusiness) return

    setErrorMessage(null)
    setSuccessMessage(null)
    setIsSubmitting(true)

    const payload: UpdateBusinessRequestPayload = {
      name: formState.name.trim(),
      category: formState.category,
      description: normalizeOptionalValue(formState.description),
      phone: normalizeOptionalValue(formState.phone),
      email: normalizeOptionalValue(formState.email),
      address_line1: formState.addressLine1.trim(),
      address_line2: normalizeOptionalValue(formState.addressLine2),
      city: formState.city.trim(),
      postcode: formState.postcode.trim(),
      timezone: formState.timezone.trim(),
    }

    try {
      const response = await fetch(`/api/businesses/${selectedBusiness.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = (await response.json()) as BusinessUpdateSuccessResponse | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(result, 'We could not save your business right now.'))
        return
      }

      setSuccessMessage('Business profile saved successfully.')
    } catch {
      setErrorMessage('We could not save your business right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!selectedBusiness) return null

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <form
        onSubmit={handleSubmit}
        className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8"
      >
        {errorMessage ? (
          <Alert variant="destructive" className="mb-6 rounded-2xl">
            <AlertTitle>Profile issue</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        {successMessage ? (
          <Alert className="mb-6 rounded-2xl">
            <AlertTitle>Profile saved</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        ) : null}

        <div className="border-b border-slate-100 pb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
            Profile
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">
            Business identity and contact
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
            Update the public business profile used by discovery, customer booking, and owner-facing
            references across the platform.
          </p>
        </div>

        <div className="mt-6 grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Business name
              <input
                required
                value={formState.name}
                onChange={handleFieldChange('name')}
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Category
              <select
                required
                value={formState.category}
                onChange={handleFieldChange('category')}
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
              >
                {SETTINGS_CATEGORY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="grid gap-2 text-sm font-medium text-slate-700">
            Description
            <textarea
              value={formState.description}
              onChange={handleFieldChange('description')}
              rows={4}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
            />
          </label>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Contact email
              <input
                type="email"
                value={formState.email}
                onChange={handleFieldChange('email')}
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Contact phone
              <input
                value={formState.phone}
                onChange={handleFieldChange('phone')}
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
              Address line 1
              <input
                required
                value={formState.addressLine1}
                onChange={handleFieldChange('addressLine1')}
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
              Address line 2
              <input
                value={formState.addressLine2}
                onChange={handleFieldChange('addressLine2')}
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              City
              <input
                required
                value={formState.city}
                onChange={handleFieldChange('city')}
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700">
              Postcode
              <input
                required
                value={formState.postcode}
                onChange={handleFieldChange('postcode')}
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm uppercase text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
              />
            </label>

            <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
              Timezone
              <select
                required
                value={formState.timezone}
                onChange={handleFieldChange('timezone')}
                className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
              >
                {!formState.timezone ? (
                  <option value="" disabled>
                    Select a timezone
                  </option>
                ) : null}
                {timezoneGroups.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.values.map((timezone) => (
                      <option key={timezone} value={timezone}>
                        {getTimezoneOptionLabel(timezone)}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-relaxed text-slate-500">
                  {detectedTimezone
                    ? `Detected from this device: ${detectedTimezone}. Change it if the business operates elsewhere.`
                    : 'Choose the timezone used by this business for availability and booking times.'}
                </p>
                {detectedTimezone && formState.timezone !== detectedTimezone ? (
                  <button
                    type="button"
                    onClick={handleUseDetectedTimezone}
                    className="inline-flex h-9 items-center justify-center rounded-full border border-slate-200 px-3 text-xs font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50"
                  >
                    Use current timezone
                  </button>
                ) : null}
              </div>
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end border-t border-slate-100 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#0B1C30] px-6 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Saving profile...' : 'Save profile'}
          </button>
        </div>
      </form>

      <aside className="grid gap-6 self-start">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
            Profile notes
          </p>
          <div className="mt-4 grid gap-3 text-sm leading-relaxed text-slate-500">
            <p>
              These fields drive the identity customers see across discovery, business detail, and
              booking pages.
            </p>
            <p>
              Timezone changes affect how appointment times are interpreted across owner and customer
              flows.
            </p>
            <p>
              Moderation status remains read-only here and is still controlled by the admin approval
              workflow.
            </p>
          </div>
        </section>
      </aside>
    </div>
  )
}
