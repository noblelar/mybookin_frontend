'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import CustomerTopBar from '@/components/customer/CustomerTopBar'

const navTabs = ['Hotels', 'Resorts', 'Venues', 'Experiences']

export default function DiscoveryNavbar() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('Hotels')
  const [searchValue, setSearchValue] = useState('')

  const submitSearch = () => {
    const params = new URLSearchParams()
    if (searchValue.trim().length) {
      params.set('q', searchValue.trim())
    }

    router.push(`/find${params.toString() ? `?${params.toString()}` : ''}`)
  }

  const desktopNav = navTabs.map((tab) => (
    <button
      key={tab}
      onClick={() => setActiveTab(tab)}
      className={`relative px-4 py-2 text-sm font-semibold tracking-tight transition-colors ${
        activeTab === tab
          ? 'text-[#0F172A] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0F172A]'
          : 'text-slate-500 hover:text-slate-800'
      }`}
    >
      {tab}
    </button>
  ))

  const desktopSearch = (
    <div className="hidden max-w-xs items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 px-3 py-2 lg:max-w-sm md:flex">
      <svg width="14" height="14" viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 opacity-50">
        <path d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z" fill="#76777D"/>
      </svg>
      <input
        type="text"
        placeholder="Search experiences..."
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            submitSearch()
          }
        }}
        className="w-full bg-transparent text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none"
      />
    </div>
  )

  const mobileSearch = (
    <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5">
      <svg width="15" height="15" viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 opacity-50">
        <path d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z" fill="#76777D"/>
      </svg>
      <input
        type="text"
        placeholder="Find services, studios, or artists..."
        value={searchValue}
        onChange={(event) => setSearchValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault()
            submitSearch()
          }
        }}
        className="flex-1 bg-transparent text-sm font-medium text-slate-600 placeholder:text-slate-400 outline-none"
      />
      <button
        onClick={submitSearch}
        className="flex-shrink-0 opacity-60 transition-opacity hover:opacity-100"
      >
        <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 14V12H10V14H7ZM4 8.5V6.5H13V8.5H4ZM1 3V1H16V3H1Z" fill="#475569"/>
        </svg>
      </button>
    </div>
  )

  return (
    <CustomerTopBar
      desktopNav={desktopNav}
      desktopSearch={desktopSearch}
      mobileSearch={mobileSearch}
      mobileLeading={
        <button className="flex h-8 w-8 items-center justify-center" aria-label="Open menu">
          <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="20" height="2" rx="1" fill="#0F172A"/>
            <rect y="6" width="20" height="2" rx="1" fill="#0F172A"/>
            <rect y="12" width="20" height="2" rx="1" fill="#0F172A"/>
          </svg>
        </button>
      }
    />
  )
}
