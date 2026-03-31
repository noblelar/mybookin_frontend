'use client'

import Link from 'next/link'

import CustomerTopBar from '@/components/customer/CustomerTopBar'
import MobileTabBar from '@/components/discovery/MobileTabBar'
import { useAuthContext } from '@/context/AuthContext'

export default function ProfilePage() {
  const { hasHydrated, session } = useAuthContext()
  const hasOwnerRole =
    session?.user.roles.some((role) => role.toUpperCase() === 'BUSINESS_OWNER') ?? false

  return (
    <div className="min-h-screen bg-slate-50 pb-16 md:pb-0">
      <CustomerTopBar />

      <main className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-10">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
            Customer Profile
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
            Account overview
          </h1>

          {!hasHydrated || !session ? (
            <p className="mt-4 text-sm text-slate-500">Loading your profile...</p>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Full name</p>
                <p className="mt-2 text-lg font-semibold text-[#0B1C30]">
                  {[session.user.firstName, session.user.lastName].filter(Boolean).join(' ') || 'Customer'}
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Email</p>
                <p className="mt-2 text-lg font-semibold text-[#0B1C30]">{session.user.email}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Phone</p>
                <p className="mt-2 text-lg font-semibold text-[#0B1C30]">{session.user.phone ?? 'Not provided'}</p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Role access</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {session.user.roles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-[#EFF4FF] p-5 md:col-span-2">
                <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">
                  Business access
                </p>
                <h2 className="mt-3 text-xl font-bold text-[#0B1C30]">
                  {hasOwnerRole ? 'Manage your owner workspace' : 'Ready to list your business?'}
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
                  {hasOwnerRole
                    ? 'Open the owner dashboard to continue managing your business settings, staff, and operations.'
                    : 'Create your business profile to upgrade into owner mode. Your session will refresh automatically as soon as the business is created.'}
                </p>
                <Link
                  href={hasOwnerRole ? '/manage_business' : '/start-business'}
                  className="mt-5 inline-flex h-11 items-center justify-center rounded-full bg-[#0B1C30] px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
                >
                  {hasOwnerRole ? 'Open owner dashboard' : 'Start owner onboarding'}
                </Link>
              </div>
            </div>
          )}
        </section>
      </main>

      <MobileTabBar />
    </div>
  )
}
