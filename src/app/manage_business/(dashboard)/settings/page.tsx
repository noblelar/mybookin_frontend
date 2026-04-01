'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from 'react'
import Link from 'next/link'

import ManageBusinessShell from '@/components/manage_business/ManageBusinessShell'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  buildTimezoneGroups,
  dedupeTimezones,
  getSupportedTimezoneValues,
  getTimezoneOptionLabel,
} from '@/lib/timezones'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  Business,
  BusinessListResponse,
  BusinessUpdateSuccessResponse,
  UpdateBusinessRequestPayload,
} from '@/types/business'
import type {
  StaffMember,
  StaffSelfMutationResponse,
  StaffSelfStatusResponse,
} from '@/types/staff'

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

const CATEGORY_OPTIONS = [
  { value: 'BARBER', label: 'Barber' },
  { value: 'HAIR', label: 'Hair' },
  { value: 'NAILS', label: 'Nails' },
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'TUTOR', label: 'Tutor' },
  { value: 'ETC', label: 'Other Services' },
]

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

const normalizeOptionalValue = (value: string) => {
  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}

const getBusinessStatusClassName = (status: string) => {
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

const toFormState = (business: Business): FormState => ({
  name: business.name,
  category: business.category,
  description: business.description ?? '',
  phone: business.phone ?? '',
  email: business.email ?? '',
  addressLine1: business.addressLine1,
  addressLine2: business.addressLine2 ?? '',
  city: business.city,
  postcode: business.postcode,
  timezone: business.timezone,
})

function ManageBusinessSettingsPageContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedBusinessId = searchParams.get('businessId')

  const [businesses, setBusinesses] = useState<Business[]>([])
  const [formState, setFormState] = useState<FormState>(createInitialState)
  const [timezoneOptions, setTimezoneOptions] = useState<string[]>([])
  const [detectedTimezone, setDetectedTimezone] = useState<string | null>(null)
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [ownerStaffMember, setOwnerStaffMember] = useState<StaffMember | null>(null)
  const [isLoadingOwnerStaff, setIsLoadingOwnerStaff] = useState(false)
  const [isSubmittingOwnerStaff, setIsSubmittingOwnerStaff] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const updateSelectedBusinessId = (businessId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('businessId', businessId)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  useEffect(() => {
    const options = getSupportedTimezoneValues()
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone?.trim() || null

    setTimezoneOptions(dedupeTimezones([...options, timezone]))
    setDetectedTimezone(timezone)
  }, [])

  useEffect(() => {
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
  }, [])

  useEffect(() => {
    if (!businesses.length) return

    const hasValidSelectedBusiness = selectedBusinessId
      ? businesses.some((business) => business.id === selectedBusinessId)
      : false

    if (!hasValidSelectedBusiness) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('businessId', businesses[0].id)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }, [businesses, pathname, router, searchParams, selectedBusinessId])

  const selectedBusiness = useMemo(() => {
    return businesses.find((business) => business.id === selectedBusinessId) ?? businesses[0] ?? null
  }, [businesses, selectedBusinessId])

  useEffect(() => {
    if (!selectedBusiness) return

    setFormState(toFormState(selectedBusiness))
    setSuccessMessage(null)
  }, [selectedBusiness])

  useEffect(() => {
    if (!selectedBusiness) {
      setOwnerStaffMember(null)
      return
    }

    let ignore = false

    async function loadOwnerStaffMembership() {
      setIsLoadingOwnerStaff(true)

      try {
        const response = await fetch(`/api/businesses/${selectedBusiness.id}/staff-members/self`, {
          method: 'GET',
          cache: 'no-store',
        })

        const payload = (await response.json()) as StaffSelfStatusResponse | ApiErrorResponse
        if (ignore) return

        if (!response.ok) {
          setErrorMessage(
            getApiErrorMessage(payload, 'We could not load owner staff membership right now.')
          )
          setOwnerStaffMember(null)
          return
        }

        setOwnerStaffMember((payload as StaffSelfStatusResponse).staffMember)
      } catch {
        if (!ignore) {
          setErrorMessage('We could not load owner staff membership right now.')
          setOwnerStaffMember(null)
        }
      } finally {
        if (!ignore) setIsLoadingOwnerStaff(false)
      }
    }

    void loadOwnerStaffMembership()

    return () => {
      ignore = true
    }
  }, [selectedBusiness])

  const timezoneGroups = useMemo(() => {
    return buildTimezoneGroups(timezoneOptions, detectedTimezone, formState.timezone)
  }, [detectedTimezone, formState.timezone, timezoneOptions])
  const staffWorkspaceHref = selectedBusiness
    ? `/manage_business/staff?businessId=${selectedBusiness.id}`
    : '/manage_business/staff'

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

      const updatedBusiness = (result as BusinessUpdateSuccessResponse).business
      setBusinesses((currentBusinesses) =>
        currentBusinesses.map((business) =>
          business.id === updatedBusiness.id ? updatedBusiness : business
        )
      )
      setSuccessMessage('Business settings saved successfully.')
    } catch {
      setErrorMessage('We could not save your business right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleOwnerStaffAction(method: 'POST' | 'DELETE') {
    if (!selectedBusiness) return

    setErrorMessage(null)
    setSuccessMessage(null)
    setIsSubmittingOwnerStaff(true)

    try {
      const response = await fetch(`/api/businesses/${selectedBusiness.id}/staff-members/self`, {
        method,
      })

      const payload = (await response.json()) as StaffSelfMutationResponse | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(
          getApiErrorMessage(payload, 'We could not update owner staff membership right now.')
        )
        return
      }

      const result = payload as StaffSelfMutationResponse
      setOwnerStaffMember(result.staffMember)
      setSuccessMessage(result.message)
    } catch {
      setErrorMessage('We could not update owner staff membership right now.')
    } finally {
      setIsSubmittingOwnerStaff(false)
    }
  }

  const ownerStaffActionLabel = ownerStaffMember
    ? ownerStaffMember.isActive
      ? 'Remove me as staff'
      : 'Add me back as staff'
    : 'Add me as staff'

  const ownerStaffActionMethod: 'POST' | 'DELETE' =
    ownerStaffMember?.isActive ? 'DELETE' : 'POST'

  return (
    <ManageBusinessShell activeNav="/manage_business/settings" topBarTab="audit">
      {errorMessage ? (
        <Alert variant="destructive" className="mb-6 rounded-2xl">
          <AlertTitle>Settings issue</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {successMessage ? (
        <Alert className="mb-6 rounded-2xl">
          <AlertTitle>Changes saved</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      ) : null}

      {isLoadingBusinesses ? (
        <div className="grid gap-6">
          <div className="h-40 animate-pulse rounded-[28px] bg-white" />
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="h-[520px] animate-pulse rounded-[28px] bg-white" />
            <div className="h-[320px] animate-pulse rounded-[28px] bg-white" />
          </div>
        </div>
      ) : !businesses.length ? (
        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
            Tenant Settings
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
            No business selected
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
            Create your first business entry before editing business identity, contact details, and
            scheduling parameters.
          </p>
        </section>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <form
            onSubmit={handleSubmit}
            className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8"
          >
            <div className="flex flex-col gap-5 border-b border-slate-100 pb-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Tenant Settings
                  </p>
                  <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
                    {selectedBusiness?.name}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
                    Update the business identity, contact details, address, and timezone used by the
                    owner workspace and customer-facing scheduling flows.
                  </p>
                </div>

                <div className="grid gap-3 sm:min-w-[280px]">
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Active business
                    <select
                      value={selectedBusiness?.id ?? ''}
                      onChange={(event) => updateSelectedBusinessId(event.target.value)}
                      className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                    >
                      {businesses.map((business) => (
                        <option key={business.id} value={business.id}>
                          {business.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  {selectedBusiness ? (
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getBusinessStatusClassName(
                          selectedBusiness.status
                        )}`}
                      >
                        {selectedBusiness.status}
                      </span>
                      <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                        {selectedBusiness.category}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
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

            <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-xl text-sm leading-relaxed text-slate-500">
                These settings control what customers see and how booking times are interpreted for
                this business.
              </p>

              <button
                type="submit"
                disabled={isSubmitting || !selectedBusiness}
                className="inline-flex h-12 items-center justify-center rounded-full bg-[#0B1C30] px-6 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? 'Saving changes...' : 'Commit changes'}
              </button>
            </div>
          </form>

          <aside className="grid gap-6 self-start">
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                Owner scheduling access
              </p>
              <div className="mt-4 grid gap-3 text-sm leading-relaxed text-slate-500">
                <p>
                  Add yourself as staff if you want customers to book time with you directly.
                  Removing yourself here deactivates your staff profile and clears service
                  assignments, while keeping historical records intact.
                </p>

                {isLoadingOwnerStaff ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                    Checking owner staff status...
                  </div>
                ) : ownerStaffMember ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-[#0B1C30]">
                        {ownerStaffMember.displayName}
                      </p>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          ownerStaffMember.isActive
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {ownerStaffMember.isActive ? 'Active staff' : 'Inactive staff'}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">{ownerStaffMember.roleTitle}</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                    You are not currently listed as staff for this business.
                  </div>
                )}
              </div>

              <div className="mt-5 grid gap-3">
                <button
                  type="button"
                  onClick={() => handleOwnerStaffAction(ownerStaffActionMethod)}
                  disabled={isSubmittingOwnerStaff || isLoadingOwnerStaff || !selectedBusiness}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmittingOwnerStaff ? 'Updating...' : ownerStaffActionLabel}
                </button>
                <Link
                  href={staffWorkspaceHref}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50"
                >
                  Open staff workspace
                </Link>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                Configuration notes
              </p>
              <div className="mt-4 grid gap-3 text-sm leading-relaxed text-slate-500">
                <p>
                  Required fields mirror the backend validation rules, so saving here keeps the
                  business profile aligned with the owner onboarding flow.
                </p>
                <p>
                  Timezone changes affect how booking times are displayed and interpreted in the owner
                  workspace.
                </p>
                <p>
                  Status remains read-only here and should continue to be controlled by the approval
                  workflow.
                </p>
              </div>
            </section>

            {selectedBusiness ? (
              <section className="rounded-[28px] border border-slate-200 bg-[#EFF4FF] p-6 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                  Business snapshot
                </p>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Status
                    </p>
                    <span
                      className={`mt-2 inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getBusinessStatusClassName(
                        selectedBusiness.status
                      )}`}
                    >
                      {selectedBusiness.status}
                    </span>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Created
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#0B1C30]">
                      {new Date(selectedBusiness.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Last updated
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#0B1C30]">
                      {new Date(selectedBusiness.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </section>
            ) : null}
          </aside>
        </div>
      )}
    </ManageBusinessShell>
  )
}

function ManageBusinessSettingsPageFallback() {
  return (
    <div className="min-h-screen bg-[#F1F5F9] p-5 md:p-6">
      <div className="grid gap-6">
        <div className="h-40 animate-pulse rounded-[28px] bg-white" />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="h-[520px] animate-pulse rounded-[28px] bg-white" />
          <div className="h-[320px] animate-pulse rounded-[28px] bg-white" />
        </div>
      </div>
    </div>
  )
}

export default function ManageBusinessSettingsPage() {
  return (
    <Suspense fallback={<ManageBusinessSettingsPageFallback />}>
      <ManageBusinessSettingsPageContent />
    </Suspense>
  )
}
