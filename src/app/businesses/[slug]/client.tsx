'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

import CustomerTopBar from '@/components/customer/CustomerTopBar'
import MobileTabBar from '@/components/discovery/MobileTabBar'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useDiscoveryBusinessDetail } from '@/hooks/useDiscoveryBusinessDetail'
import { formatCurrency, formatDurationLabel } from '@/lib/utils'

const heroImages: Record<string, string> = {
  BARBER: 'https://api.builder.io/api/v1/image/assets/TEMP/d508ac7f547631f26d8bd728c36d889f72ae660e?width=1200',
  HAIR: 'https://api.builder.io/api/v1/image/assets/TEMP/e7ab092d1192ceaa63c643f8c9b5ffca8c505cef?width=1200',
  NAILS: 'https://api.builder.io/api/v1/image/assets/TEMP/a6d0450add48b3844ecd97a59f50a2d889bb3aec?width=1200',
  RESTAURANT: 'https://api.builder.io/api/v1/image/assets/TEMP/f2aa736095396c625377fa3822964fee02b028e5?width=1200',
  TUTOR: 'https://api.builder.io/api/v1/image/assets/TEMP/7112e148ef0f9b526f7070a4f02abfee6a33df1c?width=1200',
  ETC: 'https://api.builder.io/api/v1/image/assets/TEMP/d508ac7f547631f26d8bd728c36d889f72ae660e?width=1200',
}

const formatCategoryLabel = (category: string) =>
  category
    .toLowerCase()
    .split('_')
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(' ')

const getInitials = (value: string) =>
  value
    .split(' ')
    .map((part) => part.slice(0, 1).toUpperCase())
    .join('')
    .slice(0, 2)

