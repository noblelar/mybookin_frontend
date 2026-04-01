type ClassValue = string | false | null | undefined

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ')
}

export function getApiErrorMessage(payload: unknown, fallback: string) {
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

export function formatCurrency(value: number | string, currency = 'GBP') {
  const numericValue = typeof value === 'number' ? value : Number.parseFloat(value)

  if (Number.isNaN(numericValue)) {
    return typeof value === 'string' ? value : '0.00'
  }

  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(numericValue)
}

export function formatDurationLabel(durationMinutes: number) {
  if (durationMinutes < 60) {
    return `${durationMinutes} mins`
  }

  const hours = Math.floor(durationMinutes / 60)
  const minutes = durationMinutes % 60
  if (!minutes) {
    return `${hours} hr${hours === 1 ? '' : 's'}`
  }

  return `${hours} hr ${minutes} mins`
}
