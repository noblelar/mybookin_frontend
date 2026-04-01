'use client'

import { useState } from 'react'

import DiscoveryFooter from '@/components/discovery/DiscoveryFooter'
import DiscoveryHeader from '@/components/discovery/DiscoveryHeader'
import DiscoveryNavbar from '@/components/discovery/DiscoveryNavbar'
import CategoryFilter from '@/components/discovery/CategoryFilter'
import MobileTabBar from '@/components/discovery/MobileTabBar'
import ServiceGrid from '@/components/discovery/ServiceGrid'
import { useDiscoveryBusinesses } from '@/hooks/useDiscoveryBusinesses'

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState('ALL')
  const { businesses, availableCategories, isLoading, errorMessage } = useDiscoveryBusinesses({
    category: activeCategory,
  })

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF] pb-16 md:pb-0">
      <DiscoveryNavbar />
      <DiscoveryHeader />
      <CategoryFilter
        categories={availableCategories}
        activeCategory={activeCategory}
        onChange={setActiveCategory}
      />
      <main className="flex-1 bg-white md:bg-[#F8F9FF]">
        <ServiceGrid
          businesses={businesses}
          isLoading={isLoading}
          errorMessage={errorMessage}
        />
      </main>
      <DiscoveryFooter />
      <MobileTabBar />

      <button className="md:hidden fixed bottom-20 right-4 z-50 w-12 h-12 bg-[#0B1C30] rounded-full shadow-xl flex items-center justify-center hover:bg-slate-800 transition-colors active:scale-95">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="white"/>
        </svg>
      </button>
    </div>
  )
}
