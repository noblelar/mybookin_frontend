import BusinessModerationClient from '@/components/admin/businesses/BusinessModerationClient'

export const metadata = {
  title: 'Business Directory | MyBookIns Admin',
}

export default function BusinessDirectoryPage() {
  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className="px-6 pt-6 pb-4">
        <h1 className="text-2xl md:text-3xl font-black text-[#0B1C30] tracking-tight">Business Directory</h1>
        <p className="text-sm text-slate-500 mt-1">
          Review pending business submissions, update moderation status, and control which businesses
          can appear across the marketplace.
        </p>
      </div>

      <BusinessModerationClient />
    </div>
  )
}
