const activities = [
  {
    type: 'error',
    color: 'bg-red-500',
    title: 'Suspicious Activity Detected',
    time: '2m ago',
    body: 'High-volume transaction burst from tenant #4921 (Urban Logistics). Fraud filter engaged.',
  },
  {
    type: 'success',
    color: 'bg-emerald-500',
    title: 'Settlement Processed',
    time: '14m ago',
    body: 'Payout of $12,400.00 successful for 84 merchants.',
  },
  {
    type: 'info',
    color: 'bg-blue-500',
    title: 'New Tenant Onboarded',
    time: '1h ago',
    body: (
      <>
        <strong>Apex Fitness Labs</strong> completed KYC and is now active in Directory.
      </>
    ),
  },
  {
    type: 'warning',
    color: 'bg-slate-300',
    title: 'System Update Deploying',
    time: '3h ago',
    body: 'Core engine v2.4.0 scheduled for cluster C-9. Minimal downtime expected.',
  },
  {
    type: 'error',
    color: 'bg-red-500',
    title: 'Failed API Request',
    time: '5h ago',
    body: (
      <>
        External webhook failed for merchant <strong>#1029</strong>. Retrying 3/5.
      </>
    ),
  },
]

export default function AdminActivityFeed() {
  return (
    <div className="bg-white border border-slate-200 flex flex-col h-full">
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100">
        <h3 className="font-bold text-[#0B1C30] text-sm tracking-tight">Platform Activity</h3>
        <p className="text-[10px] font-semibold tracking-[1.2px] uppercase text-slate-400 mt-0.5">
          Real-Time Audit Stream
        </p>
      </div>

      {/* Feed items */}
      <div className="flex-1 px-5 py-3 flex flex-col gap-5 overflow-y-auto">
        {activities.map((item, i) => (
          <div key={i} className="flex gap-3">
            {/* Dot */}
            <div className="flex flex-col items-center gap-1 pt-0.5 flex-shrink-0">
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${item.color}`} />
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-0.5">
                <span className="text-xs font-bold text-[#0B1C30] leading-tight">{item.title}</span>
                <span className="text-[10px] text-slate-400 flex-shrink-0 font-medium">{item.time}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{item.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-slate-100">
        <button className="text-xs font-bold text-[#1E40AF] hover:text-blue-800 transition-colors">
          View All Notifications
        </button>
      </div>
    </div>
  )
}
