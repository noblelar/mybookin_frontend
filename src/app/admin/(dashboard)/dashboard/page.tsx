import AdminStatsRow from '@/components/admin/AdminStatsRow'
import AdminChart from '@/components/admin/AdminChart'
import AdminActivityFeed from '@/components/admin/AdminActivityFeed'
import AdminQuickActions from '@/components/admin/AdminQuickActions'

export const metadata = {
  title: 'Dashboard | Precision Admin',
}

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col h-full">
      {/* Page header */}
      <div className="px-6 pt-6 pb-4 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#0B1C30] tracking-tight font-['Manrope',sans-serif] leading-tight">
            Global Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">Multi-tenant performance &amp; system health monitors.</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor"/>
            </svg>
            Export Ledger
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold bg-[#1E40AF] text-white hover:bg-blue-800 transition-colors">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 13H13V19H11V13H5V11H11V5H13V11H19V13Z" fill="currentColor"/>
            </svg>
            Provision Tenant
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="px-6 pb-4">
        <AdminStatsRow />
      </div>

      {/* Main content grid: chart (left) + activity feed (right) */}
      <div className="px-6 pb-4 flex-1 grid grid-cols-1 lg:grid-cols-[1fr_300px] xl:grid-cols-[1fr_320px] gap-4 min-h-0">
        {/* Left column: chart + quick actions */}
        <div className="flex flex-col gap-4 min-h-0">
          <AdminChart />
          <AdminQuickActions />
        </div>

        {/* Right column: activity feed */}
        <div className="min-h-0">
          <AdminActivityFeed />
        </div>
      </div>

      {/* Floating action button */}
      <button className="fixed bottom-14 right-6 w-12 h-12 bg-[#1E40AF] text-white flex items-center justify-center shadow-xl hover:bg-blue-800 transition-colors rounded-full z-40">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13 10V3L4 14H11V21L20 10H13Z" fill="white"/>
        </svg>
      </button>
    </div>
  )
}
