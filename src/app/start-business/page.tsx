'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'

import CustomerTopBar from '@/components/customer/CustomerTopBar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useAuthContext } from '@/context/AuthContext'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  Business,
  BusinessListResponse,
  CreateBusinessRequestPayload,
  CreateBusinessSuccessResponse,
} from '@/types/business'

type FormState = {
  name: string
  category: string
  description: string
  phone: string
  email: string
  addressLine1: string
  addressLine2: string
  city: string
  postcode: string
  timezone: string
}

type TimezoneGroup = {
  label: string
  values: string[]
}

const CATEGORY_OPTIONS = [
  { value: 'BARBER', label: 'Barber' },
  { value: 'HAIR', label: 'Hair' },
  { value: 'NAILS', label: 'Nails' },
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'TUTOR', label: 'Tutor' },
  { value: 'ETC', label: 'Other Services' },
]

const COMMON_TIMEZONES = [
  'UTC',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Africa/Lagos',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
]

const FALLBACK_TIMEZONES = [
  'UTC',
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Africa/Lagos',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/New_York',
  'America/Phoenix',
  'Asia/Bangkok',
  'Asia/Dubai',
  'Asia/Hong_Kong',
  'Asia/Jakarta',
  'Asia/Kolkata',
  'Asia/Seoul',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Melbourne',
  'Australia/Perth',
  'Australia/Sydney',
  'Europe/Amsterdam',
  'Europe/Berlin',
  'Europe/Dublin',
  'Europe/Lisbon',
  'Europe/London',
  'Europe/Madrid',
  'Europe/Paris',
  'Pacific/Auckland',
]

const TIMEZONE_REGION_LABELS: Record<string, string> = {
  Africa: 'Africa',
  America: 'Americas',
  Antarctica: 'Antarctica',
  Arctic: 'Arctic',
  Asia: 'Asia',
  Atlantic: 'Atlantic',
  Australia: 'Australia',
  Europe: 'Europe',
  Indian: 'Indian Ocean',
  Pacific: 'Pacific',
  UTC: 'UTC',
}

const createInitialState = (): FormState => ({
  name: '',
  category: 'BARBER',
  description: '',
  phone: '',
  email: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  postcode: '',
  timezone: '',
})

const normalizeOptionalValue = (value: string) => {
  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}

const getStatusLabelClassName = (status: string) => {
  switch (status.toUpperCase()) {
    case 'ACTIVE':
      return 'border-emerald-200 bg-emerald-50 text-emerald-700'
    case 'PENDING':
      return 'border-amber-200 bg-amber-50 text-amber-700'
    case 'SUSPENDED':
      return 'border-red-200 bg-red-50 text-red-700'
    default:
      return 'border-slate-200 bg-slate-50 text-slate-600'
  }
}

const getApiErrorMessage = (payload: unknown, fallback: string) => {
  if (
    typeof payload === 'object' &&
    payload !== null &&
    'message' in payload &&
    typeof payload.message === 'string' &&
    payload.message.trim().length
  ) {
    return payload.message
  }

  if (
    typeof payload === 'object' &&
    payload !== null &&
    'error' in payload &&
    typeof payload.error === 'string' &&
    payload.error.trim().length
  ) {
    return payload.error
  }

  return fallback
}

const sortTimezones = (timezones: readonly string[]) => {
  return [...timezones].sort((leftValue, rightValue) => leftValue.localeCompare(rightValue))
}

const dedupeTimezones = (timezones: readonly (string | null | undefined)[]) => {
  return sortTimezones(
    [...new Set(timezones.map((timezone) => timezone?.trim()).filter(Boolean) as string[])]
  )
}

const getSupportedTimezoneValues = () => {
  try {
    const intlWithSupportedValues = Intl as typeof Intl & {
      supportedValuesOf?: (key: 'timeZone') => string[]
    }

    const timezones = intlWithSupportedValues.supportedValuesOf?.('timeZone')
    if (Array.isArray(timezones) && timezones.length > 0) {
      return dedupeTimezones(timezones)
    }
  } catch {
    // Fall through to the curated fallback list.
  }

  return dedupeTimezones(FALLBACK_TIMEZONES)
}

const getTimezoneRegion = (timezone: string) => {
  return timezone.split('/')[0] ?? 'Other'
}

const getTimezoneOptionLabel = (timezone: string) => {
  const parts = timezone.split('/')
  if (parts.length <= 1) {
    return timezone.replaceAll('_', ' ')
  }

  return parts.slice(1).join(' / ').replaceAll('_', ' ')
}

