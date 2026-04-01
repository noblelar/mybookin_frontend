'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'

import ManageBusinessShell from '@/components/manage_business/ManageBusinessShell'
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

const formatCategory = (value: string) => {
  return value
    .toLowerCase()
    .split('_')
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ')
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

const getBookingStatusClassName = (status: string) => {
  switch (status.toUpperCase()) {
    case 'CONFIRMED':
      return 'bg-emerald-50 text-emerald-700'
    case 'PENDING':
      return 'bg-amber-50 text-amber-700'
    case 'CANCELLED':
      return 'bg-red-50 text-red-700'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

const formatBookingDateTime = (value: string, timezone: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Invalid date'

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

function ManageBusinessDashboardPageContent() {
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

        const nextBusinesses = (payload as BusinessListResponse).businesses
        setBusinesses(nextBusinesses)
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
        if (!ignore) {
          setIsLoadingBookings(false)
        }
      }
    }

    void loadBookings()

    return () => {
      ignore = true
    }
  }, [selectedBusinessId])

  const selectedBusiness = useMemo(() => {
    return businesses.find((business) => business.id === selectedBusinessId) ?? businesses[0] ?? null
  }, [businesses, selectedBusinessId])

  const sortedBookings = useMemo(() => {
    return [...bookings].sort(
      (leftValue, rightValue) =>
        new Date(leftValue.startAt).getTime() - new Date(rightValue.startAt).getTime()
    )
  }, [bookings])

  const upcomingBookings = useMemo(() => {
    const now = Date.now()
    return sortedBookings.filter((booking) => new Date(booking.endAt).getTime() >= now)
  }, [sortedBookings])

  const confirmedBookingsCount = useMemo(() => {
    return bookings.filter((booking) => booking.status.toUpperCase() === 'CONFIRMED').length
  }, [bookings])

  const pendingBookingsCount = useMemo(() => {
    return bookings.filter((booking) => booking.status.toUpperCase() === 'PENDING').length
  }, [bookings])

  const nextBooking = upcomingBookings[0] ?? null
  const settingsHref = selectedBusiness
    ? `/manage_business/settings?businessId=${selectedBusiness.id}`
    : '/manage_business/settings'
  const bookingsHref = selectedBusiness
    ? `/manage_business/bookings?businessId=${selectedBusiness.id}`
    : '/manage_business/bookings'
  const staffHref = selectedBusiness
    ? `/manage_business/staff?businessId=${selectedBusiness.id}`
    : '/manage_business/staff'

  const setupChecks = selectedBusiness
    ? [
        {
          label: 'Business profile completed',
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
          complete: Boolean(selectedBusiness.timezone),
        },
        {
          label: 'Business approved for discovery',
          complete: selectedBusiness.status.toUpperCase() === 'ACTIVE',
        },
      ]
    : []

  return (
    <ManageBusinessShell activeNav="/manage_business">
      {errorMessage ? (
        <Alert variant="destructive" className="mb-6 rounded-2xl">
          <AlertTitle>Owner workspace issue</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {isLoadingBusinesses ? (
        <div className="grid gap-6">
          <div className="h-40 animate-pulse rounded-[28px] bg-white" />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="h-32 animate-pulse rounded-[24px] bg-white" />
            <div className="h-32 animate-pulse rounded-[24px] bg-white" />
            <div className="h-32 animate-pulse rounded-[24px] bg-white" />
          </div>
          <div className="h-96 animate-pulse rounded-[28px] bg-white" />
        </div>
      ) : !businesses.length ? (
        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
            Owner Workspace
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
            No businesses found
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
            Create your first business entry to unlock the dashboard, settings, staff setup, and
            live booking visibility.
          </p>
          <Link
            href="/start-business"
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Start owner onboarding
          </Link>
        </section>
      ) : (
        <div className="flex flex-col gap-6">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Operational Overview
                </p>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30] md:text-4xl">
                  {selectedBusiness?.name}
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
                  Manage the business profile, watch booking activity, and use the setup checklist to
                  move this entity from owner onboarding into a fully operational workspace.
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
                      {formatCategory(selectedBusiness.category)}
                    </span>
                    <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                      {selectedBusiness.city}, {selectedBusiness.postcode}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                Managed businesses
              </p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
                {businesses.length}
              </p>
              <p className="mt-2 text-sm text-slate-500">Owner entities connected to this account.</p>
            </article>

            <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                Total bookings
              </p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
                {bookings.length}
              </p>
              <p className="mt-2 text-sm text-slate-500">All live bookings for the selected business.</p>
            </article>

            <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                Confirmed
              </p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
                {confirmedBookingsCount}
              </p>
              <p className="mt-2 text-sm text-slate-500">Confirmed customer commitments.</p>
            </article>

            <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                Pending
              </p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
                {pendingBookingsCount}
              </p>
              <p className="mt-2 text-sm text-slate-500">Pending bookings still awaiting action.</p>
            </article>
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
            <div className="grid gap-6">
              <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Setup checklist
                    </p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">
                      Keep this business deployment-ready
                    </h2>
                  </div>
                  <Link
                    href={settingsHref}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 px-4 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50"
                  >
                    Open settings
                  </Link>
                </div>

                <div className="mt-5 grid gap-3">
                  {setupChecks.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                    >
                      <span className="text-sm font-medium text-[#0B1C30]">{item.label}</span>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          item.complete
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {item.complete ? 'Complete' : 'Needs attention'}
                      </span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Recent bookings
                    </p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">
                      Live customer activity
                    </h2>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={bookingsHref}
                      className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 px-4 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50"
                    >
                      Open bookings
                    </Link>
                    {isLoadingBookings ? (
                      <span className="text-xs font-semibold text-slate-400">Loading...</span>
                    ) : null}
                  </div>
                </div>

                {isLoadingBookings ? (
                  <div className="mt-5 grid gap-3">
                    {[0, 1, 2].map((key) => (
                      <div key={key} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
                    ))}
                  </div>
                ) : upcomingBookings.length ? (
                  <div className="mt-5 grid gap-3">
                    {upcomingBookings.slice(0, 6).map((booking) => (
                      <div
                        key={booking.id}
                        className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 md:flex-row md:items-center md:justify-between"
                      >
                        <div>
                          <p className="text-sm font-semibold text-[#0B1C30]">
                            {getCustomerDisplayName(booking)}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {booking.serviceName} with {booking.assignedStaffDisplayName}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            {formatBookingDateTime(booking.startAt, booking.businessTimezone)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getBookingStatusClassName(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                          <span className="text-xs font-medium text-slate-500">
                            Party size {booking.partySize}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-500">
                    No bookings yet for this business. Once customers start booking services, this
                    area will become the owner&apos;s live operations feed.
                  </div>
                )}
              </article>
            </div>

            <div className="grid gap-6">
              <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Business snapshot
                </p>
                {selectedBusiness ? (
                  <div className="mt-4 grid gap-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Contact
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[#0B1C30]">
                        {selectedBusiness.email ?? 'No email yet'}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {selectedBusiness.phone ?? 'No phone yet'}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                        Location
                      </p>
                      <p className="mt-2 text-sm font-semibold text-[#0B1C30]">
                        {selectedBusiness.addressLine1}
                      </p>
                      {selectedBusiness.addressLine2 ? (
                        <p className="mt-1 text-sm text-slate-500">{selectedBusiness.addressLine2}</p>
                      ) : null}
                      <p className="mt-1 text-sm text-slate-500">
                        {selectedBusiness.city}, {selectedBusiness.postcode}
                      </p>
                      <p className="mt-2 text-xs font-medium text-slate-400">
                        Timezone: {selectedBusiness.timezone}
                      </p>
                    </div>
                  </div>
                ) : null}
              </article>

              <article className="rounded-[28px] border border-slate-200 bg-[#EFF4FF] p-6 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                  Next action
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">
                  {nextBooking ? 'Prepare the next booking' : 'Finish business configuration'}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">
                  {nextBooking
                    ? `${getCustomerDisplayName(nextBooking)} is scheduled for ${formatBookingDateTime(
                        nextBooking.startAt,
                        nextBooking.businessTimezone
                      )}.`
                    : 'Use settings and staff setup to make this business fully bookable and ready for customer traffic.'}
                </p>

                <div className="mt-5 grid gap-3">
                  <Link
                    href={settingsHref}
                    className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                  >
                    Edit business settings
                  </Link>
                  <Link
                    href={bookingsHref}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50"
                  >
                    Open bookings queue
                  </Link>
                  <Link
                    href={staffHref}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50"
                  >
                    Review staff setup
                  </Link>
                  <Link
                    href="/start-business"
                    className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50"
                  >
                    Add another business
                  </Link>
                </div>
              </article>
            </div>
          </section>
        </div>
      )}
    </ManageBusinessShell>
  )
}

function ManageBusinessDashboardPageFallback() {
  return (
    <div className="min-h-screen bg-[#F1F5F9] p-5 md:p-6">
      <div className="grid gap-6">
        <div className="h-40 animate-pulse rounded-[28px] bg-white" />
        <div className="grid gap-4 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-[24px] bg-white" />
          ))}
        </div>
        <div className="h-96 animate-pulse rounded-[28px] bg-white" />
      </div>
    </div>
  )
}

export default function ManageBusinessDashboardPage() {
  return (
    <Suspense fallback={<ManageBusinessDashboardPageFallback />}>
      <ManageBusinessDashboardPageContent />
    </Suspense>
  )
}
