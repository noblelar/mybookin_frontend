'use client'

import { useState } from 'react'
import Link from 'next/link'

const navTabs = ['Hotels', 'Resorts', 'Venues', 'Experiences']

export default function DiscoveryNavbar() {
  const [activeTab, setActiveTab] = useState('Hotels')
  const [searchValue, setSearchValue] = useState('')

  return (
    <>
      {/* Top bar */}
      <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200/60 shadow-sm">
        <div className="max-w-[1280px] mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between gap-3">
          {/* Mobile: Hamburger | Desktop: Logo */}
          <button className="md:hidden flex items-center justify-center w-8 h-8 flex-shrink-0" aria-label="Open menu">
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="20" height="2" rx="1" fill="#0F172A"/>
              <rect y="6" width="20" height="2" rx="1" fill="#0F172A"/>
              <rect y="12" width="20" height="2" rx="1" fill="#0F172A"/>
            </svg>
          </button>

          {/* Logo — centered on mobile, left on desktop */}
          <Link href="/" className="md:flex-shrink-0 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0">
            <span className="font-black text-[#0B1C30] tracking-tight uppercase text-base md:text-lg leading-none">
              MyBookIns
            </span>
          </Link>

          {/* Desktop nav tabs */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-semibold tracking-tight transition-colors relative ${
                  activeTab === tab
                    ? 'text-[#0F172A] after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-[#0F172A]'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>

          {/* Desktop search */}
          <div className="flex-1 max-w-xs lg:max-w-sm hidden md:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 border border-slate-200">
            <svg width="14" height="14" viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 opacity-50">
              <path d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z" fill="#76777D"/>
            </svg>
            <input
              type="text"
              placeholder="Search experiences..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none w-full font-medium"
            />
          </div>

          {/* Right: Bell (desktop) + Avatar */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="hidden md:flex w-9 h-9 items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
              <svg width="18" height="20" viewBox="0 0 18 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 17V15H2V8C2 6.61667 2.41667 5.3875 3.25 4.3125C4.08333 3.2375 5.16667 2.53333 6.5 2.2V1.5C6.5 1.08333 6.64583 0.729167 6.9375 0.4375C7.22917 0.145833 7.58333 0 8 0C8.41667 0 8.77083 0.145833 9.0625 0.4375C9.35417 0.729167 9.5 1.08333 9.5 1.5V2.2C10.8333 2.53333 11.9167 3.2375 12.75 4.3125C13.5833 5.3875 14 6.61667 14 8V15H16V17H0ZM8 20C7.45 20 6.97917 19.8042 6.5875 19.4125C6.19583 19.0208 6 18.55 6 18H10C10 18.55 9.80417 19.0208 9.4125 19.4125C9.02083 19.8042 8.55 20 8 20ZM4 15H12V8C12 6.9 11.6083 5.95833 10.825 5.175C10.0417 4.39167 9.1 4 8 4C6.9 4 5.95833 4.39167 5.175 5.175C4.39167 5.95833 4 6.9 4 8V15Z" fill="#64748B"/>
              </svg>
            </button>
            <button className="w-9 h-9 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center flex-shrink-0 ring-2 ring-slate-200">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="white"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile search bar */}
        <div className="md:hidden px-4 pb-3">
          <div className="flex items-center gap-2 bg-slate-100 rounded-xl px-3 py-2.5 border border-slate-200">
            <svg width="15" height="15" viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 opacity-50">
              <path d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z" fill="#76777D"/>
            </svg>
            <input
              type="text"
              placeholder="Find services, studios, or artists..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="bg-transparent text-sm text-slate-600 placeholder:text-slate-400 outline-none flex-1 font-medium"
            />
            {/* Filter icon */}
            <button className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity">
              <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M7 14V12H10V14H7ZM4 8.5V6.5H13V8.5H4ZM1 3V1H16V3H1Z" fill="#475569"/>
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  )
}
