import type { Business, BusinessStatus } from '@/types/business'

interface BusinessBottomProps {
  businesses: Business[]
  isLoading?: boolean
  selectedBusiness: Business | null
  updatingBusinessId: string | null
  onRefresh: () => void
  onStatusChange: (business: Business, nextStatus: BusinessStatus) => void
}

const formatDateTime = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('en-GB', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

const getStatusSummary = (businesses: Business[], status: BusinessStatus) =>
  businesses.filter((business) => business.status === status).length

export default function BusinessBottom({
  businesses,
  isLoading = false,
  selectedBusiness,
  updatingBusinessId,
  onRefresh,
  onStatusChange,
}: BusinessBottomProps) {
  const pendingCount = getStatusSummary(businesses, 'PENDING')
  const activeCount = getStatusSummary(businesses, 'ACTIVE')
  const suspendedCount = getStatusSummary(businesses, 'SUSPENDED')

  if (isLoading && businesses.length === 0) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
        <div className="bg-white p-5 rounded-sm">
          <div className="h-5 w-40 animate-pulse rounded bg-slate-100" />
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {Array.from({ length: 6 }).map((_, index) => (
              <div key={index} className="h-14 animate-pulse rounded bg-slate-100" />
            ))}
          </div>
        </div>
        <div className="bg-[#1E40AF] rounded-sm p-5">
          <div className="h-5 w-32 animate-pulse rounded bg-blue-300/40" />
          <div className="mt-4 h-16 animate-pulse rounded bg-blue-300/30" />
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">
      <div className="bg-white p-5 rounded-sm">
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-black tracking-[1.5px] uppercase text-slate-500">
              Moderation Detail
            </span>
            <p className="mt-2 text-xl font-black tracking-tight text-[#0B1C30]">
              {selectedBusiness ? selectedBusiness.name : 'Select a business to review'}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {selectedBusiness
                ? 'Review submission details before approving visibility across discovery and booking.'
                : 'Use the table above to choose a business and open the moderation detail view.'}
            </p>
          </div>
          <button
            type="button"
            onClick={onRefresh}
            className="rounded-full border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-50"
          >
            Refresh
          </button>
        </div>

        {selectedBusiness ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Business</p>
              <p className="mt-2 text-sm font-semibold text-[#0B1C30]">{selectedBusiness.name}</p>
              <p className="mt-1 text-xs text-slate-500">slug: {selectedBusiness.slugUk}</p>
              <p className="mt-3 text-xs text-slate-500">
                {selectedBusiness.description ?? 'No business description was provided during submission.'}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Contact</p>
              <p className="mt-2 text-sm font-semibold text-[#0B1C30]">
                {selectedBusiness.email ?? 'No email provided'}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {selectedBusiness.phone ?? 'No phone number provided'}
              </p>
              <p className="mt-3 text-xs text-slate-500">
                Owner user: {selectedBusiness.ownerUserId}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Location</p>
              <p className="mt-2 text-sm font-semibold text-[#0B1C30]">
                {selectedBusiness.addressLine1}
              </p>
              {selectedBusiness.addressLine2 && (
                <p className="mt-1 text-xs text-slate-500">{selectedBusiness.addressLine2}</p>
              )}
              <p className="mt-1 text-xs text-slate-500">
                {selectedBusiness.city}, {selectedBusiness.postcode}
              </p>
            </div>

            <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
              <p className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400">Moderation</p>
              <p className="mt-2 text-sm font-semibold text-[#0B1C30]">
                Current status: {selectedBusiness.status}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Submitted: {formatDateTime(selectedBusiness.createdAt)}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Last updated: {formatDateTime(selectedBusiness.updatedAt)}
              </p>
              <p className="mt-3 text-xs text-slate-500">
                Timezone: {selectedBusiness.timezone}
              </p>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-200 px-5 py-8 text-sm text-slate-500">
            No businesses are available in this view yet. Adjust the filters above or wait for new
            owner submissions to arrive.
          </div>
        )}
      </div>

      <div className="bg-[#1E40AF] rounded-sm p-5 flex flex-col justify-between gap-4">
        <div>
          <span className="text-[10px] font-black tracking-[1.5px] uppercase text-blue-200 mb-3 block">
            Moderation Actions
          </span>
          <p className="text-white font-black text-xl leading-snug tracking-tight">
            {selectedBusiness
              ? `${selectedBusiness.name} is currently ${selectedBusiness.status.toLowerCase()}.`
              : 'Select a business above to publish, suspend, or return it to the review queue.'}
          </p>

          <div className="mt-5 space-y-2 text-xs text-blue-100">
            <div className="flex items-center justify-between rounded bg-white/10 px-3 py-2">
              <span>Pending review</span>
              <span className="font-black text-white">{pendingCount}</span>
            </div>
            <div className="flex items-center justify-between rounded bg-white/10 px-3 py-2">
              <span>Visible in marketplace</span>
              <span className="font-black text-white">{activeCount}</span>
            </div>
            <div className="flex items-center justify-between rounded bg-white/10 px-3 py-2">
              <span>Suspended listings</span>
              <span className="font-black text-white">{suspendedCount}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <button
            type="button"
            onClick={() => selectedBusiness && onStatusChange(selectedBusiness, 'ACTIVE')}
            disabled={!selectedBusiness || selectedBusiness.status === 'ACTIVE' || updatingBusinessId === selectedBusiness.id}
            className="w-full bg-white text-[#1E40AF] text-xs font-black tracking-widest uppercase py-3 rounded-sm hover:bg-blue-50 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            {selectedBusiness && updatingBusinessId === selectedBusiness.id && selectedBusiness.status !== 'ACTIVE'
              ? 'Saving...'
              : 'Approve and Publish'}
          </button>
          <button
            type="button"
            onClick={() => selectedBusiness && onStatusChange(selectedBusiness, 'SUSPENDED')}
            disabled={!selectedBusiness || selectedBusiness.status === 'SUSPENDED' || updatingBusinessId === selectedBusiness.id}
            className="w-full border border-white/30 text-white text-xs font-black tracking-widest uppercase py-3 rounded-sm hover:bg-white/10 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            Move to Suspended
          </button>
          <button
            type="button"
            onClick={() => selectedBusiness && onStatusChange(selectedBusiness, 'PENDING')}
            disabled={!selectedBusiness || selectedBusiness.status === 'PENDING' || updatingBusinessId === selectedBusiness.id}
            className="w-full border border-white/20 text-blue-100 text-xs font-black tracking-widest uppercase py-3 rounded-sm hover:bg-white/5 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
          >
            Return to Pending
          </button>
        </div>
      </div>
    </div>
  )
}
