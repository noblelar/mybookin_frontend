'use client'

import type { ReactNode } from 'react'
import { usePathname } from 'next/navigation'

import ManageBusinessShell from '@/components/manage_business/ManageBusinessShell'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useManageBusinessSettingsContext } from '@/context/ManageBusinessSettingsContext'
import { buildSettingsSubNavItems } from '@/components/manage_business/settings/settings-navigation'
import { getBusinessStatusClassName } from '@/components/manage_business/settings/settings-utils'

export default function ManageBusinessSettingsLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const {
    businesses,
    selectedBusiness,
    isLoadingBusinesses,
    businessLoadError,
    updateSelectedBusinessId,
  } = useManageBusinessSettingsContext()

  return (
    <ManageBusinessShell
      activeNav="/manage_business/settings"
      subNavItems={buildSettingsSubNavItems(selectedBusiness?.id ?? null)}
      activeSubNav={pathname}
    >
      {businessLoadError ? (
        <Alert variant="destructive" className="mb-6 rounded-2xl">
          <AlertTitle>Settings issue</AlertTitle>
          <AlertDescription>{businessLoadError}</AlertDescription>
        </Alert>
      ) : null}

      {isLoadingBusinesses ? (
        <div className="grid gap-6">
          <div className="h-40 animate-pulse rounded-[28px] bg-white" />
          <div className="h-[520px] animate-pulse rounded-[28px] bg-white" />
        </div>
      ) : !businesses.length ? (
        <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
            Tenant Settings
          </p>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
            No business selected
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
            Create your first business entry before editing business identity, hours, media, billing,
            and owner access.
          </p>
        </section>
      ) : (
        <div className="grid gap-6">
          <section className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm md:p-8">
            <div className="flex flex-col gap-5 border-b border-slate-100 pb-6">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
                    Tenant Settings
                  </p>
                  <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-[#0B1C30]">
                    {selectedBusiness?.name}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-500">
                    Use the sticky sub-navigation above to move between focused settings pages for
                    profile, hours, media, billing, and owner scheduling access.
                  </p>
                </div>

                <div className="grid gap-3 sm:min-w-[280px]">
                  <label className="grid gap-2 text-sm font-medium text-slate-700">
                    Active business
                    <select
                      value={selectedBusiness?.id ?? ''}
                      onChange={(event) => updateSelectedBusinessId(event.target.value)}
                      className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition focus:border-[#0B1C30] focus:bg-white"
                    >
                      {businesses.map((business) => (
                        <option key={business.id} value={business.id}>
                          {business.name}
                        </option>
                      ))}
                    </select>
                  </label>

                  {selectedBusiness ? (
                    <div className="flex flex-wrap gap-2">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getBusinessStatusClassName(
                          selectedBusiness.status
                        )}`}
                      >
                        {selectedBusiness.status}
                      </span>
                      <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
                        {selectedBusiness.category}
                      </span>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          {children}
        </div>
      )}
    </ManageBusinessShell>
  )
}
