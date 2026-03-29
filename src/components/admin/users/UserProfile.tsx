interface UserProfileProps {
  userId: string
  onClose: () => void
}

const profileData: Record<string, {
  name: string
  email: string
  phone: string
  role: string
  roleColor: string
  status: 'Active' | 'Suspended' | 'Pending'
  joinedDate: string
  lastActive: string
  businessName: string
  totalBookings: number
  totalSpend: string
  avatarColor: string
  initials: string
  permissions: string[]
}> = {
  'USR-00192': {
    name: 'Marcus Thompson',
    email: 'marcus.t@vortexgroup.com',
    phone: '+44 7911 123456',
    role: 'Business Owner',
    roleColor: 'bg-[#1E40AF] text-white',
    status: 'Active',
    joinedDate: 'Jan 14, 2024',
    lastActive: '2 min ago',
    businessName: 'Vortex Logistics Group',
    totalBookings: 842,
    totalSpend: '$12,400',
    avatarColor: 'bg-[#1E40AF]',
    initials: 'MT',
    permissions: ['Manage Staff', 'View Analytics', 'Process Refunds', 'Configure Services'],
  },
  'USR-00193': {
    name: 'Sarah Jenkins',
    email: 'sarah.j@aetherhealth.io',
    phone: '+44 7922 654321',
    role: 'Admin',
    roleColor: 'bg-[#0B1C30] text-white',
    status: 'Active',
    joinedDate: 'Mar 02, 2024',
    lastActive: '1 hour ago',
    businessName: 'Aether Health Systems',
    totalBookings: 302,
    totalSpend: '$4,900',
    avatarColor: 'bg-purple-600',
    initials: 'SJ',
    permissions: ['Full Admin Access', 'Manage Users', 'System Configuration', 'Financial Reports'],
  },
  'USR-00194': {
    name: 'David Chen',
    email: 'david.c@ignitetech.dev',
    phone: '+44 7933 987654',
    role: 'Business Owner',
    roleColor: 'bg-[#1E40AF] text-white',
    status: 'Suspended',
    joinedDate: 'Feb 19, 2024',
    lastActive: '3 days ago',
    businessName: 'Ignite Tech Solutions',
    totalBookings: 218,
    totalSpend: '$3,200',
    avatarColor: 'bg-slate-500',
    initials: 'DC',
    permissions: ['Manage Staff', 'View Analytics'],
  },
  'USR-00195': {
    name: 'Priya Nair',
    email: 'p.nair@summitrealty.co',
    phone: '+44 7944 321098',
    role: 'Staff',
    roleColor: 'bg-emerald-600 text-white',
    status: 'Active',
    joinedDate: 'Apr 05, 2024',
    lastActive: '5 hours ago',
    businessName: 'Summit Realty Partners',
    totalBookings: 96,
    totalSpend: '$1,180',
    avatarColor: 'bg-emerald-600',
    initials: 'PN',
    permissions: ['View Bookings', 'Manage Schedule'],
  },
  'USR-00196': {
    name: 'Tom Briggs',
    email: 'tom.b@roastco.co.uk',
    phone: '+44 7955 543210',
    role: 'End User',
    roleColor: 'bg-slate-100 text-slate-700',
    status: 'Pending',
    joinedDate: 'May 21, 2024',
    lastActive: 'Just now',
    businessName: 'Roast & Co. Retail',
    totalBookings: 14,
    totalSpend: '$342',
    avatarColor: 'bg-amber-600',
    initials: 'TB',
    permissions: ['Book Services', 'Manage Profile'],
  },
}

const statusStyle = {
  Active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Suspended: 'bg-red-50 text-red-600 border border-red-200',
  Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
}

