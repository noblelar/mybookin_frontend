'use client'

import Link from 'next/link'

import CustomerTopBar from '@/components/customer/CustomerTopBar'
import MobileTabBar from '@/components/discovery/MobileTabBar'
import { useAuthContext } from '@/context/AuthContext'

export default function BookingsPage() {
  const { hasHydrated, session } = useAuthContext()

  return (
    <div className="min-h-screen bg-slate-50 pb-16 md:pb-0">
      <CustomerTopBar />

      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
            Booking Hub
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
            Your upcoming reservations
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
            {hasHydrated && session
              ? `Welcome back, ${session.user.firstName || session.user.email}. This area is now a protected customer destination and is ready for live booking data next.`
              : 'Loading your customer workspace...'}
          </p>
        </div>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">Next milestone</p>
            <h2 className="mt-3 text-xl font-bold text-[#0B1C30]">Connect live booking history</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              The navigation is now pointing at a real authenticated page, so we can safely layer booking APIs onto this screen next without revisiting the customer shell.
            </p>
          </article>

          <article className="rounded-3xl border border-slate-200 bg-[#EFF4FF] p-6 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Keep exploring</p>
            <h2 className="mt-3 text-xl font-bold text-[#0B1C30]">Discover more services</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Browse the discovery catalog while we wire the bookings dataset into this protected customer workspace.
            </p>
            <Link
              href="/discover"
              className="mt-5 inline-flex items-center justify-center rounded-full bg-[#0B1C30] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
            >
              Return to Discover
            </Link>
          </article>
        </section>
      </main>

      <MobileTabBar />
    </div>
  )
}
