import PlanConfiguration from '@/components/admin/subscriptions/PlanConfiguration'
import EcosystemDistribution from '@/components/admin/subscriptions/EcosystemDistribution'
import InvoiceLedger from '@/components/admin/subscriptions/InvoiceLedger'

export const metadata = {
  title: 'Subscriptions | MyBookins Admin',
}

export default function SubscriptionsPage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className="px-6 pt-5 pb-4">
        <div className="flex items-center gap-3 flex-wrap mb-1">
          <h1 className="text-2xl md:text-3xl font-black text-[#0B1C30] tracking-tight">Pricing Architecture</h1>
          <span className="text-[9px] font-black tracking-[1.5px] uppercase px-2.5 py-1 bg-emerald-100 text-emerald-700 rounded-sm border border-emerald-200">
            Live System
          </span>
        </div>
        <p className="text-sm text-slate-500 max-w-2xl">
          Configure the economic engine of the platform. Balance merchant subscriptions with per-transaction fees to optimize ecosystem health and platform revenue.
        </p>
      </div>

      {/* Two-column: Plan Config + Ecosystem Distribution */}
      <div className="px-6 pb-5">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,420px)_1fr] gap-5 items-start">
          {/* Left: Plan Configuration with blue left-border accent */}
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1E40AF] rounded-l-sm" />
            <div className="ml-1">
              <PlanConfiguration />
            </div>
          </div>

          {/* Right: Ecosystem Distribution */}
          <EcosystemDistribution />
        </div>
      </div>

      {/* Invoice Ledger */}
      <div className="px-6 pb-6">
        <InvoiceLedger />
      </div>
    </div>
  )
}
