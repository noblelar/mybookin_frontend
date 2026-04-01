'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import CustomerTopBar from '@/components/customer/CustomerTopBar'
import MobileTabBar from '@/components/discovery/MobileTabBar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useAuthContext } from '@/context/AuthContext'
import { getApiErrorMessage } from '@/lib/utils'
import type { ApiErrorResponse } from '@/types/auth'
import type { Booking, BookingListResponse, BookingMutationResponse } from '@/types/booking'

const formatDateTime = (value: string, timezone: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: timezone,
  }).format(date)
}

const getStatusClassName = (status: string) => {
  switch (status.toUpperCase()) {
    case 'CONFIRMED':
      return 'bg-emerald-50 text-emerald-700'
    case 'PENDING':
      return 'bg-amber-50 text-amber-700'
    case 'CANCELLED':
      return 'bg-slate-100 text-slate-600'
    case 'COMPLETED':
      return 'bg-blue-50 text-blue-700'
    case 'NO_SHOW':
      return 'bg-red-50 text-red-700'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

function BookingsPageContent() {
  const searchParams = useSearchParams()
  const { hasHydrated, session } = useAuthContext()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(
    searchParams.get('created') === '1' ? 'Your booking has been created successfully.' : null
  )
  const [isCancellingId, setIsCancellingId] = useState<string | null>(null)

  useEffect(() => {
    let ignore = false

    async function loadBookings() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const response = await fetch('/api/bookings/me', {
          method: 'GET',
          cache: 'no-store',
        })

        const payload = (await response.json()) as BookingListResponse | ApiErrorResponse
        if (ignore) return

        if (!response.ok) {
          setBookings([])
          setErrorMessage(getApiErrorMessage(payload, 'We could not load your bookings right now.'))
          return
        }

        setBookings((payload as BookingListResponse).bookings)
      } catch {
        if (!ignore) {
          setBookings([])
          setErrorMessage('We could not load your bookings right now.')
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    void loadBookings()

    return () => {
      ignore = true
    }
  }, [])

  const sortedBookings = useMemo(
    () =>
      [...bookings].sort(
        (leftValue, rightValue) =>
          new Date(leftValue.startAt).getTime() - new Date(rightValue.startAt).getTime()
      ),
    [bookings]
  )

  const upcomingBookings = sortedBookings.filter((booking) =>
    ['PENDING', 'CONFIRMED'].includes(booking.status.toUpperCase())
  )
  const historicalBookings = sortedBookings.filter(
    (booking) => !['PENDING', 'CONFIRMED'].includes(booking.status.toUpperCase())
  )

  async function handleCancelBooking(bookingId: string) {
    setIsCancellingId(bookingId)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(`/api/bookings/me/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cancel_reason: 'Cancelled by customer' }),
      })

      const payload = (await response.json()) as BookingMutationResponse | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(payload, 'We could not cancel this booking right now.'))
        return
      }

      const updatedBooking = (payload as BookingMutationResponse).booking
      setBookings((currentValue) =>
        currentValue.map((booking) => (booking.id === updatedBooking.id ? updatedBooking : booking))
      )
      setSuccessMessage((payload as BookingMutationResponse).message)
    } catch {
      setErrorMessage('We could not cancel this booking right now.')
    } finally {
      setIsCancellingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-16 md:pb-0">
      <CustomerTopBar />

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
        {errorMessage ? (
          <Alert variant="destructive" className="rounded-3xl">
            <AlertTitle>Booking history issue</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        {successMessage ? (
          <Alert className="rounded-3xl">
            <AlertTitle>Updated</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        ) : null}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
            Booking Hub
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
            Your reservations
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
            {hasHydrated && session
              ? `Welcome back, ${session.user.firstName || session.user.email}. Your confirmed and pending reservations are listed here in real time.`
              : 'Loading your customer workspace...'}
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-3">
          <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Upcoming</p>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">{upcomingBookings.length}</p>
          </article>
          <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">History</p>
            <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">{historicalBookings.length}</p>
          </article>
          <article className="rounded-[24px] border border-slate-200 bg-[#EFF4FF] p-5 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Need another slot?</p>
            <Link
              href="/discover"
              className="mt-3 inline-flex items-center justify-center rounded-full bg-[#0B1C30] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Return to discover
            </Link>
          </article>
        </section>

        {isLoading ? (
          <div className="grid gap-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-40 animate-pulse rounded-[28px] bg-white" />
            ))}
          </div>
        ) : !sortedBookings.length ? (
          <section className="rounded-[32px] border border-dashed border-slate-200 bg-white p-8 shadow-sm text-center">
            <h2 className="text-2xl font-bold text-[#0B1C30]">No bookings yet</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Once you confirm a reservation, it will appear here immediately.
            </p>
            <Link
              href="/discover"
              className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Explore businesses
            </Link>
          </section>
        ) : (
          <>
            <section className="grid gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Upcoming bookings</p>
                <h2 className="mt-2 text-2xl font-bold text-[#0B1C30]">Active reservations</h2>
              </div>

              {upcomingBookings.length ? (
                upcomingBookings.map((booking) => (
                  <article
                    key={booking.id}
                    className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-xl font-bold text-[#0B1C30]">{booking.serviceName}</h3>
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClassName(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">{booking.businessName}</p>
                        <p className="mt-3 text-sm text-slate-600">
                          {formatDateTime(booking.startAt, booking.businessTimezone)} with {booking.assignedStaffDisplayName}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">Party size {booking.partySize}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleCancelBooking(booking.id)}
                          disabled={isCancellingId === booking.id}
                          className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {isCancellingId === booking.id ? 'Cancelling...' : 'Cancel booking'}
                        </button>
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[24px] border border-dashed border-slate-200 bg-white px-5 py-8 text-sm text-slate-500">
                  No upcoming reservations right now.
                </div>
              )}
            </section>

            <section className="grid gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Booking history</p>
                <h2 className="mt-2 text-2xl font-bold text-[#0B1C30]">Completed and cancelled</h2>
              </div>

              {historicalBookings.length ? (
                historicalBookings.map((booking) => (
                  <article
                    key={booking.id}
                    className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold text-[#0B1C30]">{booking.serviceName}</h3>
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusClassName(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        <p className="mt-2 text-sm text-slate-500">{booking.businessName}</p>
                        <p className="mt-2 text-sm text-slate-600">
                          {formatDateTime(booking.startAt, booking.businessTimezone)}
                        </p>
                        {booking.cancelReason ? (
                          <p className="mt-2 text-sm text-slate-500">Reason: {booking.cancelReason}</p>
                        ) : null}
                      </div>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-[24px] border border-dashed border-slate-200 bg-white px-5 py-8 text-sm text-slate-500">
                  No completed or cancelled bookings yet.
                </div>
              )}
            </section>
          </>
        )}
      </main>

      <MobileTabBar />
    </div>
  )
}

function BookingsPageFallback() {
  return (
    <div className="min-h-screen bg-slate-50 pb-16 md:pb-0">
      <CustomerTopBar />
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
            Booking Hub
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
            Your reservations
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
            Loading your customer workspace...
          </p>
        </div>

        <div className="grid gap-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-40 animate-pulse rounded-[28px] bg-white" />
          ))}
        </div>
      </main>

      <MobileTabBar />
    </div>
  )
}

export default function BookingsPage() {
  return (
    <Suspense fallback={<BookingsPageFallback />}>
      <BookingsPageContent />
    </Suspense>
  )
}
