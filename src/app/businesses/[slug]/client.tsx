'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Star } from 'lucide-react'

interface Service {
  id: string
  name: string
  description: string
  duration: string
  price: number
  category: string
  tag?: string
}

interface StaffMember {
  id: string
  name: string
  role: string
  image: string
  rating: number
}

interface Business {
  id: string
  name: string
  services: Service[]
  staff: StaffMember[]
}

export default function BusinessDetailsClient({ business, slug }: { business: Business; slug: string }) {
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  // Get unique categories
  const categories = Array.from(new Set(business.services.map(s => s.category)))
  const filteredServices = activeCategory 
    ? business.services.filter(s => s.category === activeCategory)
    : business.services

  return (
    <>
      {/* Services Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Services</h2>

        {/* Category Filter */}
        {categories.length > 1 && (
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
            {categories.map(category => (
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
        )}

        {/* Services Grid */}
        <div className="grid gap-4">
          {filteredServices.map(service => (
            <div key={service.id} className="bg-white rounded-lg p-5 border border-slate-200 hover:shadow-md transition">
              <div className="flex justify-between items-start gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-slate-900">{service.name}</h3>
                    {service.tag && (
                      <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded">
                        {service.tag}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm mb-3">{service.description}</p>
                  <div className="flex gap-4 text-sm text-slate-500">
                    <span>⏱️ {service.duration}</span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-bold text-slate-900">£{service.price}</p>
                  <Link
                      href={`/businesses/${slug}/book?service=${encodeURIComponent(service.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}`}
                      className="mt-2 inline-block px-4 py-2 bg-slate-900 text-white rounded-lg font-semibold text-sm hover:bg-slate-800 transition"
                    >
                      Book Now
                    </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Section */}
      {business.staff.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Meet Our Team</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {business.staff.map(member => (
              <div key={member.id} className="bg-white rounded-lg p-6 border border-slate-200">
                <div className="flex gap-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      sizes="64px"
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{member.name}</h3>
                    <p className="text-slate-600 text-sm mb-2">{member.role}</p>
                    <div className="flex items-center gap-1">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={i < Math.floor(member.rating) ? 'fill-slate-900 text-slate-900' : 'text-slate-300'}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{member.rating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  )
}