export default function BusinessDetailsClient({ slug }: { slug: string }) {
  const { detail, isLoading, errorMessage } = useDiscoveryBusinessDetail(slug)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const categories = useMemo(
    () => (detail ? Array.from(new Set(detail.services.map((service) => service.serviceCategoryName))) : []),
    [detail]
  )

  const filteredServices = useMemo(() => {
    if (!detail) return []
    if (!activeCategory) return detail.services
    return detail.services.filter((service) => service.serviceCategoryName === activeCategory)
  }, [activeCategory, detail])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 pb-16 md:pb-0">
        <CustomerTopBar />
        <div className="h-96 animate-pulse bg-slate-200" />
        <div className="max-w-4xl mx-auto px-4 -mt-24 relative z-10">
          <div className="h-64 animate-pulse rounded-lg bg-white shadow-lg" />
        </div>
      </div>
    )
  }

  if (!detail) {
    return (
      <div className="min-h-screen bg-slate-50 pb-16 md:pb-0">
        <CustomerTopBar />
        <div className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-12">
          <Alert variant="destructive" className="rounded-3xl">
            <AlertTitle>Business unavailable</AlertTitle>
            <AlertDescription>
              {errorMessage ?? 'The business you are looking for could not be loaded right now.'}
            </AlertDescription>
          </Alert>
          <Link
            href="/discover"
            className="inline-flex w-fit items-center justify-center rounded-full bg-[#0B1C30] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
          >
            Return to discover
          </Link>
        </div>
      </div>
    )
  }

  const { business, services, staffMembers } = detail
  const heroImage = heroImages[business.category] ?? heroImages.ETC

  return (
    <div className="min-h-screen bg-slate-50 pb-16 md:pb-0">
      <CustomerTopBar />

      <div className="relative h-96 bg-slate-200 overflow-hidden">
        <Image
          src={heroImage}
          alt={business.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-24 relative z-10">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-start gap-4 mb-4">
            <div>
              <span className="inline-flex rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-white">
                {formatCategoryLabel(business.category)}
              </span>
              <h1 className="mt-3 text-3xl font-bold text-slate-900 mb-2">{business.name}</h1>
              <div className="flex items-center gap-4 flex-wrap text-sm text-slate-500">
                <span>{business.city}, {business.postcode}</span>
                <span>Timezone: {business.timezone}</span>
                <span>{services.length} service{services.length === 1 ? '' : 's'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
            <div className="flex gap-3">
              <div className="mt-1 text-slate-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 21C12 21 19 15.5 19 10C19 6.13401 15.866 3 12 3C8.13401 3 5 6.13401 5 10C5 15.5 12 21 12 21Z" stroke="currentColor" strokeWidth="1.5"/>
                  <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm uppercase tracking-wide text-slate-600">Location</p>
                <p className="text-slate-900">{business.addressLine1}</p>
                {business.addressLine2 ? <p className="text-slate-900">{business.addressLine2}</p> : null}
                <p className="text-slate-600 text-sm">{business.city}, {business.postcode}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="mt-1 text-slate-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M12 7V12L15.5 14" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm uppercase tracking-wide text-slate-600">Availability</p>
                <p className="text-slate-900">Bookable slots are shown per service and staff member.</p>
                <p className="text-slate-600 text-sm">Select a service to see live availability.</p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="mt-1 text-slate-600">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M5 4H19C20.1046 4 21 4.89543 21 6V18L17 15H5C3.89543 15 3 14.1046 3 13V6C3 4.89543 3.89543 4 5 4Z" stroke="currentColor" strokeWidth="1.5"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-slate-900 text-sm uppercase tracking-wide text-slate-600">Contact</p>
                <p className="text-slate-900">{business.phone ?? 'Phone not provided yet'}</p>
                <p className="text-slate-600 text-sm">{business.email ?? 'Email not provided yet'}</p>
              </div>
            </div>

            <div>
              <p className="font-semibold text-slate-900 text-sm uppercase tracking-wide text-slate-600 mb-2">About</p>
              <p className="text-slate-700">
                {business.description ?? 'This business is live on the marketplace and ready to accept bookings.'}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Services</h2>

          {categories.length > 1 ? (
            <div className="flex flex-wrap gap-2 mb-6">
              <button
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
                  activeCategory === null
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                }`}
              >
                All Services
              </button>
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full font-semibold text-sm transition ${
                    activeCategory === category
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          ) : null}

          <div className="grid gap-4">
            {filteredServices.length ? (
              filteredServices.map((service) => (
                <div key={service.id} className="bg-white rounded-lg p-5 border border-slate-200 hover:shadow-md transition">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-slate-900">{service.name}</h3>
                        {!service.isActive ? (
                          <span className="px-2 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded">
                            Coming soon
                          </span>
                        ) : null}
                      </div>
                      <p className="text-slate-600 text-sm mb-3">
                        {service.description ?? 'No description provided yet.'}
                      </p>
                      <div className="flex gap-4 text-sm text-slate-500 flex-wrap">
                        <span>{formatDurationLabel(service.durationMinutes)}</span>
                        {Number.parseFloat(service.depositAmount) > 0 ? (
                          <span>Deposit {formatCurrency(service.depositAmount, service.currency)}</span>
                        ) : null}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-2xl font-bold text-slate-900">
                        {formatCurrency(service.priceAmount, service.currency)}
                      </p>
                      <Link
                        href={`/businesses/${slug}/book?serviceId=${encodeURIComponent(service.id)}`}
                        className="mt-2 inline-block px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold text-sm hover:bg-slate-800 transition"
                      >
                        Book Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-8 text-sm text-slate-500">
                There are no live services to show for this business yet.
              </div>
            )}
          </div>
        </div>

        {staffMembers.length ? (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Meet Our Team</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {staffMembers.map((member) => (
                <div key={member.id} className="bg-white rounded-lg p-6 border border-slate-200">
                  <div className="flex gap-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#EFF4FF] text-lg font-black text-[#0B1C30]">
                      {getInitials(member.displayName)}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900">{member.displayName}</h3>
                      <p className="text-slate-600 text-sm mb-2">{member.roleTitle}</p>
                      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">
                        Available on assigned services
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <MobileTabBar />
    </div>
  )
}
