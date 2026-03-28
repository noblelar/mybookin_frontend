interface StatCardProps {
  label: string
  value: string
  sub?: string
  trend?: string
  trendUp?: boolean
  badge?: { text: string; color: 'green' | 'blue' }
  highlight?: { text: string; color: 'green' | 'red' }
}

function StatCard({ label, value, sub, trend, trendUp, badge, highlight }: StatCardProps) {
  return (
    <div className="bg-white border-l-4 border-[#1E40AF] flex-1 min-w-0 p-4 flex flex-col gap-2">
      {/* Label row */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-[10px] font-black tracking-[1.2px] uppercase text-slate-400">{label}</span>
        <div className="flex items-center gap-1.5">
          {trend && (
            <span className={`text-xs font-bold flex items-center gap-0.5 ${trendUp ? 'text-emerald-600' : 'text-red-500'}`}>
              {trendUp ? '↗' : '↘'}{trend}
            </span>
          )}
          {badge && (
            <span className={`text-[9px] font-black tracking-wider uppercase px-1.5 py-0.5 rounded-sm ${
              badge.color === 'green' ? 'bg-emerald-100 text-emerald-700 border border-emerald-300' : 'bg-blue-100 text-blue-700'
            }`}>
              {badge.text}
            </span>
          )}
          {highlight && (
            <span className={`text-xs font-black ${highlight.color === 'green' ? 'text-emerald-600' : 'text-red-500'}`}>
              {highlight.text}
            </span>
          )}
        </div>
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-black text-[#0B1C30] tracking-tight leading-none">{value}</span>
        {sub && <span className="text-xs text-slate-400 font-medium">{sub}</span>}
      </div>
    </div>
  )
}

export default function AdminStatsRow() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 border border-slate-200">
      <StatCard
        label="Active Businesses"
        value="1,284"
        sub="/ 1,500 Quota"
        trend="12%"
        trendUp
      />
      <StatCard
        label="Total Revenue"
        value="$4.28M"
        sub="USD Gross"
        trend="4.2%"
        trendUp
      />
      <StatCard
        label="Pending Payouts"
        value="$142.9k"
        sub="24h Cycle"
        badge={{ text: 'Secure', color: 'green' }}
      />
      <StatCard
        label="System Latency"
        value="24ms"
        sub="Avg. Response"
        highlight={{ text: '99.98% Up', color: 'green' }}
      />
    </div>
  )
}
