import ServiceCard from './ServiceCard'

const services = [
  {
    id: 1,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/d508ac7f547631f26d8bd728c36d889f72ae660e?width=764',
    category: 'Barber',
    name: 'Iron & Taper Studio',
    rating: 4.9,
    reviewCount: 124,
    distance: '0.8 miles away',
  },
  {
    id: 2,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/e7ab092d1192ceaa63c643f8c9b5ffca8c505cef?width=764',
    category: 'Hair',
    name: 'Lumina Hair Collective',
    rating: 4.8,
    reviewCount: 310,
    distance: '1.2 miles away',
  },
  {
    id: 3,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/a6d0450add48b3844ecd97a59f50a2d889bb3aec?width=764',
    category: 'Restaurant',
    name: 'Monolith Kitchen',
    rating: 5.0,
    reviewCount: 89,
    distance: '0.3 miles away',
  },
  {
    id: 4,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/f2aa736095396c625377fa3822964fee02b028e5?width=764',
    category: 'Nails',
    name: 'Onyx & Ivory Spa',
    rating: 4.7,
    reviewCount: 215,
    distance: '2.1 miles away',
  },
  {
    id: 5,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/7112e148ef0f9b526f7070a4f02abfee6a33df1c?width=764',
    category: 'Tutor',
    name: 'The Scholar Society',
    rating: 4.9,
    reviewCount: 42,
    distance: 'Remote / 3.0 miles',
  },
  {
    id: 6,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/d508ac7f547631f26d8bd728c36d889f72ae660e?width=764',
    category: 'Fitness',
    name: 'Axis Performance Lab',
    rating: 4.6,
    reviewCount: 512,
    distance: '1.5 miles away',
  },
  {
    id: 7,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/e7ab092d1192ceaa63c643f8c9b5ffca8c505cef?width=764',
    category: 'Spa',
    name: 'Haven Wellness',
    rating: 4.8,
    reviewCount: 180,
    distance: '2.4 miles away',
  },
  {
    id: 8,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/a6d0450add48b3844ecd97a59f50a2d889bb3aec?width=764',
    category: 'Nails',
    name: 'Studio Pure',
    rating: 4.9,
    reviewCount: 92,
    distance: '0.5 miles away',
  },
]

export default function ServiceGrid() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {services.map((service) => (
          <ServiceCard key={service.id} {...service} />
        ))}
      </div>
    </div>
  )
}
