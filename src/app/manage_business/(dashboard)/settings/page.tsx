'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

import { useManageBusinessSettingsContext } from '@/context/ManageBusinessSettingsContext'

export default function ManageBusinessSettingsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { selectedBusiness } = useManageBusinessSettingsContext()

  useEffect(() => {
    const nextBusinessId = searchParams.get('businessId') ?? selectedBusiness?.id ?? null
    const nextPath = nextBusinessId
      ? `/manage_business/settings/profile?businessId=${nextBusinessId}`
      : '/manage_business/settings/profile'

    router.replace(nextPath, { scroll: false })
  }, [router, searchParams, selectedBusiness?.id])

  return (
    <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">
        Redirecting
      </p>
      <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0B1C30]">
        Opening business profile settings
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-500">
        Moving you into the new route-based settings flow so each section stays focused and easier to
        manage.
      </p>
    </section>
  )
}
