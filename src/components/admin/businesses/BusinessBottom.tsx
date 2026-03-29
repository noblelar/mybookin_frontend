const revenueData = [
  { label: 'Free', value: 15, height: 30 },
  { label: 'SMB', value: 30, height: 55 },
  { label: 'Pro', value: 50, height: 80 },
  { label: 'Enterprise', value: 100, height: 160 },
]

export default function BusinessBottom() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
      {/* Revenue Distribution Chart */}
      <div className="bg-white p-5 rounded-sm">
        <div className="mb-4">
          <span className="text-[10px] font-black tracking-[1.5px] uppercase text-slate-500">Revenue Distribution by Plan</span>
        </div>
        <div className="relative h-[180px] flex items-end gap-6 pl-2">
          {/* Y-axis lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {[100, 75, 50, 25, 0].map((v) => (
              <div key={v} className="flex items-center gap-2">
                <span className="text-[9px] text-slate-300 font-medium w-4">{v === 0 ? '' : v}</span>
                <div className="flex-1 border-t border-slate-100" />
              </div>
            ))}
          </div>
          {/* Bars */}
          <div className="flex items-end gap-4 h-full pl-8 flex-1">
            {revenueData.map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1.5 flex-1">
                <div
                  className={`w-full rounded-t-sm transition-all ${
                    item.label === 'Enterprise' ? 'bg-[#1E40AF]' : 'bg-[#BFDBFE]'
                  }`}
                  style={{ height: `${item.height}px` }}
                />
                <span className={`text-[10px] font-bold ${
                  item.label === 'Enterprise' ? 'text-[#1E40AF]' : 'text-slate-400'
                }`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* System Broadcast */}
      <div className="bg-[#1E40AF] rounded-sm p-5 flex flex-col justify-between gap-4">
        <div>
          <span className="text-[10px] font-black tracking-[1.5px] uppercase text-blue-200 mb-3 block">System Broadcast</span>
          <p className="text-white font-black text-xl leading-snug tracking-tight">
            Node reconciliation required for 4 unsynced Stripe accounts.
          </p>
        </div>
        <button className="w-full bg-white text-[#1E40AF] text-xs font-black tracking-widest uppercase py-3 rounded-sm hover:bg-blue-50 transition-colors">
          Start Sync Engine
        </button>
      </div>
    </div>
  )
}
