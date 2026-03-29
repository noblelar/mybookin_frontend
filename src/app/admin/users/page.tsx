'use client'

import { useState } from 'react'
import UserStatsRow from '@/components/admin/users/UserStatsRow'
import UserFilters from '@/components/admin/users/UserFilters'
import UserTable from '@/components/admin/users/UserTable'
import UserProfile from '@/components/admin/users/UserProfile'

export default function UserManagementPage() {
  const [selectedUser, setSelectedUser] = useState<string>('USR-00192')

  return (
    <div className="flex flex-col min-h-full">
      {/* Breadcrumb */}
      <div className="px-6 pt-5 pb-1">
        <div className="flex items-center gap-2 text-[10px] font-black tracking-[1.5px] uppercase text-slate-400">
          <span>Admin</span>
          <span>›</span>
          <span className="text-[#0B1C30]">User Management</span>
        </div>
      </div>

      {/* Page Header */}
      <div className="px-6 pt-2 pb-4 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#0B1C30] tracking-tight">
            User Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage platform users, roles, permissions, and account status across all tenants.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] font-black tracking-[1.5px] uppercase text-slate-400 border border-slate-200 px-2 py-1 rounded">
            8,142 Total Users
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="px-6 pb-4">
        <UserStatsRow />
      </div>

      {/* Filters */}
      <div className="px-6 pb-3">
        <UserFilters />
      </div>

      {/* Table + Profile Panel */}
      <div className="px-6 pb-6 flex-1 flex flex-col lg:flex-row gap-4">
        {/* Table */}
        <div className="flex flex-col flex-1 min-w-0">
          <UserTable selectedId={selectedUser} onSelect={setSelectedUser} />
        </div>

        {/* Profile Panel */}
        {selectedUser && (
          <div className="lg:w-[300px] xl:w-[320px] flex-shrink-0 bg-white rounded-sm overflow-hidden flex flex-col border border-slate-100">
            <UserProfile userId={selectedUser} onClose={() => setSelectedUser('')} />
          </div>
        )}
      </div>
    </div>
  )
}
