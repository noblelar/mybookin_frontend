'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

import CustomerAuthActions from '@/components/customer/CustomerAuthActions'
import MobileTabBar from '@/components/discovery/MobileTabBar'

// ── Static data ────────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: 'Hair Cut', icon: 'https://api.builder.io/api/v1/image/assets/TEMP/e5629e7b0142a7530b0aa59abc9f0de02da29a58?width=36' },
  { label: 'Hair Styling', icon: 'https://api.builder.io/api/v1/image/assets/TEMP/1e834fb8dad234d9b6c4fd46fa1c69654bd1d050?width=36' },
  { label: 'Nail Art', icon: 'https://api.builder.io/api/v1/image/assets/TEMP/ee6988e23c419895ec48eb99152d1d7fb524fb44?width=36' },
  { label: 'Hair Cut', icon: 'https://api.builder.io/api/v1/image/assets/TEMP/68f29b7f211c1309f9196dc177e1c04867ddd85b?width=36' },
  { label: 'Beard Cut', icon: 'https://api.builder.io/api/v1/image/assets/TEMP/f095fcf780eac17a1f61d378696f375e837c8591?width=36' },
  { label: 'Massage', icon: 'https://api.builder.io/api/v1/image/assets/TEMP/e5629e7b0142a7530b0aa59abc9f0de02da29a58?width=36' },
  { label: 'Pedicure', icon: 'https://api.builder.io/api/v1/image/assets/TEMP/1e834fb8dad234d9b6c4fd46fa1c69654bd1d050?width=36' },
  { label: 'Lip Tinting', icon: 'https://api.builder.io/api/v1/image/assets/TEMP/ee6988e23c419895ec48eb99152d1d7fb524fb44?width=36' },
]

const SALONS = [
  {
    id: 'hair-avenue',
    name: 'Hair Avenue',
    distance: '2 km',
    location: 'Moratuwa, Colombo',
    rating: 4.7,
    reviews: 312,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/7f02eb040f921ba0397ba0d0825e439a22200500?width=568',
  },
  {
    id: 'ny-salon',
    name: 'NY Salon',
    distance: '2.3 km',
    location: 'Moratuwa, Colombo',
    rating: 4.7,
    reviews: 312,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/b6991f3866310cbd57a30730b37cb22b1f4d4aef?width=568',
  },
  {
    id: 'salon-by-d',
    name: 'Salon by D',
    distance: '2 km',
    location: 'Moratuwa, Colombo',
    rating: 4.7,
    reviews: 312,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/a6a9b054c693ded88e22301dd2d4064d1c0c5eae?width=568',
  },
  {
    id: 'central-salon',
    name: 'Central Salon',
    distance: '2.2 km',
    location: 'Moratuwa, Colombo',
    rating: 4.7,
    reviews: 312,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/4c8ee2ddd9327d8b965401639d6fed2958ceba6c?width=568',
  },
  {
    id: 'salon-see',
    name: 'Salon See',
    distance: '2 km',
    location: 'Moratuwa, Colombo',
    rating: 4.7,
    reviews: 312,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/675a2484554b1ac20569de478c76367795bcd412?width=568',
  },
  {
    id: 'hair-avenue-2',
    name: 'Hair Avenue',
    distance: '2 km',
    location: 'Moratuwa, Colombo',
    rating: 4.7,
    reviews: 312,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/7f02eb040f921ba0397ba0d0825e439a22200500?width=568',
  },
]

