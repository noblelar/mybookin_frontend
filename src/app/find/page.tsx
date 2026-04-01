'use client'

import { Suspense, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

import CustomerAuthActions from '@/components/customer/CustomerAuthActions'
import MobileTabBar from '@/components/discovery/MobileTabBar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useDiscoveryBusinesses } from '@/hooks/useDiscoveryBusinesses'
import { formatCurrency } from '@/lib/utils'
import type { DiscoveryBusinessSummary } from '@/types/discovery'

const categoryImages: Record<string, string> = {
  BARBER: 'https://api.builder.io/api/v1/image/assets/TEMP/7f02eb040f921ba0397ba0d0825e439a22200500?width=568',
  HAIR: 'https://api.builder.io/api/v1/image/assets/TEMP/b6991f3866310cbd57a30730b37cb22b1f4d4aef?width=568',
  NAILS: 'https://api.builder.io/api/v1/image/assets/TEMP/a6a9b054c693ded88e22301dd2d4064d1c0c5eae?width=568',
  RESTAURANT: 'https://api.builder.io/api/v1/image/assets/TEMP/4c8ee2ddd9327d8b965401639d6fed2958ceba6c?width=568',
  TUTOR: 'https://api.builder.io/api/v1/image/assets/TEMP/675a2484554b1ac20569de478c76367795bcd412?width=568',
  ETC: 'https://api.builder.io/api/v1/image/assets/TEMP/7f02eb040f921ba0397ba0d0825e439a22200500?width=568',
}

const formatCategoryLabel = (category: string) =>
  category
    .toLowerCase()
    .split('_')
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(' ')

function BusinessCard({ business }: { business: DiscoveryBusinessSummary }) {
  return (
    <Link
      href={`/businesses/${business.business.slugUk}`}
      className="flex flex-col bg-white rounded-[10px] shadow-[0_4px_80px_0_rgba(0,0,0,0.08)] p-3 gap-3 transition-transform hover:-translate-y-0.5"
    >
      <div className="relative w-full rounded-[10px] overflow-hidden" style={{ height: '180px' }}>
        <Image
          src={categoryImages[business.business.category] ?? categoryImages.ETC}
          alt={business.business.name}
          fill
          className="object-cover"
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center gap-3">
          <span className="font-inter font-bold text-[#0B1C30] text-[18px] leading-tight">
            {business.business.name}
          </span>
          <span className="font-inter font-medium text-[#939393] text-sm whitespace-nowrap">
            {business.startingPrice ? `from ${formatCurrency(business.startingPrice)}` : 'See services'}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Image
            src="https://api.builder.io/api/v1/image/assets/TEMP/91b4d1860c215278f9d14b807b5d09d5b30758c0?width=36"
            alt="location"
            width={18}
            height={18}
          />
          <span className="font-inter font-medium text-[#939393] text-sm">
            {business.business.city}, {business.business.postcode}
          </span>
        </div>

        <div className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center rounded-full bg-[#EFF4FF] px-3 py-1 text-xs font-semibold text-[#0B1C30]">
            {formatCategoryLabel(business.business.category)}
          </span>
          <span className="font-inter font-medium text-sm text-[#0B0C15]">
            {business.activeServiceCount} service{business.activeServiceCount === 1 ? '' : 's'}
          </span>
        </div>
      </div>
    </Link>
  )
}

function CheckFilter({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-2 opacity-60">
      <div className="w-6 h-6 border-2 rounded flex items-center justify-center flex-shrink-0 border-[#D0D5DD]" />
      <span className="font-inter font-medium text-[16px] text-[#0B1C30]">{label}</span>
    </div>
  )
}

function FindPageContent() {
  const searchParams = useSearchParams()

  const initialQuery = searchParams.get('q') ?? ''
  const initialCategory = searchParams.get('category')?.toUpperCase() ?? 'ALL'

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [priceRange, setPriceRange] = useState([0, 500])

  const { businesses, availableCategories, isLoading, errorMessage } = useDiscoveryBusinesses({
    search: searchQuery,
    category: activeCategory,
  })

  const filteredBusinesses = useMemo(
    () =>
      businesses.filter((business) => {
        if (!business.startingPrice) return true
        const startingPrice = Number.parseFloat(business.startingPrice)
        if (Number.isNaN(startingPrice)) return true
        return startingPrice >= priceRange[0] && startingPrice <= priceRange[1]
      }),
    [businesses, priceRange]
  )

  const categories = ['ALL', ...availableCategories]

  return (
    <div className="min-h-screen bg-white font-inter pb-16 md:pb-0">
      <header className="bg-white w-full" style={{ boxShadow: '0 4px 80px 0 rgba(0,0,0,0.08)' }}>
        <div className="max-w-[1360px] mx-auto px-5 h-20 flex items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <svg width="36" height="36" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.8134 3.90091C21.7668 3.88365 21.7198 3.86755 21.6723 3.85263C21.418 3.77242 21.1511 3.72653 20.8749 3.72283C19.7705 3.70756 18.8027 4.35818 18.1502 5.29551C17.4978 6.2328 17.1162 7.478 17.1025 8.84766C17.1007 9.06408 17.1085 9.28047 17.1256 9.49622L17.0999 11.5302L20.1746 13.9973C20.3664 14.0425 20.5651 14.0671 20.7685 14.07C21.873 14.0851 22.8408 13.4347 23.4933 12.4972C24.1457 11.5599 24.5272 10.3148 24.541 8.94503C24.5547 7.57549 24.197 6.31975 23.5642 5.36611C23.1194 4.69555 22.516 4.16333 21.8135 3.90102L21.8134 3.90091Z" fill="#235AFF"/>
              <path d="M11.7042 9.30093C11.2693 9.15494 10.835 9.06305 10.4081 9.02848C9.2698 8.93648 8.15172 9.27227 7.46136 10.1347C6.77121 10.9971 6.6877 12.1586 7.02175 13.2533C7.35596 14.3477 8.09748 15.4241 9.16356 16.284C10.2297 17.1439 11.4343 17.6386 12.5726 17.7306C13.5442 17.809 14.5003 17.5777 15.1888 16.9719L16.7033 15.6574L17.0444 16.0377L20.0405 19.393L33.019 33.9218C34.8793 31.6088 33.2056 26.0922 27.1693 21.237L14.3059 10.9106C13.8164 10.4773 13.1501 9.93977 12.4288 9.54452 11.7041 9.30112L11.7042 9.30093Z" fill="#235AFF"/>
              <path d="M17.0203 17.9343C16.9885 20.5306 16.9547 23.2703 16.9236 25.9952C16.8358 33.7413 20.0314 38.5396 22.9995 38.5732L20.397 21.7045L17.0202 17.9344L17.0203 17.9343Z" fill="#235AFF"/>
            </svg>
            <span className="text-base font-black tracking-tight text-[#0B1C30]">
              MyBookIns
            </span>
          </Link>

          <div className="flex-1 max-w-[500px] hidden md:flex items-center gap-2 px-4 py-3 rounded-[10px] bg-[#F5F5F5]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L15 15M17 11A6 6 0 11 5 11a6 6 0 0112 0z" stroke="#A0A0A0" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search services, businesses, or categories..."
              className="bg-transparent flex-1 outline-none text-sm font-normal text-[#0B0C15]"
            />
          </div>

          <div className="flex items-center gap-3">
            <CustomerAuthActions />
          </div>
        </div>
      </header>

      <div className="border-b border-[#F5F5F5] bg-white">
        <div className="max-w-[1360px] mx-auto px-5 py-3 flex items-center gap-16 flex-wrap md:flex-nowrap">
          <div className="flex items-center gap-2 flex-shrink-0">
            <Image src="https://api.builder.io/api/v1/image/assets/TEMP/e87066137fc7161c4c7a2f93b7baa9c7f860132a?width=48" alt="pin" width={24} height={24} />
            <div>
              <p className="text-xs font-medium text-[#939393]">Marketplace</p>
              <p className="font-medium text-base text-[#0B0C15]">Approved businesses</p>
            </div>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto pb-1 flex-1 scrollbar-hide">
            {categories.map((category) => {
              const isActive = activeCategory === category
              return (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className="flex items-center gap-2 px-3 h-10 rounded-lg flex-shrink-0 transition-colors"
                  style={{
                    background: isActive ? '#235AFF' : '#F5F5F5',
                  }}
                >
                  <span
                    className="text-sm font-medium whitespace-nowrap"
                    style={{ color: isActive ? '#FFF' : '#0B1C30' }}
                  >
                    {category === 'ALL' ? 'All Services' : formatCategoryLabel(category)}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="max-w-[1360px] mx-auto px-5 py-6 flex gap-6 items-start">
        <aside className="hidden md:flex flex-col gap-4 w-[268px] flex-shrink-0">
          <div className="bg-white rounded-[10px] p-4 flex flex-col gap-4" style={{ boxShadow: '0 4px 80px 0 rgba(0,0,0,0.08)' }}>
            <h3 className="font-semibold text-base text-[#0B1C30]">Price Range</h3>
            <div className="flex justify-between text-base font-medium text-[#0B1C30]">
              <span>£{priceRange[0]}</span>
              <span>£{priceRange[1]}</span>
            </div>
            <input
              type="range"
              min={0}
              max={500}
              value={priceRange[1]}
              onChange={(event) => setPriceRange([priceRange[0], Number.parseInt(event.target.value, 10)])}
              className="w-full accent-[#235AFF] cursor-pointer"
            />
          </div>

          <div className="bg-white rounded-[10px] p-4 flex flex-col gap-4" style={{ boxShadow: '0 4px 80px 0 rgba(0,0,0,0.08)' }}>
            <h3 className="font-semibold text-base text-[#0B1C30]">More filters soon</h3>
            <div className="flex flex-col gap-2">
              <CheckFilter label="Location" />
              <CheckFilter label="Availability" />
              <CheckFilter label="Offers" />
            </div>
          </div>
        </aside>

        <div className="flex-1 min-w-0 flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h2 className="font-bold text-lg text-[#0B1C30]">
              Nearby businesses
              {searchQuery ? (
                <span className="font-normal text-sm ml-2 text-[#939393]">
                  for &quot;{searchQuery}&quot;
                </span>
              ) : null}
            </h2>
            <button className="flex items-center gap-1 text-sm font-bold uppercase transition-colors hover:opacity-80 text-[#235AFF]" style={{ letterSpacing: '0.5px' }}>
              <Image src="https://api.builder.io/api/v1/image/assets/TEMP/cf55f53538d1d50e553ccf21beef0e544c78594c?width=40" alt="map" width={20} height={20} />
              View on Map
            </button>
          </div>

          {errorMessage ? (
            <Alert variant="destructive" className="rounded-[16px]">
              <AlertTitle>Search unavailable</AlertTitle>
              <AlertDescription>{errorMessage}</AlertDescription>
            </Alert>
          ) : null}

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="h-[320px] animate-pulse rounded-[10px] bg-slate-100" />
              ))}
            </div>
          ) : filteredBusinesses.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredBusinesses.map((business) => (
                <BusinessCard key={business.business.id} business={business} />
              ))}
            </div>
          ) : (
            <div className="rounded-[18px] border border-dashed border-slate-200 bg-white px-6 py-10 text-center">
              <h3 className="text-xl font-bold text-[#0B1C30]">No results yet</h3>
              <p className="mt-3 text-sm text-slate-500">
                Try widening your price range or searching with a different category.
              </p>
            </div>
          )}
        </div>
      </div>
      <MobileTabBar />
    </div>
  )
}

export default function FindPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><p className="text-[#939393]">Loading...</p></div>}>
      <FindPageContent />
    </Suspense>
  )
}
