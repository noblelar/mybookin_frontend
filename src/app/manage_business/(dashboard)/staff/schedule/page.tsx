'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

import ManageBusinessShell from '@/components/manage_business/ManageBusinessShell'
import { buildStaffSubNavItems } from '@/components/manage_business/workspace/staff-navigation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getCurrentDateInTimeZone, getApiErrorMessage } from '@/lib/utils'
import type { Availability, AvailabilityResponse } from '@/types/availability'
import type { ApiErrorResponse } from '@/types/auth'
import type { Business, BusinessListResponse } from '@/types/business'
import type { Service, ServiceListResponse } from '@/types/service'
import type { StaffListResponse, StaffMember, StaffShiftListResponse, TimeOffListResponse, StaffShift, TimeOff } from '@/types/staff'

const formatSlotTime = (value: string, timezone: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
  }).format(date)
}

const formatDateLabel = (value: string) => {
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(date)
}

const formatDateTimeLabel = (value: string, timezone: string) => {
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

export default function ManageBusinessStaffSchedulePage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedBusinessId = searchParams.get('businessId')

  const [businesses, setBusinesses] = useState<Business[]>([])
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
  const [shifts, setShifts] = useState<StaffShift[]>([])
  const [timeOff, setTimeOff] = useState<TimeOff[]>([])
  const [availability, setAvailability] = useState<Availability | null>(null)
  const [availabilityDate, setAvailabilityDate] = useState(new Date().toISOString().slice(0, 10))
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true)
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(false)
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const setBusinessId = useCallback((businessId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('businessId', businessId)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }, [pathname, router, searchParams])

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
    if (!hasValidSelectedBusiness) setBusinessId(businesses[0].id)
  }, [businesses, selectedBusinessId, setBusinessId])

  const selectedBusiness = useMemo(
    () => businesses.find((business) => business.id === selectedBusinessId) ?? businesses[0] ?? null,
    [businesses, selectedBusinessId]
  )
  const selectedStaff = useMemo(
    () => staffMembers.find((staffMember) => staffMember.id === selectedStaffId) ?? staffMembers[0] ?? null,
    [selectedStaffId, staffMembers]
  )
  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) ?? services[0] ?? null,
    [selectedServiceId, services]
  )

  useEffect(() => {
    if (!selectedBusiness?.timezone) return
    setAvailabilityDate(getCurrentDateInTimeZone(selectedBusiness.timezone))
  }, [selectedBusiness?.id, selectedBusiness?.timezone])

  useEffect(() => {
    if (!selectedBusiness) {
      setStaffMembers([])
      setServices([])
      return
    }
    const businessId = selectedBusiness.id
    let ignore = false
    async function loadWorkspace() {
      setIsLoadingWorkspace(true)
      setErrorMessage(null)
      try {
        const [staffResponse, servicesResponse] = await Promise.all([
          fetch(`/api/businesses/${businessId}/staff-members?include_inactive=true`, {
            method: 'GET',
            cache: 'no-store',
          }),
          fetch(`/api/businesses/${businessId}/services?include_inactive=true`, {
            method: 'GET',
            cache: 'no-store',
          }),
        ])
        const [staffPayload, servicesPayload] = await Promise.all([
          staffResponse.json(),
          servicesResponse.json(),
        ])
        if (ignore) return
        if (staffResponse.ok) {
          const nextStaff = (staffPayload as StaffListResponse).staffMembers
          setStaffMembers(nextStaff)
          setSelectedStaffId((currentValue) => {
            if (currentValue && nextStaff.some((staffMember) => staffMember.id === currentValue)) return currentValue
            return nextStaff[0]?.id ?? null
          })
        } else {
          setStaffMembers([])
        }
        if (servicesResponse.ok) {
          const nextServices = (servicesPayload as ServiceListResponse).services
          setServices(nextServices)
          setSelectedServiceId((currentValue) => {
            if (currentValue && nextServices.some((service) => service.id === currentValue)) return currentValue
            return nextServices[0]?.id ?? null
          })
        } else {
          setServices([])
        }
      } catch {
        if (!ignore) {
          setStaffMembers([])
          setServices([])
          setErrorMessage('We could not load this staff workspace right now.')
        }
      } finally {
        if (!ignore) setIsLoadingWorkspace(false)
      }
    }
    void loadWorkspace()
    return () => {
      ignore = true
    }
  }, [selectedBusiness])

  useEffect(() => {
    if (!selectedBusiness || !selectedStaff) {
      setShifts([])
      setTimeOff([])
      setAvailability(null)
      return
    }
    const businessId = selectedBusiness.id
    const staffId = selectedStaff.id
    let ignore = false
    async function loadSchedule() {
      setIsLoadingSchedule(true)
      try {
        const requests = [
          fetch(`/api/businesses/${businessId}/staff-members/${staffId}/shifts`, {
            method: 'GET',
            cache: 'no-store',
          }),
          fetch(`/api/businesses/${businessId}/staff-members/${staffId}/time-off`, {
            method: 'GET',
            cache: 'no-store',
          }),
        ]
        if (selectedService) {
          requests.push(
            fetch(
              `/api/businesses/${businessId}/services/${selectedService.id}/availability?date=${encodeURIComponent(
                availabilityDate
              )}&staff_member_id=${encodeURIComponent(staffId)}`,
              { method: 'GET', cache: 'no-store' }
            )
          )
        }

        const responses = await Promise.all(requests)
        const payloads = await Promise.all(responses.map((response) => response.json()))
        if (ignore) return

        setShifts(responses[0].ok ? (payloads[0] as StaffShiftListResponse).shifts : [])
        setTimeOff(responses[1].ok ? (payloads[1] as TimeOffListResponse).timeOff : [])
        setAvailability(
          selectedService && responses[2]?.ok ? (payloads[2] as AvailabilityResponse).availability : null
        )
      } catch {
        if (!ignore) {
          setShifts([])
          setTimeOff([])
          setAvailability(null)
        }
      } finally {
        if (!ignore) setIsLoadingSchedule(false)
      }
    }
    void loadSchedule()
    return () => {
      ignore = true
    }
  }, [availabilityDate, selectedBusiness, selectedService, selectedStaff])

  const previewSlots = availability?.timelineSlots.length ? availability.timelineSlots : availability?.slots ?? []
  const previewTimezone = availability?.timezone ?? selectedBusiness?.timezone ?? 'UTC'

  return (
    <ManageBusinessShell
      activeNav="/manage_business/staff"
      subNavItems={buildStaffSubNavItems(selectedBusiness?.id ?? null)}
      activeSubNav={pathname}
    >
      {errorMessage ? (
        <Alert variant="destructive" className="mb-6 rounded-2xl">
          <AlertTitle>Schedule issue</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      ) : null}

      {isLoadingBusinesses ? (
        <div className="grid gap-6">
          <div className="h-40 animate-pulse rounded-[28px] bg-white" />
          <div className="h-[520px] animate-pulse rounded-[28px] bg-white" />
        </div>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                  Staff Workspace
                </p>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
                  Schedule and availability
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
                  Review one staff member&apos;s working windows, time off blocks, and service availability
                  without the rest of the team administration around it.
                </p>
              </div>

              <div className="grid gap-3 sm:min-w-[280px]">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Active business
                  <select
                    value={selectedBusiness?.id ?? ''}
                    onChange={(event) => setBusinessId(event.target.value)}
                    className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                  >
                    {businesses.map((business) => (
                      <option key={business.id} value={business.id}>
                        {business.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Team member
                  <select
                    value={selectedStaff?.id ?? ''}
                    onChange={(event) => setSelectedStaffId(event.target.value)}
                    className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                  >
                    {staffMembers.map((staffMember) => (
                      <option key={staffMember.id} value={staffMember.id}>
                        {staffMember.displayName}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <article className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Upcoming shifts
                    </p>
                    <h2 className="mt-2 text-xl font-bold tracking-tight text-[#0B1C30]">
                      Scheduled working windows
                    </h2>
                  </div>
                  <Link
                    href={selectedBusiness ? `/manage_business/staff?businessId=${selectedBusiness.id}` : '/manage_business/staff'}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50"
                  >
                    Edit in team tab
                  </Link>
                </div>
                <div className="mt-4 grid gap-3">
                  {shifts.length ? shifts.map((shift) => (
                    <div key={shift.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-[#0B1C30]">{formatDateLabel(shift.shiftDate)}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {shift.startTime.slice(0, 5)} - {shift.endTime.slice(0, 5)}
                      </p>
                    </div>
                  )) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
                      No shifts are currently scheduled for this team member.
                    </div>
                  )}
                </div>
              </article>

              <article className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Time off
                </p>
                <h2 className="mt-2 text-xl font-bold tracking-tight text-[#0B1C30]">
                  Blocked absence windows
                </h2>
                <div className="mt-4 grid gap-3">
                  {timeOff.length ? timeOff.map((entry) => (
                    <div key={entry.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-[#0B1C30]">{entry.reason}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatDateTimeLabel(entry.startAt, previewTimezone)} - {formatDateTimeLabel(entry.endAt, previewTimezone)}
                      </p>
                    </div>
                  )) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
                      No time off has been recorded for this team member.
                    </div>
                  )}
                </div>
              </article>
            </div>
          </section>

          <aside className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
              Availability preview
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">
              Service slots
            </h2>

            <div className="mt-5 grid gap-3">
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Service
                <select
                  value={selectedService?.id ?? ''}
                  onChange={(event) => setSelectedServiceId(event.target.value)}
                  className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                >
                  {services.map((service) => (
                    <option key={service.id} value={service.id}>
                      {service.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700">
                Date
                <input
                  type="date"
                  value={availabilityDate}
                  onChange={(event) => setAvailabilityDate(event.target.value)}
                  className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                />
              </label>
            </div>

            <div className="mt-5 space-y-2">
              {isLoadingWorkspace || isLoadingSchedule ? (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                  Checking availability...
                </div>
              ) : !previewSlots.length ? (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                  No slots were generated for this team member and service on the selected date.
                </div>
              ) : (
                previewSlots.slice(0, 10).map((slot) => (
                  <div key={`${slot.staffMemberId}-${slot.startAt}`} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-sm font-semibold text-[#0B1C30]">{slot.staffMemberDisplayName}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {formatSlotTime(slot.startAt, previewTimezone)} - {formatSlotTime(slot.endAt, previewTimezone)}
                    </p>
                  </div>
                ))
              )}
            </div>
          </aside>
        </div>
      )}
    </ManageBusinessShell>
  )
}
