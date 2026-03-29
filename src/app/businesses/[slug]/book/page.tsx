'use client'

import { useState, use } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// ── Static data ────────────────────────────────────────────────────────────
const STAFF = [
  {
    id: 'julian',
    name: 'Julian S.',
    status: 'AVAILABLE' as const,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/b1300631cb29f01d963d09791de71f8683dafad9?width=150',
  },
  {
    id: 'aria',
    name: 'Aria M.',
    status: 'OFF-DUTY' as const,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/9983a564b8c383cdb8949630f0f164ead3fcfe4f?width=150',
  },
  {
    id: 'rowan',
    name: 'Rowan K.',
    status: 'AVAILABLE' as const,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/8c088a9c7625c7b54fff538728cdcf1186f08f9d?width=150',
  },
  {
    id: 'marcus',
    name: 'Marcus V.',
    status: 'AVAILABLE' as const,
    image: 'https://api.builder.io/api/v1/image/assets/TEMP/b1300631cb29f01d963d09791de71f8683dafad9?width=150',
  },
]

const SERVICES: Record<string, { name: string; duration: string; price: number; category: string }> = {
  'classic-haircut': { name: 'Classic Haircut', duration: '30 min', price: 35, category: 'Hair Services' },
  'beard-trim-shape': { name: 'Beard Trim & Shape', duration: '25 min', price: 28, category: 'Beard Services' },
  'full-grooming-package': { name: 'Full Grooming Package', duration: '60 min', price: 85, category: 'Packages' },
  'hair-coloring': { name: 'Hair Coloring', duration: '90 min', price: 120, category: 'Hair Services' },
  'hot-shave': { name: 'Hot Shave', duration: '20 min', price: 22, category: 'Shaving Services' },
  default: { name: 'Haircut', duration: '45 min', price: 35, category: 'Executive Grooming' },
}

// ── Build a 7-day week starting from today ─────────────────────────────────
function buildWeek() {
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
  const today = new Date()
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    return { label: days[d.getDay()], num: d.getDate(), date: d }
  })
}

// ── Time slots ─────────────────────────────────────────────────────────────
const TIME_SLOTS = [
  { time: '09:00', period: 'AM', status: 'available' as const },
  { time: '09:45', period: 'AM', status: 'available' as const },
  { time: '10:30', period: 'AM', status: 'time-off' as const },
  { time: '11:15', period: 'AM', status: 'available' as const },
  { time: '12:00', period: 'PM', status: 'available' as const },
  { time: '12:45', period: 'PM', status: 'available' as const },
  { time: '01:30', period: 'PM', status: 'available' as const },
  { time: '02:15', period: 'PM', status: 'booked' as const },
  { time: '03:00', period: 'PM', status: 'available' as const },
  { time: '03:45', period: 'PM', status: 'available' as const },
  { time: '04:30', period: 'PM', status: 'available' as const },
  { time: '05:15', period: 'PM', status: 'available' as const },
]

