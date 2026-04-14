'use client'

import { useRouter } from 'next/navigation'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { formatCurrency } from '@/lib/utils'
import type { DiscoveryBusinessSummary } from '@/types/discovery'

import ServiceCard from './ServiceCard'

const categoryImages: Record<string, string> = {
  BARBER: 'https://api.builder.io/api/v1/image/assets/TEMP/d508ac7f547631f26d8bd728c36d889f72ae660e?width=764',
  HAIR: 'https://api.builder.io/api/v1/image/assets/TEMP/e7ab092d1192ceaa63c643f8c9b5ffca8c505cef?width=764',
  NAILS: 'https://api.builder.io/api/v1/image/assets/TEMP/a6d0450add48b3844ecd97a59f50a2d889bb3aec?width=764',
  RESTAURANT: 'https://api.builder.io/api/v1/image/assets/TEMP/f2aa736095396c625377fa3822964fee02b028e5?width=764',
  TUTOR: 'https://api.builder.io/api/v1/image/assets/TEMP/7112e148ef0f9b526f7070a4f02abfee6a33df1c?width=764',
  ETC: 'https://api.builder.io/api/v1/image/assets/TEMP/f2aa736095396c625377fa3822964fee02b028e5?width=764',
}

const formatCategoryLabel = (category: string) =>
  category
    .toLowerCase()
    .split('_')
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(' ')

interface ServiceGridProps {
  businesses: DiscoveryBusinessSummary[]
  isLoading: boolean
  errorMessage: string | null
}

export default function ServiceGrid({
  businesses,
  isLoading,
  errorMessage,
}: ServiceGridProps) {
  const router = useRouter()

  if (errorMessage) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-6 md:px-6">
        <Alert variant="destructive" className="rounded-3xl">
          <AlertTitle>Discovery catalog unavailable</AlertTitle>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="max-w-[1280px] mx-auto md:px-6 md:py-8">
        <div className="md:hidden flex flex-col gap-4 px-4 py-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-80 animate-pulse rounded-3xl bg-slate-100" />
          ))}
        </div>
        <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="h-80 animate-pulse rounded-3xl bg-slate-100" />
          ))}
        </div>
      </div>
    )
  }

  if (!businesses.length) {
    return (
      <div className="max-w-[1280px] mx-auto px-4 py-8 md:px-6">
        <div className="rounded-[28px] border border-dashed border-slate-200 bg-white px-6 py-10 text-center shadow-sm">
          <h2 className="text-2xl font-bold text-[#0B1C30]">No businesses match this filter yet</h2>
          <p className="mt-3 text-sm leading-relaxed text-slate-500">
            Try another category or come back after more businesses have been approved.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1280px] mx-auto md:px-6 md:py-8">
      <div className="md:hidden flex flex-col divide-y divide-slate-100">
        {businesses.map((item) => (
          <ServiceCard
            key={item.business.id}
            image={item.coverImageUrl ?? categoryImages[item.business.category] ?? categoryImages.ETC}
            category={formatCategoryLabel(item.business.category)}
            name={item.business.name}
            location={`${item.business.city}, ${item.business.postcode}`}
            price={item.startingPrice ? `from ${formatCurrency(item.startingPrice)}` : 'See services'}
            nextSlot={
              item.activeServiceCount
                ? `${item.activeServiceCount} live service${item.activeServiceCount === 1 ? '' : 's'}`
                : 'Services coming soon'
            }
            isPremium={item.activeServiceCount >= 4}
            onSelect={() => router.push(`/businesses/${item.business.slugUk}`)}
          />
        ))}
      </div>

      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {businesses.map((item) => (
          <ServiceCard
            key={item.business.id}
            image={item.coverImageUrl ?? categoryImages[item.business.category] ?? categoryImages.ETC}
            category={formatCategoryLabel(item.business.category)}
            name={item.business.name}
            location={`${item.business.city}, ${item.business.postcode}`}
            price={item.startingPrice ? `from ${formatCurrency(item.startingPrice)}` : 'See services'}
            nextSlot={
              item.activeServiceCount
                ? `${item.activeServiceCount} live service${item.activeServiceCount === 1 ? '' : 's'}`
                : 'Services coming soon'
            }
            isPremium={item.activeServiceCount >= 4}
            onSelect={() => router.push(`/businesses/${item.business.slugUk}`)}
          />
        ))}
      </div>
    </div>
  )
}
