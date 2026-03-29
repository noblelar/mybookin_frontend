import BusinessStatsRow from '@/components/admin/businesses/BusinessStatsRow'
import BusinessFilters from '@/components/admin/businesses/BusinessFilters'
import BusinessTable from '@/components/admin/businesses/BusinessTable'
import BusinessBottom from '@/components/admin/businesses/BusinessBottom'

export const metadata = {
  title: 'Business Directory | MyBookins Admin',
}

export default function BusinessDirectoryPage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl md:text-3xl font-black text-[#0B1C30] tracking-tight">Business Directory</h1>
        <p className="text-sm text-slate-500 mt-1">Manage multi-tenant organizations, billing status, and subscription tier assignments.</p>
      </div>

      {/* Stats Row */}
      <div className="px-6 pb-4">
        <BusinessStatsRow />
      </div>

      {/* Filters Bar */}
      <div className="px-6 pb-2">
        <BusinessFilters />
      </div>

      {/* Table */}
      <div className="px-6 pb-4">
        <BusinessTable />
      </div>

      {/* Bottom: Chart + Broadcast */}
      <div className="px-6 pb-6">
        <BusinessBottom />
      </div>
    </div>
  )
}
