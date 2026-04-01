import type { Business } from '@/types/business'

interface BusinessStatsRowProps {
  businesses: Business[]
  isLoading?: boolean
}

interface StatCardProps {
  label: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral' | 'urgent'
  accentColor?: string
  badge?: string
}

function StatCard({
  label,
  value,
  change,
  changeType = 'positive',
  accentColor = 'border-[#1E40AF]',
  badge,
}: StatCardProps) {
  return (
    <div className={`bg-white border-l-4 ${accentColor} px-5 py-4 flex flex-col gap-1`}>
      <span className="text-[10px] font-black tracking-[1.5px] uppercase text-slate-400">{label}</span>
      <div className="flex items-baseline gap-2 flex-wrap">
        <span className="text-2xl font-black text-[#0B1C30] tracking-tight">{value}</span>
        {change && (
          <span
            className={`text-xs font-bold ${
              changeType === 'positive'
                ? 'text-emerald-600'
                : changeType === 'urgent'
                  ? 'text-red-500'
                  : changeType === 'negative'
                    ? 'text-red-500'
                    : 'text-slate-500'
            }`}
          >
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

export default function BusinessStatsRow({
  businesses,
  isLoading = false,
}: BusinessStatsRowProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-white px-5 py-4">
            <div className="h-3 w-24 animate-pulse rounded bg-slate-100" />
            <div className="mt-3 h-8 w-16 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>
    )
  }

  const totalBusinesses = businesses.length
  const pendingBusinesses = businesses.filter((business) => business.status === 'PENDING').length
  const activeBusinesses = businesses.filter((business) => business.status === 'ACTIVE').length
  const suspendedBusinesses = businesses.filter((business) => business.status === 'SUSPENDED').length
  const approvalRate =
    totalBusinesses > 0 ? `${Math.round((activeBusinesses / totalBusinesses) * 100)}%` : '0%'

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-slate-200">
      <StatCard
        label="Total Businesses"
        value={totalBusinesses.toLocaleString()}
        change={`${pendingBusinesses} pending review`}
        changeType={pendingBusinesses > 0 ? 'neutral' : 'positive'}
        accentColor="border-[#1E40AF]"
      />
      <StatCard
        label="Approved Listings"
        value={activeBusinesses.toLocaleString()}
        change={approvalRate}
        changeType="positive"
        accentColor="border-emerald-500"
      />
      <StatCard
        label="Queue Health"
        value={pendingBusinesses.toLocaleString()}
        badge={pendingBusinesses > 0 ? 'In Review' : 'Clear'}
        accentColor={pendingBusinesses > 0 ? 'border-amber-500' : 'border-emerald-500'}
      />
      <StatCard
        label="Suspended Listings"
        value={suspendedBusinesses.toLocaleString()}
        change={suspendedBusinesses > 0 ? 'Requires follow-up' : 'Stable'}
        changeType={suspendedBusinesses > 0 ? 'urgent' : 'positive'}
        accentColor="border-red-500"
      />
    </div>
  )
}
