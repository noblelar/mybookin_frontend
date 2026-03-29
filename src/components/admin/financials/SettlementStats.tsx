interface StatCardProps {
  label: string
  value: string
  sub?: string
  change?: string
  changeLabel?: string
  accentColor: string
}

function StatCard({ label, value, sub, change, changeLabel, accentColor }: StatCardProps) {
  return (
    <div className={`bg-white border-l-4 ${accentColor} px-5 py-4 flex flex-col gap-1 min-w-0`}>
      <span className="text-[10px] font-black tracking-[1.5px] uppercase text-slate-400">{label}</span>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-xl lg:text-2xl font-black text-[#0B1C30] tracking-tight leading-tight">{value}</span>
        {change && (
          <span className="text-xs font-bold text-emerald-600">{change}</span>
        )}
      </div>
      {sub && <span className="text-[11px] text-slate-400 font-medium">{sub}</span>}
      {changeLabel && <span className="text-[10px] text-slate-400 font-semibold">{changeLabel}</span>}
    </div>
  )
}

export default function SettlementStats() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200">
      <StatCard
        label="Total Settled (MTD)"
        value="$428,940.00"
        change="+12.4%"
        accentColor="border-[#1E40AF]"
      />
      <StatCard
        label="Pending Batches"
        value="14"
        sub="Next run at 00:00"
        accentColor="border-amber-400"
      />
      <StatCard
        label="Net Platform Fee"
        value="$12,855.20"
        change="3.2%"
        changeLabel="Avg"
        accentColor="border-emerald-500"
      />
      <StatCard
        label="Failed Attempts"
        value="0"
        sub="Last 24h"
        accentColor="border-slate-300"
      />
    </div>
  )
}
