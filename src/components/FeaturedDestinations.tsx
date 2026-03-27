import BusinessCard from './BusinessCard'

const businesses = [
  {
    name: 'Iron & Taper Studio',
    image:
      'https://api.builder.io/api/v1/image/assets/TEMP/d508ac7f547631f26d8bd728c36d889f72ae660e?width=764',
    badge: 'Open Now',
    badgeStyle: 'green' as const,
    rating: 4.9,
    location: 'London, UK',
    price: 'Starting from £35',
  },
  {
    name: 'The Core Alignment',
    image:
      'https://api.builder.io/api/v1/image/assets/TEMP/e7ab092d1192ceaa63c643f8c9b5ffca8c505cef?width=764',
    badge: 'Open Now',
    badgeStyle: 'green' as const,
    rating: 5.0,
    location: 'Manchester, UK',
    price: 'Starting from £60',
  },
  {
    name: 'Lumina Wellness',
    image:
      'https://api.builder.io/api/v1/image/assets/TEMP/a6d0450add48b3844ecd97a59f50a2d889bb3aec?width=764',
    badge: 'Booked Today',
    badgeStyle: 'dark' as const,
    rating: 4.8,
    location: 'Edinburgh, UK',
    price: 'Starting from £85',
  },
]

export default function FeaturedDestinations() {
  return (
    <section className="w-full py-24 px-6 bg-light">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-end gap-8 mb-16">
          <div className="flex flex-col gap-4">
            <h2 className="font-manrope text-4xl font-bold text-navy">
              Featured Destinations
            </h2>
            <p className="text-body max-w-md">
              The best-in-class service providers from across the MyBookins
              network, vetted for quality and consistency.
            </p>
          </div>
          <a
            href="#"
            className="pb-1 border-b-2 border-navy text-navy font-bold text-sm uppercase tracking-wider hover:text-opacity-80 transition-colors whitespace-nowrap"
          >
            View All Businesses
          </a>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-10">
          {businesses.map((business, index) => (
            <BusinessCard key={index} {...business} />
          ))}
        </div>
      </div>
    </section>
  )
}