function StarIcon({ filled = true }: { filled?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.2974 2.63248L11.6174 5.27248C11.7974 5.63998 12.2774 5.99248 12.6824 6.05998L15.0749 6.45748C16.6049 6.71248 16.9649 7.82248 15.8624 8.91748L14.0024 10.7775C13.6874 11.0925 13.5149 11.7 13.6124 12.135L14.1449 14.4375C14.5649 16.26 13.5974 16.965 11.9849 16.0125L9.74243 14.685C9.33743 14.445 8.66993 14.445 8.25743 14.685L6.01493 16.0125C4.40993 16.965 3.43493 16.2525 3.85493 14.4375L4.38743 12.135C4.48493 11.7 4.31243 11.0925 3.99743 10.7775L2.13743 8.91748C1.04243 7.82248 1.39493 6.71248 2.92493 6.45748L5.31743 6.05998C5.71493 5.99248 6.19493 5.63998 6.37493 5.27248L7.69493 2.63248C8.41493 1.19998 9.58493 1.19998 10.2974 2.63248Z"
        fill={filled ? '#FFD33C' : 'none'}
        stroke={filled ? 'none' : '#FFD33C'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SalonCard({ salon }: { salon: typeof SALONS[0] }) {
  const [liked, setLiked] = useState(false)

  return (
    <div className="flex flex-col bg-white rounded-[10px] shadow-[0_4px_80px_0_rgba(0,0,0,0.08)] p-3 gap-3">
      {/* Image */}
      <div className="relative w-full rounded-[10px] overflow-hidden" style={{ height: '180px' }}>
        <Image
          src={salon.image}
          alt={salon.name}
          fill
          className="object-cover"
        />
        <button
          onClick={() => setLiked(!liked)}
          className="absolute top-2 right-2 w-9 h-9 rounded-[10px] flex items-center justify-center"
          style={{ background: 'rgba(255,255,255,0.20)', backdropFilter: 'blur(6px)' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              stroke="white"
              strokeWidth="1.5"
              fill={liked ? 'white' : 'none'}
            />
          </svg>
        </button>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="font-inter font-bold" style={{ fontSize: '18px', color: '#0B1C30' }}>{salon.name}</span>
          <span className="font-inter font-medium text-[#939393] text-sm">{salon.distance}</span>
        </div>
        <div className="flex items-center gap-1">
          <Image
            src="https://api.builder.io/api/v1/image/assets/TEMP/91b4d1860c215278f9d14b807b5d09d5b30758c0?width=36"
            alt="location"
            width={18}
            height={18}
          />
          <span className="font-inter font-medium text-[#939393] text-sm">{salon.location}</span>
        </div>
        <div className="flex items-center gap-1">
          <StarIcon />
          <span className="font-inter font-medium text-sm">
            <span className="text-[#0B0C15]">{salon.rating}</span>
            {' '}
            <span className="text-[#939393]">({salon.reviews})</span>
          </span>
        </div>
      </div>
    </div>
  )
}

function RatingFilter({ stars, hasUp }: { stars: number; hasUp?: boolean }) {
  const [checked, setChecked] = useState(false)
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        onClick={() => setChecked(!checked)}
        className="w-6 h-6 border-2 rounded flex items-center justify-center flex-shrink-0"
        style={{ borderColor: checked ? '#235AFF' : '#D0D5DD', background: checked ? '#235AFF' : 'white' }}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} filled={i < stars} />
        ))}
        {hasUp && <span className="text-[#0B0C15] font-medium text-sm ml-1">& up</span>}
      </div>
    </label>
  )
}

function CheckFilter({ label }: { label: string }) {
  const [checked, setChecked] = useState(false)
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <div
        onClick={() => setChecked(!checked)}
        className="w-6 h-6 border-2 rounded flex items-center justify-center flex-shrink-0"
        style={{ borderColor: checked ? '#235AFF' : '#D0D5DD', background: checked ? '#235AFF' : 'white' }}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className="font-inter font-medium" style={{ fontSize: '16px', color: '#0B1C30' }}>{label}</span>
    </label>
  )
}

