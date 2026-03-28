import DiscoveryNavbar from '@/components/discovery/DiscoveryNavbar'
import DiscoveryHeader from '@/components/discovery/DiscoveryHeader'
import CategoryFilter from '@/components/discovery/CategoryFilter'
import ServiceGrid from '@/components/discovery/ServiceGrid'
import DiscoveryFooter from '@/components/discovery/DiscoveryFooter'

export const metadata = {
  title: 'Discovery Catalog | MyBookins',
  description: 'Discover and book top-rated local services near you.',
}

export default function DiscoverPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF]">
      <DiscoveryNavbar />
      <DiscoveryHeader />
      <CategoryFilter />
      <main className="flex-1">
        <ServiceGrid />
      </main>
      <DiscoveryFooter />
    </div>
  )
}
