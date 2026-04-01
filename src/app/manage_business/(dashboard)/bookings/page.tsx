'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState } from 'react'

import ManageBusinessShell from '@/components/manage_business/ManageBusinessShell'
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
import type { Service, ServiceListResponse } from '@/types/service'
import type { StaffListResponse, StaffMember } from '@/types/staff'

type BookingFilters = {
  search: string
  status: 'ALL' | BookingStatus
  serviceId: string
  assignedStaffId: string
  dateFrom: string
  dateTo: string
}

const INITIAL_FILTERS: BookingFilters = {
  search: '',
  status: 'ALL',
  serviceId: 'ALL',
  assignedStaffId: 'ALL',
  dateFrom: '',
  dateTo: '',
}

const STATUS_OPTIONS: Array<BookingFilters['status']> = [
  'ALL',
  'PENDING',
  'CONFIRMED',
  'COMPLETED',
  'NO_SHOW',
  'CANCELLED',
]

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

const getCustomerDisplayName = (booking: Booking) => {
  const fullName = `${booking.customerFirstName} ${booking.customerLastName}`.trim()
  return fullName || booking.customerEmail
}

const filterBookingsBySearch = (bookings: Booking[], search: string) => {
  const query = search.trim().toLowerCase()
  if (!query) return bookings

  return bookings.filter((booking) =>
    [
      getCustomerDisplayName(booking),
      booking.customerEmail,
      booking.serviceName,
      booking.assignedStaffDisplayName,
      booking.businessName,
    ]
      .join(' ')
      .toLowerCase()
      .includes(query)
  )
}

function ManageBusinessBookingsPageContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedBusinessId = searchParams.get('businessId')

  const [businesses, setBusinesses] = useState<Business[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filters, setFilters] = useState<BookingFilters>(INITIAL_FILTERS)
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState('')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true)
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(false)
  const [isLoadingBookings, setIsLoadingBookings] = useState(false)
  const [activeMutation, setActiveMutation] = useState<string | null>(null)

  const selectedBusiness = useMemo(
    () => businesses.find((business) => business.id === selectedBusinessId) ?? businesses[0] ?? null,
    [businesses, selectedBusinessId]
  )

  const visibleBookings = useMemo(
    () =>
      filterBookingsBySearch(
        [...bookings].sort(
          (leftValue, rightValue) =>
            new Date(leftValue.startAt).getTime() - new Date(rightValue.startAt).getTime()
        ),
        filters.search
      ),
    [bookings, filters.search]
  )

  const selectedBooking = useMemo(
    () => visibleBookings.find((booking) => booking.id === selectedBookingId) ?? visibleBookings[0] ?? null,
    [selectedBookingId, visibleBookings]
  )

  const totalBookings = visibleBookings.length
  const pendingBookingsCount = visibleBookings.filter((booking) => booking.status === 'PENDING').length
  const confirmedBookingsCount = visibleBookings.filter((booking) => booking.status === 'CONFIRMED').length
  const closedBookingsCount = visibleBookings.filter((booking) =>
    ['COMPLETED', 'NO_SHOW', 'CANCELLED'].includes(booking.status)
  ).length

  const updateSelectedBusinessId = (businessId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('businessId', businessId)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const resetFilters = () => setFilters(INITIAL_FILTERS)

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
      setServices([])
      setStaffMembers([])
      setBookings([])
      return
    }

    let ignore = false

    async function loadWorkspace() {
      setIsLoadingWorkspace(true)
      setErrorMessage(null)

      try {
        const [servicesResponse, staffResponse] = await Promise.all([
          fetch(`/api/businesses/${selectedBusinessId}/services?include_inactive=true`, {
            method: 'GET',
            cache: 'no-store',
          }),
          fetch(`/api/businesses/${selectedBusinessId}/staff-members?include_inactive=true`, {
            method: 'GET',
            cache: 'no-store',
          }),
        ])

        const [servicesPayload, staffPayload] = await Promise.all([
          servicesResponse.json(),
          staffResponse.json(),
        ])

        if (ignore) return

        if (!servicesResponse.ok) {
          setErrorMessage(getApiErrorMessage(servicesPayload, 'We could not load services right now.'))
          setServices([])
        } else {
          setServices((servicesPayload as ServiceListResponse).services)
        }

        if (!staffResponse.ok) {
          setErrorMessage(
            getApiErrorMessage(staffPayload, 'We could not load staff members right now.')
          )
          setStaffMembers([])
        } else {
          setStaffMembers((staffPayload as StaffListResponse).staffMembers)
        }
      } catch {
        if (!ignore) {
          setErrorMessage('We could not load this bookings workspace right now.')
          setServices([])
          setStaffMembers([])
        }
      } finally {
        if (!ignore) setIsLoadingWorkspace(false)
      }
    }

    void loadWorkspace()

    return () => {
      ignore = true
    }
  }, [selectedBusinessId])

  useEffect(() => {
    if (!selectedBusinessId) return

    let ignore = false

    async function loadBookings() {
      setIsLoadingBookings(true)
      setErrorMessage(null)

      try {
        const params = new URLSearchParams()
        if (filters.status !== 'ALL') params.set('status', filters.status)
        if (filters.serviceId !== 'ALL') params.set('service_id', filters.serviceId)
        if (filters.assignedStaffId !== 'ALL') params.set('assigned_staff_id', filters.assignedStaffId)
        if (filters.dateFrom) params.set('date_from', filters.dateFrom)
        if (filters.dateTo) params.set('date_to', filters.dateTo)

        const response = await fetch(
          `/api/businesses/${selectedBusinessId}/bookings${params.toString() ? `?${params.toString()}` : ''}`,
          {
            method: 'GET',
            cache: 'no-store',
          }
        )

        const payload = (await response.json()) as BookingListResponse | ApiErrorResponse
        if (ignore) return

        if (!response.ok) {
          setErrorMessage(getApiErrorMessage(payload, 'We could not load business bookings right now.'))
          setBookings([])
          return
        }

        setBookings((payload as BookingListResponse).bookings)
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
  }, [
    filters.assignedStaffId,
    filters.dateFrom,
    filters.dateTo,
    filters.serviceId,
    filters.status,
    selectedBusinessId,
  ])

  useEffect(() => {
    if (!visibleBookings.length) {
      setSelectedBookingId(null)
      return
    }

    if (!selectedBookingId || !visibleBookings.some((booking) => booking.id === selectedBookingId)) {
      setSelectedBookingId(visibleBookings[0].id)
    }
  }, [selectedBookingId, visibleBookings])

  useEffect(() => {
    setCancelReason('')
  }, [selectedBookingId])

  const servicesWorkspaceHref = selectedBusiness
    ? `/manage_business/services?businessId=${selectedBusiness.id}`
    : '/manage_business/services'
  const staffWorkspaceHref = selectedBusiness
    ? `/manage_business/staff?businessId=${selectedBusiness.id}`
    : '/manage_business/staff'

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
      setBookings((currentValue) => {
        const nextValue = currentValue.map((booking) =>
          booking.id === updatedBooking.id ? updatedBooking : booking
        )

        if (filters.status !== 'ALL' && updatedBooking.status !== filters.status) {
          return nextValue.filter((booking) => booking.id !== updatedBooking.id)
        }

        return nextValue
      })
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
      setBookings((currentValue) => {
        const nextValue = currentValue.map((booking) =>
          booking.id === cancelledBooking.id ? cancelledBooking : booking
        )

        if (filters.status !== 'ALL' && cancelledBooking.status !== filters.status) {
          return nextValue.filter((booking) => booking.id !== cancelledBooking.id)
        }

        return nextValue
      })
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
    <ManageBusinessShell activeNav="/manage_business/bookings" topBarTab="reports">
      {errorMessage ? (
        <Alert variant="destructive" className="mb-6 rounded-2xl">
          <AlertTitle>Bookings workspace issue</AlertTitle>
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
          <div className="grid gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-28 animate-pulse rounded-[24px] bg-white" />
            ))}
          </div>
          <div className="h-[720px] animate-pulse rounded-[28px] bg-white" />
        </div>
      ) : !businesses.length ? (
        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
            Bookings Workspace
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
            No business selected yet
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
            Create your first business, configure services and staff, and customer bookings will begin
            flowing into this operations queue.
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
                  Bookings Operations
                </p>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30] md:text-4xl">
                  Keep the appointment queue moving
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
                  Review incoming reservations, confirm and close appointments, and keep business
                  availability aligned with what your team can actually deliver.
                </p>
              </div>

              <div className="grid gap-3 sm:min-w-[300px]">
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
                      {selectedBusiness.city}, {selectedBusiness.postcode}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"><p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Visible bookings</p><p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">{totalBookings}</p></article>
            <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"><p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Pending</p><p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">{pendingBookingsCount}</p></article>
            <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"><p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Confirmed</p><p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">{confirmedBookingsCount}</p></article>
            <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm"><p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Closed out</p><p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">{closedBookingsCount}</p></article>
          </section>

          <section className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)]">
            <aside className="grid gap-6 self-start">
              <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Filters</p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">Focus the queue</h2>
                <div className="mt-5 grid gap-4">
                  <label className="grid gap-2 text-sm font-medium text-slate-700"><span>Search</span><input value={filters.search} onChange={(event) => setFilters((currentValue) => ({ ...currentValue, search: event.target.value }))} placeholder="Customer, service, staff..." className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white" /></label>
                  <label className="grid gap-2 text-sm font-medium text-slate-700"><span>Status</span><select value={filters.status} onChange={(event) => setFilters((currentValue) => ({ ...currentValue, status: event.target.value as BookingFilters['status'] }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white">{STATUS_OPTIONS.map((status) => <option key={status} value={status}>{status === 'ALL' ? 'All statuses' : status}</option>)}</select></label>
                  <label className="grid gap-2 text-sm font-medium text-slate-700"><span>Service</span><select value={filters.serviceId} onChange={(event) => setFilters((currentValue) => ({ ...currentValue, serviceId: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"><option value="ALL">All services</option>{services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}</select></label>
                  <label className="grid gap-2 text-sm font-medium text-slate-700"><span>Staff member</span><select value={filters.assignedStaffId} onChange={(event) => setFilters((currentValue) => ({ ...currentValue, assignedStaffId: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"><option value="ALL">All staff</option>{staffMembers.map((staffMember) => <option key={staffMember.id} value={staffMember.id}>{staffMember.displayName}</option>)}</select></label>
                  <label className="grid gap-2 text-sm font-medium text-slate-700"><span>Date from</span><input type="date" value={filters.dateFrom} onChange={(event) => setFilters((currentValue) => ({ ...currentValue, dateFrom: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white" /></label>
                  <label className="grid gap-2 text-sm font-medium text-slate-700"><span>Date to</span><input type="date" value={filters.dateTo} onChange={(event) => setFilters((currentValue) => ({ ...currentValue, dateTo: event.target.value }))} className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white" /></label>
                  <button type="button" onClick={resetFilters} className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50">Reset filters</button>
                </div>
              </article>

              <article className="rounded-[28px] border border-slate-200 bg-[#EFF4FF] p-6 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Owner shortcuts</p>
                <div className="mt-4 grid gap-3">
                  <Link href={servicesWorkspaceHref} className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800">Review services</Link>
                  <Link href={staffWorkspaceHref} className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50">Review staff setup</Link>
                </div>
              </article>
            </aside>

            <div className="grid gap-6 2xl:grid-cols-[minmax(0,1fr)_360px]">
              <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4"><div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Booking queue</p><h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">Incoming reservations</h2></div>{isLoadingWorkspace || isLoadingBookings ? <span className="text-xs font-semibold text-slate-400">Loading...</span> : null}</div>
                <div className="mt-5 grid gap-3">
                  {isLoadingWorkspace || isLoadingBookings ? (
                    Array.from({ length: 4 }).map((_, index) => <div key={index} className="h-24 animate-pulse rounded-2xl bg-slate-100" />)
                  ) : visibleBookings.length ? (
                    visibleBookings.map((booking) => {
                      const isSelected = selectedBooking?.id === booking.id
                      return (
                        <button key={booking.id} type="button" onClick={() => setSelectedBookingId(booking.id)} className={`rounded-2xl border px-4 py-4 text-left transition-colors ${isSelected ? 'border-[#0B1C30] bg-slate-50' : 'border-slate-200 bg-white hover:bg-slate-50'}`}>
                          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-sm font-semibold text-[#0B1C30]">{getCustomerDisplayName(booking)}</p>
                                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getBookingStatusClassName(booking.status)}`}>{booking.status}</span>
                              </div>
                              <p className="mt-2 text-sm text-slate-500">{booking.serviceName} with {booking.assignedStaffDisplayName}</p>
                              <p className="mt-1 text-xs text-slate-400">{formatBookingDateTime(booking.startAt, booking.businessTimezone)}</p>
                            </div>
                            <div className="text-left md:text-right"><p className="text-sm font-semibold text-[#0B1C30]">Party size {booking.partySize}</p><p className="mt-1 text-xs text-slate-500">{booking.customerEmail}</p></div>
                          </div>
                        </button>
                      )
                    })
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-10 text-center"><h3 className="text-xl font-bold text-[#0B1C30]">No bookings in view</h3><p className="mt-3 text-sm text-slate-500">Try widening the filters or complete the business setup so customers can start booking.</p></div>
                  )}
                </div>
              </article>

              <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Booking detail</p>
                {selectedBooking ? (
                  <div className="mt-4 grid gap-5">
                    <div><div className="flex flex-wrap items-center gap-2"><h2 className="text-2xl font-bold tracking-tight text-[#0B1C30]">{getCustomerDisplayName(selectedBooking)}</h2><span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getBookingStatusClassName(selectedBooking.status)}`}>{selectedBooking.status}</span></div><p className="mt-2 text-sm text-slate-500">{selectedBooking.customerEmail}</p></div>
                    <div className="grid gap-3">
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Appointment</p><p className="mt-2 text-sm font-semibold text-[#0B1C30]">{selectedBooking.serviceName}</p><p className="mt-1 text-sm text-slate-500">{formatBookingDateTime(selectedBooking.startAt, selectedBooking.businessTimezone)}</p><p className="mt-1 text-xs text-slate-400">With {selectedBooking.assignedStaffDisplayName}</p></div>
                      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Customer context</p><p className="mt-2 text-sm font-semibold text-[#0B1C30]">Party size {selectedBooking.partySize}</p><p className="mt-1 text-sm text-slate-500">Created {formatBookingDateTime(selectedBooking.createdAt, selectedBooking.businessTimezone)}</p>{selectedBooking.cancelReason ? <p className="mt-2 text-xs text-slate-500">Cancellation reason: {selectedBooking.cancelReason}</p> : null}</div>
                    </div>
                    <div className="grid gap-3">
                      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Actions</p>
                      <div className="grid gap-3">
                        <button type="button" onClick={() => handleUpdateStatus('CONFIRMED')} disabled={!canConfirm || activeMutation !== null} className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">{activeMutation === `status:${selectedBooking.id}:CONFIRMED` ? 'Confirming...' : 'Confirm booking'}</button>
                        <button type="button" onClick={() => handleUpdateStatus('COMPLETED')} disabled={!canComplete || activeMutation !== null} className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">{activeMutation === `status:${selectedBooking.id}:COMPLETED` ? 'Completing...' : 'Mark completed'}</button>
                        <button type="button" onClick={() => handleUpdateStatus('NO_SHOW')} disabled={!canMarkNoShow || activeMutation !== null} className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60">{activeMutation === `status:${selectedBooking.id}:NO_SHOW` ? 'Updating...' : 'Mark no-show'}</button>
                      </div>
                      {canCancel ? (
                        <div className="grid gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <label className="grid gap-2 text-sm font-medium text-slate-700"><span>Cancellation reason</span><textarea value={cancelReason} onChange={(event) => setCancelReason(event.target.value)} rows={4} placeholder="Optional note for why this booking was cancelled." className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30]" /></label>
                          <button type="button" onClick={handleCancelBooking} disabled={activeMutation !== null} className="inline-flex h-11 items-center justify-center rounded-full border border-rose-200 bg-white px-5 text-sm font-semibold text-rose-700 transition-colors hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60">{activeMutation === `cancel:${selectedBooking.id}` ? 'Cancelling...' : 'Cancel booking'}</button>
                        </div>
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">This booking is already closed out, so no further owner actions are available.</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">Select a booking from the queue to review the customer details and apply status changes.</div>
                )}
              </aside>
            </div>
          </section>
        </div>
      )}
    </ManageBusinessShell>
  )
}

function ManageBusinessBookingsPageFallback() {
  return (
    <div className="min-h-screen bg-[#F1F5F9] p-5 md:p-6">
      <div className="grid gap-6">
        <div className="h-40 animate-pulse rounded-[28px] bg-white" />
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-[24px] bg-white" />
          ))}
        </div>
        <div className="h-[720px] animate-pulse rounded-[28px] bg-white" />
      </div>
    </div>
  )
}

export default function ManageBusinessBookingsPage() {
  return (
    <Suspense fallback={<ManageBusinessBookingsPageFallback />}>
      <ManageBusinessBookingsPageContent />
    </Suspense>
  )
}
