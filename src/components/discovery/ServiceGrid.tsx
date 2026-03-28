import ServiceCard, { ServiceCardProps } from './ServiceCard'

const services: ServiceCardProps[] = [
  {
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/d508ac7f547631f26d8bd728c36d889f72ae660e?width=764',
    category: 'Barber',
    name: 'The Heritage Grooming Co.',
    rating: 4.9,
    reviewCount: 124,
    distance: '0.8 miles away',
    price: 'from $45',
    nextSlot: 'Next: 2:30 PM',
  },
  {
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/e7ab092d1192ceaa63c643f8c9b5ffca8c505cef?width=764',
    category: 'Hair',
    name: 'Aura Studio & Spa',
    rating: 5.0,
    reviewCount: 310,
    distance: '1.4 miles away',
    price: 'from $85',
    nextSlot: 'Tomorrow',
  },
  {
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/a6d0450add48b3844ecd97a59f50a2d889bb3aec?width=764',
    category: 'Nails',
    name: 'Varnish & Velvet',
    rating: 4.8,
    reviewCount: 215,
    distance: '2.1 miles',
    price: '$35+',
    isPremium: true,
  },
  {
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/f2aa736095396c625377fa3822964fee02b028e5?width=764',
    category: 'Fitness',
    name: 'Equilibrium Movement',
    rating: 4.7,
    reviewCount: 92,
    distance: '3.2 miles away',
    price: 'from $25',
    urgency: 'Only 2 spots left',
  },
  {
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/7112e148ef0f9b526f7070a4f02abfee6a33df1c?width=764',
    category: 'Tutor',
    name: 'The Scholar Society',
    rating: 4.9,
    reviewCount: 42,
    distance: 'Remote / 3.0 miles',
    price: 'from $60',
    nextSlot: 'Next: 5:00 PM',
  },
  {
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/d508ac7f547631f26d8bd728c36d889f72ae660e?width=764',
    category: 'Fitness',
    name: 'Axis Performance Lab',
    rating: 4.6,
    reviewCount: 512,
    distance: '1.5 miles away',
    price: 'from $30',
    nextSlot: 'Tomorrow',
  },
  {
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/e7ab092d1192ceaa63c643f8c9b5ffca8c505cef?width=764',
    category: 'Spa',
    name: 'Haven Wellness',
    rating: 4.8,
    reviewCount: 180,
    distance: '2.4 miles away',
    price: 'from $95',
    nextSlot: 'Next: 4:00 PM',
  },
  {
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/a6d0450add48b3844ecd97a59f50a2d889bb3aec?width=764',
    category: 'Nails',
    name: 'Studio Pure',
    rating: 4.9,
    reviewCount: 92,
    distance: '0.5 miles away',
    price: 'from $40',
    urgency: 'Only 1 spot left',
  },
]

export default function ServiceGrid() {
  return (
    <div className="max-w-[1280px] mx-auto md:px-6 md:py-8">
      {/* Mobile: full-width stacked list (no padding/gap, just dividers) */}
      <div className="md:hidden flex flex-col divide-y divide-slate-100">
        {services.map((service, i) => (
          <ServiceCard key={i} {...service} />
        ))}
      </div>

      {/* Desktop: responsive grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {services.map((service, i) => (
          <ServiceCard key={i} {...service} />
        ))}
      </div>
    </div>
  )
}