function FindPageContent() {
  const searchParams = useSearchParams()

  const initialQuery = searchParams.get('q') ?? ''
  const initialCategory = searchParams.get('category') ?? CATEGORIES[0].label

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [priceRange, setPriceRange] = useState([5, 500])

  return (
    <div className="min-h-screen bg-white font-inter pb-16 md:pb-0">

      {/* ── Top Navbar ─────────────────────────────────────────────────────── */}
      <header className="bg-white w-full" style={{ boxShadow: '0 4px 80px 0 rgba(0,0,0,0.08)' }}>
        <div className="max-w-[1360px] mx-auto px-5 h-20 flex items-center justify-between gap-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <svg width="36" height="36" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21.8134 3.90091C21.7668 3.88365 21.7198 3.86755 21.6723 3.85263C21.418 3.77242 21.1511 3.72653 20.8749 3.72283C19.7705 3.70756 18.8027 4.35818 18.1502 5.29551C17.4978 6.2328 17.1162 7.478 17.1025 8.84766C17.1007 9.06408 17.1085 9.28047 17.1256 9.49622L17.0999 11.5302L20.1746 13.9973C20.3664 14.0425 20.5651 14.0671 20.7685 14.07C21.873 14.0851 22.8408 13.4347 23.4933 12.4972C24.1457 11.5599 24.5272 10.3148 24.541 8.94503C24.5547 7.57549 24.197 6.31975 23.5642 5.36611C23.1194 4.69555 22.516 4.16333 21.8135 3.90102L21.8134 3.90091Z" fill="#235AFF"/>
              <path d="M11.7042 9.30093C11.2693 9.15494 10.835 9.06305 10.4081 9.02848C9.2698 8.93648 8.15172 9.27227 7.46136 10.1347C6.77121 10.9971 6.6877 12.1586 7.02175 13.2533C7.35596 14.3477 8.09748 15.4241 9.16356 16.284C10.2297 17.1439 11.4343 17.6386 12.5726 17.7306C13.5442 17.809 14.5003 17.5777 15.1888 16.9719L16.7033 15.6574L17.0444 16.0377L20.0405 19.393L33.019 33.9218C34.8793 31.6088 33.2056 26.0922 27.1693 21.237L14.3059 10.9106C13.8164 10.4773 13.1501 9.93977 12.4288 9.54452 11.7041 9.30112L11.7042 9.30093Z" fill="#235AFF"/>
              <path d="M17.0203 17.9343C16.9885 20.5306 16.9547 23.2703 16.9236 25.9952C16.8358 33.7413 20.0314 38.5396 22.9995 38.5732L20.397 21.7045L17.0202 17.9344L17.0203 17.9343Z" fill="#235AFF"/>
            </svg>
            <span className="text-base font-black tracking-tight" style={{ color: '#0B1C30' }}>
              MyBookIns
            </span>
          </Link>

          {/* Search Bar */}
          <div className="flex-1 max-w-[500px] hidden md:flex items-center gap-2 px-4 py-3 rounded-[10px]" style={{ background: '#F5F5F5' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M21 21L15 15M17 11A6 6 0 11 5 11a6 6 0 0112 0z" stroke="#A0A0A0" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search services, salons, or stylists..."
              className="bg-transparent flex-1 outline-none text-sm font-normal"
              style={{ color: '#0B0C15' }}
            />
          </div>

          {/* Right: session-aware account controls */}
          <div className="flex items-center gap-3">
            <CustomerAuthActions />
          </div>
        </div>
      </header>

      {/* ── Sub-bar: Location + Categories ─────────────────────────────────── */}
      <div className="border-b border-[#F5F5F5] bg-white">
        <div className="max-w-[1360px] mx-auto px-5 py-3 flex items-center gap-16 flex-wrap md:flex-nowrap">

          {/* Location */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Image src="https://api.builder.io/api/v1/image/assets/TEMP/e87066137fc7161c4c7a2f93b7baa9c7f860132a?width=48" alt="pin" width={24} height={24} />
            <div>
              <p className="text-xs font-medium" style={{ color: '#939393' }}>Location</p>
              <p className="font-medium text-base" style={{ color: '#0B0C15' }}>England, London</p>
            </div>
            <Image src="https://api.builder.io/api/v1/image/assets/TEMP/0d0dfae7c1919743f512d00b977a20cacb2af3a0?width=48" alt="chevron" width={20} height={20} />
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-3 overflow-x-auto pb-1 flex-1 scrollbar-hide">
            {CATEGORIES.map((cat, idx) => {
              return (
                <button
                  key={`${cat.label}-${idx}`}
                  onClick={() => setActiveCategory(`${cat.label}-${idx}`)}
                  className="flex items-center gap-2 px-3 h-10 rounded-lg flex-shrink-0 transition-colors"
                  style={{
                    background: activeCategory === `${cat.label}-${idx}` ? '#235AFF' : '#F5F5F5',
                  }}
                >
                  <Image src={cat.icon} alt={cat.label} width={18} height={18} />
                  <span
                    className="text-sm font-medium whitespace-nowrap"
                    style={{ color: activeCategory === `${cat.label}-${idx}` ? '#FFF' : '#0B1C30' }}
                  >
                    {cat.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ── Main content ────────────────────────────────────────────────────── */}
      <div className="max-w-[1360px] mx-auto px-5 py-6 flex gap-6 items-start">

        {/* ── Left: Filters sidebar ───────────────────────────────────────── */}
        <aside className="hidden md:flex flex-col gap-4 w-[268px] flex-shrink-0">

          {/* Price Range */}
          <div className="bg-white rounded-[10px] p-4 flex flex-col gap-4" style={{ boxShadow: '0 4px 80px 0 rgba(0,0,0,0.08)' }}>
            <h3 className="font-semibold text-base" style={{ color: '#0B1C30' }}>Price Range</h3>
            <div className="flex justify-between text-base font-medium" style={{ color: '#0B1C30' }}>
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
            <input
              type="range"
              min={5}
              max={500}
              value={priceRange[1]}
              onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value)])}
              className="w-full accent-[#235AFF] cursor-pointer"
            />
          </div>

          {/* Location */}
          <div className="bg-white rounded-[10px] p-4 flex flex-col gap-4" style={{ boxShadow: '0 4px 80px 0 rgba(0,0,0,0.08)' }}>
            <h3 className="font-semibold text-base" style={{ color: '#0B1C30' }}>Location</h3>
            <div className="flex flex-col gap-2">
              <CheckFilter label="Near me" />
              <CheckFilter label="2 km" />
              <CheckFilter label="5 km" />
            </div>
          </div>

          {/* Ratings */}
          <div className="bg-white rounded-[10px] p-4 flex flex-col gap-4" style={{ boxShadow: '0 4px 80px 0 rgba(0,0,0,0.08)' }}>
            <h3 className="font-semibold text-base" style={{ color: '#0B1C30' }}>Ratings</h3>
            <div className="flex flex-col gap-3">
              <RatingFilter stars={5} />
              <RatingFilter stars={4} hasUp />
              <RatingFilter stars={3} hasUp />
            </div>
          </div>

          {/* Availability */}
          <div className="bg-white rounded-[10px] p-4 flex flex-col gap-4" style={{ boxShadow: '0 4px 80px 0 rgba(0,0,0,0.08)' }}>
            <h3 className="font-semibold text-base" style={{ color: '#0B1C30' }}>Availability</h3>
            <div className="flex flex-col gap-2">
              <CheckFilter label="Today" />
              <CheckFilter label="Tomorrow" />
            </div>
          </div>

          {/* Offers */}
          <div className="bg-white rounded-[10px] p-4 flex flex-col gap-4" style={{ boxShadow: '0 4px 80px 0 rgba(0,0,0,0.08)' }}>
            <h3 className="font-semibold text-base" style={{ color: '#0B1C30' }}>Offers</h3>
            <div className="flex flex-col gap-2">
              <CheckFilter label="20% off" />
              <CheckFilter label="Morning Deals" />
            </div>
          </div>
        </aside>

        {/* ── Right: Results grid ─────────────────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* Header row */}
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg" style={{ color: '#0B1C30' }}>
              Nearby Salons
              {searchQuery && (
                <span className="font-normal text-sm ml-2" style={{ color: '#939393' }}>
                  for &quot;{searchQuery}&quot;
                </span>
              )}
            </h2>
            <button className="flex items-center gap-1 text-sm font-bold uppercase transition-colors hover:opacity-80" style={{ color: '#235AFF', letterSpacing: '0.5px' }}>
              <Image src="https://api.builder.io/api/v1/image/assets/TEMP/cf55f53538d1d50e553ccf21beef0e544c78594c?width=40" alt="map" width={20} height={20} />
              View on Map
            </button>
          </div>

          {/* Salon grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {SALONS.map((salon, i) => (
              <SalonCard key={`${salon.id}-${i}`} salon={salon} />
            ))}
          </div>
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
