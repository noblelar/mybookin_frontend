'use client'

import Link from 'next/link'
import { Suspense, useEffect, useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

import ManageBusinessShell from '@/components/manage_business/ManageBusinessShell'
import { buildDashboardSubNavItems } from '@/components/manage_business/workspace/dashboard-navigation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import type { ApiErrorResponse } from '@/types/auth'
import type { Booking, BusinessBookingsResponse } from '@/types/booking'
import type { Business, BusinessListResponse } from '@/types/business'

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

const formatBookingDateTime = (value: string, timezone: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  try {
    return new Intl.DateTimeFormat('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: timezone,
    }).format(date)
  } catch {
    return date.toLocaleString()
  }
}

const getCustomerDisplayName = (booking: Booking) => {
  const fullName = `${booking.customerFirstName} ${booking.customerLastName}`.trim()
  return fullName || booking.customerEmail
}

const getChecklistStatusClassName = (complete: boolean) =>
  complete ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'

function ManageBusinessReadinessPageContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedBusinessId = searchParams.get('businessId')

  const [businesses, setBusinesses] = useState<Business[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true)
  const [isLoadingBookings, setIsLoadingBookings] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const updateSelectedBusinessId = (businessId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('businessId', businessId)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  useEffect(() => {
    let ignore = false

    async function loadBusinesses() {
      setIsLoadingBusinesses(true)

      try {
        const response = await fetch('/api/businesses', { method: 'GET', cache: 'no-store' })
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
        if (!ignore) setIsLoadingBusinesses(false)
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

  useEffect(() => {
    if (!selectedBusinessId) {
      setBookings([])
      return
    }

    let ignore = false

    async function loadBookings() {
      setIsLoadingBookings(true)

      try {
        const response = await fetch(`/api/businesses/${selectedBusinessId}/bookings`, {
          method: 'GET',
          cache: 'no-store',
        })

        const payload = (await response.json()) as BusinessBookingsResponse | ApiErrorResponse
        if (ignore) return

        if (!response.ok) {
          setErrorMessage(getApiErrorMessage(payload, 'We could not load business bookings right now.'))
          setBookings([])
          return
        }

        setBookings((payload as BusinessBookingsResponse).bookings)
      } catch {
        if (!ignore) {
          setErrorMessage('We could not load business bookings right now.')
          setBookings([])
        }
      } finally {
        if (!ignore) setIsLoadingBookings(false)
      }
    }

    void loadBookings()

    return () => {
      ignore = true
    }
  }, [selectedBusinessId])

  const selectedBusiness = useMemo(
    () => businesses.find((business) => business.id === selectedBusinessId) ?? businesses[0] ?? null,
    [businesses, selectedBusinessId]
  )

  const completedBookingsCount = useMemo(
    () => bookings.filter((booking) => booking.status.toUpperCase() === 'COMPLETED').length,
    [bookings]
  )

  const nextUpcomingBooking = useMemo(() => {
    const now = Date.now()
    return (
      [...bookings]
        .filter((booking) => new Date(booking.endAt).getTime() >= now)
        .sort(
          (leftValue, rightValue) =>
            new Date(leftValue.startAt).getTime() - new Date(rightValue.startAt).getTime()
        )[0] ?? null
    )
  }, [bookings])

  const readinessChecks = selectedBusiness
    ? [
        {
          label: 'Business profile completed',
          description: 'Contact details, address, and a usable description are all present.',
          complete: Boolean(
            selectedBusiness.description &&
              selectedBusiness.email &&
              selectedBusiness.phone &&
              selectedBusiness.addressLine1 &&
              selectedBusiness.city &&
              selectedBusiness.postcode
          ),
        },
        {
          label: 'Timezone configured',
          description: 'Timezone is required for booking, business hours, and schedule accuracy.',
          complete: Boolean(selectedBusiness.timezone),
        },
        {
          label: 'Business approved for discovery',
          description: 'Approval is what allows the business to appear publicly on the marketplace.',
          complete: selectedBusiness.status.toUpperCase() === 'ACTIVE',
        },
      ]
    : []

  const completedChecksCount = readinessChecks.filter((check) => check.complete).length
  const settingsHref = selectedBusiness
    ? `/manage_business/settings/profile?businessId=${selectedBusiness.id}`
    : '/manage_business/settings/profile'
  const hoursHref = selectedBusiness
    ? `/manage_business/settings/hours?businessId=${selectedBusiness.id}`
    : '/manage_business/settings/hours'
  const bookingsHref = selectedBusiness
    ? `/manage_business/bookings?businessId=${selectedBusiness.id}`
    : '/manage_business/bookings'

  return (
    <ManageBusinessShell
      activeNav="/manage_business"
      subNavItems={buildDashboardSubNavItems(selectedBusiness?.id ?? null)}
      activeSubNav={pathname}
    >
      {errorMessage ? (
        <Alert variant="destructive" className="mb-6 rounded-2xl">
          <AlertTitle>Readiness issue</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {isLoadingBusinesses ? (
        <div className="grid gap-6">
          <div className="h-36 animate-pulse rounded-[28px] bg-white" />
          <div className="h-[420px] animate-pulse rounded-[28px] bg-white" />
        </div>
      ) : !businesses.length ? (
        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
            Readiness Workspace
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
            No businesses found
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
            Create your first business before you start tracking readiness, approval, and launch prep.
          </p>
          <Link
            href="/start-business"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Start owner onboarding
          </Link>
        </section>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <section className="grid gap-6">
            <article className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Readiness Workspace
                  </p>
                  <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
                    Launch and operations readiness
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
                    Use this focused view to see whether the selected business is ready for public discovery,
                    reliable booking operations, and day-to-day owner management.
                  </p>
                </div>

                <label className="grid gap-2 text-sm font-medium text-slate-700 sm:min-w-[280px]">
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
              </div>
            </article>

            <section className="grid gap-4 md:grid-cols-3">
              <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Checklist completion
                </p>
                <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
                  {completedChecksCount}/{readinessChecks.length}
                </p>
                <p className="mt-2 text-sm text-slate-500">Critical setup milestones currently complete.</p>
              </article>

              <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Completed appointments
                </p>
                <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
                  {completedBookingsCount}
                </p>
                <p className="mt-2 text-sm text-slate-500">A simple signal that the business is actively operating.</p>
              </article>

              <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Approval status
                </p>
                <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
                  {selectedBusiness?.status ?? 'Unknown'}
                </p>
                <p className="mt-2 text-sm text-slate-500">Marketplace visibility still depends on this state.</p>
              </article>
            </section>

            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Launch checklist
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">
                    Keep the business deployment-ready
                  </h2>
                </div>
                {isLoadingBookings ? (
                  <span className="text-xs font-semibold text-slate-400">Loading...</span>
                ) : null}
              </div>

              <div className="mt-5 grid gap-3">
                {readinessChecks.map((check) => (
                  <div
                    key={check.label}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
                  >
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                      <div>
                        <p className="text-sm font-semibold text-[#0B1C30]">{check.label}</p>
                        <p className="mt-1 text-xs leading-relaxed text-slate-500">{check.description}</p>
                      </div>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getChecklistStatusClassName(
                          check.complete
                        )}`}
                      >
                        {check.complete ? 'Complete' : 'Needs attention'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </section>

          <aside className="grid gap-6 self-start">
            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                Immediate next step
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">
                {nextUpcomingBooking ? 'Prepare the next appointment' : 'Finish critical setup'}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                {nextUpcomingBooking
                  ? `${getCustomerDisplayName(nextUpcomingBooking)} is next up at ${formatBookingDateTime(
                      nextUpcomingBooking.startAt,
                      nextUpcomingBooking.businessTimezone
                    )}.`
                  : 'Use the links below to finish the setup steps that still block smoother operations.'}
              </p>

              <div className="mt-5 grid gap-3">
                <Link
                  href={settingsHref}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  Open business profile
                </Link>
                <Link
                  href={hoursHref}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50"
                >
                  Review business hours
                </Link>
                <Link
                  href={bookingsHref}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50"
                >
                  Open bookings queue
                </Link>
              </div>
            </article>
          </aside>
        </div>
      )}
    </ManageBusinessShell>
  )
}

function ManageBusinessReadinessPageFallback() {
  return (
    <div className="min-h-screen bg-[#F1F5F9] p-5 md:p-6">
      <div className="grid gap-6">
        <div className="h-36 animate-pulse rounded-[28px] bg-white" />
        <div className="h-[420px] animate-pulse rounded-[28px] bg-white" />
      </div>
    </div>
  )
}

export default function ManageBusinessReadinessPage() {
  return (
    <Suspense fallback={<ManageBusinessReadinessPageFallback />}>
      <ManageBusinessReadinessPageContent />
    </Suspense>
  )
}
