'use client'

import { useEffect, useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useManageBusinessSettingsContext } from '@/context/ManageBusinessSettingsContext'
import { getApiErrorMessage } from '@/lib/utils'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  BusinessHoursMutationResponse,
  BusinessHoursResponse,
  UpdateBusinessHoursPayload,
} from '@/types/business'
import {
  createDefaultBusinessHoursState,
  toBusinessHoursFormState,
  type BusinessHoursFormState,
} from '@/components/manage_business/settings/settings-utils'

export default function ManageBusinessSettingsHoursPage() {
  const { selectedBusiness } = useManageBusinessSettingsContext()

  const [businessHours, setBusinessHours] = useState<BusinessHoursFormState[]>(
    createDefaultBusinessHoursState
  )
  const [isLoadingBusinessHours, setIsLoadingBusinessHours] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedBusiness) {
      setBusinessHours(createDefaultBusinessHoursState())
      return
    }

    const businessId = selectedBusiness.id
    let ignore = false

    async function loadBusinessHours() {
      setIsLoadingBusinessHours(true)
      setErrorMessage(null)

      try {
        const response = await fetch(`/api/businesses/${businessId}/hours`, {
          method: 'GET',
          cache: 'no-store',
        })

        const payload = (await response.json()) as BusinessHoursResponse | ApiErrorResponse
        if (ignore) return

        if (!response.ok) {
          setBusinessHours(createDefaultBusinessHoursState())
          setErrorMessage(getApiErrorMessage(payload, 'We could not load business hours right now.'))
          return
        }

        setBusinessHours(toBusinessHoursFormState((payload as BusinessHoursResponse).hours))
      } catch {
        if (!ignore) {
          setBusinessHours(createDefaultBusinessHoursState())
          setErrorMessage('We could not load business hours right now.')
        }
      } finally {
        if (!ignore) {
          setIsLoadingBusinessHours(false)
        }
      }
    }

    void loadBusinessHours()

    return () => {
      ignore = true
    }
  }, [selectedBusiness])

  const updateBusinessHoursField = (
    dayOfWeek: BusinessHoursFormState['dayOfWeek'],
    field: 'openTime' | 'closeTime' | 'isClosed',
    value: string | boolean
  ) => {
    setBusinessHours((currentValue) =>
      currentValue.map((day) => {
        if (day.dayOfWeek !== dayOfWeek) return day

        if (field === 'isClosed') {
          const nextClosedState = Boolean(value)
          return {
            ...day,
            isClosed: nextClosedState,
            openTime: nextClosedState ? '' : day.openTime,
            closeTime: nextClosedState ? '' : day.closeTime,
          }
        }

        return {
          ...day,
          [field]: String(value),
        }
      })
    )
  }

  async function handleSaveHours() {
    if (!selectedBusiness) return

    setErrorMessage(null)
    setSuccessMessage(null)
    setIsSubmitting(true)

    const invalidHoursDay = businessHours.find(
      (day) => !day.isClosed && (!day.openTime.trim() || !day.closeTime.trim())
    )
    if (invalidHoursDay) {
      setErrorMessage(`Add both open and close times for ${invalidHoursDay.label}, or mark it closed.`)
      setIsSubmitting(false)
      return
    }

    const payload: UpdateBusinessHoursPayload = {
      hours: businessHours.map((day) => ({
        day_of_week: day.dayOfWeek,
        open_time: day.isClosed ? null : day.openTime,
        close_time: day.isClosed ? null : day.closeTime,
        is_closed: day.isClosed,
      })),
    }

    try {
      const response = await fetch(`/api/businesses/${selectedBusiness.id}/hours`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      const result = (await response.json()) as
        | BusinessHoursMutationResponse
        | ApiErrorResponse

      if (!response.ok) {
        setErrorMessage(getApiErrorMessage(result, 'We could not save business hours right now.'))
        return
      }

      setBusinessHours(toBusinessHoursFormState((result as BusinessHoursMutationResponse).hours))
      setSuccessMessage('Business hours saved successfully.')
    } catch {
      setErrorMessage('We could not save business hours right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!selectedBusiness) return null

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        {errorMessage ? (
          <Alert variant="destructive" className="mb-6 rounded-2xl">
            <AlertTitle>Hours issue</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        {successMessage ? (
          <Alert className="mb-6 rounded-2xl">
            <AlertTitle>Hours saved</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
              Hours
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">
              Weekly operating schedule
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
              Closed days appear unavailable to customers and also block new staff shifts from being
              created for that day.
            </p>
          </div>
          {isLoadingBusinessHours ? (
            <span className="text-xs font-semibold text-slate-400">Loading...</span>
          ) : null}
        </div>

        <div className="mt-5 grid gap-3">
          {businessHours.map((day) => (
            <div
              key={day.dayOfWeek}
              className={`grid gap-3 rounded-2xl border px-4 py-4 md:grid-cols-[120px_minmax(0,1fr)_140px] ${
                day.isClosed ? 'border-slate-200 bg-slate-50' : 'border-slate-200 bg-white'
              }`}
            >
              <div>
                <p className="text-sm font-semibold text-[#0B1C30]">{day.label}</p>
                <p className="mt-1 text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
                  {day.shortLabel}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Open
                  <input
                    type="time"
                    value={day.openTime}
                    disabled={day.isClosed || isLoadingBusinessHours}
                    onChange={(event) =>
                      updateBusinessHoursField(day.dayOfWeek, 'openTime', event.target.value)
                    }
                    className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </label>

                <label className="grid gap-2 text-sm font-medium text-slate-700">
                  Close
                  <input
                    type="time"
                    value={day.closeTime}
                    disabled={day.isClosed || isLoadingBusinessHours}
                    onChange={(event) =>
                      updateBusinessHoursField(day.dayOfWeek, 'closeTime', event.target.value)
                    }
                    className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </label>
              </div>

              <label className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
                <span>Closed all day</span>
                <input
                  type="checkbox"
                  checked={day.isClosed}
                  onChange={(event) =>
                    updateBusinessHoursField(day.dayOfWeek, 'isClosed', event.target.checked)
                  }
                  className="h-4 w-4 rounded border-slate-300 text-[#0B1C30] focus:ring-[#0B1C30]"
                />
              </label>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={() => void handleSaveHours()}
            disabled={isSubmitting || isLoadingBusinessHours}
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#0B1C30] px-6 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? 'Saving hours...' : 'Save hours'}
          </button>
        </div>
      </section>

      <aside className="grid gap-6 self-start">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
            Hours guidance
          </p>
          <div className="mt-4 grid gap-3 text-sm leading-relaxed text-slate-500">
            <p>Business hours define the outer boundary of when customer bookings can exist.</p>
            <p>Staff shifts on closed days are blocked, and availability is trimmed to the open window.</p>
            <p>Use this page to keep the booking calendar aligned with how the business really operates.</p>
          </div>
        </section>
      </aside>
    </div>
  )
}
