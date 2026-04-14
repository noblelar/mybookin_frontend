'use client'

import { Suspense, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'

import CustomerTopBar from '@/components/customer/CustomerTopBar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useDiscoveryBusinessDetail } from '@/hooks/useDiscoveryBusinessDetail'
import { buildLoginRedirectPath } from '@/lib/auth'
import { getBusinessCoverUrl, getBusinessLogoUrl } from '@/lib/media'
import { formatCurrency, formatDurationLabel, getApiErrorMessage } from '@/lib/utils'
import { useAuthContext } from '@/context/AuthContext'
import type { ApiErrorResponse } from '@/types/auth'
import type { BookingMutationResponse } from '@/types/booking'

const staffImages = [
  'https://api.builder.io/api/v1/image/assets/TEMP/b1300631cb29f01d963d09791de71f8683dafad9?width=150',
  'https://api.builder.io/api/v1/image/assets/TEMP/9983a564b8c383cdb8949630f0f164ead3fcfe4f?width=150',
  'https://api.builder.io/api/v1/image/assets/TEMP/8c088a9c7625c7b54fff538728cdcf1186f08f9d?width=150',
]

const getStaffImage = (staffMemberId: string) =>
  staffImages[
    Math.abs(
      [...staffMemberId].reduce((total, character) => total + character.charCodeAt(0), 0)
    ) % staffImages.length
  ]

const formatDateTime = (value: string, timezone: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: timezone,
  }).format(date)
}

