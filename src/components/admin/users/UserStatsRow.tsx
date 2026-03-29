const stats = [
  {
    label: 'Total Users',
    value: '8,142',
    sub: '+3.2% this month',
    subColor: 'text-emerald-600',
    accent: 'border-[#1E40AF]',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Active Sessions',
    value: '1,038',
    sub: 'Right now',
    subColor: 'text-slate-400',
    accent: 'border-emerald-500',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'New This Month',
    value: '412',
    sub: '+18% vs last month',
    subColor: 'text-emerald-600',
    accent: 'border-purple-500',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
      </svg>
    ),
  },
  {
    label: 'Suspended Users',
    value: '27',
    sub: '3 pending review',
    subColor: 'text-red-500',
    accent: 'border-red-500',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" fill="currentColor"/>
      </svg>
    ),
  },
]

export default function UserStatsRow() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200 rounded-sm overflow-hidden">
      {stats.map((stat) => (
        <div key={stat.label} className={`bg-white px-5 py-4 border-l-4 ${stat.accent}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black tracking-[1.2px] uppercase text-slate-400">
              {stat.label}
            </span>
            <span className="text-slate-300">{stat.icon}</span>
          </div>
          <div className="text-2xl font-black text-[#0B1C30] tracking-tight">{stat.value}</div>
          <div className={`text-[10px] font-bold mt-1 ${stat.subColor}`}>{stat.sub}</div>
        </div>
      ))}
    </div>
  )
}