const buildTimezoneGroups = (
  options: readonly string[],
  detectedTimezone: string | null,
  selectedTimezone: string
) => {
  const normalizedOptions = dedupeTimezones([
    ...options,
    detectedTimezone,
    selectedTimezone,
  ])

  const commonTimezoneSet = new Set(COMMON_TIMEZONES)
  const currentTimezoneValues = detectedTimezone ? [detectedTimezone] : []
  const commonTimezoneValues = normalizedOptions.filter(
    (timezone) => timezone !== detectedTimezone && commonTimezoneSet.has(timezone)
  )

  const groupedByRegion = new Map<string, string[]>()

  normalizedOptions.forEach((timezone) => {
    if (timezone === detectedTimezone || commonTimezoneSet.has(timezone)) {
      return
    }

    const region = getTimezoneRegion(timezone)
    const regionValues = groupedByRegion.get(region) ?? []
    regionValues.push(timezone)
    groupedByRegion.set(region, regionValues)
  })

  const groups: TimezoneGroup[] = []

  if (currentTimezoneValues.length > 0) {
    groups.push({ label: 'Current device timezone', values: currentTimezoneValues })
  }

  if (commonTimezoneValues.length > 0) {
    groups.push({ label: 'Common timezones', values: commonTimezoneValues })
  }

  const regionalGroups = [...groupedByRegion.entries()]
    .sort(([leftRegion], [rightRegion]) => leftRegion.localeCompare(rightRegion))
    .map(([region, values]) => ({
      label: TIMEZONE_REGION_LABELS[region] ?? region,
      values: sortTimezones(values),
    }))

  return [...groups, ...regionalGroups]
}

