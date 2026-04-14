'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useMemo, useState } from 'react'

import ManageBusinessShell from '@/components/manage_business/ManageBusinessShell'
import { buildServicesSubNavItems } from '@/components/manage_business/workspace/services-navigation'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { getCurrentDateInTimeZone, getApiErrorMessage } from '@/lib/utils'
import type { Availability, AvailabilityResponse } from '@/types/availability'
import type { ApiErrorResponse } from '@/types/auth'
import type { Business, BusinessListResponse } from '@/types/business'
import type { ServiceResourceRuleListResponse } from '@/types/resource'
import type { Service, ServiceListResponse } from '@/types/service'
import type { ServiceStaffAssignmentResponse } from '@/types/staff'

const formatSlotTime = (value: string, timezone: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: timezone,
  }).format(date)
}

const getAvailabilityStatusClassName = (status: Availability['timelineSlots'][number]['status']) => {
  switch (status) {
    case 'AVAILABLE':
      return 'bg-emerald-50 text-emerald-700'
    case 'BOOKED':
      return 'bg-rose-50 text-rose-700'
    case 'RESOURCE_BLOCKED':
      return 'bg-cyan-50 text-cyan-700'
    case 'UNAVAILABLE':
      return 'bg-amber-50 text-amber-700'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

export default function ManageBusinessServicesOperationsPage() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedBusinessId = searchParams.get('businessId')

  const [businesses, setBusinesses] = useState<Business[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
  const [assignedStaff, setAssignedStaff] = useState<{ id: string; displayName: string; roleTitle: string; isActive: boolean }[]>([])
  const [resourceRules, setResourceRules] = useState<{ id: string; resourceName: string; resourceType: string; unitsRequired: number }[]>([])
  const [availability, setAvailability] = useState<Availability | null>(null)
  const [availabilityDate, setAvailabilityDate] = useState(new Date().toISOString().slice(0, 10))
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true)
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(false)
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

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) ?? services[0] ?? null,
    [services, selectedServiceId]
  )

  useEffect(() => {
    if (!selectedBusiness?.timezone) return
    setAvailabilityDate(getCurrentDateInTimeZone(selectedBusiness.timezone))
  }, [selectedBusiness?.id, selectedBusiness?.timezone])

  useEffect(() => {
    if (!selectedBusiness) {
      setServices([])
      return
    }
    const businessId = selectedBusiness.id
    let ignore = false
    async function loadServices() {
      setIsLoadingWorkspace(true)
      setErrorMessage(null)
      try {
        const response = await fetch(`/api/businesses/${businessId}/services?include_inactive=true`, {
          method: 'GET',
          cache: 'no-store',
        })
        const payload = (await response.json()) as ServiceListResponse | ApiErrorResponse
        if (ignore) return
        if (!response.ok) {
          setServices([])
          setErrorMessage(getApiErrorMessage(payload, 'We could not load services right now.'))
          return
        }
        const nextServices = (payload as ServiceListResponse).services
        setServices(nextServices)
        setSelectedServiceId((currentValue) => {
          if (currentValue && nextServices.some((service) => service.id === currentValue)) return currentValue
          return nextServices[0]?.id ?? null
        })
      } catch {
        if (!ignore) {
          setServices([])
          setErrorMessage('We could not load services right now.')
        }
      } finally {
        if (!ignore) setIsLoadingWorkspace(false)
      }
    }
    void loadServices()
    return () => {
      ignore = true
    }
  }, [selectedBusiness])

  useEffect(() => {
    if (!selectedBusiness || !selectedService) {
      setAssignedStaff([])
      setResourceRules([])
      setAvailability(null)
      return
    }
    const businessId = selectedBusiness.id
    const serviceId = selectedService.id
    let ignore = false
    async function loadOperations() {
      setIsLoadingWorkspace(true)
      try {
        const [staffResponse, rulesResponse, availabilityResponse] = await Promise.all([
          fetch(`/api/businesses/${businessId}/services/${serviceId}/staff-members?include_inactive=true`, { method: 'GET', cache: 'no-store' }),
          fetch(`/api/businesses/${businessId}/services/${serviceId}/resource-rules`, { method: 'GET', cache: 'no-store' }),
          fetch(`/api/businesses/${businessId}/services/${serviceId}/availability?date=${encodeURIComponent(availabilityDate)}`, { method: 'GET', cache: 'no-store' }),
        ])
        const [staffPayload, rulesPayload, availabilityPayload] = await Promise.all([
          staffResponse.json(),
          rulesResponse.json(),
          availabilityResponse.json(),
        ])
        if (ignore) return
        setAssignedStaff(
          staffResponse.ok ? (staffPayload as ServiceStaffAssignmentResponse).staffMembers : []
        )
        setResourceRules(
          rulesResponse.ok ? (rulesPayload as ServiceResourceRuleListResponse).rules : []
        )
        setAvailability(
          availabilityResponse.ok ? (availabilityPayload as AvailabilityResponse).availability : null
        )
      } catch {
        if (!ignore) {
          setAssignedStaff([])
          setResourceRules([])
          setAvailability(null)
        }
      } finally {
        if (!ignore) setIsLoadingWorkspace(false)
      }
    }
    void loadOperations()
    return () => {
      ignore = true
    }
  }, [availabilityDate, selectedBusiness, selectedService])

  const resourceWorkspaceHref = selectedBusiness
    ? `/manage_business/resources?businessId=${selectedBusiness.id}`
    : '/manage_business/resources'

  const previewSlots = availability?.timelineSlots.length ? availability.timelineSlots : availability?.slots ?? []
  const previewTimezone = availability?.timezone ?? selectedBusiness?.timezone ?? 'UTC'

  return (
    <ManageBusinessShell
      activeNav="/manage_business/services"
      subNavItems={buildServicesSubNavItems(selectedBusiness?.id ?? null)}
      activeSubNav={pathname}
    >
      {errorMessage ? (
        <Alert variant="destructive" className="mb-6 rounded-2xl">
          <AlertTitle>Service operations issue</AlertTitle>
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
                  Services Workspace
                </p>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
                  Service operations
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
                  Focus this view on who can deliver the selected service, what shared resources it
                  depends on, and whether live slots are actually generating.
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
                  Active service
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
              </div>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
              <article className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Assigned team
                    </p>
                    <h2 className="mt-2 text-xl font-bold tracking-tight text-[#0B1C30]">
                      People currently attached
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
                  {assignedStaff.length ? assignedStaff.map((staffMember) => (
                    <div key={staffMember.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-[#0B1C30]">{staffMember.displayName}</p>
                      <p className="mt-1 text-xs text-slate-500">{staffMember.roleTitle}</p>
                    </div>
                  )) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
                      No staff are currently assigned to this service.
                    </div>
                  )}
                </div>
              </article>

              <article className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Resource rules
                    </p>
                    <h2 className="mt-2 text-xl font-bold tracking-tight text-[#0B1C30]">
                      Shared capacity constraints
                    </h2>
                  </div>
                  <Link
                    href={resourceWorkspaceHref}
                    className="inline-flex h-10 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50"
                  >
                    Open resources
                  </Link>
                </div>
                <div className="mt-4 grid gap-3">
                  {resourceRules.length ? resourceRules.map((rule) => (
                    <div key={rule.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-3">
                      <p className="text-sm font-semibold text-[#0B1C30]">{rule.resourceName}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {rule.resourceType.toLowerCase()} | {rule.unitsRequired} required
                      </p>
                    </div>
                  )) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-4 py-6 text-sm text-slate-500">
                      No resource rules are configured for this service yet.
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
              Live slot timeline
            </h2>

            <label className="mt-5 grid gap-2 text-sm font-medium text-slate-700">
              Date
              <input
                type="date"
                value={availabilityDate}
                onChange={(event) => setAvailabilityDate(event.target.value)}
                className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
              />
            </label>

            <div className="mt-5 space-y-2">
              {isLoadingWorkspace ? (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                  Checking operations...
                </div>
              ) : !previewSlots.length ? (
                <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                  No slots were generated for this service on the selected date.
                </div>
              ) : (
                previewSlots.slice(0, 10).map((slot) => (
                  <div key={`${slot.staffMemberId}-${slot.startAt}`} className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-[#0B1C30]">{slot.staffMemberDisplayName}</p>
                      <p className="mt-1 text-xs text-slate-500">
                        {formatSlotTime(slot.startAt, previewTimezone)} - {formatSlotTime(slot.endAt, previewTimezone)}
                      </p>
                    </div>
                    <span className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${getAvailabilityStatusClassName(slot.status)}`}>
                      {slot.status}
                    </span>
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