function CheckoutPageContent({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { hasHydrated, session } = useAuthContext()

  const serviceId = searchParams.get('serviceId')
  const staffId = searchParams.get('staffId')
  const startAt = searchParams.get('startAt')

  const [resolvedSlug, setResolvedSlug] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    params.then(({ slug }) => setResolvedSlug(slug))
  }, [params])

  const { detail, isLoading, errorMessage: detailErrorMessage } = useDiscoveryBusinessDetail(
    resolvedSlug ?? ''
  )

  const selectedService = useMemo(
    () => detail?.services.find((service) => service.id === serviceId) ?? null,
    [detail?.services, serviceId]
  )
  const selectedStaff = useMemo(
    () => detail?.staffMembers.find((staffMember) => staffMember.id === staffId) ?? null,
    [detail?.staffMembers, staffId]
  )

  const returnUrl = resolvedSlug
    ? `/businesses/${resolvedSlug}/checkout?${searchParams.toString()}`
    : null

  async function handleConfirmBooking() {
    if (!detail || !selectedService || !selectedStaff || !startAt) return

    if (!hasHydrated) {
      return
    }

    if (!session) {
      router.push(buildLoginRedirectPath(returnUrl))
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await fetch(
        `/api/discovery/businesses/id/${detail.business.id}/services/${selectedService.id}/bookings`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            assigned_staff_id: selectedStaff.id,
            start_at: startAt,
            party_size: 1,
          }),
        }
      )

      const payload = (await response.json()) as BookingMutationResponse | ApiErrorResponse

      if (!response.ok) {
        if (response.status === 401) {
          router.push(buildLoginRedirectPath(returnUrl))
          return
        }

        setErrorMessage(getApiErrorMessage(payload, 'We could not create this booking right now.'))
        return
      }

      router.replace('/bookings?created=1')
      router.refresh()
    } catch {
      setErrorMessage('We could not create this booking right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!resolvedSlug || isLoading) {
    return (
      <div className="min-h-screen bg-[#EFF4FF]">
        <CustomerTopBar />
        <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
          <div className="h-[480px] animate-pulse rounded-[28px] bg-white" />
        </div>
      </div>
    )
  }

  if (!detail || !selectedService || !selectedStaff || !startAt) {
    return (
      <div className="min-h-screen bg-[#EFF4FF]">
        <CustomerTopBar />
        <div className="max-w-4xl mx-auto px-4 py-10">
          <Alert variant="destructive" className="rounded-3xl">
            <AlertTitle>Reservation details missing</AlertTitle>
            <AlertDescription>
              {detailErrorMessage ??
                'Select a service, professional, and time before opening the confirmation screen.'}
            </AlertDescription>
          </Alert>
          <Link
            href={resolvedSlug ? `/businesses/${resolvedSlug}/book` : '/discover'}
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#0B1C30] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Return to booking
          </Link>
        </div>
      </div>
    )
  }

  const depositAmount =
    Number.parseFloat(selectedService.depositAmount) > 0
      ? selectedService.depositAmount
      : null
  const canAttemptConfirmation = hasHydrated && !isSubmitting
  const businessCoverImage = getBusinessCoverUrl(detail.media)
  const businessLogoImage = getBusinessLogoUrl(detail.media)

  return (
    <div className="min-h-screen bg-[#EFF4FF]">
      <CustomerTopBar />
      <div className="max-w-5xl mx-auto px-4 py-10 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-start">
          <div className="flex flex-col gap-8">
            <Link
              href={`/businesses/${resolvedSlug}/book?serviceId=${encodeURIComponent(selectedService.id)}`}
              className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase text-slate-500 hover:text-slate-800 transition w-fit"
            >
              <svg width="16" height="16" viewBox="0 0 20 14" fill="none">
                <path d="M7 14L0 7L7 0L8.4 1.4L3.825 6H20V8H3.825L8.425 12.6L7 14Z" fill="currentColor"/>
              </svg>
              Back to booking
            </Link>

            <div>
              <h1 className="font-manrope text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
                Review your reservation
              </h1>
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                Confirm the final details below. Once submitted, the booking will appear in your protected bookings area.
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white border border-slate-200 p-4 shadow-sm rounded-[20px]">
              <div className="w-20 h-20 flex-shrink-0 overflow-hidden bg-slate-100 rounded-2xl">
                <Image
                  src={businessCoverImage ?? businessLogoImage ?? getStaffImage(selectedStaff.id)}
                  alt={detail.business.name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">
                  {detail.business.name}
                </span>
                <h2 className="font-manrope font-bold text-slate-900 text-base leading-snug">
                  {selectedService.name}
                </h2>
                <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                  <span>{formatDurationLabel(selectedService.durationMinutes)}</span>
                  <span>{formatDateTime(startAt, detail.business.timezone)}</span>
                </div>
              </div>
            </div>

            <div className="rounded-[20px] bg-white border border-slate-200 p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Assigned professional</p>
              <div className="mt-4 flex items-center gap-4">
                <div className="h-16 w-16 overflow-hidden rounded-2xl bg-slate-100">
                  <Image
                    src={getStaffImage(selectedStaff.id)}
                    alt={selectedStaff.displayName}
                    width={64}
                    height={64}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-lg font-bold text-[#0B1C30]">{selectedStaff.displayName}</p>
                  <p className="text-sm text-slate-500">{selectedStaff.roleTitle}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                <span className="text-sm text-slate-500">Service rate</span>
                <span className="text-sm font-semibold text-slate-900">
                  {formatCurrency(selectedService.priceAmount, selectedService.currency)}
                </span>
              </div>
              {depositAmount ? (
                <div className="flex justify-between items-center border-b border-slate-200 pb-4">
                  <span className="text-sm text-slate-500">Deposit due at booking</span>
                  <span className="text-sm font-semibold text-slate-900">
                    {formatCurrency(depositAmount, selectedService.currency)}
                  </span>
                </div>
              ) : null}
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-black uppercase tracking-wider text-slate-900">Total</span>
                <div className="text-right">
                  <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {formatCurrency(selectedService.priceAmount, selectedService.currency)}
                  </p>
                  <p className="text-[10px] font-bold tracking-widest uppercase text-slate-400 mt-0.5">
                    Currency: {selectedService.currency}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {errorMessage ? (
              <Alert variant="destructive" className="rounded-3xl">
                <AlertTitle>Confirmation issue</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) : null}

            <div>
              <h2 className="font-manrope text-2xl font-bold text-slate-900 mb-1">Confirmation</h2>
              <p className="text-slate-500 text-sm">
                We are ready to create this booking as soon as you confirm it.
              </p>
            </div>

            <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Customer session</p>
              {hasHydrated && session ? (
                <div className="mt-3 space-y-1">
                  <p className="text-lg font-bold text-[#0B1C30]">
                    {session.user.firstName || session.user.email}
                  </p>
                  <p className="text-sm text-slate-500">{session.user.email}</p>
                  <p className="text-xs uppercase tracking-[0.14em] text-emerald-600 font-semibold">
                    Ready to confirm
                  </p>
                </div>
              ) : (
                <div className="mt-3 space-y-3">
                  <p className="text-sm text-slate-500">
                    Sign in to attach this booking to your customer account.
                  </p>
                  <Link
                    href={buildLoginRedirectPath(returnUrl)}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50"
                  >
                    Sign in to continue
                  </Link>
                </div>
              )}
            </div>

            <div className="rounded-[20px] border border-slate-200 bg-white p-5 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">What happens next</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li>The booking is created immediately against your account.</li>
                <li>You can review or cancel it later from your bookings page.</li>
                <li>The business receives the reservation in its owner workspace.</li>
              </ul>
            </div>

            <div className="flex flex-col items-center gap-3 mt-2">
              <button
                onClick={handleConfirmBooking}
                disabled={!canAttemptConfirmation}
                className={`w-full flex items-center justify-center gap-3 py-4 font-bold tracking-wide text-sm uppercase transition ${
                  !canAttemptConfirmation
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-slate-900 text-white hover:bg-slate-700 cursor-pointer'
                }`}
              >
                {!hasHydrated
                  ? 'Loading session...'
                  : isSubmitting
                    ? 'Confirming booking...'
                    : !session
                      ? 'Sign in to confirm'
                      : 'Confirm booking'}
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
              <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-widest uppercase text-slate-400">
                Booking will be saved to your account instantly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CheckoutPageFallback() {
  return (
    <div className="min-h-screen bg-[#EFF4FF]">
      <CustomerTopBar />
      <div className="mx-auto max-w-5xl px-4 py-10 md:py-16">
        <div className="h-[480px] animate-pulse rounded-[28px] bg-white" />
      </div>
    </div>
  )
}

export default function CheckoutPage(props: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense fallback={<CheckoutPageFallback />}>
      <CheckoutPageContent {...props} />
    </Suspense>
  )
}
