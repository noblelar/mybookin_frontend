'use client'

import { useState } from 'react'

interface User {
  id: string
  name: string
  email: string
  userId: string
  role: 'Admin' | 'Business Owner' | 'End User' | 'Staff'
  roleColor: string
  joinedDate: string
  lastActive: string
  status: 'Active' | 'Suspended' | 'Pending'
  avatarColor: string
  initials: string
}

const users: User[] = [
  {
    id: 'USR-00192',
    name: 'Marcus Thompson',
    email: 'marcus.t@vortexgroup.com',
    userId: 'id: usr_192',
    role: 'Business Owner',
    roleColor: 'bg-[#1E40AF] text-white',
    joinedDate: 'Jan 14, 2024',
    lastActive: '2 min ago',
    status: 'Active',
    avatarColor: 'bg-[#1E40AF]',
    initials: 'MT',
  },
  {
    id: 'USR-00193',
    name: 'Sarah Jenkins',
    email: 'sarah.j@aetherhealth.io',
    userId: 'id: usr_193',
    role: 'Admin',
    roleColor: 'bg-[#0B1C30] text-white',
    joinedDate: 'Mar 02, 2024',
    lastActive: '1 hour ago',
    status: 'Active',
    avatarColor: 'bg-purple-600',
    initials: 'SJ',
  },
  {
    id: 'USR-00194',
    name: 'David Chen',
    email: 'david.c@ignitetech.dev',
    userId: 'id: usr_194',
    role: 'Business Owner',
    roleColor: 'bg-[#1E40AF] text-white',
    joinedDate: 'Feb 19, 2024',
    lastActive: '3 days ago',
    status: 'Suspended',
    avatarColor: 'bg-slate-500',
    initials: 'DC',
  },
  {
    id: 'USR-00195',
    name: 'Priya Nair',
    email: 'p.nair@summitrealty.co',
    userId: 'id: usr_195',
    role: 'Staff',
    roleColor: 'bg-emerald-600 text-white',
    joinedDate: 'Apr 05, 2024',
    lastActive: '5 hours ago',
    status: 'Active',
    avatarColor: 'bg-emerald-600',
    initials: 'PN',
  },
  {
    id: 'USR-00196',
    name: 'Tom Briggs',
    email: 'tom.b@roastco.co.uk',
    userId: 'id: usr_196',
    role: 'End User',
    roleColor: 'bg-slate-100 text-slate-700',
    joinedDate: 'May 21, 2024',
    lastActive: 'Just now',
    status: 'Pending',
    avatarColor: 'bg-amber-600',
    initials: 'TB',
  },
]

const statusConfig = {
  Active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Suspended: 'bg-red-50 text-red-600 border border-red-200',
  Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
}

const statusDot = {
  Active: 'bg-emerald-500',
  Suspended: 'bg-red-500',
  Pending: 'bg-amber-400',
}

interface Props {
  selectedId: string
  onSelect: (id: string) => void
}

export default function UserTable({ selectedId, onSelect }: Props) {
  const [page, setPage] = useState(1)

  return (
    <div className="bg-white rounded-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              <th className="text-left px-4 py-3 text-[10px] font-black tracking-[1.2px] uppercase text-slate-400">User</th>
              <th className="text-left px-4 py-3 text-[10px] font-black tracking-[1.2px] uppercase text-slate-400">Role</th>
              <th className="text-left px-4 py-3 text-[10px] font-black tracking-[1.2px] uppercase text-slate-400">Joined</th>
              <th className="text-left px-4 py-3 text-[10px] font-black tracking-[1.2px] uppercase text-slate-400">Last Active</th>
              <th className="text-left px-4 py-3 text-[10px] font-black tracking-[1.2px] uppercase text-slate-400">Status</th>
              <th className="text-left px-4 py-3 text-[10px] font-black tracking-[1.2px] uppercase text-slate-400">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {users.map((user) => (
              <tr
                key={user.id}
                onClick={() => onSelect(user.id)}
                className={`cursor-pointer transition-colors ${
                  selectedId === user.id ? 'bg-[#EFF4FF]' : 'hover:bg-slate-50'
                }`}
              >
                {/* User */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${user.avatarColor}`}>
                      <span className="text-[10px] font-black text-white">{user.initials}</span>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#0B1C30]">{user.name}</div>
                      <div className="text-[10px] text-slate-400 font-medium">{user.email}</div>
                      <div className="text-[10px] text-slate-300 font-medium">{user.userId}</div>
                    </div>
                  </div>
                </td>

                {/* Role */}
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded ${user.roleColor}`}>
                    {user.role}
                  </span>
                </td>

                {/* Joined */}
                <td className="px-4 py-3">
                  <span className="text-sm text-slate-600">{user.joinedDate}</span>
                </td>

                {/* Last Active */}
                <td className="px-4 py-3">
                  <span className="text-sm text-slate-500">{user.lastActive}</span>
                </td>

                {/* Status */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot[user.status]}`} />
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${statusConfig[user.status]}`}>
                      {user.status}
                    </span>
                  </div>
                </td>

                {/* Actions */}
                <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-1.5">
                    <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700" title="View Profile">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
                      </svg>
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-700" title="Edit User">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor"/>
                      </svg>
                    </button>
                    <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-red-50 transition-colors text-slate-400 hover:text-red-500" title="Suspend User">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="border-t border-slate-100 px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
        <div className="text-xs text-slate-500">
          Showing 1–5 of 8,142 users
        </div>
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50 disabled:opacity-40" disabled>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" fill="currentColor"/></svg>
          </button>
          {[1, 2, 3].map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-7 h-7 flex items-center justify-center rounded text-xs font-bold transition-colors ${
                page === p
                  ? 'bg-[#1E40AF] text-white'
                  : 'border border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
            >
              {p}
            </button>
          ))}
          <button className="w-7 h-7 flex items-center justify-center rounded border border-slate-200 text-slate-400 hover:bg-slate-50">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" fill="currentColor"/></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
