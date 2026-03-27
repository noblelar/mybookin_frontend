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
    <section
      className="w-full"
      style={{
        background: '#F8F9FF',
        paddingTop: '96px',
        paddingBottom: '96px',
      }}
    >
      <div
        className="mx-auto px-6 flex flex-col gap-16"
        style={{ maxWidth: '1280px' }}
      >
        {/* Header */}
        <div className="flex justify-between items-end gap-8">
          <div className="flex flex-col gap-4">
            <h2
              className="font-manrope font-extrabold"
              style={{
                fontSize: '36px',
                color: '#0B1C30',
                lineHeight: '40px',
                letterSpacing: '-1.8px',
              }}
            >
              Featured Destinations
            </h2>
            <p
              className="font-inter font-normal text-base"
              style={{ color: '#45464D', maxWidth: '448px' }}
            >
              The most sought-after experts across the MyBookins network,
              vetted for quality and consistency.
            </p>
          </div>
          <a
            href="#"
            className="font-inter text-sm font-bold uppercase pb-1 flex-shrink-0"
            style={{
              color: '#0B1C30',
              letterSpacing: '1.4px',
              borderBottom: '2px solid #000',
            }}
          >
            View All Businesses
          </a>
        </div>

        {/* Grid */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
            gap: '40px',
          }}
        >
          {businesses.map((business, index) => (
            <BusinessCard key={index} {...business} />
          ))}
        </div>
      </div>
    </section>
  )
}