export default function StartBusinessPage() {
  const router = useRouter()
  const { hasHydrated, session, setSession } = useAuthContext()
  const [formState, setFormState] = useState<FormState>(createInitialState)
  const [timezoneOptions, setTimezoneOptions] = useState<string[]>(() =>
    dedupeTimezones(FALLBACK_TIMEZONES)
  )
  const [detectedTimezone, setDetectedTimezone] = useState<string | null>(null)
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    const options = getSupportedTimezoneValues()
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone?.trim() || null
    const normalizedOptions = dedupeTimezones([...options, timezone])

    setTimezoneOptions(normalizedOptions)
    setDetectedTimezone(timezone)
    setFormState((currentValue) => ({
      ...currentValue,
      timezone: currentValue.timezone || timezone || normalizedOptions[0] || '',
    }))
  }, [])

  useEffect(() => {
    if (!hasHydrated || !session) {
      return
    }

    let ignore = false

    async function loadBusinesses() {
      setIsLoadingBusinesses(true)

      try {
        const response = await fetch('/api/businesses', {
          method: 'GET',
          cache: 'no-store',
        })

        const payload = (await response.json()) as BusinessListResponse | ApiErrorResponse
        if (ignore) return

        if (!response.ok) {
          setErrorMessage(getApiErrorMessage(payload, 'We could not load your businesses right now.'))
          setBusinesses([])
          return
        }

        setBusinesses((payload as BusinessListResponse).businesses)
      } catch {
        if (!ignore) {
          setErrorMessage('We could not load your businesses right now.')
          setBusinesses([])
        }
      } finally {
        if (!ignore) {
          setIsLoadingBusinesses(false)
        }
      }
    }

    void loadBusinesses()

    return () => {
      ignore = true
    }
  }, [hasHydrated, session])

  const hasOwnerRole = useMemo(() => {
    return session?.user.roles.some((role) => role.toUpperCase() === 'BUSINESS_OWNER') ?? false
  }, [session])

  const introTitle = hasOwnerRole ? 'Add another business' : 'Become a business owner'
  const introDescription = hasOwnerRole
    ? 'Create another location or brand under your account. We will refresh your session and keep your owner access in sync.'
    : 'Set up your business profile, upgrade into owner mode, and unlock the management dashboard in one flow.'

  const infoTitle = businesses.length
    ? 'Your current businesses'
    : 'What happens next'

  const infoDescription = businesses.length
    ? 'You already have owner access. You can still create another business below, or jump straight into the management dashboard.'
    : 'New businesses can stay pending while you finish setup and wait for activation. Once approved, they can be listed publicly in discovery.'

  const timezoneGroups = useMemo(() => {
    return buildTimezoneGroups(timezoneOptions, detectedTimezone, formState.timezone)
  }, [detectedTimezone, formState.timezone, timezoneOptions])

  const handleFieldChange =
    (field: keyof FormState) =>
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
    setErrorMessage(null)
    setIsSubmitting(true)

    const payload: CreateBusinessRequestPayload = {
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
      const response = await fetch('/api/businesses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = (await response.json()) as CreateBusinessSuccessResponse | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(result, 'We could not create your business right now.'))
        return
      }

      const successPayload = result as CreateBusinessSuccessResponse
      setSession(successPayload.session)
      router.replace(successPayload.redirectTo)
      router.refresh()
    } catch {
      setErrorMessage('We could not create your business right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <CustomerTopBar />

      <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
        <section className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
              Owner Onboarding
            </p>
            <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
              {introTitle}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
              {introDescription}
            </p>

            {!hasHydrated || !session ? (
              <div className="mt-8 h-40 animate-pulse rounded-3xl bg-slate-100" />
            ) : (
              <>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                    Signed in as {session.user.email}
                  </span>
                  <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                    Roles: {session.user.roles.join(', ')}
                  </span>
                </div>

                <Alert className="mt-6">
                  <AlertTitle>Immediate owner access</AlertTitle>
                  <AlertDescription>
                    When this form succeeds, your session will be refreshed with the updated role so
                    you can enter the business dashboard right away.
                  </AlertDescription>
                </Alert>

                {errorMessage ? (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTitle>Unable to continue</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                ) : null}

                <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
                  <div className="grid gap-5 md:grid-cols-2">
                    <label className="grid gap-2 text-sm font-medium text-slate-700">
                      Business name
                      <input
                        required
                        value={formState.name}
                        onChange={handleFieldChange('name')}
                        className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                        placeholder="Meridian Studio"
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
                        {CATEGORY_OPTIONS.map((option) => (
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
                      placeholder="Tell customers what makes your business special."
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
                        placeholder="hello@meridianstudio.com"
                      />
                    </label>

                    <label className="grid gap-2 text-sm font-medium text-slate-700">
                      Contact phone
                      <input
                        value={formState.phone}
                        onChange={handleFieldChange('phone')}
                        className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                        placeholder="+44 0000 000 000"
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
                        placeholder="221B Baker Street"
                      />
                    </label>

                    <label className="grid gap-2 text-sm font-medium text-slate-700 md:col-span-2">
                      Address line 2
                      <input
                        value={formState.addressLine2}
                        onChange={handleFieldChange('addressLine2')}
                        className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                        placeholder="Floor, suite, or landmark"
                      />
                    </label>

                    <label className="grid gap-2 text-sm font-medium text-slate-700">
                      City
                      <input
                        required
                        value={formState.city}
                        onChange={handleFieldChange('city')}
                        className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                        placeholder="London"
                      />
                    </label>

                    <label className="grid gap-2 text-sm font-medium text-slate-700">
                      Postcode
                      <input
                        required
                        value={formState.postcode}
                        onChange={handleFieldChange('postcode')}
                        className="h-12 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm uppercase text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                        placeholder="NW1 6XE"
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
                            ? `Detected from this device: ${detectedTimezone}. Change it if the business runs in a different timezone.`
                            : 'Choose the timezone your business operates in. This controls scheduling and availability.'}
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

                  <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <p className="max-w-xl text-sm leading-relaxed text-slate-500">
                      By continuing, we will create your business profile, refresh your auth session,
                      and move you into the owner dashboard.
                    </p>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex h-12 items-center justify-center rounded-full bg-[#0B1C30] px-6 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isSubmitting ? 'Creating business...' : 'Create business'}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          <aside className="space-y-6">
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                {infoTitle}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{infoDescription}</p>

              {isLoadingBusinesses ? (
                <div className="mt-5 space-y-3">
                  <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                  <div className="h-24 animate-pulse rounded-2xl bg-slate-100" />
                </div>
              ) : businesses.length ? (
                <div className="mt-5 space-y-3">
                  {businesses.map((business) => (
                    <div
                      key={business.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#0B1C30]">{business.name}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {business.city}, {business.postcode}
                          </p>
                        </div>
                        <span
                          className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${getStatusLabelClassName(
                            business.status
                          )}`}
                        >
                          {business.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
                  No businesses yet. The first one you create here will upgrade your session into
                  owner mode automatically.
                </div>
              )}

              <div className="mt-5 flex flex-wrap gap-3">
                {hasOwnerRole ? (
                  <Link
                    href="/manage_business"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50"
                  >
                    Open dashboard
                  </Link>
                ) : null}
                <Link
                  href="/discover"
                  className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                >
                  Back to discover
                </Link>
              </div>
            </section>
          </aside>
        </section>
      </main>
    </div>
  )
}
