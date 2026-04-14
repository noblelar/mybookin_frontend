'use client'

import BusinessMediaSection from '@/components/manage_business/media/BusinessMediaSection'
import { useManageBusinessSettingsContext } from '@/context/ManageBusinessSettingsContext'

export default function ManageBusinessSettingsMediaPage() {
  const { selectedBusiness } = useManageBusinessSettingsContext()

  if (!selectedBusiness) return null

  return (
    <BusinessMediaSection
      businessId={selectedBusiness.id}
      businessName={selectedBusiness.name}
    />
  )
}
