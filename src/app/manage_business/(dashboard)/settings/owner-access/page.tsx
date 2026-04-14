'use client'

import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useManageBusinessSettingsContext } from '@/context/ManageBusinessSettingsContext'
import { getApiErrorMessage } from '@/lib/utils'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  StaffMember,
  StaffSelfMutationResponse,
  StaffSelfStatusResponse,
} from '@/types/staff'

export default function ManageBusinessSettingsOwnerAccessPage() {
  const { selectedBusiness } = useManageBusinessSettingsContext()

  const [ownerStaffMember, setOwnerStaffMember] = useState<StaffMember | null>(null)
  const [isLoadingOwnerStaff, setIsLoadingOwnerStaff] = useState(false)
  const [isSubmittingOwnerStaff, setIsSubmittingOwnerStaff] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    if (!selectedBusiness) {
      setOwnerStaffMember(null)
      return
    }

    const businessId = selectedBusiness.id
    let ignore = false

    async function loadOwnerStaffMembership() {
      setIsLoadingOwnerStaff(true)
      setErrorMessage(null)
      setSuccessMessage(null)

      try {
        const response = await fetch(`/api/businesses/${businessId}/staff-members/self`, {
          method: 'GET',
          cache: 'no-store',
        })

        const payload = (await response.json()) as StaffSelfStatusResponse | ApiErrorResponse
        if (ignore) return

        if (!response.ok) {
          setOwnerStaffMember(null)
          setErrorMessage(
            getApiErrorMessage(payload, 'We could not load owner staff membership right now.')
          )
          return
        }

        setOwnerStaffMember((payload as StaffSelfStatusResponse).staffMember)
      } catch {
        if (!ignore) {
          setOwnerStaffMember(null)
          setErrorMessage('We could not load owner staff membership right now.')
        }
      } finally {
        if (!ignore) {
          setIsLoadingOwnerStaff(false)
        }
      }
    }

    void loadOwnerStaffMembership()

    return () => {
      ignore = true
    }
  }, [selectedBusiness])

  const staffWorkspaceHref = selectedBusiness
    ? `/manage_business/staff?businessId=${selectedBusiness.id}`
    : '/manage_business/staff'

  const ownerStaffActionMethod = useMemo<'POST' | 'DELETE'>(() => {
    if (!ownerStaffMember || !ownerStaffMember.isActive) return 'POST'
    return 'DELETE'
  }, [ownerStaffMember])

  const ownerStaffActionLabel = useMemo(() => {
    if (!ownerStaffMember) return 'Add me as staff'
    if (ownerStaffMember.isActive) return 'Remove me as staff'
    return 'Reactivate me as staff'
  }, [ownerStaffMember])

  async function handleOwnerStaffAction(method: 'POST' | 'DELETE') {
    if (!selectedBusiness) return

    setErrorMessage(null)
    setSuccessMessage(null)
    setIsSubmittingOwnerStaff(true)

    try {
      const response = await fetch(`/api/businesses/${selectedBusiness.id}/staff-members/self`, {
        method,
      })

      const payload = (await response.json()) as StaffSelfMutationResponse | ApiErrorResponse
      if (!response.ok) {
        setErrorMessage(
          getApiErrorMessage(payload, 'We could not update owner staff access right now.')
        )
        return
      }

      const result = payload as StaffSelfMutationResponse
      setOwnerStaffMember(result.staffMember)
      setSuccessMessage(result.message)
    } catch {
      setErrorMessage('We could not update owner staff access right now.')
    } finally {
      setIsSubmittingOwnerStaff(false)
    }
  }

  if (!selectedBusiness) return null

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
      <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
        {errorMessage ? (
          <Alert variant="destructive" className="mb-6 rounded-2xl">
            <AlertTitle>Owner access issue</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
        ) : null}

        {successMessage ? (
          <Alert className="mb-6 rounded-2xl">
            <AlertTitle>Owner access updated</AlertTitle>
            <AlertDescription>{successMessage}</AlertDescription>
          </Alert>
        ) : null}

        <div className="border-b border-slate-100 pb-6">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
            Owner Access
          </p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">
            Owner scheduling and bookability
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-500">
            Decide whether the business owner should appear as a bookable staff member inside this
            business. Removing owner access deactivates the staff profile and clears service
            assignments while preserving history.
          </p>
        </div>

        <div className="mt-6 grid gap-5">
          {isLoadingOwnerStaff ? (
            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
              Checking owner staff status...
            </div>
          ) : ownerStaffMember ? (
            <div className="rounded-[28px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-lg font-bold text-[#0B1C30]">{ownerStaffMember.displayName}</p>
                <span
                  className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                    ownerStaffMember.isActive
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {ownerStaffMember.isActive ? 'Active staff' : 'Inactive staff'}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-500">{ownerStaffMember.roleTitle}</p>
              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                {ownerStaffMember.isActive
                  ? 'Customers can be booked with you once you are assigned to services and have active shifts.'
                  : 'Your owner staff record still exists, but it is inactive and no longer contributes to bookable availability.'}
              </p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
              You are not currently listed as staff for this business.
            </div>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="max-w-xl text-sm leading-relaxed text-slate-500">
            This control only affects whether the owner is available as staff. It does not change
            business ownership or owner access to the dashboard.
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => void handleOwnerStaffAction(ownerStaffActionMethod)}
              disabled={isSubmittingOwnerStaff || isLoadingOwnerStaff}
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmittingOwnerStaff ? 'Updating...' : ownerStaffActionLabel}
            </button>
            <Link
              href={staffWorkspaceHref}
              className="inline-flex h-11 items-center justify-center rounded-full border border-slate-200 px-5 text-sm font-semibold text-[#0B1C30] transition-colors hover:bg-slate-50"
            >
              Open staff workspace
            </Link>
          </div>
        </div>
      </section>

      <aside className="grid gap-6 self-start">
        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
            What this controls
          </p>
          <div className="mt-4 grid gap-3 text-sm leading-relaxed text-slate-500">
            <p>Adding yourself as staff makes you assignable to services and shifts like any other team member.</p>
            <p>Removing yourself here is useful when only other working members should be bookable.</p>
            <p>Historical bookings and audit records remain intact even after the owner staff profile is deactivated.</p>
          </div>
        </section>
      </aside>
    </div>
  )
}
