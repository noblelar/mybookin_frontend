'use client'

import Link from 'next/link'
import { Copy, Loader2, Shield, ShieldAlert, Trash2, UserPlus } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useAuthContext } from '@/context/AuthContext'
import type { ApiErrorResponse } from '@/types/auth'
import type {
  AdminAccessSummaryResponse,
  AdminInvitation,
  AdminInvitationCreateSuccessResponse,
  AdminManagedUser,
  AdminRoleRemovalSuccessResponse,
} from '@/types/admin'

const formatDateTime = (value: string | null) => {
  if (!value) return 'Not set'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

const getDisplayName = (user: Pick<AdminManagedUser, 'firstName' | 'lastName' | 'email'>) => {
  const fullName = `${user.firstName} ${user.lastName}`.trim()
  return fullName || user.email
}

export default function UserManagementPage() {
  const { hasHydrated, session } = useAuthContext()
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')
  const [admins, setAdmins] = useState<AdminManagedUser[]>([])
  const [invitations, setInvitations] = useState<AdminInvitation[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const isSuperAdmin = useMemo(() => {
    return session?.user.roles.some((role) => role.toUpperCase() === 'SUPER_ADMIN') ?? false
  }, [session?.user.roles])

  useEffect(() => {
    if (!hasHydrated) return
    if (!isSuperAdmin) {
      setIsLoading(false)
      return
    }

    let cancelled = false

    async function fetchAccessSummary() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const response = await fetch('/api/admin/access', {
          method: 'GET',
          cache: 'no-store',
        })

        const payload = (await response.json()) as AdminAccessSummaryResponse | ApiErrorResponse
        if (!response.ok) {
          if (!cancelled) {
            setErrorMessage(
              'message' in payload ? payload.message : 'We could not load admin access right now.'
            )
          }
          return
        }

        const successPayload = payload as AdminAccessSummaryResponse
        if (!cancelled) {
          setAdmins(successPayload.admins)
          setInvitations(successPayload.invitations)
        }
      } catch {
        if (!cancelled) {
          setErrorMessage('We could not load admin access right now.')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void fetchAccessSummary()

    return () => {
      cancelled = true
    }
  }, [hasHydrated, isSuperAdmin])

  async function handleCreateInvitation(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    setIsSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch('/api/admin/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: inviteEmail }),
      })

      const payload = (await response.json()) as
        | AdminInvitationCreateSuccessResponse
        | ApiErrorResponse

      if (!response.ok) {
        setErrorMessage(
          'message' in payload ? payload.message : 'We could not create this admin invitation.'
        )
        return
      }

      const successPayload = payload as AdminInvitationCreateSuccessResponse
      setInvitations((currentValue) => [successPayload.invitation, ...currentValue])
      setInviteEmail('')
      setSuccessMessage(
        'Admin invitation created. Copy the invite link now, because the raw link is only shown at creation time.'
      )
    } catch {
      setErrorMessage('We could not create this admin invitation right now.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleCopyInvite(invitation: AdminInvitation) {
    if (!invitation.inviteUrl) {
      setErrorMessage('This invitation is missing its invite URL. Create a new invitation instead.')
      return
    }

    try {
      await navigator.clipboard.writeText(invitation.inviteUrl)
      setSuccessMessage(`Invite link copied for ${invitation.email}.`)
    } catch {
      setErrorMessage('We could not copy the invite link automatically.')
    }
  }

  async function handleRemoveAdmin(user: AdminManagedUser) {
    const confirmed = window.confirm(`Remove admin access for ${getDisplayName(user)}?`)
    if (!confirmed) return

    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const response = await fetch(`/api/admin/users/${user.userId}/admin-role`, {
        method: 'DELETE',
      })

      const payload = (await response.json()) as
        | AdminRoleRemovalSuccessResponse
        | ApiErrorResponse

      if (!response.ok) {
        setErrorMessage(
          'message' in payload ? payload.message : 'We could not remove admin access right now.'
        )
        return
      }

      setAdmins((currentValue) => currentValue.filter((item) => item.userId !== user.userId))
      setSuccessMessage(payload.message)
    } catch {
      setErrorMessage('We could not remove admin access right now.')
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      <div className="px-6 pb-1 pt-5">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[1.5px] text-slate-400">
          <span>Admin</span>
          <span>&rsaquo;</span>
          <span className="text-[#0B1C30]">User Management</span>
        </div>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4 px-6 pb-4 pt-2">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#0B1C30] md:text-3xl">
            User Management
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Super admins can invite platform admins, review active admin access, and remove admin
            roles without touching protected SUPER_ADMIN accounts.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded border border-slate-200 px-2 py-1 text-[10px] font-black uppercase tracking-[1.5px] text-slate-400">
            SUPER_ADMIN via CLI only
          </span>
        </div>
      </div>

      <div className="flex-1 px-6 pb-6">
        {!hasHydrated || isLoading ? (
          <div className="rounded-3xl border border-slate-200 bg-white px-6 py-12 text-center text-slate-500">
            <Loader2 className="mx-auto h-5 w-5 animate-spin text-slate-400" />
            <p className="mt-3 text-sm">Loading platform access controls...</p>
          </div>
        ) : !isSuperAdmin ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-6">
            <Alert variant="destructive">
              <AlertTitle>Super admin access required</AlertTitle>
              <AlertDescription>
                This workspace is reserved for SUPER_ADMIN accounts. Standard admins can use the
                rest of the admin dashboard, but admin onboarding and removal stay protected here.
              </AlertDescription>
            </Alert>
            <div className="mt-5">
              <Link
                href="/admin/dashboard"
                className="inline-flex rounded-full bg-[#0B1C30] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#16314f]"
              >
                Back to dashboard
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <div className="space-y-4">
              {errorMessage && (
                <Alert variant="destructive">
                  <AlertTitle>Something needs attention</AlertTitle>
                  <AlertDescription>{errorMessage}</AlertDescription>
                </Alert>
              )}

              {successMessage && (
                <Alert>
                  <AlertTitle>Updated</AlertTitle>
                  <AlertDescription>{successMessage}</AlertDescription>
                </Alert>
              )}

              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">
                      Invite Admin
                    </p>
                    <h2 className="mt-2 text-xl font-black tracking-tight text-[#0B1C30]">
                      Onboard a new admin
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      This creates a secure invite link for the `ADMIN` role only. SUPER_ADMIN stays
                      CLI-only.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-100 p-3 text-slate-500">
                    <UserPlus className="h-5 w-5" />
                  </div>
                </div>

                <form
                  onSubmit={handleCreateInvitation}
                  className="mt-5 flex flex-col gap-3 sm:flex-row"
                >
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={(event) => setInviteEmail(event.target.value)}
                    placeholder="admin@example.com"
                    className="h-12 flex-1 rounded-2xl border border-slate-200 px-4 text-sm text-slate-700 outline-none transition-colors focus:border-[#0B1C30]"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex h-12 items-center justify-center rounded-2xl bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#16314f] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isSubmitting ? 'Creating...' : 'Create invite'}
                  </button>
                </form>
              </section>

              <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">
                      Platform Admins
                    </p>
                    <h2 className="mt-2 text-xl font-black tracking-tight text-[#0B1C30]">
                      Active admin accounts
                    </h2>
                  </div>
                  <div className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-black uppercase tracking-[0.24em] text-slate-500">
                    {admins.length} total
                  </div>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
                  <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(140px,0.7fr)_minmax(120px,0.5fr)] gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    <span>Account</span>
                    <span>Roles</span>
                    <span>Action</span>
                  </div>
                  {admins.length === 0 ? (
                    <div className="px-4 py-6 text-sm text-slate-500">No admin users found yet.</div>
                  ) : (
                    admins.map((adminUser) => (
                      <div
                        key={adminUser.userId}
                        className="grid grid-cols-[minmax(0,1.2fr)_minmax(140px,0.7fr)_minmax(120px,0.5fr)] gap-3 border-b border-slate-100 px-4 py-4 last:border-b-0"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#0B1C30]">
                            {getDisplayName(adminUser)}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-500">{adminUser.email}</p>
                          <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-400">
                            Added {formatDateTime(adminUser.createdAt)}
                          </p>
                        </div>
                        <div className="flex flex-wrap items-start gap-2">
                          {adminUser.roles.map((role) => (
                            <span
                              key={`${adminUser.userId}-${role}`}
                              className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500"
                            >
                              {role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                            </span>
                          ))}
                          {adminUser.protected && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-amber-700">
                              <ShieldAlert className="h-3 w-3" />
                              CLI protected
                            </span>
                          )}
                        </div>
                        <div className="flex items-center">
                          {adminUser.removableAdmin ? (
                            <button
                              type="button"
                              onClick={() => handleRemoveAdmin(adminUser)}
                              className="inline-flex items-center gap-2 rounded-full border border-red-200 px-3 py-2 text-xs font-semibold text-red-700 transition-colors hover:bg-red-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Remove admin
                            </button>
                          ) : (
                            <span className="text-xs font-semibold text-slate-400">Protected</span>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-slate-400">
                    Invitations
                  </p>
                  <h2 className="mt-2 text-xl font-black tracking-tight text-[#0B1C30]">
                    Pending and historical invites
                  </h2>
                </div>
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-500">
                  <Shield className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {invitations.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                    No invitations have been created yet.
                  </div>
                ) : (
                  invitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-[#0B1C30]">
                            {invitation.email}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            Invited by {invitation.invitedByEmail}
                          </p>
                        </div>
                        <span className="inline-flex rounded-full bg-white px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">
                          {invitation.status.replaceAll('_', ' ')}
                        </span>
                      </div>

                      <div className="mt-3 space-y-1 text-xs text-slate-500">
                        <p>Role: {invitation.roleName}</p>
                        <p>Expires: {formatDateTime(invitation.expiresAt)}</p>
                        <p>Created: {formatDateTime(invitation.createdAt)}</p>
                        {invitation.acceptedAt && (
                          <p>Accepted: {formatDateTime(invitation.acceptedAt)}</p>
                        )}
                      </div>

                      {invitation.inviteUrl && invitation.status === 'PENDING' && (
                        <button
                          type="button"
                          onClick={() => handleCopyInvite(invitation)}
                          className="mt-4 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100"
                        >
                          <Copy className="h-3.5 w-3.5" />
                          Copy invite link
                        </button>
                      )}

                      {!invitation.inviteUrl && invitation.status === 'PENDING' && (
                        <p className="mt-4 text-[11px] leading-5 text-slate-500">
                          Raw invite links are only shown once when the invitation is created.
                        </p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
