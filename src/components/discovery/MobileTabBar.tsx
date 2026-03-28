'use client'

import { useState } from 'react'

const tabs = [
  {
    id: 'home',
    label: 'Home',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" fill={active ? 'white' : '#64748B'}/>
      </svg>
    ),
  },
  {
    id: 'bookings',
    label: 'Bookings',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" fill={active ? '#64748B' : '#64748B'}/>
      </svg>
    ),
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill={active ? '#64748B' : '#64748B'}/>
      </svg>
    ),
  },
]

export default function MobileTabBar() {
  const [activeTab, setActiveTab] = useState('home')

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 safe-bottom">
      <div className="flex items-center justify-around px-4 h-16">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center gap-1 flex-1 py-2"
            >
              {isActive ? (
                <div className="w-12 h-8 bg-[#0B1C30] rounded-full flex items-center justify-center">
                  {tab.icon(true)}
                </div>
              ) : (
                <div className="w-12 h-8 flex items-center justify-center">
                  {tab.icon(false)}
                </div>
              )}
              <span className={`text-[10px] font-semibold ${isActive ? 'text-[#0B1C30]' : 'text-slate-400'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
