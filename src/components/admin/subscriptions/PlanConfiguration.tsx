'use client'

import { useState } from 'react'

export default function PlanConfiguration() {
  const [mode, setMode] = useState<'monthly' | 'payg'>('monthly')
  const [planName, setPlanName] = useState('Growth Tier')
  const [retainer, setRetainer] = useState('149.00')
  const [perBooking, setPerBooking] = useState('2.50')
  const [features, setFeatures] = useState({
    analytics: true,
    support: true,
    domain: false,
  })

  const toggleFeature = (key: keyof typeof features) => {
    setFeatures(prev => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="bg-white border border-slate-200 rounded-sm overflow-hidden flex flex-col">
      {/* Panel Header */}
      <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-100">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#1E40AF"/>
        </svg>
        <h2 className="text-base font-black text-[#0B1C30] tracking-tight">Plan Configuration</h2>
      </div>

      <div className="px-5 py-5 flex flex-col gap-5">
        {/* Configuration Mode */}
        <div>
          <label className="block text-[9px] font-black tracking-[1.5px] uppercase text-slate-400 mb-2">
            Configuration Mode
          </label>
          <div className="flex rounded-sm overflow-hidden border border-slate-200">
            <button
              onClick={() => setMode('monthly')}
              className={`flex-1 py-2 text-xs font-bold transition-colors ${
                mode === 'monthly' ? 'bg-[#1E40AF] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              Monthly Subscription
            </button>
            <button
              onClick={() => setMode('payg')}
              className={`flex-1 py-2 text-xs font-bold transition-colors border-l border-slate-200 ${
                mode === 'payg' ? 'bg-[#1E40AF] text-white' : 'bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              Pay-As-You-Go
            </button>
          </div>
        </div>

        {/* Plan Identity */}
        <div>
          <label className="block text-[9px] font-black tracking-[1.5px] uppercase text-slate-400 mb-2">
            Plan Identity
          </label>
          <input
            type="text"
            value={planName}
            onChange={(e) => setPlanName(e.target.value)}
            className="w-full border border-slate-200 rounded-sm px-3 py-2.5 text-sm text-[#0B1C30] font-medium bg-white focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF]"
          />
        </div>

        {/* Pricing Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[9px] font-black tracking-[1.5px] uppercase text-slate-400 mb-2">
              Monthly Retainer ($)
            </label>
            <input
              type="text"
              value={retainer}
              onChange={(e) => setRetainer(e.target.value)}
              className="w-full border border-slate-200 rounded-sm px-3 py-2.5 text-sm text-[#0B1C30] font-medium bg-white focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF]"
            />
          </div>
          <div>
            <label className="block text-[9px] font-black tracking-[1.5px] uppercase text-slate-400 mb-2">
              Per Booking ($)
            </label>
            <input
              type="text"
              value={perBooking}
              onChange={(e) => setPerBooking(e.target.value)}
              className="w-full border border-slate-200 rounded-sm px-3 py-2.5 text-sm text-[#0B1C30] font-medium bg-white focus:outline-none focus:border-[#1E40AF] focus:ring-1 focus:ring-[#1E40AF]"
            />
          </div>
        </div>

        {/* Included Features */}
        <div>
          <label className="block text-[9px] font-black tracking-[1.5px] uppercase text-slate-400 mb-3">
            Included Features
          </label>
          <div className="flex flex-col gap-2">
            {[
              { key: 'analytics' as const, label: 'Advanced Analytics Suite' },
              { key: 'support' as const, label: 'Priority Support Dispatch' },
              { key: 'domain' as const, label: 'Custom Domain Mapping' },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => toggleFeature(key)}
                className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 rounded-sm hover:bg-slate-100 transition-colors text-left w-full"
              >
                <span className={`w-4 h-4 rounded-sm border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                  features[key] ? 'bg-[#1E40AF] border-[#1E40AF]' : 'bg-white border-slate-300'
                }`}>
                  {features[key] && (
                    <svg width="8" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M2.85 6.0125L0 3.1625L0.7125 2.45L2.85 4.5875L7.4375 0L8.15 0.7125L2.85 6.0125Z" fill="white"/>
                    </svg>
                  )}
                </span>
                <span className="text-sm text-[#0B1C30] font-medium">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Commit Button */}
        <button className="w-full bg-[#1E40AF] text-white text-[10px] font-black tracking-[2px] uppercase py-3.5 hover:bg-blue-700 transition-colors rounded-sm">
          Commit Plan Changes
        </button>
      </div>
    </div>
  )
}
