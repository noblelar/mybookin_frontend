'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

import ManageBusinessShell from '@/components/manage_business/ManageBusinessShell'
import { buildBookingsSubNavItems } from '@/components/manage_business/workspace/bookings-navigation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getApiErrorMessage } from '@/lib/utils'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  Booking,
  BookingListResponse,
  BookingMutationResponse,
  BookingStatus,
  CancelBookingPayload,
  UpdateBookingStatusPayload,
} from '@/types/booking'
import type { Business, BusinessListResponse } from '@/types/business'

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

const getBookingStatusClassName = (status: string) => {
  switch (status.toUpperCase()) {
    case 'CONFIRMED':
      return 'bg-emerald-50 text-emerald-700'
    case 'PENDING':
      return 'bg-amber-50 text-amber-700'
    case 'COMPLETED':
      return 'bg-blue-50 text-blue-700'
    case 'NO_SHOW':
      return 'bg-rose-50 text-rose-700'
    case 'CANCELLED':
      return 'bg-slate-100 text-slate-600'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

const getCustomerDisplayName = (booking: Booking) => {
  const fullName = `${booking.customerFirstName} ${booking.customerLastName}`.trim()
  return fullName || booking.customerEmail
}

export default function ManageBusinessBookingsDetailPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedBusinessId = searchParams.get('businessId')
  const selectedBookingId = searchParams.get('bookingId')

  const [businesses, setBusinesses] = useState<Business[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [cancelReason, setCancelReason] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true)
  const [isLoadingBookings, setIsLoadingBookings] = useState(false)
  const [activeMutation, setActiveMutation] = useState<string | null>(null)

  const setQueryValue = useCallback((key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString())

    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [pathname, router, searchParams])

  const selectedBusiness = useMemo(() => {
    return businesses.find((business) => business.id === selectedBusinessId) ?? businesses[0] ?? null
  }, [businesses, selectedBusinessId])

  const sortedBookings = useMemo(() => {
    return [...bookings].sort(
      (leftValue, rightValue) =>
        new Date(leftValue.startAt).getTime() - new Date(rightValue.startAt).getTime()
    )
  }, [bookings])

  const selectedBooking = useMemo(() => {
    return (
      sortedBookings.find((booking) => booking.id === selectedBookingId) ?? sortedBookings[0] ?? null
    )
  }, [selectedBookingId, sortedBookings])

  useEffect(() => {
    let ignore = false

    async function loadBusinesses() {
      setIsLoadingBusinesses(true)

      try {
        const response = await fetch('/api/businesses', { method: 'GET', cache: 'no-store' })
        const payload = (await response.json()) as BusinessListResponse | ApiErrorResponse
        if (ignore) return

        if (!response.ok) {
          setBusinesses([])
          setErrorMessage(getApiErrorMessage(payload, 'We could not load your businesses right now.'))
          return
        }

        setBusinesses((payload as BusinessListResponse).businesses)
      } catch {
        if (!ignore) {
          setBusinesses([])
          setErrorMessage('We could not load your businesses right now.')
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
      setQueryValue('businessId', businesses[0].id)
    }
  }, [businesses, selectedBusinessId, setQueryValue])

  useEffect(() => {
    if (!selectedBusiness) {
      setBookings([])
      return
    }

    const businessId = selectedBusiness.id
    let ignore = false

    async function loadBookings() {
      setIsLoadingBookings(true)
      setErrorMessage(null)

      try {
        const response = await fetch(`/api/businesses/${businessId}/bookings`, {
          method: 'GET',
          cache: 'no-store',
        })

        const payload = (await response.json()) as BookingListResponse | ApiErrorResponse
        if (ignore) return

        if (!response.ok) {
          setBookings([])
          setErrorMessage(getApiErrorMessage(payload, 'We could not load business bookings right now.'))
          return
        }

        setBookings((payload as BookingListResponse).bookings)
      } catch {
        if (!ignore) {
          setBookings([])
          setErrorMessage('We could not load business bookings right now.')
        }
      } finally {
        if (!ignore) setIsLoadingBookings(false)
      }
    }

    void loadBookings()

    return () => {
      ignore = true
    }
  }, [selectedBusiness])

  useEffect(() => {
    if (!sortedBookings.length) return
    if (!selectedBookingId || !sortedBookings.some((booking) => booking.id === selectedBookingId)) {
      setQueryValue('bookingId', sortedBookings[0].id)
    }
  }, [selectedBookingId, setQueryValue, sortedBookings])

  useEffect(() => {
    setCancelReason('')
  }, [selectedBooking?.id])

  async function handleUpdateStatus(nextStatus: BookingStatus) {
    if (!selectedBusiness || !selectedBooking) return

    setActiveMutation(`status:${selectedBooking.id}:${nextStatus}`)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(
        `/api/businesses/${selectedBusiness.id}/bookings/${selectedBooking.id}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: nextStatus } satisfies UpdateBookingStatusPayload),
        }
      )

      const payload = (await response.json()) as BookingMutationResponse | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(payload, 'We could not update this booking right now.'))
        return
      }

      const updatedBooking = (payload as BookingMutationResponse).booking
      setBookings((currentValue) =>
        currentValue.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking))
      )
      setSuccessMessage((payload as BookingMutationResponse).message)
    } catch {
      setErrorMessage('We could not update this booking right now.')
    } finally {
      setActiveMutation(null)
    }
  }

  async function handleCancelBooking() {
    if (!selectedBusiness || !selectedBooking) return

    setActiveMutation(`cancel:${selectedBooking.id}`)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(
        `/api/businesses/${selectedBusiness.id}/bookings/${selectedBooking.id}/cancel`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            cancel_reason: cancelReason.trim() ? cancelReason.trim() : null,
          } satisfies CancelBookingPayload),
        }
      )

      const payload = (await response.json()) as BookingMutationResponse | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(payload, 'We could not cancel this booking right now.'))
        return
      }

      const cancelledBooking = (payload as BookingMutationResponse).booking
      setBookings((currentValue) =>
        currentValue.map((booking) =>
          booking.id === cancelledBooking.id ? cancelledBooking : booking
        )
      )
      setSuccessMessage((payload as BookingMutationResponse).message)
      setCancelReason('')
    } catch {
      setErrorMessage('We could not cancel this booking right now.')
    } finally {
      setActiveMutation(null)
    }
  }

  const canConfirm = selectedBooking?.status === 'PENDING'
  const canCancel = selectedBooking
    ? ['PENDING', 'CONFIRMED'].includes(selectedBooking.status)
    : false
  const canComplete = selectedBooking?.status === 'CONFIRMED'
  const canMarkNoShow = selectedBooking?.status === 'CONFIRMED'

  return (
    <ManageBusinessShell
      activeNav="/manage_business/bookings"
      subNavItems={buildBookingsSubNavItems(selectedBusiness?.id ?? null)}
      activeSubNav={pathname}
    >
      {errorMessage ? (
        <Alert variant="destructive" className="mb-6 rounded-2xl">
          <AlertTitle>Booking detail issue</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {successMessage ? (
        <Alert className="mb-6 rounded-2xl">
          <AlertTitle>Updated</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      ) : null}

      {isLoadingBusinesses ? (
        <div className="grid gap-6">
          <div className="h-40 animate-pulse rounded-[28px] bg-white" />
          <div className="h-[520px] animate-pulse rounded-[28px] bg-white" />
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="grid gap-6 self-start">
            <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                Booking Detail
              </p>
              <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
                Action a booking
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                Select a reservation from the list, then confirm, complete, mark no-show, or cancel it
                from one focused page.
              </p>

              <label className="mt-5 grid gap-2 text-sm font-medium text-slate-700">
                Active business
                <select
                  value={selectedBusiness?.id ?? ''}
                  onChange={(event) => setQueryValue('businessId', event.target.value)}
                  className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                >
                  {businesses.map((business) => (
                    <option key={business.id} value={business.id}>
                      {business.name}
                    </option>
                  ))}
                </select>
              </label>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                Booking list
              </p>
              <div className="mt-4 grid gap-3">
                {isLoadingBookings ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
                  ))
                ) : sortedBookings.length ? (
                  sortedBookings.map((booking) => {
                    const isSelected = selectedBooking?.id === booking.id

                    return (
                      <button
                        key={booking.id}
                        type="button"
                        onClick={() => setQueryValue('bookingId', booking.id)}
                        className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
                          isSelected
                            ? 'border-[#0B1C30] bg-slate-50'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <p className="text-sm font-semibold text-[#0B1C30]">
                          {getCustomerDisplayName(booking)}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">
                          {booking.serviceName} with {booking.assignedStaffDisplayName}
                        </p>
                      </button>
                    )
                  })
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                    No bookings exist for this business yet.
                  </div>
                )}
              </div>
            </section>
          </aside>

          <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            {selectedBooking ? (
              <div className="grid gap-5">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-2xl font-bold tracking-tight text-[#0B1C30]">
                      {getCustomerDisplayName(selectedBooking)}
                    </h2>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getBookingStatusClassName(
                        selectedBooking.status
                      )}`}
                    >
                      {selectedBooking.status}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">{selectedBooking.customerEmail}</p>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Appointment
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#0B1C30]">
                      {selectedBooking.serviceName}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {formatBookingDateTime(
                        selectedBooking.startAt,
                        selectedBooking.businessTimezone
                      )}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      With {selectedBooking.assignedStaffDisplayName}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Customer context
                    </p>
                    <p className="mt-2 text-sm font-semibold text-[#0B1C30]">
                      Party size {selectedBooking.partySize}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Created{' '}
                      {formatBookingDateTime(
                        selectedBooking.createdAt,
                        selectedBooking.businessTimezone
                      )}
                    </p>
                    {selectedBooking.cancelReason ? (
                      <p className="mt-2 text-xs text-slate-500">
                        Cancellation reason: {selectedBooking.cancelReason}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid gap-3">
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Actions
                  </p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => void handleUpdateStatus('CONFIRMED')}
                      disabled={!canConfirm || activeMutation !== null}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {activeMutation === `status:${selectedBooking.id}:CONFIRMED`
                        ? 'Confirming...'
                        : 'Confirm booking'}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleUpdateStatus('COMPLETED')}
                      disabled={!canComplete || activeMutation !== null}
                      className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {activeMutation === `status:${selectedBooking.id}:COMPLETED`
                        ? 'Completing...'
                        : 'Mark completed'}
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleUpdateStatus('NO_SHOW')}
                      disabled={!canMarkNoShow || activeMutation !== null}
                      className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {activeMutation === `status:${selectedBooking.id}:NO_SHOW`
                        ? 'Updating...'
                        : 'Mark no-show'}
                    </button>
                  </div>

                  {canCancel ? (
                    <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <label className="grid gap-2 text-sm font-medium text-slate-700">
                        <span>Cancellation reason</span>
                        <textarea
                          value={cancelReason}
                          onChange={(event) => setCancelReason(event.target.value)}
                          rows={4}
                          placeholder="Optional note for why this booking was cancelled."
                          className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30]"
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() => void handleCancelBooking()}
                        disabled={activeMutation !== null}
                        className="inline-flex h-11 items-center justify-center rounded-full border border-rose-200 bg-white px-5 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {activeMutation === `cancel:${selectedBooking.id}`
                          ? 'Cancelling...'
                          : 'Cancel booking'}
                      </button>
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                      This booking is already closed out, so no further owner actions are available.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                Select a booking from the list to review it in more detail.
              </div>
            )}
          </section>
        </div>
      )}
    </ManageBusinessShell>
  )
}