// ── Component ──────────────────────────────────────────────────────────────
export default function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ service?: string }>
}) {
  const { slug } = use(params)
  const { service: serviceId } = use(searchParams)

  const service = SERVICES[serviceId ?? ''] ?? SERVICES.default
  const week = buildWeek()

  const [selectedStaff, setSelectedStaff] = useState<string | null>(null)
  const [selectedDay, setSelectedDay] = useState<number>(0) // index into week
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const canConfirm = selectedStaff !== null && selectedTime !== null

  return (
    <div className="min-h-screen bg-[#EFF4FF] pb-24 lg:pb-0">

      {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
      <div className="bg-[#0D1F35] px-4 md:px-8 py-2.5">
        <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-teal-300">
          The Monolith Atelier
          <span className="text-white/40 mx-2">/</span>
          Book a Service
          <span className="text-white/40 mx-2">/</span>
          <span className="text-white/70">Select Professional &amp; Time</span>
        </p>
      </div>

      {/* ── Page header ──────────────────────────────────────────────────── */}
      <div className="px-4 md:px-8 py-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <Link
            href={`/businesses/${slug}`}
            className="flex items-center gap-2 text-[10px] font-bold tracking-[0.12em] uppercase text-slate-500 hover:text-slate-800 mb-2 transition w-fit"
          >
            <svg width="14" height="10" viewBox="0 0 20 14" fill="none">
              <path d="M7 14L0 7L7 0L8.4 1.4L3.825 6H20V8H3.825L8.425 12.6L7 14Z" fill="currentColor"/>
            </svg>
            Back to Business
          </Link>
          <h1 className="font-manrope text-2xl md:text-3xl font-extrabold text-[#0B1C30] tracking-tight">
            Staff Selection &amp; Availability
          </h1>
        </div>

        {/* View toggle */}
        <div className="hidden md:flex border border-slate-300 overflow-hidden">
          <button className="px-4 py-2 text-[10px] font-black tracking-widest uppercase bg-[#0B1C30] text-white">
            Standard View
          </button>
          <button className="px-4 py-2 text-[10px] font-black tracking-widest uppercase bg-white text-slate-500 hover:text-slate-800 border-l border-slate-300 transition">
            Comfortable
          </button>
        </div>
      </div>

      {/* ── Main layout ──────────────────────────────────────────────────── */}
      <div className="px-4 md:px-8 pb-8 flex flex-col lg:flex-row gap-6 items-start">

        {/* ── Left: staff + date + time ───────────────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col gap-5">

          {/* Available Professionals */}
          <div className="bg-white border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-manrope font-bold text-[#0B1C30] text-base">Available Professionals</h2>
              <div className="flex gap-2">
                <button className="w-8 h-8 border border-slate-300 flex items-center justify-center hover:border-slate-500 transition text-slate-500">
                  <svg width="14" height="14" viewBox="0 0 20 14" fill="none">
                    <path d="M7 14L0 7L7 0L8.4 1.4L3.825 6H20V8H3.825L8.425 12.6L7 14Z" fill="currentColor"/>
                  </svg>
                </button>
                <button className="w-8 h-8 border border-slate-300 flex items-center justify-center hover:border-slate-500 transition text-slate-500">
                  <svg width="14" height="14" viewBox="0 0 20 14" fill="none">
                    <path d="M13 14L11.575 12.6L16.175 8H0V6H16.175L11.6 1.4L13 0L20 7L13 14Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {STAFF.map(member => (
                <button
                  key={member.id}
                  onClick={() => member.status === 'AVAILABLE' && setSelectedStaff(member.id)}
                  disabled={member.status !== 'AVAILABLE'}
                  className={`flex flex-col items-center gap-2 p-3 border transition
                    ${selectedStaff === member.id
                      ? 'border-[#0B1C30] bg-[#EFF4FF]'
                      : member.status === 'AVAILABLE'
                        ? 'border-slate-200 hover:border-slate-400 bg-[#F8F9FF] cursor-pointer'
                        : 'border-slate-200 bg-slate-50 opacity-60 cursor-not-allowed'
                    }`}
                >
                  <div className="relative">
                    <div className="w-14 h-14 overflow-hidden bg-slate-200">
                      <Image
                        src={member.image}
                        alt={member.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover grayscale"
                      />
                    </div>
                    {/* Status dot */}
                    <span className={`absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-white
                      ${member.status === 'AVAILABLE' ? 'bg-emerald-500' : 'bg-amber-400'}`}
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-xs font-bold text-[#0B1C30] leading-tight">{member.name}</p>
                    <p className={`text-[9px] font-black tracking-widest uppercase mt-0.5 ${
                      member.status === 'AVAILABLE' ? 'text-emerald-600' : 'text-amber-500'
                    }`}>
                      {member.status.replace('-', ' ')}
                    </p>
                  </div>
                  {selectedStaff === member.id && (
                    <div className="w-full h-0.5 bg-[#0B1C30] mt-1" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Week date picker */}
          <div className="bg-white border border-slate-200 shadow-sm px-5 py-4">
            <div className="grid grid-cols-7 gap-1">
              {week.map((day, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedDay(idx)}
                  className={`flex flex-col items-center py-3 px-1 transition
                    ${selectedDay === idx
                      ? 'bg-[#0B1C30] text-white'
                      : 'hover:bg-slate-100 text-[#0B1C30]'
                    }`}
                >
                  <span className={`text-[9px] font-bold tracking-widest uppercase mb-1 ${
                    selectedDay === idx ? 'text-white/60' : 'text-slate-500'
                  }`}>
                    {day.label}
                  </span>
                  <span className="text-lg font-black leading-none">{day.num}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Daily schedule matrix */}
          <div className="bg-white border border-slate-200 shadow-sm p-5">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[10px] font-black tracking-[0.14em] uppercase text-slate-600">
                Daily Schedule Matrix
              </h2>
              <p className="text-[10px] font-medium text-slate-400 tracking-wide">
                Time Zone: GMT+0
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {TIME_SLOTS.map(slot => {
                const slotKey = `${slot.time}-${slot.period}`
                const isSelected = selectedTime === slotKey
                const isUnavailable = slot.status !== 'available'

                return (
                  <button
                    key={slotKey}
                    onClick={() => slot.status === 'available' && setSelectedTime(slotKey)}
                    disabled={isUnavailable}
                    className={`flex flex-col items-center py-3 border transition
                      ${isSelected
                        ? 'bg-[#0B1C30] text-white border-[#0B1C30]'
                        : slot.status === 'time-off'
                          ? 'bg-white border-slate-200 cursor-not-allowed'
                          : slot.status === 'booked'
                            ? 'bg-slate-50 border-slate-200 cursor-not-allowed'
                            : 'bg-white border-slate-200 hover:border-slate-400 cursor-pointer'
                      }`}
                  >
                    <span className={`text-sm font-bold leading-none ${
                      isSelected ? 'text-white' :
                      slot.status === 'time-off' ? 'text-red-500' :
                      slot.status === 'booked' ? 'text-slate-300' :
                      'text-[#0B1C30]'
                    }`}>
                      {slot.time}
                    </span>
                    <span className={`text-[9px] font-bold tracking-wider uppercase mt-0.5 ${
                      isSelected ? 'text-white/70' :
                      slot.status === 'time-off' ? 'text-red-400' :
                      slot.status === 'booked' ? 'text-slate-300' :
                      'text-slate-400'
                    }`}>
                      {slot.status === 'time-off' ? 'Time Off' :
                       slot.status === 'booked' ? 'Booked' :
                       slot.period}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Bottom stats bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Staff Utilization', value: '84.2%' },
              { label: 'Resource Load', value: 'High' },
              { label: 'Booking Lead', value: '2.4 Days' },
              { label: 'Cancellation', value: '0.8%' },
            ].map(stat => (
              <div key={stat.label} className="border-l-2 border-slate-400 pl-3 py-1">
                <p className="text-[9px] font-black tracking-widest uppercase text-slate-400 mb-1">
                  {stat.label}
                </p>
                <p className="text-xl font-extrabold text-[#0B1C30]">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right: Service summary sidebar (desktop) ────────────────── */}
        <div className="hidden lg:flex flex-col gap-4 w-72 xl:w-80 flex-shrink-0">

          {/* Service details */}
          <div className="bg-white border border-slate-200 shadow-sm p-5">
            <p className="text-[9px] font-black tracking-[0.14em] uppercase text-slate-400 mb-2">
              Selected Service
            </p>
            <h2 className="font-manrope text-2xl font-extrabold text-[#0B1C30] mb-5">
              {service.name}
            </h2>

            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                    <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <span className="text-sm">Duration</span>
                </div>
                <span className="text-sm font-bold text-[#0B1C30]">{service.duration}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <rect x="2" y="5" width="20" height="14" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M2 10h20" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  <span className="text-sm">Base Price</span>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extrabold text-[#0B1C30]">£{service.price.toFixed(2)}</p>
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Currency: GBP</p>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" stroke="currentColor" strokeWidth="1.5"/>
                    <circle cx="7" cy="7" r="1" fill="currentColor"/>
                  </svg>
                  <span className="text-sm">Category</span>
                </div>
                <span className="text-xs font-black uppercase tracking-wide bg-[#0B1C30] text-white px-2.5 py-1">
                  {service.category}
                </span>
              </div>
            </div>
          </div>

          {/* Resource assignment */}
          <div className="bg-[#EFF4FF] border border-slate-200 shadow-sm p-4 flex gap-3">
            <div className="w-10 h-10 bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="8" width="18" height="12" rx="1" stroke="#0B1C30" strokeWidth="1.5"/>
                <path d="M7 8V6a5 5 0 0110 0v2" stroke="#0B1C30" strokeWidth="1.5"/>
                <path d="M3 13h18" stroke="#0B1C30" strokeWidth="1.5"/>
              </svg>
            </div>
            <div>
              <p className="text-[9px] font-black tracking-[0.14em] uppercase text-slate-400 mb-0.5">
                Resource Assignment
              </p>
              <p className="text-sm font-bold text-[#0B1C30] mb-1">Chair #1</p>
              <p className="text-xs text-slate-500 leading-snug">
                Reserved specifically for this service session in Studio A.
              </p>
            </div>
          </div>

          {/* Confirm booking panel */}
          <div className="bg-[#0B1C30] p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black tracking-widest uppercase text-white/40 mb-1">
                  Estimated Total
                </p>
                <p className="text-3xl font-extrabold text-white">
                  £{service.price.toFixed(2)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-[9px] font-black tracking-widest uppercase text-white/40 mb-1">Status</p>
                <p className={`text-sm font-black tracking-wide uppercase ${canConfirm ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {canConfirm ? 'Ready' : 'Pending'}
                </p>
              </div>
            </div>

            <Link
              href={canConfirm ? `/businesses/${slug}/checkout` : '#'}
              onClick={e => !canConfirm && e.preventDefault()}
              className={`block w-full text-center py-3.5 font-black tracking-[0.16em] uppercase text-sm transition
                ${canConfirm
                  ? 'bg-white text-[#0B1C30] hover:bg-slate-100'
                  : 'bg-white/20 text-white/40 cursor-not-allowed'
                }`}
            >
              Confirm Booking
            </Link>

            <p className="text-center text-[9px] font-bold tracking-[0.14em] uppercase text-white/25">
              Architect Terminal V2.4.1
            </p>
          </div>
        </div>
      </div>

      {/* ── Mobile sticky bar ─────────────────────────────────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0B1C30] shadow-2xl z-50">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <div>
            <p className="text-[9px] font-black tracking-widest uppercase text-white/40">
              {service.name}
            </p>
            <p className="text-xl font-extrabold text-white">£{service.price.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black tracking-widest uppercase text-white/40">Status</p>
            <p className={`text-xs font-black uppercase tracking-wide ${canConfirm ? 'text-emerald-400' : 'text-amber-400'}`}>
              {canConfirm ? 'Ready' : 'Select staff & time'}
            </p>
          </div>
        </div>
        <div className="px-4 py-3">
          <Link
            href={canConfirm ? `/businesses/${slug}/checkout` : '#'}
            onClick={e => !canConfirm && e.preventDefault()}
            className={`block w-full text-center py-3 font-black tracking-[0.14em] uppercase text-sm transition
              ${canConfirm
                ? 'bg-white text-[#0B1C30] hover:bg-slate-100'
                : 'bg-white/20 text-white/40 cursor-not-allowed pointer-events-none'
              }`}
          >
            Confirm Booking
          </Link>
        </div>
      </div>
    </div>
  )
}