export default function UserProfile({ userId, onClose }: UserProfileProps) {
  const user = profileData[userId] ?? profileData['USR-00192']

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div>
          <div className="text-[10px] font-black tracking-[1.2px] uppercase text-slate-400">User Profile</div>
          <div className="text-sm font-black text-[#0B1C30] mt-0.5">{userId}</div>
        </div>
        <button
          onClick={onClose}
          className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/>
          </svg>
        </button>
      </div>

      {/* Avatar + Identity */}
      <div className="px-5 pt-5 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${user.avatarColor}`}>
            <span className="text-sm font-black text-white">{user.initials}</span>
          </div>
          <div>
            <div className="text-base font-black text-[#0B1C30]">{user.name}</div>
            <div className="text-xs text-slate-500">{user.email}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`text-[10px] font-bold px-2 py-1 rounded ${user.roleColor}`}>
            {user.role}
          </span>
          <span className={`text-[10px] font-bold px-2 py-1 rounded ${statusStyle[user.status]}`}>
            {user.status}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="px-5 py-4 border-b border-slate-100 flex flex-col gap-3 text-xs">
        <div className="flex justify-between items-start gap-2">
          <span className="text-[10px] font-black tracking-[1px] uppercase text-slate-400">Phone</span>
          <span className="font-semibold text-[#0B1C30] text-right">{user.phone}</span>
        </div>
        <div className="flex justify-between items-start gap-2">
          <span className="text-[10px] font-black tracking-[1px] uppercase text-slate-400">Business</span>
          <span className="font-semibold text-[#0B1C30] text-right">{user.businessName}</span>
        </div>
        <div className="flex justify-between items-start gap-2">
          <span className="text-[10px] font-black tracking-[1px] uppercase text-slate-400">Joined</span>
          <span className="font-semibold text-[#0B1C30] text-right">{user.joinedDate}</span>
        </div>
        <div className="flex justify-between items-start gap-2">
          <span className="text-[10px] font-black tracking-[1px] uppercase text-slate-400">Last Active</span>
          <span className="font-semibold text-[#0B1C30] text-right">{user.lastActive}</span>
        </div>
      </div>

      {/* Activity KPIs */}
      <div className="px-5 py-4 border-b border-slate-100">
        <div className="text-[10px] font-black tracking-[1.2px] uppercase text-slate-400 mb-3">Activity Summary</div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-50 rounded p-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Bookings</div>
            <div className="text-xl font-black text-[#0B1C30] mt-1">{user.totalBookings}</div>
          </div>
          <div className="bg-slate-50 rounded p-3">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Total Spend</div>
            <div className="text-xl font-black text-[#0B1C30] mt-1">{user.totalSpend}</div>
          </div>
        </div>
      </div>

      {/* Permissions */}
      <div className="px-5 py-4 flex-1">
        <div className="text-[10px] font-black tracking-[1.2px] uppercase text-slate-400 mb-3">Permissions</div>
        <div className="flex flex-col gap-2">
          {user.permissions.map((perm) => (
            <div key={perm} className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#EFF4FF] border border-[#1E40AF] flex items-center justify-center flex-shrink-0">
                <svg width="8" height="8" viewBox="0 0 12 9" fill="none">
                  <path d="M1 4.5L4.5 8L11 1" stroke="#1E40AF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              <span className="text-xs font-semibold text-slate-700">{perm}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="px-5 py-4 border-t border-slate-100 flex flex-col gap-2">
        <button className="w-full py-2.5 bg-[#0B1C30] text-white text-xs font-bold rounded hover:bg-[#162d47] transition-colors tracking-wide uppercase">
          Edit User
        </button>
        {user.status === 'Suspended' ? (
          <button className="w-full py-2.5 border border-emerald-300 text-emerald-700 text-xs font-bold rounded hover:bg-emerald-50 transition-colors tracking-wide uppercase">
            Reinstate User
          </button>
        ) : (
          <button className="w-full py-2.5 border border-red-200 text-red-500 text-xs font-bold rounded hover:bg-red-50 transition-colors tracking-wide uppercase">
            Suspend User
          </button>
        )}
      </div>
    </div>
  )
}
