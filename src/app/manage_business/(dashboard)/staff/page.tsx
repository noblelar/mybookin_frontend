'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useMemo, useState, type FormEvent } from 'react'

import ManageBusinessShell from '@/components/manage_business/ManageBusinessShell'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { buildStaffSubNavItems } from '@/components/manage_business/workspace/staff-navigation'
import { getCurrentDateInTimeZone } from '@/lib/utils'
import type { Availability, AvailabilityResponse } from '@/types/availability'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  Business,
  BusinessDayOfWeek,
  BusinessHoursDay,
  BusinessHoursResponse,
  BusinessListResponse,
} from '@/types/business'
import type { Service, ServiceListResponse } from '@/types/service'
import type {
  OnboardStaffSuccessResponse,
  ServiceStaffAssignmentResponse,
  StaffInvitation,
  StaffInvitationListResponse,
  StaffListResponse,
  StaffMember,
  StaffMutationResponse,
  StaffShift,
  StaffShiftListResponse,
  StaffShiftMutationResponse,
  TimeOff,
  TimeOffListResponse,
  TimeOffMutationResponse,
} from '@/types/staff'

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

const buildTodayDate = () =>
  getCurrentDateInTimeZone(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC')

const BUSINESS_DAY_OF_WEEK_VALUES: BusinessDayOfWeek[] = [
  'SUNDAY',
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
]

const DEFAULT_BUSINESS_HOURS: BusinessHoursDay[] = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
].map((dayOfWeek, index) => ({
  id: `default-${index}`,
  businessId: '',
  dayOfWeek: dayOfWeek as BusinessDayOfWeek,
  openTime: null,
  closeTime: null,
  isClosed: true,
}))

const getBusinessDayOfWeekFromDate = (value: string): BusinessDayOfWeek => {
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  return BUSINESS_DAY_OF_WEEK_VALUES[date.getUTCDay()] ?? 'SUNDAY'
}

const addDaysToDateString = (value: string, daysToAdd: number) => {
  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(Date.UTC(year, month - 1, day))
  date.setUTCDate(date.getUTCDate() + daysToAdd)
  return date.toISOString().slice(0, 10)
}

const getWeekStartDate = (anchorDate: string) => {
  const offsets: Record<BusinessDayOfWeek, number> = {
    SUNDAY: -6,
    MONDAY: 0,
    TUESDAY: -1,
    WEDNESDAY: -2,
    THURSDAY: -3,
    FRIDAY: -4,
    SATURDAY: -5,
  }

  return addDaysToDateString(anchorDate, offsets[getBusinessDayOfWeekFromDate(anchorDate)] ?? 0)
}

const buildWeek = (anchorDate: string) => {
  const weekStartDate = getWeekStartDate(anchorDate)

  return Array.from({ length: 7 }).map((_, index) => {
    const dateString = addDaysToDateString(weekStartDate, index)
    const currentDate = new Date(`${dateString}T12:00:00Z`)

    return {
      key: dateString,
      label: currentDate.toLocaleDateString('en-GB', { weekday: 'short', timeZone: 'UTC' }).toUpperCase(),
      dateNumber: currentDate.getUTCDate(),
      dayOfWeek: getBusinessDayOfWeekFromDate(dateString),
    }
  })
}

const buildLocalDateTime = (date: string, time: string) => `${date}T${time}`

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

