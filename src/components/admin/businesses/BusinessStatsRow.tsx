interface StatCardProps {
  label: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral' | 'urgent'
  accentColor?: string
  badge?: string
}

function StatCard({ label, value, change, changeType = 'positive', accentColor = 'border-[#1E40AF]', badge }: StatCardProps) {
  return (
    <div className={`bg-white border-l-4 ${accentColor} px-5 py-4 flex flex-col gap-1`}>
      <span className="text-[10px] font-black tracking-[1.5px] uppercase text-slate-400">{label}</span>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-2xl font-black text-[#0B1C30] tracking-tight">{value}</span>
        {change && (
          <span className={`text-xs font-bold ${
            changeType === 'positive' ? 'text-emerald-600' :
            changeType === 'urgent' ? 'text-red-500' :
            changeType === 'negative' ? 'text-red-500' :
            'text-slate-500'
          }`}>
            {change}
          </span>
        )}
        {badge && (
          <span className="text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 bg-emerald-100 text-emerald-700 rounded">
            {badge}
          </span>
        )}
      </div>
    </div>
  )
}

export default function BusinessStatsRow() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200">
      <StatCard
        label="Total Tenants"
        value="1,284"
        change="+12%"
        changeType="positive"
        accentColor="border-[#1E40AF]"
      />
      <StatCard
        label="Active MRR"
        value="$42,900"
        change="+4.5%"
        changeType="positive"
        accentColor="border-emerald-500"
      />
      <StatCard
        label="System Health"
        value="99.9%"
        badge="Verified"
        accentColor="border-emerald-500"
      />
      <StatCard
        label="Pending Suspensions"
        value="14"
        change="Urgent"
        changeType="urgent"
        accentColor="border-red-500"
      />
    </div>
  )
}
