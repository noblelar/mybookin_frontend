import Image from 'next/image'
import { MapPin, Clock, Star, Phone } from 'lucide-react'
import BusinessDetailsClient from './client'

// Sample business data - in a real app, this would come from an API based on slug
const businessData = {
  'the-monolith-atelier': {
    id: '1',
    name: 'The Monolith Atelier',
    slug: 'the-monolith-atelier',
    rating: 4.9,
    reviews: 284,
    location: 'London, UK',
    address: '123 Brick Lane, London E1 6QL',
    phone: '+44 20 7123 4567',
    hours: {
      monday: '10:00 AM - 8:00 PM',
      tuesday: '10:00 AM - 8:00 PM',
      wednesday: '10:00 AM - 8:00 PM',
      thursday: '10:00 AM - 9:00 PM',
      friday: '10:00 AM - 9:00 PM',
      saturday: '11:00 AM - 6:00 PM',
      sunday: 'Closed',
    },
    heroImage: 'https://api.builder.io/api/v1/image/assets/TEMP/d508ac7f547631f26d8bd728c36d889f72ae660e?width=1200',
    description: 'Premium barber and grooming studio specializing in precision cuts, beard styling, and luxury grooming treatments.',
    facilities: ['WiFi', 'Parking', 'Complimentary Drinks', 'Private Rooms'],
    services: [
      {
        id: '1',
        name: 'Classic Haircut',
        description: 'Professional haircut with line-up and shaping',
        duration: '30 mins',
        price: 35,
        category: 'Hair Services',
      },
      {
        id: '2',
        name: 'Beard Trim & Shape',
        description: 'Complete beard styling with hot towel treatment',
        duration: '25 mins',
        price: 28,
        category: 'Beard Services',
      },
      {
        id: '3',
        name: 'Full Grooming Package',
        description: 'Haircut, beard trim, shampoo, and beard oil treatment',
        duration: '60 mins',
        price: 85,
        category: 'Packages',
        tag: 'RESOURCE STATIONED',
      },
      {
        id: '4',
        name: 'Hair Coloring',
        description: 'Premium hair coloring with expert color consultation',
        duration: '90 mins',
        price: 120,
        category: 'Hair Services',
      },
      {
        id: '5',
        name: 'Hot Shave',
        description: 'Traditional hot towel shave with premium products',
        duration: '20 mins',
        price: 22,
        category: 'Shaving Services',
      },
    ],
    staff: [
      {
        id: '1',
        name: 'Marcus Thompson',
        role: 'Senior Barber',
        image: 'https://api.builder.io/api/v1/image/assets/TEMP/b1300631cb29f01d963d09791de71f8683dafad9?width=150',
        rating: 4.95,
      },
    ],
  },
}

export default async function BusinessDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const business = businessData[slug as keyof typeof businessData]

  if (!business) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Business Not Found</h1>
          <p className="text-slate-600">The business you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="relative h-96 bg-slate-200 overflow-hidden">
        <Image
          src={business.heroImage}
          alt={business.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-24 relative z-10">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-between items-start gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">{business.name}</h1>
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(business.rating) ? 'fill-slate-900 text-slate-900' : 'text-slate-300'}
                      />
                    ))}
                  </div>
                  <span className="font-semibold text-slate-900">{business.rating}</span>
                  <span className="text-slate-500">({business.reviews} reviews)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
            {/* Location */}
            <div className="flex gap-3">
              <MapPin size={20} className="text-slate-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-slate-900 text-sm uppercase tracking-wide text-slate-600">Location</p>
                <p className="text-slate-900">{business.address}</p>
                <p className="text-slate-600 text-sm">{business.location}</p>
              </div>
            </div>

            {/* Hours */}
            <div className="flex gap-3">
              <Clock size={20} className="text-slate-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-slate-900 text-sm uppercase tracking-wide text-slate-600">Hours</p>
                <p className="text-slate-900">{business.hours.monday}</p>
                <p className="text-slate-600 text-sm">Mon-Wed, Sat-Sun</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex gap-3">
              <Phone size={20} className="text-slate-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-semibold text-slate-900 text-sm uppercase tracking-wide text-slate-600">Contact</p>
                <p className="text-slate-900">{business.phone}</p>
              </div>
            </div>

            {/* Description */}
            <div>
              <p className="font-semibold text-slate-900 text-sm uppercase tracking-wide text-slate-600 mb-2">About</p>
              <p className="text-slate-700">{business.description}</p>
            </div>
          </div>

          {/* Facilities */}
          {business.facilities.length > 0 && (
            <div className="border-t pt-6 mt-6">
              <p className="font-semibold text-slate-900 text-sm uppercase tracking-wide text-slate-600 mb-3">Facilities</p>
              <div className="flex flex-wrap gap-2">
                {business.facilities.map(facility => (
                  <span key={facility} className="px-3 py-1 bg-blue-50 text-blue-900 rounded-full text-sm font-medium">
                    {facility}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Client Component for Interactive Parts */}
        <BusinessDetailsClient business={business} slug={slug} />
      </div>
    </div>
  )
}
