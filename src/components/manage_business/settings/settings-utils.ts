import type {
  Business,
  BusinessDayOfWeek,
  BusinessHoursDay,
  BusinessStatus,
} from '@/types/business'

export type SettingsFormState = {
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

export type BusinessHoursFormState = {
  dayOfWeek: BusinessDayOfWeek
  label: string
  shortLabel: string
  openTime: string
  closeTime: string
  isClosed: boolean
}

export const SETTINGS_CATEGORY_OPTIONS = [
  { value: 'BARBER', label: 'Barber' },
  { value: 'HAIR', label: 'Hair' },
  { value: 'NAILS', label: 'Nails' },
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'TUTOR', label: 'Tutor' },
  { value: 'ETC', label: 'Other Services' },
]

export const BUSINESS_HOURS_ROWS: Array<{
  dayOfWeek: BusinessDayOfWeek
  label: string
  shortLabel: string
}> = [
  { dayOfWeek: 'MONDAY', label: 'Monday', shortLabel: 'Mon' },
  { dayOfWeek: 'TUESDAY', label: 'Tuesday', shortLabel: 'Tue' },
  { dayOfWeek: 'WEDNESDAY', label: 'Wednesday', shortLabel: 'Wed' },
  { dayOfWeek: 'THURSDAY', label: 'Thursday', shortLabel: 'Thu' },
  { dayOfWeek: 'FRIDAY', label: 'Friday', shortLabel: 'Fri' },
  { dayOfWeek: 'SATURDAY', label: 'Saturday', shortLabel: 'Sat' },
  { dayOfWeek: 'SUNDAY', label: 'Sunday', shortLabel: 'Sun' },
]

export const createInitialSettingsFormState = (): SettingsFormState => ({
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

const formatTimeInputValue = (value: string | null) => (value ? value.slice(0, 5) : '')

export const createDefaultBusinessHoursState = (): BusinessHoursFormState[] =>
  BUSINESS_HOURS_ROWS.map((row) => ({
    ...row,
    openTime: '',
    closeTime: '',
    isClosed: true,
  }))

export const toBusinessHoursFormState = (
  hours: BusinessHoursDay[]
): BusinessHoursFormState[] => {
  const businessHoursMap = new Map(hours.map((hour) => [hour.dayOfWeek, hour]))

  return BUSINESS_HOURS_ROWS.map((row) => {
    const businessHour = businessHoursMap.get(row.dayOfWeek)
    return {
      ...row,
      openTime: formatTimeInputValue(businessHour?.openTime ?? null),
      closeTime: formatTimeInputValue(businessHour?.closeTime ?? null),
      isClosed: businessHour?.isClosed ?? true,
    }
  })
}

export const toSettingsFormState = (business: Business): SettingsFormState => ({
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

export const normalizeOptionalValue = (value: string) => {
  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}

export const getBusinessStatusClassName = (status: BusinessStatus | string) => {
  switch (String(status).toUpperCase()) {
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

export const formatBillingTypeLabel = (value: string) => {
  switch (value) {
    case 'PAY_AS_YOU_GO':
      return 'Pay as you go'
    case 'HYBRID':
      return 'Hybrid'
    case 'MONTHLY':
      return 'Monthly'
    default:
      return value
  }
}

export const formatDateLabel = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium' }).format(date)
}
