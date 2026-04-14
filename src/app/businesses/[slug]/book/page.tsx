'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import CustomerTopBar from '@/components/customer/CustomerTopBar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getBusinessCoverUrl, getBusinessLogoUrl } from '@/lib/media'
import { useDiscoveryBusinessDetail } from '@/hooks/useDiscoveryBusinessDetail'
import {
  formatCurrency,
  formatDurationLabel,
  getApiErrorMessage,
  getCurrentDateInTimeZone,
} from '@/lib/utils'
import type { Availability, AvailabilityResponse } from '@/types/availability'
import type { ApiErrorResponse } from '@/types/auth'
import type { BusinessDayOfWeek } from '@/types/business'
import type { ServiceStaffAssignmentResponse, StaffMember } from '@/types/staff'

const staffImages = [
  'https://api.builder.io/api/v1/image/assets/TEMP/b1300631cb29f01d963d09791de71f8683dafad9?width=150',
  'https://api.builder.io/api/v1/image/assets/TEMP/9983a564b8c383cdb8949630f0f164ead3fcfe4f?width=150',
  'https://api.builder.io/api/v1/image/assets/TEMP/8c088a9c7625c7b54fff538728cdcf1186f08f9d?width=150',
]

const BUSINESS_DAY_OF_WEEK_VALUES: BusinessDayOfWeek[] = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
]

const addDaysToDateString = (value: string, daysToAdd: number) => {
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + daysToAdd)
  return date.toISOString().slice(0, 10)
}

const getBusinessDayOfWeekFromDate = (value: string): BusinessDayOfWeek => {
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return BUSINESS_DAY_OF_WEEK_VALUES[date.getUTCDay()] ?? 'SUNDAY'
}

const buildWeek = (startDate: string) => {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']

  return Array.from({ length: 8 }, (_, index) => {
    const dateString = addDaysToDateString(startDate, index)
    const date = new Date(`${dateString}T12:00:00Z`)

    return {
      key: dateString,
      label: days[date.getUTCDay()],
      num: date.getUTCDate(),
    }
  })
}

const formatSlotTime = (value: string, timezone: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
  }).format(date)
}

const formatDateLabel = (value: string, timezone: string) => {
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: timezone,
  }).format(date)
}

const getStaffImage = (staffMemberId: string) =>
  staffImages[
    Math.abs(
      [...staffMemberId].reduce((total, character) => total + character.charCodeAt(0), 0)
    ) % staffImages.length
  ]

