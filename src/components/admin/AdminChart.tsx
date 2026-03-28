'use client'

import { useState } from 'react'

const timeFilters = ['24H', '7D', '30D']

// Bar heights as percentages of max chart height
const chartData = [
  { time: '08:00 AM', value: 35 },
  { time: '', value: 42 },
  { time: '', value: 28 },
  { time: '12:00 PM', value: 58 },
  { time: '', value: 72 },
  { time: '', value: 65 },
  { time: '04:00 PM', value: 88 },
  { time: '', value: 95 },
  { time: '', value: 78 },
  { time: '08:00 PM', value: 45 },
  { time: '', value: 32 },
  { time: 'LIVE', value: 55, isLive: true },
]

export default function AdminChart() {
  const [activeFilter, setActiveFilter] = useState('24H')

  return (
    <div className="bg-white border border-slate-200 p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-bold text-[#0B1C30] text-sm tracking-tight">Booking Volume & Capacity</h3>
          <p className="text-[10px] font-semibold tracking-[1.2px] uppercase text-slate-400 mt-0.5">
            Real-Time Throughput Metrics
          </p>
        </div>
        {/* Time filter */}
        <div className="flex items-center border border-slate-200 rounded overflow-hidden flex-shrink-0">
          {timeFilters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3 py-1.5 text-xs font-bold transition-colors ${
                activeFilter === f
                  ? 'bg-[#0B1C30] text-white'
                  : 'bg-white text-slate-500 hover:bg-slate-50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Chart area */}
      <div className="relative h-[220px] flex items-end gap-1.5 pt-4">
        {chartData.map((bar, i) => {
          const isHighlighted = i >= 6 && i <= 8 // 04:00 PM peak
          const isCurrentBar = i === 7 // tallest/current
          return (
            <div key={i} className="flex-1 flex flex-col items-center justify-end h-full gap-1">
              <div
                className={`w-full rounded-t-sm transition-all duration-300 ${
                  isCurrentBar
                    ? 'bg-[#1E40AF]'
                    : isHighlighted
                    ? 'bg-[#3B82F6]'
                    : bar.isLive
                    ? 'bg-[#93C5FD]'
                    : 'bg-[#BFDBFE]'
                }`}
                style={{ height: `${bar.value}%` }}
              />
            </div>
          )
        })}
      </div>

      {/* X-axis labels */}
      <div className="flex items-center gap-1.5">
        {chartData.map((bar, i) => (
          <div key={i} className="flex-1 text-center">
            {bar.time && (
              <span className={`text-[9px] font-semibold ${bar.isLive ? 'text-[#1E40AF] font-black' : 'text-slate-400'}`}>
                {bar.time}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
