const tiers = [
  {
    label: 'Starter Tier ($0/mo + $5 fee)',
    users: 450,
    total: 1284,
    color: 'bg-slate-400',
    pct: 35,
  },
  {
    label: 'Growth Tier ($149/mo + $2.5 fee)',
    users: 712,
    total: 1284,
    color: 'bg-[#1E40AF]',
    pct: 55,
  },
  {
    label: 'Enterprise (Custom)',
    users: 122,
    total: 1284,
    color: 'bg-emerald-500',
    pct: 10,
  },
]

export default function EcosystemDistribution() {
  return (
    <div className="bg-white border border-slate-200 rounded-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <h2 className="text-base font-black text-[#0B1C30] tracking-tight">Ecosystem Distribution</h2>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 border-b border-slate-100">
        {[
          {
            label: 'Active Merchants',
            value: '1,284',
            sub: '+12% MoM',
            subColor: 'text-emerald-600',
            subIcon: '↗',
          },
          {
            label: 'Monthly MRR',
            value: '$142.5k',
            sub: 'Projected',
            subColor: 'text-[#1E40AF]',
            subIcon: '◈',
          },
          {
            label: 'Avg. Fee/TX',
            value: '$1.82',
            sub: 'Efficiency',
            subColor: 'text-slate-400',
            subIcon: '↻',
          },
        ].map((stat) => (
          <div key={stat.label} className="px-4 py-4">
            <div className="text-[9px] font-black tracking-[1.2px] uppercase text-slate-400 mb-1">{stat.label}</div>
            <div className="text-2xl font-black text-[#0B1C30] tracking-tight leading-tight">{stat.value}</div>
            <div className={`flex items-center gap-1 mt-1 text-[11px] font-semibold ${stat.subColor}`}>
              <span>{stat.subIcon}</span>
              <span>{stat.sub}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Tier Utilization */}
      <div className="px-5 py-5 flex-1">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[9px] font-black tracking-[1.5px] uppercase text-slate-400">Tier Utilization</span>
          <button className="text-slate-300 hover:text-slate-500">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" fill="currentColor"/></svg>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {tiers.map((tier) => (
            <div key={tier.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-[#0B1C30]">{tier.label}</span>
                <span className="text-[10px] font-bold text-slate-400">{tier.users} Users</span>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${tier.color} transition-all`}
                  style={{ width: `${tier.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