function BookPageContent({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const searchParams = useSearchParams()
  const requestedServiceId = searchParams.get('serviceId') ?? searchParams.get('service')
  const [resolvedSlug, setResolvedSlug] = useState<string | null>(null)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(requestedServiceId)
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [availability, setAvailability] = useState<Availability | null>(null)
  const [selectedSlotStartAt, setSelectedSlotStartAt] = useState<string | null>(null)
  const [isLoadingStaff, setIsLoadingStaff] = useState(false)
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false)
  const [pageError, setPageError] = useState<string | null>(null)

  useEffect(() => {
    params.then(({ slug }) => setResolvedSlug(slug))
  }, [params])

  const { detail, isLoading, errorMessage } = useDiscoveryBusinessDetail(resolvedSlug ?? '')

  const businessToday = detail ? getCurrentDateInTimeZone(detail.business.timezone) : ''
  const maxSelectableDate = businessToday ? addDaysToDateString(businessToday, 7) : ''
  const week = useMemo(
    () => (businessToday ? buildWeek(businessToday) : []),
    [businessToday]
  )
  const closedDateKeys = useMemo(() => {
    if (!detail) return new Set<string>()

    return new Set(
      week
        .filter((day) =>
          detail.businessHours.some(
            (businessHour) => businessHour.dayOfWeek === getBusinessDayOfWeekFromDate(day.key) && businessHour.isClosed
          )
        )
        .map((day) => day.key)
    )
  }, [detail, week])
  const firstSelectableDate = useMemo(
    () => week.find((day) => !closedDateKeys.has(day.key))?.key ?? businessToday,
    [businessToday, closedDateKeys, week]
  )
  const selectedService = useMemo(
    () => detail?.services.find((service) => service.id === selectedServiceId) ?? detail?.services[0] ?? null,
    [detail?.services, selectedServiceId]
  )
  const visibleSlots = useMemo(
    () =>
      availability?.slots.filter((slot) => {
        const slotTimestamp = new Date(slot.startAt).getTime()
        return Number.isFinite(slotTimestamp) && slotTimestamp > Date.now()
      }) ?? [],
    [availability?.slots]
  )
  const selectedStaff = useMemo(
    () => staffMembers.find((staffMember) => staffMember.id === selectedStaffId) ?? null,
    [selectedStaffId, staffMembers]
  )
  const selectedSlot = useMemo(
    () => visibleSlots.find((slot) => slot.startAt === selectedSlotStartAt) ?? null,
    [selectedSlotStartAt, visibleSlots]
  )
  const selectedDateIsClosed = closedDateKeys.has(selectedDate)

  useEffect(() => {
    if (!detail?.services.length) return

    const requestedService = requestedServiceId
      ? detail.services.find((service) => service.id === requestedServiceId)
      : null

    setSelectedServiceId(requestedService?.id ?? detail.services[0]?.id ?? null)
  }, [detail?.services, requestedServiceId])

  useEffect(() => {
    if (!businessToday) return

    setSelectedDate((currentValue) => {
      if (
        !currentValue ||
        currentValue < businessToday ||
        currentValue > maxSelectableDate ||
        closedDateKeys.has(currentValue)
      ) {
        return firstSelectableDate
      }

      return currentValue
    })
  }, [businessToday, closedDateKeys, firstSelectableDate, maxSelectableDate])

  useEffect(() => {
    if (!visibleSlots.length) {
      setSelectedSlotStartAt(null)
      return
    }

    if (!selectedSlotStartAt || !visibleSlots.some((slot) => slot.startAt === selectedSlotStartAt)) {
      setSelectedSlotStartAt(null)
    }
  }, [selectedSlotStartAt, visibleSlots])

  useEffect(() => {
    if (!detail || !selectedService) {
      setStaffMembers([])
      setSelectedStaffId(null)
      return
    }

    const businessId = detail.business.id
    const serviceId = selectedService.id

    let ignore = false

    async function loadStaffMembers() {
      setIsLoadingStaff(true)
      setPageError(null)
      setSelectedStaffId(null)
      setSelectedSlotStartAt(null)
      setAvailability(null)

      try {
        const response = await fetch(
          `/api/discovery/businesses/id/${businessId}/services/${serviceId}/staff-members`,
          {
            method: 'GET',
            cache: 'no-store',
          }
        )

        const payload = (await response.json()) as ServiceStaffAssignmentResponse | ApiErrorResponse
        if (ignore) return

        if (!response.ok) {
          setStaffMembers([])
          setPageError(getApiErrorMessage(payload, 'We could not load available professionals right now.'))
          return
        }

        const nextStaffMembers = (payload as ServiceStaffAssignmentResponse).staffMembers
        setStaffMembers(nextStaffMembers)
        setSelectedStaffId(nextStaffMembers[0]?.id ?? null)
      } catch {
        if (!ignore) {
          setStaffMembers([])
          setPageError('We could not load available professionals right now.')
        }
      } finally {
        if (!ignore) {
          setIsLoadingStaff(false)
        }
      }
    }

    void loadStaffMembers()

    return () => {
      ignore = true
    }
  }, [detail, selectedService])

  useEffect(() => {
    if (!detail || !selectedService || !selectedStaffId || !selectedDate || selectedDateIsClosed) {
      setAvailability(null)
      setSelectedSlotStartAt(null)
      return
    }

    const businessId = detail.business.id
    const serviceId = selectedService.id
    const staffMemberId = selectedStaffId

    let ignore = false

    async function loadAvailability() {
      setIsLoadingAvailability(true)
      setPageError(null)
      setSelectedSlotStartAt(null)

      try {
        const query = new URLSearchParams({
          date: selectedDate,
          staff_member_id: staffMemberId,
        })

        const response = await fetch(
          `/api/discovery/businesses/id/${businessId}/services/${serviceId}/availability?${query.toString()}`,
          {
            method: 'GET',
            cache: 'no-store',
          }
        )

        const payload = (await response.json()) as AvailabilityResponse | ApiErrorResponse
        if (ignore) return

        if (!response.ok) {
          setAvailability(null)
          setPageError(getApiErrorMessage(payload, 'We could not load availability right now.'))
          return
        }

        setAvailability((payload as AvailabilityResponse).availability)
      } catch {
        if (!ignore) {
          setAvailability(null)
          setPageError('We could not load availability right now.')
        }
      } finally {
        if (!ignore) {
          setIsLoadingAvailability(false)
        }
      }
    }

    void loadAvailability()

    return () => {
      ignore = true
    }
  }, [detail, selectedDate, selectedDateIsClosed, selectedService, selectedStaffId])

  if (!resolvedSlug || isLoading) {
    return (
      <div className="min-h-screen bg-[#EFF4FF]">
        <CustomerTopBar />
        <div className="px-4 md:px-8 py-10">
          <div className="h-96 animate-pulse rounded-[28px] bg-white" />
        </div>
      </div>
    )
  }

  if (!detail || !selectedService) {
    return (
      <div className="min-h-screen bg-[#EFF4FF]">
        <CustomerTopBar />
        <div className="mx-auto max-w-3xl px-4 py-10">
          <Alert variant="destructive" className="rounded-3xl">
            <AlertTitle>Booking unavailable</AlertTitle>
            <AlertDescription>
              {errorMessage ?? 'We could not load this booking flow right now.'}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const canConfirm = Boolean(selectedStaff && selectedSlot)
  const availabilityTimezone = availability?.timezone ?? detail.business.timezone
  const availabilityDurationMinutes = availability?.durationMinutes ?? selectedService.durationMinutes
  const businessCoverImage = getBusinessCoverUrl(detail.media)
  const businessLogoImage = getBusinessLogoUrl(detail.media)
  const checkoutHref = canConfirm
    ? `/businesses/${resolvedSlug}/checkout?serviceId=${encodeURIComponent(selectedService.id)}&staffId=${encodeURIComponent(selectedStaff!.id)}&startAt=${encodeURIComponent(selectedSlot!.startAt)}`
    : '#'

  return (
    <div className="min-h-screen bg-[#EFF4FF]">
      <CustomerTopBar />

      <div className="bg-[#0D1F35] px-4 md:px-8 py-2.5">
        <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-teal-300">
          {detail.business.name}
          <span className="text-white/40 mx-2">/</span>
          Book a Service
          <span className="text-white/40 mx-2">/</span>
          <span className="text-white/70">Select Professional &amp; Time</span>
        </p>
      </div>

      <div className="px-4 md:px-8 py-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Link
            href={`/businesses/${resolvedSlug}`}
            className="flex items-center gap-2 text-[10px] font-bold tracking-[0.12em] uppercase text-slate-500 hover:text-slate-800 mb-2 transition w-fit"
          >
            <svg width="14" height="10" viewBox="0 0 20 14" fill="none">
              <path d="M7 14L0 7L7 0L8.4 1.4L3.825 6H20V8H3.825L8.425 12.6L7 14Z" fill="currentColor"/>
            </svg>
            Back to Business
          </Link>
          <h1 className="font-manrope text-2xl md:text-3xl font-extrabold text-[#0B1C30] tracking-tight">
            Staff Selection &amp; Availability
          </h1>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <label className="text-sm font-medium text-slate-700">
            <span className="sr-only">Select service</span>
            <select
              value={selectedService.id}
              onChange={(event) => setSelectedServiceId(event.target.value)}
              className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30]"
            >
              {detail.services.map((service) => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="px-4 md:px-8 pb-8 flex flex-col lg:flex-row gap-6 items-start">
        <div className="flex-1 min-w-0 flex flex-col gap-5">
          {pageError ? (
            <Alert variant="destructive" className="rounded-3xl">
              <AlertTitle>Booking flow issue</AlertTitle>
              <AlertDescription>{pageError}</AlertDescription>
            </Alert>
          ) : null}

          <div className="bg-white border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5 gap-4">
              <h2 className="font-manrope font-bold text-[#0B1C30] text-base">
                Available Professionals
              </h2>
              {isLoadingStaff ? <span className="text-xs font-semibold text-slate-400">Loading...</span> : null}
            </div>

            {staffMembers.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {staffMembers.map((member) => (
                  <button
                    key={member.id}
                    onClick={() => setSelectedStaffId(member.id)}
                    className={`flex flex-col items-center gap-2 p-3 border transition ${
                      selectedStaffId === member.id
                        ? 'border-[#0B1C30] bg-[#EFF4FF]'
                        : 'border-slate-200 hover:border-slate-400 bg-[#F8F9FF] cursor-pointer'
                    }`}
                  >
                    <div className="relative">
                      <div className="w-14 h-14 overflow-hidden bg-slate-200">
                        <Image
                          src={getStaffImage(member.id)}
                          alt={member.displayName}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover grayscale"
                        />
                      </div>
                      <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-white bg-emerald-500" />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-[#0B1C30] leading-tight">{member.displayName}</p>
                      <p className="text-[9px] font-black tracking-widest uppercase mt-0.5 text-emerald-600">
                        {member.roleTitle}
                      </p>
                    </div>
                    {selectedStaffId === member.id ? (
                      <div className="w-full h-0.5 bg-[#0B1C30] mt-1" />
                    ) : null}
                  </button>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                No bookable professionals are assigned to this service yet.
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 shadow-sm px-5 py-4">
            <div className="grid grid-cols-4 gap-1 md:grid-cols-8">
              {week.map((day) => (
                <button
                  key={day.key}
                  disabled={closedDateKeys.has(day.key)}
                  onClick={() => setSelectedDate(day.key)}
                  className={`flex flex-col items-center py-3 px-1 transition ${
                    closedDateKeys.has(day.key)
                        ? 'bg-slate-50 text-slate-300 cursor-not-allowed'
                        : selectedDate === day.key
                          ? 'bg-[#0B1C30] text-white'
                          : 'hover:bg-slate-100 text-[#0B1C30]'
                  }`}
                >
                  <span className={`text-[9px] font-bold tracking-widest uppercase mb-1 ${
                    closedDateKeys.has(day.key)
                      ? 'text-slate-400'
                      : selectedDate === day.key
                        ? 'text-white/60'
                        : 'text-slate-500'
                  }`}>
                    {day.label}
                  </span>
                  <span className="text-lg font-black leading-none">{day.num}</span>
                  {closedDateKeys.has(day.key) ? (
                    <span className="mt-1 text-[8px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Closed
                    </span>
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[10px] font-black tracking-[0.14em] uppercase text-slate-600">
                Daily Schedule Matrix
              </h2>
              <p className="text-[10px] font-medium text-slate-400 tracking-wide">
                Time Zone: {detail.business.timezone}
              </p>
            </div>

            {!selectedStaff ? (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                Select a professional to see live bookable slots for {formatDateLabel(selectedDate, detail.business.timezone)}.
              </div>
            ) : selectedDateIsClosed ? (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                This business is closed on {formatDateLabel(selectedDate, detail.business.timezone)}.
                Choose another day to continue.
              </div>
            ) : isLoadingAvailability ? (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="h-20 animate-pulse rounded-2xl bg-slate-100" />
                ))}
              </div>
            ) : visibleSlots.length ? (
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {visibleSlots.map((slot) => {
                  const isSelected = selectedSlotStartAt === slot.startAt
                  return (
                    <button
                      key={slot.startAt}
                      onClick={() => setSelectedSlotStartAt(slot.startAt)}
                      className={`flex flex-col items-center py-3 border transition ${
                        isSelected
                          ? 'bg-[#0B1C30] text-white border-[#0B1C30]'
                          : 'bg-white border-slate-200 hover:border-slate-400 cursor-pointer'
                      }`}
                    >
                      <span className={`text-sm font-bold leading-none ${isSelected ? 'text-white' : 'text-[#0B1C30]'}`}>
                        {formatSlotTime(slot.startAt, availabilityTimezone)}
                      </span>
                      <span className={`text-[9px] font-bold tracking-wider uppercase mt-0.5 ${isSelected ? 'text-white/70' : 'text-slate-400'}`}>
                        {formatDurationLabel(availabilityDurationMinutes)}
                      </span>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                No bookable slots were generated for this date. Try another day or staff member.
              </div>
            )}
          </div>
        </div>

        <div className="hidden lg:flex flex-col gap-4 w-72 xl:w-80 flex-shrink-0 h-screen sticky top-0 overflow-y-auto">
          <div className="bg-white border border-slate-200 shadow-sm p-5">
            {businessCoverImage ? (
              <div className="relative mb-5 h-32 overflow-hidden rounded-2xl bg-slate-100">
                <Image
                  src={businessCoverImage}
                  alt={detail.business.name}
                  fill
                  className="object-cover"
                />
                {businessLogoImage ? (
                  <div className="absolute bottom-3 left-3 overflow-hidden rounded-2xl border border-white/70 bg-white shadow-sm">
                    <Image
                      src={businessLogoImage}
                      alt={`${detail.business.name} logo`}
                      width={48}
                      height={48}
                      className="h-12 w-12 object-contain p-2"
                    />
                  </div>
                ) : null}
              </div>
            ) : null}
            <p className="text-[9px] font-black tracking-[0.14em] uppercase text-slate-400 mb-2">
              Selected Service
            </p>
            <h2 className="font-manrope text-2xl font-extrabold text-[#0B1C30] mb-5">
              {selectedService.name}
            </h2>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Duration</span>
                <span className="text-sm font-bold text-[#0B1C30]">
                  {formatDurationLabel(selectedService.durationMinutes)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Base Price</span>
                <div className="text-right">
                  <p className="text-lg font-extrabold text-[#0B1C30]">
                    {formatCurrency(selectedService.priceAmount, selectedService.currency)}
                  </p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    Currency: {selectedService.currency}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">Category</span>
                <span className="text-xs font-black uppercase tracking-wide bg-[#0B1C30] text-white px-2.5 py-1">
                  {selectedService.serviceCategoryName}
                </span>
              </div>

              {selectedStaff ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Professional</span>
                  <span className="text-sm font-bold text-[#0B1C30]">{selectedStaff.displayName}</span>
                </div>
              ) : null}

              {selectedSlot ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">Selected slot</span>
                  <span className="text-sm font-bold text-[#0B1C30]">
                    {formatSlotTime(selectedSlot.startAt, detail.business.timezone)}
                  </span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="bg-[#EFF4FF] border border-slate-200 shadow-sm p-4 flex gap-3">
            <div className="w-10 h-10 bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M12 2V22M2 12H22" stroke="#0B1C30" strokeWidth="1.5"/>
              </svg>
            </div>
            <div>
              <p className="text-[9px] font-black tracking-[0.14em] uppercase text-slate-400 mb-0.5">
                Next step
              </p>
              <p className="text-sm font-bold text-[#0B1C30] mb-1">Review and confirm</p>
              <p className="text-xs text-slate-500 leading-snug">
                Continue to the confirmation screen to review the final reservation details before the booking is created.
              </p>
            </div>
          </div>

          <div className="bg-[#0B1C30] p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black tracking-widest uppercase text-white/40 mb-1">
                  Estimated Total
                </p>
                <p className="text-3xl font-extrabold text-white">
                  {formatCurrency(selectedService.priceAmount, selectedService.currency)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black tracking-widest uppercase text-white/40 mb-1">Status</p>
                <p className={`text-sm font-black tracking-wide uppercase ${canConfirm ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {canConfirm ? 'Ready' : 'Pending'}
                </p>
              </div>
            </div>

            <Link
              href={checkoutHref}
              onClick={(event) => {
                if (!canConfirm) {
                  event.preventDefault()
                }
              }}
              className={`block w-full text-center py-3.5 font-black tracking-[0.16em] uppercase text-sm transition ${
                canConfirm
                  ? 'bg-white text-[#0B1C30] hover:bg-slate-100'
                  : 'bg-white/20 text-white/40 cursor-not-allowed'
              }`}
            >
              Review Booking
            </Link>

            <p className="text-center text-[9px] font-bold tracking-[0.14em] uppercase text-white/25">
              {formatDateLabel(selectedDate, detail.business.timezone)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function BookPageFallback() {
  return (
    <div className="min-h-screen bg-[#EFF4FF]">
      <CustomerTopBar />
      <div className="px-4 py-10 md:px-8">
        <div className="h-96 animate-pulse rounded-[28px] bg-white" />
      </div>
    </div>
  )
}

export default function BookPage(props: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<BookPageFallback />}>
      <BookPageContent {...props} />
    </Suspense>
  )
}
