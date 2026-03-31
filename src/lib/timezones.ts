export type TimezoneGroup = {
  label: string
  values: string[]
}

const COMMON_TIMEZONES = [
  'UTC',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'Africa/Lagos',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
]

const FALLBACK_TIMEZONES = [
  'UTC',
  'Africa/Cairo',
  'Africa/Johannesburg',
  'Africa/Lagos',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/New_York',
  'America/Phoenix',
  'Asia/Bangkok',
  'Asia/Dubai',
  'Asia/Hong_Kong',
  'Asia/Jakarta',
  'Asia/Kolkata',
  'Asia/Seoul',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Melbourne',
  'Australia/Perth',
  'Australia/Sydney',
  'Europe/Amsterdam',
  'Europe/Berlin',
  'Europe/Dublin',
  'Europe/Lisbon',
  'Europe/London',
  'Europe/Madrid',
  'Europe/Paris',
  'Pacific/Auckland',
]

const TIMEZONE_REGION_LABELS: Record<string, string> = {
  Africa: 'Africa',
  America: 'Americas',
  Antarctica: 'Antarctica',
  Arctic: 'Arctic',
  Asia: 'Asia',
  Atlantic: 'Atlantic',
  Australia: 'Australia',
  Europe: 'Europe',
  Indian: 'Indian Ocean',
  Pacific: 'Pacific',
  UTC: 'UTC',
}

export const sortTimezones = (timezones: readonly string[]) => {
  return [...timezones].sort((leftValue, rightValue) => leftValue.localeCompare(rightValue))
}

export const dedupeTimezones = (timezones: readonly (string | null | undefined)[]) => {
  return sortTimezones(
    [...new Set(timezones.map((timezone) => timezone?.trim()).filter(Boolean) as string[])]
  )
}

export const getSupportedTimezoneValues = () => {
  try {
    const intlWithSupportedValues = Intl as typeof Intl & {
      supportedValuesOf?: (key: 'timeZone') => string[]
    }

    const timezones = intlWithSupportedValues.supportedValuesOf?.('timeZone')
    if (Array.isArray(timezones) && timezones.length > 0) {
      return dedupeTimezones(timezones)
    }
  } catch {
    // Fall through to the curated fallback list.
  }

  return dedupeTimezones(FALLBACK_TIMEZONES)
}

export const getTimezoneRegion = (timezone: string) => {
  return timezone.split('/')[0] ?? 'Other'
}

export const getTimezoneOptionLabel = (timezone: string) => {
  const parts = timezone.split('/')
  if (parts.length <= 1) {
    return timezone.replaceAll('_', ' ')
  }

  return parts.slice(1).join(' / ').replaceAll('_', ' ')
}

export const buildTimezoneGroups = (
  options: readonly string[],
  detectedTimezone: string | null,
  selectedTimezone: string
) => {
  const normalizedOptions = dedupeTimezones([...options, detectedTimezone, selectedTimezone])

  const commonTimezoneSet = new Set(COMMON_TIMEZONES)
  const currentTimezoneValues = detectedTimezone ? [detectedTimezone] : []
  const commonTimezoneValues = normalizedOptions.filter(
    (timezone) => timezone !== detectedTimezone && commonTimezoneSet.has(timezone)
  )

  const groupedByRegion = new Map<string, string[]>()

  normalizedOptions.forEach((timezone) => {
    if (timezone === detectedTimezone || commonTimezoneSet.has(timezone)) {
      return
    }

    const region = getTimezoneRegion(timezone)
    const regionValues = groupedByRegion.get(region) ?? []
    regionValues.push(timezone)
    groupedByRegion.set(region, regionValues)
  })

  const groups: TimezoneGroup[] = []

  if (currentTimezoneValues.length > 0) {
    groups.push({ label: 'Current device timezone', values: currentTimezoneValues })
  }

  if (commonTimezoneValues.length > 0) {
    groups.push({ label: 'Common timezones', values: commonTimezoneValues })
  }

  const regionalGroups = [...groupedByRegion.entries()]
    .sort(([leftRegion], [rightRegion]) => leftRegion.localeCompare(rightRegion))
    .map(([region, values]) => ({
      label: TIMEZONE_REGION_LABELS[region] ?? region,
      values: sortTimezones(values),
    }))

  return [...groups, ...regionalGroups]
}
