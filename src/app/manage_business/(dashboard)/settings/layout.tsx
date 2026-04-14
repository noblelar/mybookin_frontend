import { Suspense } from 'react'

import ManageBusinessSettingsLayout from '@/components/manage_business/settings/ManageBusinessSettingsLayout'
import { ManageBusinessSettingsProvider } from '@/context/ManageBusinessSettingsContext'

function ManageBusinessSettingsLayoutFallback() {
  return (
    <div className="min-h-screen bg-[#F1F5F9] p-5 md:p-6">
      <div className="grid gap-6">
        <div className="h-40 animate-pulse rounded-[28px] bg-white" />
        <div className="h-[520px] animate-pulse rounded-[28px] bg-white" />
      </div>
    </div>
  )
}

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<ManageBusinessSettingsLayoutFallback />}>
      <ManageBusinessSettingsProvider>
        <ManageBusinessSettingsLayout>{children}</ManageBusinessSettingsLayout>
      </ManageBusinessSettingsProvider>
    </Suspense>
  )
}