const formatInvitationStatusClassName = (status: string) => {
  switch (status.toUpperCase()) {
    case 'PENDING':
      return 'bg-amber-50 text-amber-700'
    case 'ACCEPTED':
      return 'bg-emerald-50 text-emerald-700'
    case 'EXPIRED':
    case 'REVOKED':
      return 'bg-slate-100 text-slate-600'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

const formatClockTime = (value: string) => value.slice(0, 5)

const formatDateLabel = (value: string) => {
  const date = new Date(`${value}T00:00:00`)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
  }).format(date)
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
    case 'UNAVAILABLE':
      return 'bg-amber-50 text-amber-700'
    case 'RESOURCE_BLOCKED':
      return 'bg-cyan-50 text-cyan-700'
    case 'PAST':
      return 'bg-slate-100 text-slate-600'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

const getAvailabilityStatusLabel = (status: Availability['timelineSlots'][number]['status']) => {
  switch (status) {
    case 'AVAILABLE':
      return 'Available'
    case 'BOOKED':
      return 'Booked'
    case 'UNAVAILABLE':
      return 'Unavailable'
    case 'RESOURCE_BLOCKED':
      return 'Resource blocked'
    case 'PAST':
      return 'Past'
    default:
      return status
  }
}

const toIsoStringFromLocalInput = (value: string) => {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date.toISOString()
}

const sortStaffMembers = (items: StaffMember[]) =>
  [...items].sort((leftValue, rightValue) =>
    leftValue.displayName.localeCompare(rightValue.displayName)
  )

const sortInvitations = (items: StaffInvitation[]) =>
  [...items].sort(
    (leftValue, rightValue) =>
      new Date(rightValue.createdAt).getTime() - new Date(leftValue.createdAt).getTime()
  )

const sortShifts = (items: StaffShift[]) =>
  [...items].sort((leftValue, rightValue) => {
    const leftKey = `${leftValue.shiftDate}T${leftValue.startTime}`
    const rightKey = `${rightValue.shiftDate}T${rightValue.startTime}`
    return leftKey.localeCompare(rightKey)
  })

const sortTimeOffEntries = (items: TimeOff[]) =>
  [...items].sort(
    (leftValue, rightValue) =>
      new Date(leftValue.startAt).getTime() - new Date(rightValue.startAt).getTime()
  )

function ManageBusinessStaffPageContent() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const selectedBusinessId = searchParams.get('businessId')

  const [businesses, setBusinesses] = useState<Business[]>([])
  const [businessHours, setBusinessHours] = useState<BusinessHoursDay[]>(DEFAULT_BUSINESS_HOURS)
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [invitations, setInvitations] = useState<StaffInvitation[]>([])
  const [assignedServiceStaff, setAssignedServiceStaff] = useState<StaffMember[]>([])
  const [assignedStaffIds, setAssignedStaffIds] = useState<string[]>([])
  const [selectedStaffId, setSelectedStaffId] = useState<string | null>(null)
  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
  const [shifts, setShifts] = useState<StaffShift[]>([])
  const [timeOff, setTimeOff] = useState<TimeOff[]>([])
  const [availability, setAvailability] = useState<Availability | null>(null)
  const [isLoadingBusinesses, setIsLoadingBusinesses] = useState(true)
  const [isLoadingWorkspace, setIsLoadingWorkspace] = useState(false)
  const [isLoadingBusinessHours, setIsLoadingBusinessHours] = useState(false)
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false)
  const [isLoadingSchedule, setIsLoadingSchedule] = useState(false)
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [weekAnchorDate, setWeekAnchorDate] = useState(buildTodayDate())
  const [availabilityDate, setAvailabilityDate] = useState(buildTodayDate())
  const [onboardEmail, setOnboardEmail] = useState('')
  const [onboardDisplayName, setOnboardDisplayName] = useState('')
  const [onboardRoleTitle, setOnboardRoleTitle] = useState('')
  const [staffEditorDisplayName, setStaffEditorDisplayName] = useState('')
  const [staffEditorRoleTitle, setStaffEditorRoleTitle] = useState('')
  const [shiftDate, setShiftDate] = useState(buildTodayDate())
  const [shiftStartTime, setShiftStartTime] = useState('09:00')
  const [shiftEndTime, setShiftEndTime] = useState('17:00')
  const [isOffShift, setIsOffShift] = useState(false)
  const [timeOffStartAt, setTimeOffStartAt] = useState(buildLocalDateTime(buildTodayDate(), '09:00'))
  const [timeOffEndAt, setTimeOffEndAt] = useState(buildLocalDateTime(buildTodayDate(), '17:00'))
  const [timeOffReason, setTimeOffReason] = useState('')
  const [isSubmittingOnboard, setIsSubmittingOnboard] = useState(false)
  const [isSavingStaffProfile, setIsSavingStaffProfile] = useState(false)
  const [isSavingAssignments, setIsSavingAssignments] = useState(false)
  const [isSavingShift, setIsSavingShift] = useState(false)
  const [isSavingTimeOff, setIsSavingTimeOff] = useState(false)
  const [isUpdatingStaffId, setIsUpdatingStaffId] = useState<string | null>(null)
  const [isDeletingShiftId, setIsDeletingShiftId] = useState<string | null>(null)
  const [isDeletingTimeOffId, setIsDeletingTimeOffId] = useState<string | null>(null)
  const [copiedInvitationId, setCopiedInvitationId] = useState<string | null>(null)

  const selectedBusiness = useMemo(
    () => businesses.find((business) => business.id === selectedBusinessId) ?? businesses[0] ?? null,
    [businesses, selectedBusinessId]
  )
  const businessHoursByDay = useMemo(
    () => new Map(businessHours.map((day) => [day.dayOfWeek, day])),
    [businessHours]
  )

  const selectedStaff = useMemo(
    () => staffMembers.find((staffMember) => staffMember.id === selectedStaffId) ?? staffMembers[0] ?? null,
    [selectedStaffId, staffMembers]
  )

  const selectedService = useMemo(
    () => services.find((service) => service.id === selectedServiceId) ?? services[0] ?? null,
    [selectedServiceId, services]
  )
  const previewSlots = availability?.timelineSlots.length ? availability.timelineSlots : availability?.slots ?? []
  const previewTimezone = availability?.timezone ?? selectedBusiness?.timezone ?? 'UTC'
  const previewDurationMinutes = availability?.durationMinutes ?? selectedService?.durationMinutes ?? 0

  const weekDays = useMemo(() => buildWeek(weekAnchorDate), [weekAnchorDate])
  const selectedShiftBusinessHours = useMemo(
    () => businessHoursByDay.get(getBusinessDayOfWeekFromDate(shiftDate)) ?? null,
    [businessHoursByDay, shiftDate]
  )
  const isSelectedShiftDayClosed = selectedShiftBusinessHours?.isClosed ?? false
  const isAvailabilityDateClosed = useMemo(
    () => businessHoursByDay.get(getBusinessDayOfWeekFromDate(availabilityDate))?.isClosed ?? false,
    [availabilityDate, businessHoursByDay]
  )

  const pendingInvitations = useMemo(
    () => invitations.filter((invitation) => invitation.status.toUpperCase() === 'PENDING'),
    [invitations]
  )

  const activeStaffMembers = useMemo(
    () => staffMembers.filter((staffMember) => staffMember.isActive),
    [staffMembers]
  )

  const inactiveAssignedStaff = useMemo(
    () => assignedServiceStaff.filter((staffMember) => !staffMember.isActive),
    [assignedServiceStaff]
  )

  const shiftsByDay = useMemo(() => {
    const counts = new Map<string, number>()
    for (const shift of shifts) {
      counts.set(shift.shiftDate, (counts.get(shift.shiftDate) ?? 0) + 1)
    }
    return counts
  }, [shifts])

  const businessScopedHref = (href: string) =>
    selectedBusiness ? `${href}?businessId=${selectedBusiness.id}` : href

  useEffect(() => {
    if (!selectedBusiness?.timezone) return

    const businessToday = getCurrentDateInTimeZone(selectedBusiness.timezone)
    setAvailabilityDate(businessToday)
    setWeekAnchorDate(businessToday)
    setShiftDate(businessToday)
    setTimeOffStartAt(buildLocalDateTime(businessToday, '09:00'))
    setTimeOffEndAt(buildLocalDateTime(businessToday, '17:00'))
  }, [selectedBusiness?.id, selectedBusiness?.timezone])

  useEffect(() => {
    if (!selectedBusinessId) {
      setBusinessHours(DEFAULT_BUSINESS_HOURS)
      return
    }

    let ignore = false

    async function loadBusinessHours() {
      setIsLoadingBusinessHours(true)

      try {
        const response = await fetch(`/api/businesses/${selectedBusinessId}/hours`, {
          method: 'GET',
          cache: 'no-store',
        })

        const payload = (await response.json()) as BusinessHoursResponse | ApiErrorResponse
        if (ignore) return

        if (!response.ok) {
          setErrorMessage(getApiErrorMessage(payload, 'We could not load business hours right now.'))
          setBusinessHours(DEFAULT_BUSINESS_HOURS)
          return
        }

        setBusinessHours((payload as BusinessHoursResponse).hours)
      } catch {
        if (!ignore) {
          setErrorMessage('We could not load business hours right now.')
          setBusinessHours(DEFAULT_BUSINESS_HOURS)
        }
      } finally {
        if (!ignore) setIsLoadingBusinessHours(false)
      }
    }

    void loadBusinessHours()

    return () => {
      ignore = true
    }
  }, [selectedBusinessId])

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

    const hasValidSelection = selectedBusinessId
      ? businesses.some((business) => business.id === selectedBusinessId)
      : false

    if (!hasValidSelection) {
      const params = new URLSearchParams(searchParams.toString())
      params.set('businessId', businesses[0].id)
      router.replace(`${pathname}?${params.toString()}`, { scroll: false })
    }
  }, [businesses, pathname, router, searchParams, selectedBusinessId])

  useEffect(() => {
    if (!selectedBusinessId) {
      setStaffMembers([])
      setServices([])
      setInvitations([])
      return
    }

    let ignore = false

    async function loadWorkspace() {
      setIsLoadingWorkspace(true)
      setErrorMessage(null)

      try {
        const [staffResponse, servicesResponse, invitationsResponse] = await Promise.all([
          fetch(`/api/businesses/${selectedBusinessId}/staff-members?include_inactive=true`, {
            method: 'GET',
            cache: 'no-store',
          }),
          fetch(`/api/businesses/${selectedBusinessId}/services?include_inactive=true`, {
            method: 'GET',
            cache: 'no-store',
          }),
          fetch(`/api/businesses/${selectedBusinessId}/staff-invitations`, {
            method: 'GET',
            cache: 'no-store',
          }),
        ])

        const [staffPayload, servicesPayload, invitationsPayload] = await Promise.all([
          staffResponse.json(),
          servicesResponse.json(),
          invitationsResponse.json(),
        ])

        if (ignore) return

        if (!staffResponse.ok) {
          setErrorMessage(getApiErrorMessage(staffPayload, 'We could not load staff members right now.'))
          setStaffMembers([])
        } else {
          const nextStaffMembers = sortStaffMembers((staffPayload as StaffListResponse).staffMembers)
          setStaffMembers(nextStaffMembers)
          setSelectedStaffId((currentValue) => {
            if (currentValue && nextStaffMembers.some((staffMember) => staffMember.id === currentValue)) {
              return currentValue
            }
            return nextStaffMembers[0]?.id ?? null
          })
        }

        if (!servicesResponse.ok) {
          setErrorMessage(getApiErrorMessage(servicesPayload, 'We could not load services right now.'))
          setServices([])
        } else {
          const nextServices = (servicesPayload as ServiceListResponse).services
          setServices(nextServices)
          setSelectedServiceId((currentValue) => {
            if (currentValue && nextServices.some((service) => service.id === currentValue)) {
              return currentValue
            }
            return nextServices[0]?.id ?? null
          })
        }

        if (!invitationsResponse.ok) {
          setErrorMessage(
            getApiErrorMessage(invitationsPayload, 'We could not load staff invitations right now.')
          )
          setInvitations([])
        } else {
          setInvitations(
            sortInvitations((invitationsPayload as StaffInvitationListResponse).invitations)
          )
        }
      } catch {
        if (!ignore) {
          setErrorMessage('We could not load the staff workspace right now.')
          setStaffMembers([])
          setServices([])
          setInvitations([])
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
    if (!selectedStaff) {
      setStaffEditorDisplayName('')
      setStaffEditorRoleTitle('')
      return
    }

    setStaffEditorDisplayName(selectedStaff.displayName)
    setStaffEditorRoleTitle(selectedStaff.roleTitle)
  }, [selectedStaff])

  useEffect(() => {
    if (!selectedBusinessId || !selectedService) {
      setAssignedServiceStaff([])
      setAssignedStaffIds([])
      return
    }

    let ignore = false

    async function loadAssignments() {
      setIsLoadingAssignments(true)

      try {
        const response = await fetch(
          `/api/businesses/${selectedBusinessId}/services/${selectedService.id}/staff-members?include_inactive=true`,
          {
            method: 'GET',
            cache: 'no-store',
          }
        )

        const payload = (await response.json()) as ServiceStaffAssignmentResponse | ApiErrorResponse
        if (ignore) return

        if (!response.ok) {
          setErrorMessage(
            getApiErrorMessage(payload, 'We could not load service assignments right now.')
          )
          setAssignedServiceStaff([])
          setAssignedStaffIds([])
          return
        }

        const nextAssignedStaff = (payload as ServiceStaffAssignmentResponse).staffMembers
        setAssignedServiceStaff(nextAssignedStaff)
        setAssignedStaffIds(
          nextAssignedStaff
            .filter((staffMember) => staffMember.isActive)
            .map((staffMember) => staffMember.id)
        )
      } catch {
        if (!ignore) {
          setErrorMessage('We could not load service assignments right now.')
          setAssignedServiceStaff([])
          setAssignedStaffIds([])
        }
      } finally {
        if (!ignore) setIsLoadingAssignments(false)
      }
    }

    void loadAssignments()

    return () => {
      ignore = true
    }
  }, [selectedBusinessId, selectedService])

  useEffect(() => {
    if (!selectedBusinessId || !selectedStaff) {
      setShifts([])
      setTimeOff([])
      return
    }

    let ignore = false

    async function loadSchedule() {
      setIsLoadingSchedule(true)

      try {
        const [shiftsResponse, timeOffResponse] = await Promise.all([
          fetch(`/api/businesses/${selectedBusinessId}/staff-members/${selectedStaff.id}/shifts`, {
            method: 'GET',
            cache: 'no-store',
          }),
          fetch(`/api/businesses/${selectedBusinessId}/staff-members/${selectedStaff.id}/time-off`, {
            method: 'GET',
            cache: 'no-store',
          }),
        ])

        const [shiftsPayload, timeOffPayload] = await Promise.all([
          shiftsResponse.json(),
          timeOffResponse.json(),
        ])

        if (ignore) return

        if (!shiftsResponse.ok) {
          setErrorMessage(getApiErrorMessage(shiftsPayload, 'We could not load shifts right now.'))
          setShifts([])
        } else {
          setShifts(sortShifts((shiftsPayload as StaffShiftListResponse).shifts))
        }

        if (!timeOffResponse.ok) {
          setErrorMessage(getApiErrorMessage(timeOffPayload, 'We could not load time off right now.'))
          setTimeOff([])
        } else {
          setTimeOff(sortTimeOffEntries((timeOffPayload as TimeOffListResponse).timeOff))
        }
      } catch {
        if (!ignore) {
          setErrorMessage('We could not load this staff schedule right now.')
          setShifts([])
          setTimeOff([])
        }
      } finally {
        if (!ignore) setIsLoadingSchedule(false)
      }
    }

    void loadSchedule()

    return () => {
      ignore = true
    }
  }, [selectedBusinessId, selectedStaff])

  useEffect(() => {
    if (!selectedBusinessId || !selectedService || !selectedStaff || isAvailabilityDateClosed) {
      setAvailability(null)
      return
    }

    let ignore = false

    async function loadAvailability() {
      setIsLoadingAvailability(true)

      try {
        const params = new URLSearchParams({ date: availabilityDate, staff_member_id: selectedStaff.id })
        const response = await fetch(
          `/api/businesses/${selectedBusinessId}/services/${selectedService.id}/availability?${params.toString()}`,
          {
            method: 'GET',
            cache: 'no-store',
          }
        )

        const payload = (await response.json()) as AvailabilityResponse | ApiErrorResponse
        if (ignore) return

        if (!response.ok) {
          setAvailability(null)
          return
        }

        setAvailability((payload as AvailabilityResponse).availability)
      } catch {
        if (!ignore) setAvailability(null)
      } finally {
        if (!ignore) setIsLoadingAvailability(false)
      }
    }

    void loadAvailability()

    return () => {
      ignore = true
    }
  }, [availabilityDate, isAvailabilityDateClosed, selectedBusinessId, selectedService, selectedStaff])

  const updateSelectedBusinessId = (businessId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('businessId', businessId)
    router.replace(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const toggleAssignedStaff = (staffMemberId: string) => {
    setAssignedStaffIds((currentValue) =>
      currentValue.includes(staffMemberId)
        ? currentValue.filter((value) => value !== staffMemberId)
        : [...currentValue, staffMemberId]
    )
  }

  async function handleOnboardStaff(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedBusinessId) return

    setIsSubmittingOnboard(true)
    setErrorMessage(null)
    setSuccessMessage(null)
    setCopiedInvitationId(null)

    try {
      const response = await fetch(`/api/businesses/${selectedBusinessId}/staff-members/onboard`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: onboardEmail,
          display_name: onboardDisplayName,
          role_title: onboardRoleTitle,
        }),
      })

      const payload = (await response.json()) as OnboardStaffSuccessResponse | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(payload, 'We could not onboard this team member right now.'))
        return
      }

      const result = payload as OnboardStaffSuccessResponse
      if (result.staffMember) {
        setStaffMembers((currentValue) =>
          sortStaffMembers([
            result.staffMember!,
            ...currentValue.filter((staffMember) => staffMember.id !== result.staffMember!.id),
          ])
        )
        setSelectedStaffId(result.staffMember.id)
      }
      if (result.invitation) {
        setInvitations((currentValue) =>
          sortInvitations([
            result.invitation!,
            ...currentValue.filter((invitation) => invitation.id !== result.invitation!.id),
          ])
        )
      }

      setOnboardEmail('')
      setOnboardDisplayName('')
      setOnboardRoleTitle('')
      setSuccessMessage(
        result.invitation?.inviteUrl
          ? `${result.message} Copy the invite link now before you refresh the page.`
          : result.message
      )
    } catch {
      setErrorMessage('We could not onboard this team member right now.')
    } finally {
      setIsSubmittingOnboard(false)
    }
  }

  async function handleCopyInviteLink(invitation: StaffInvitation) {
    if (!invitation.inviteUrl) {
      setErrorMessage('Invite links are only available immediately after they are created.')
      return
    }

    try {
      await navigator.clipboard.writeText(invitation.inviteUrl)
      setCopiedInvitationId(invitation.id)
      setSuccessMessage(`Invite link copied for ${invitation.email}.`)
    } catch {
      setErrorMessage('We could not copy the invite link right now.')
    }
  }

  async function handleSaveStaffProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedBusinessId || !selectedStaff) return

    setIsSavingStaffProfile(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(
        `/api/businesses/${selectedBusinessId}/staff-members/${selectedStaff.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            display_name: staffEditorDisplayName,
            role_title: staffEditorRoleTitle,
          }),
        }
      )

      const payload = (await response.json()) as StaffMutationResponse | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(payload, 'We could not update this staff profile right now.'))
        return
      }

      const updatedStaffMember = (payload as StaffMutationResponse).staffMember
      setStaffMembers((currentValue) =>
        sortStaffMembers(
          currentValue.map((staffMember) =>
            staffMember.id === updatedStaffMember.id ? updatedStaffMember : staffMember
          )
        )
      )
      setAssignedServiceStaff((currentValue) =>
        currentValue.map((staffMember) =>
          staffMember.id === updatedStaffMember.id ? updatedStaffMember : staffMember
        )
      )
      setSuccessMessage(payload.message)
    } catch {
      setErrorMessage('We could not update this staff profile right now.')
    } finally {
      setIsSavingStaffProfile(false)
    }
  }

  async function handleToggleStaffMember(staffMember: StaffMember) {
    if (!selectedBusinessId) return

    setIsUpdatingStaffId(staffMember.id)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(
        `/api/businesses/${selectedBusinessId}/staff-members/${staffMember.id}/active`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ is_active: !staffMember.isActive }),
        }
      )

      const payload = (await response.json()) as StaffMutationResponse | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(payload, 'We could not update this staff member right now.'))
        return
      }

      const updatedStaffMember = (payload as StaffMutationResponse).staffMember
      setStaffMembers((currentValue) =>
        sortStaffMembers(
          currentValue.map((item) => (item.id === updatedStaffMember.id ? updatedStaffMember : item))
        )
      )
      setAssignedServiceStaff((currentValue) =>
        currentValue.map((item) => (item.id === updatedStaffMember.id ? updatedStaffMember : item))
      )
      if (!updatedStaffMember.isActive) {
        setAssignedStaffIds((currentValue) => currentValue.filter((value) => value !== updatedStaffMember.id))
      }
      setSuccessMessage(payload.message)
    } catch {
      setErrorMessage('We could not update this staff member right now.')
    } finally {
      setIsUpdatingStaffId(null)
    }
  }

  async function handleSaveAssignments(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedBusinessId || !selectedService) return

    setIsSavingAssignments(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(
        `/api/businesses/${selectedBusinessId}/services/${selectedService.id}/staff-members`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ staff_member_ids: assignedStaffIds }),
        }
      )

      const payload = (await response.json()) as ServiceStaffAssignmentResponse | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(payload, 'We could not save service assignments right now.'))
        return
      }

      const nextAssignedStaff = (payload as ServiceStaffAssignmentResponse).staffMembers
      setAssignedServiceStaff(nextAssignedStaff)
      setAssignedStaffIds(
        nextAssignedStaff
          .filter((staffMember) => staffMember.isActive)
          .map((staffMember) => staffMember.id)
      )
      setSuccessMessage(payload.message)
    } catch {
      setErrorMessage('We could not save service assignments right now.')
    } finally {
      setIsSavingAssignments(false)
    }
  }

  async function handleCreateShift(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedBusinessId || !selectedStaff) return

    setIsSavingShift(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(
        `/api/businesses/${selectedBusinessId}/staff-members/${selectedStaff.id}/shifts`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            shift_date: shiftDate,
            start_time: shiftStartTime,
            end_time: shiftEndTime,
            is_off: isOffShift,
          }),
        }
      )

      const payload = (await response.json()) as StaffShiftMutationResponse | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(payload, 'We could not create this shift right now.'))
        return
      }

      setShifts((currentValue) => sortShifts([...currentValue, (payload as StaffShiftMutationResponse).shift]))
      setWeekAnchorDate(shiftDate)
      setShiftStartTime('09:00')
      setShiftEndTime('17:00')
      setIsOffShift(false)
      setSuccessMessage(payload.message)
    } catch {
      setErrorMessage('We could not create this shift right now.')
    } finally {
      setIsSavingShift(false)
    }
  }

  async function handleDeleteShift(shiftId: string) {
    if (!selectedBusinessId || !selectedStaff) return

    setIsDeletingShiftId(shiftId)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(
        `/api/businesses/${selectedBusinessId}/staff-members/${selectedStaff.id}/shifts/${shiftId}`,
        { method: 'DELETE' }
      )

      const payload = (await response.json()) as { message?: string } | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(payload, 'We could not delete this shift right now.'))
        return
      }

      setShifts((currentValue) => currentValue.filter((shift) => shift.id !== shiftId))
      setSuccessMessage(payload.message ?? 'Shift deleted successfully.')
    } catch {
      setErrorMessage('We could not delete this shift right now.')
    } finally {
      setIsDeletingShiftId(null)
    }
  }

  async function handleCreateTimeOff(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedBusinessId || !selectedStaff) return

    const startAt = toIsoStringFromLocalInput(timeOffStartAt)
    const endAt = toIsoStringFromLocalInput(timeOffEndAt)

    if (!startAt || !endAt) {
      setErrorMessage('Please enter a valid time-off window.')
      return
    }

    setIsSavingTimeOff(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(
        `/api/businesses/${selectedBusinessId}/staff-members/${selectedStaff.id}/time-off`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            start_at: startAt,
            end_at: endAt,
            reason: timeOffReason,
          }),
        }
      )

      const payload = (await response.json()) as TimeOffMutationResponse | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(payload, 'We could not create this time off block right now.'))
        return
      }

      setTimeOff((currentValue) =>
        sortTimeOffEntries([...currentValue, (payload as TimeOffMutationResponse).timeOff])
      )
      setTimeOffReason('')
      setSuccessMessage(payload.message)
    } catch {
      setErrorMessage('We could not create this time off block right now.')
    } finally {
      setIsSavingTimeOff(false)
    }
  }

  async function handleDeleteTimeOff(timeOffId: string) {
    if (!selectedBusinessId || !selectedStaff) return

    setIsDeletingTimeOffId(timeOffId)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(
        `/api/businesses/${selectedBusinessId}/staff-members/${selectedStaff.id}/time-off/${timeOffId}`,
        { method: 'DELETE' }
      )

      const payload = (await response.json()) as { message?: string } | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(payload, 'We could not delete this time off block right now.'))
        return
      }

      setTimeOff((currentValue) => currentValue.filter((entry) => entry.id !== timeOffId))
      setSuccessMessage(payload.message ?? 'Time off deleted successfully.')
    } catch {
      setErrorMessage('We could not delete this time off block right now.')
    } finally {
      setIsDeletingTimeOffId(null)
    }
  }

  return (
    <ManageBusinessShell
      activeNav="/manage_business/staff"
      subNavItems={buildStaffSubNavItems(selectedBusiness?.id ?? null)}
      activeSubNav={pathname}
    >
      {errorMessage ? (
        <Alert variant="destructive" className="mb-6 rounded-2xl">
          <AlertTitle>Staff workspace issue</AlertTitle>
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
          <div className="h-96 animate-pulse rounded-[28px] bg-white" />
        </div>
      ) : !businesses.length ? (
        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
            Team Operations
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
            No business selected yet
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
            Create a business first, then return here to invite team members, assign services,
            create shifts, and preview availability.
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
                  Team Operations
                </p>
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30] md:text-4xl">
                  Staff, invitations, and shift coverage
                </h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
                  Attach existing accounts instantly, invite future teammates by email, map staff to
                  services, and keep a close eye on the real availability customers will see.
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
                    <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                      {selectedBusiness.timezone}
                    </span>
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                Total staff
              </p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
                {staffMembers.length}
              </p>
            </article>
            <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                Active team
              </p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
                {activeStaffMembers.length}
              </p>
            </article>
            <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                Pending invites
              </p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
                {pendingInvitations.length}
              </p>
            </article>
            <article className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                Bookable services
              </p>
              <p className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
                {services.length}
              </p>
            </article>
          </section>

          <section className="grid gap-6 xl:grid-cols-[360px_minmax(0,1fr)]">
            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                Staff onboarding
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">
                Attach or invite teammates
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">
                If the email already belongs to a MyBookIns account, the person is attached
                immediately. Otherwise, a secure invite link is generated for them to complete later.
              </p>

              <form onSubmit={handleOnboardStaff} className="mt-5 grid gap-3">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Email
                  <input
                    type="email"
                    value={onboardEmail}
                    onChange={(event) => setOnboardEmail(event.target.value)}
                    placeholder="teammate@example.com"
                    className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Display name
                  <input
                    value={onboardDisplayName}
                    onChange={(event) => setOnboardDisplayName(event.target.value)}
                    placeholder="Alex Morgan"
                    className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                  />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Role title
                  <input
                    value={onboardRoleTitle}
                    onChange={(event) => setOnboardRoleTitle(event.target.value)}
                    placeholder="Senior Stylist"
                    className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                  />
                </label>
                <button
                  type="submit"
                  disabled={isSubmittingOnboard}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmittingOnboard ? 'Processing...' : 'Attach or invite'}
                </button>
              </form>

              <div className="mt-6 grid gap-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold text-[#0B1C30]">Invitation queue</p>
                  <span className="text-xs font-medium text-slate-400">
                    {pendingInvitations.length} pending
                  </span>
                </div>
                {invitations.length ? (
                  invitations.slice(0, 6).map((invitation) => (
                    <div key={invitation.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-semibold text-[#0B1C30]">{invitation.displayName}</p>
                          <p className="mt-1 text-xs text-slate-500">{invitation.email}</p>
                        </div>
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${formatInvitationStatusClassName(
                            invitation.status
                          )}`}
                        >
                          {invitation.status}
                        </span>
                      </div>
                      <p className="mt-3 text-xs text-slate-500">
                        {invitation.roleTitle} • Expires{' '}
                        {formatDateTimeLabel(invitation.expiresAt, selectedBusiness?.timezone ?? 'UTC')}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {invitation.inviteUrl ? (
                          <button
                            type="button"
                            onClick={() => handleCopyInviteLink(invitation)}
                            className="inline-flex h-9 items-center justify-center rounded-full border border-slate-200 bg-white px-4 text-xs font-semibold text-[#0B1C30] transition-colors hover:bg-slate-100"
                          >
                            {copiedInvitationId === invitation.id ? 'Copied' : 'Copy invite'}
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">
                            Copy links are available only immediately after creation.
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                    No staff invitations yet. Invite someone new or attach an existing user above.
                  </div>
                )}
              </div>
            </article>

            <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
              <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                      Team roster
                    </p>
                    <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">
                      Focus on one person at a time
                    </h2>
                  </div>
                  {isLoadingWorkspace ? (
                    <span className="text-xs font-semibold text-slate-400">Loading...</span>
                  ) : null}
                </div>
                <div className="mt-5 grid gap-3">
                  {staffMembers.length ? (
                    staffMembers.map((staffMember) => {
                      const isSelected = selectedStaff?.id === staffMember.id
                      return (
                        <button
                          type="button"
                          key={staffMember.id}
                          onClick={() => setSelectedStaffId(staffMember.id)}
                          className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
                            isSelected
                              ? 'border-[#0B1C30] bg-slate-50'
                              : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-[#0B1C30]">{staffMember.displayName}</p>
                              <p className="mt-1 text-sm text-slate-500">{staffMember.roleTitle}</p>
                            </div>
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                staffMember.isActive
                                  ? 'bg-emerald-50 text-emerald-700'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {staffMember.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="mt-3 text-xs text-slate-400">
                            Added {formatDateTimeLabel(staffMember.createdAt, selectedBusiness?.timezone ?? 'UTC')}
                          </p>
                        </button>
                      )
                    })
                  ) : (
                    <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-8 text-sm text-slate-500">
                      No team members yet. Use the onboarding panel to attach the first person.
                    </div>
                  )}
                </div>
              </article>

              <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                  Staff profile
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">
                  {selectedStaff ? selectedStaff.displayName : 'Select a staff member'}
                </h2>
                {selectedStaff ? (
                  <form onSubmit={handleSaveStaffProfile} className="mt-5 grid gap-3">
                    <label className="grid gap-2 text-sm font-medium text-slate-700">
                      Display name
                      <input
                        value={staffEditorDisplayName}
                        onChange={(event) => setStaffEditorDisplayName(event.target.value)}
                        className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-slate-700">
                      Role title
                      <input
                        value={staffEditorRoleTitle}
                        onChange={(event) => setStaffEditorRoleTitle(event.target.value)}
                        className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                      />
                    </label>
                    <div className="mt-2 flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={isSavingStaffProfile}
                        className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isSavingStaffProfile ? 'Saving...' : 'Save profile'}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStaffMember(selectedStaff)}
                        disabled={isUpdatingStaffId === selectedStaff.id}
                        className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isUpdatingStaffId === selectedStaff.id
                          ? 'Saving...'
                          : selectedStaff.isActive
                            ? 'Deactivate'
                            : 'Reactivate'}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="mt-5 rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                    Select a team member from the roster to edit their profile and active state.
                  </div>
                )}
              </article>
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Service assignments
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">
                    Decide who can deliver each service
                  </h2>
                </div>
                {isLoadingAssignments ? (
                  <span className="text-xs font-semibold text-slate-400">Loading...</span>
                ) : null}
              </div>

              {!services.length ? (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-200 px-5 py-8 text-sm text-slate-500">
                  Add services first, then return here to connect those services to active staff
                  members.
                  <div className="mt-4">
                    <Link
                      href={businessScopedHref('/manage_business/services')}
                      className="inline-flex h-10 items-center justify-center rounded-full bg-[#0B1C30] px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                    >
                      Open services workspace
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-5 grid gap-5">
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Focus service
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

                  <div className="grid gap-3 md:grid-cols-2">
                    {services.map((service) => (
                      <button
                        key={service.id}
                        type="button"
                        onClick={() => setSelectedServiceId(service.id)}
                        className={`rounded-2xl border px-4 py-4 text-left transition-colors ${
                          selectedService?.id === service.id
                            ? 'border-[#0B1C30] bg-slate-50'
                            : 'border-slate-200 bg-white hover:bg-slate-50'
                        }`}
                      >
                        <p className="text-sm font-semibold text-[#0B1C30]">{service.name}</p>
                        <p className="mt-1 text-xs text-slate-500">
                          {service.durationMinutes} mins • £{service.priceAmount}
                        </p>
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleSaveAssignments} className="grid gap-4">
                    <div className="grid gap-3">
                      {activeStaffMembers.length ? (
                        activeStaffMembers.map((staffMember) => (
                          <label
                            key={staffMember.id}
                            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                          >
                            <input
                              type="checkbox"
                              checked={assignedStaffIds.includes(staffMember.id)}
                              onChange={() => toggleAssignedStaff(staffMember.id)}
                              className="h-4 w-4 rounded border-slate-300 text-[#0B1C30] focus:ring-[#0B1C30]"
                            />
                            <span className="flex-1">
                              <span className="block font-semibold text-[#0B1C30]">{staffMember.displayName}</span>
                              <span className="block text-xs text-slate-500">{staffMember.roleTitle}</span>
                            </span>
                          </label>
                        ))
                      ) : (
                        <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                          Add or reactivate a staff member before assigning this service.
                        </div>
                      )}
                    </div>

                    {inactiveAssignedStaff.length ? (
                      <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                        {inactiveAssignedStaff.map((staffMember) => staffMember.displayName).join(', ')}{' '}
                        currently have historical assignments but need reactivation before they can
                        remain on the bookable schedule.
                      </div>
                    ) : null}

                    <div className="flex flex-wrap gap-3">
                      <button
                        type="submit"
                        disabled={isSavingAssignments || !selectedService}
                        className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isSavingAssignments ? 'Saving...' : 'Save assignments'}
                      </button>
                      <Link
                        href={businessScopedHref('/manage_business/services')}
                        className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50"
                      >
                        Edit services
                      </Link>
                    </div>
                  </form>
                </div>
              )}
            </article>

            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                Availability preview
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">
                {selectedStaff ? selectedStaff.displayName : 'Select a staff member'}
              </h2>

              {selectedService && selectedStaff ? (
                <div className="mt-5 grid gap-4">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-[#0B1C30]">{selectedService.name}</p>
                    <p className="mt-1 text-xs text-slate-500">
                      {selectedService.durationMinutes} mins • {selectedBusiness?.timezone}
                    </p>
                  </div>
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Date
                    <input
                      type="date"
                      value={availabilityDate}
                      onChange={(event) => setAvailabilityDate(event.target.value)}
                      className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                    />
                  </label>
                  <div className="space-y-2">
                    {isLoadingAvailability ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                        Checking availability...
                      </div>
                    ) : isAvailabilityDateClosed ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                        This business is closed on the selected date, so no customer-facing slots can
                        be generated.
                      </div>
                    ) : !previewSlots.length ? (
                      <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                        No slots were generated for this service-staff pair on the selected date.
                        Check shifts, business hours, time off, pooled resource capacity, existing
                        bookings, or whether the day is already in the past.
                      </div>
                    ) : (
                      previewSlots.slice(0, 12).map((slot) => (
                        <div
                          key={`${slot.staffMemberId}-${slot.startAt}`}
                          className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
                        >
                          <div>
                            <p className="text-sm font-semibold text-[#0B1C30]">
                              {slot.staffMemberDisplayName}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {formatSlotTime(slot.startAt, previewTimezone)} -{' '}
                              {formatSlotTime(slot.endAt, previewTimezone)}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em] ${getAvailabilityStatusClassName(
                                slot.status
                              )}`}
                            >
                              {getAvailabilityStatusLabel(slot.status)}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                              {previewDurationMinutes} min
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                  Select both a service and a staff member to preview the real bookable slots.
                </div>
              )}
            </article>
          </section>

          <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                    Shift governance
                  </p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">
                    {selectedStaff ? `Schedule ${selectedStaff.displayName}` : 'Select a staff member'}
                  </h2>
                </div>
                {isLoadingSchedule ? (
                  <span className="text-xs font-semibold text-slate-400">Loading...</span>
                ) : null}
              </div>

              {selectedStaff ? (
                <div className="mt-5 grid gap-5">
                  <div className="grid gap-2 sm:grid-cols-7">
                    {weekDays.map((weekDay) => {
                      const businessDay = businessHoursByDay.get(weekDay.dayOfWeek)
                      const isClosed = businessDay?.isClosed ?? false
                      const openTime = businessDay?.openTime?.slice(0, 5) ?? null
                      const closeTime = businessDay?.closeTime?.slice(0, 5) ?? null

                      return (
                        <button
                          type="button"
                          key={weekDay.key}
                          onClick={() => {
                            setWeekAnchorDate(weekDay.key)
                            setShiftDate(weekDay.key)
                          }}
                          className={`rounded-2xl border px-3 py-3 text-left transition-colors ${
                            shiftDate === weekDay.key
                              ? 'border-[#0B1C30] bg-slate-50'
                              : isClosed
                                ? 'border-slate-200 bg-slate-50 text-slate-400 hover:bg-slate-50'
                                : 'border-slate-200 bg-white hover:bg-slate-50'
                          }`}
                        >
                          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                            {weekDay.label}
                          </p>
                          <p className="mt-2 text-lg font-bold text-[#0B1C30]">{weekDay.dateNumber}</p>
                          <p className="mt-1 text-xs text-slate-500">
                            {isClosed
                              ? 'Closed'
                              : openTime && closeTime
                                ? `${openTime} - ${closeTime}`
                                : `${shiftsByDay.get(weekDay.key) ?? 0} shifts`}
                          </p>
                        </button>
                      )
                    })}
                  </div>

                  <form onSubmit={handleCreateShift} className="grid gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:grid-cols-4">
                    <label className="grid gap-2 text-sm font-medium text-slate-700">
                      Shift date
                      <input
                        type="date"
                        value={shiftDate}
                        onChange={(event) => setShiftDate(event.target.value)}
                        className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30]"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-slate-700">
                      Start
                      <input
                        type="time"
                        value={shiftStartTime}
                        disabled={isSelectedShiftDayClosed || isLoadingBusinessHours}
                        onChange={(event) => setShiftStartTime(event.target.value)}
                        className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-slate-700">
                      End
                      <input
                        type="time"
                        value={shiftEndTime}
                        disabled={isSelectedShiftDayClosed || isLoadingBusinessHours}
                        onChange={(event) => setShiftEndTime(event.target.value)}
                        className="h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </label>
                    <div className="grid gap-3">
                      <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700">
                        <input
                          type="checkbox"
                          checked={isOffShift}
                          disabled={isSelectedShiftDayClosed || isLoadingBusinessHours}
                          onChange={(event) => setIsOffShift(event.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-[#0B1C30] focus:ring-[#0B1C30]"
                        />
                        Mark as off
                      </label>
                      <button
                        type="submit"
                        disabled={isSavingShift || isSelectedShiftDayClosed || isLoadingBusinessHours}
                        className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                      >
                        {isSavingShift
                          ? 'Saving...'
                          : isSelectedShiftDayClosed
                            ? 'Business closed'
                            : 'Add shift'}
                      </button>
                    </div>
                  </form>

                  {isSelectedShiftDayClosed ? (
                    <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                      This day is marked closed in business hours, so new shifts cannot be added until
                      the business is opened for that weekday.
                    </div>
                  ) : null}

                  <div className="grid gap-3">
                    {shifts.length ? (
                      shifts.map((shift) => (
                        <div
                          key={shift.id}
                          className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row md:items-center md:justify-between"
                        >
                          <div>
                            <p className="text-sm font-semibold text-[#0B1C30]">
                              {formatDateLabel(shift.shiftDate)}
                            </p>
                            <p className="mt-1 text-sm text-slate-500">
                              {formatClockTime(shift.startTime)} - {formatClockTime(shift.endTime)}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                shift.isOff ? 'bg-amber-50 text-amber-700' : 'bg-emerald-50 text-emerald-700'
                              }`}
                            >
                              {shift.isOff ? 'Off block' : 'Working'}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDeleteShift(shift.id)}
                              disabled={isDeletingShiftId === shift.id}
                              className="inline-flex rounded-full border border-slate-200 px-3 py-1.5 text-xs font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isDeletingShiftId === shift.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                        No shifts yet. Add the first working window for this team member.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                  Select a staff member from the roster to manage shifts.
                </div>
              )}
            </article>

            <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                Time off
              </p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">
                Block absences and exceptions
              </h2>

              {selectedStaff ? (
                <div className="mt-5 grid gap-4">
                  <form onSubmit={handleCreateTimeOff} className="grid gap-3">
                    <label className="grid gap-2 text-sm font-medium text-slate-700">
                      Start
                      <input
                        type="datetime-local"
                        value={timeOffStartAt}
                        onChange={(event) => setTimeOffStartAt(event.target.value)}
                        className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-slate-700">
                      End
                      <input
                        type="datetime-local"
                        value={timeOffEndAt}
                        onChange={(event) => setTimeOffEndAt(event.target.value)}
                        className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                      />
                    </label>
                    <label className="grid gap-2 text-sm font-medium text-slate-700">
                      Reason
                      <textarea
                        value={timeOffReason}
                        onChange={(event) => setTimeOffReason(event.target.value)}
                        rows={4}
                        className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                      />
                    </label>
                    <button
                      type="submit"
                      disabled={isSavingTimeOff}
                      className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isSavingTimeOff ? 'Saving...' : 'Add time off'}
                    </button>
                  </form>

                  <div className="grid gap-3">
                    {timeOff.length ? (
                      timeOff.map((entry) => (
                        <div key={entry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-[#0B1C30]">{entry.reason}</p>
                              <p className="mt-1 text-xs text-slate-500">
                                {formatDateTimeLabel(entry.startAt, selectedBusiness?.timezone ?? 'UTC')} -{' '}
                                {formatDateTimeLabel(entry.endAt, selectedBusiness?.timezone ?? 'UTC')}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleDeleteTimeOff(entry.id)}
                              disabled={isDeletingTimeOffId === entry.id}
                              className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-[#0B1C30] transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {isDeletingTimeOffId === entry.id ? 'Deleting...' : 'Delete'}
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                        No time off recorded for this staff member yet.
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                  Select a staff member from the roster to manage time off windows.
                </div>
              )}
            </article>
          </section>
        </div>
      )}
    </ManageBusinessShell>
  )
}

function ManageBusinessStaffPageFallback() {
  return (
    <div className="min-h-screen bg-[#F1F5F9] p-5 md:p-6">
      <div className="grid gap-6">
        <div className="h-40 animate-pulse rounded-[28px] bg-white" />
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
          <div className="h-[720px] animate-pulse rounded-[28px] bg-white" />
          <div className="h-[520px] animate-pulse rounded-[28px] bg-white" />
        </div>
      </div>
    </div>
  )
}

export default function ManageBusinessStaffPage() {
  return (
    <Suspense fallback={<ManageBusinessStaffPageFallback />}>
      <ManageBusinessStaffPageContent />
    </Suspense>
  )
}
