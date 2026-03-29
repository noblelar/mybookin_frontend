'use client'

import { useState } from 'react'

export default function UserFilters() {
  const [role, setRole] = useState('All Roles')
  const [status, setStatus] = useState('All Status')

  return (
    <div className="bg-white border border-slate-100 rounded-sm px-4 py-3 flex items-center gap-3 flex-wrap">
      {/* Search */}
      <div className="flex items-center gap-2 flex-1 min-w-[200px] bg-slate-50 border border-slate-200 rounded px-3 py-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-slate-400 flex-shrink-0">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" fill="currentColor"/>
        </svg>
        <input
          type="text"
          placeholder="Search users by name, email, or ID..."
          className="bg-transparent text-xs text-slate-700 placeholder:text-slate-400 outline-none flex-1"
        />
      </div>

      {/* Role filter */}
      <div className="relative">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="appearance-none bg-white border border-slate-200 rounded px-3 py-2 text-xs font-semibold text-slate-700 pr-7 focus:outline-none focus:border-slate-300 cursor-pointer"
        >
          <option>All Roles</option>
          <option>Admin</option>
          <option>Business Owner</option>
          <option>End User</option>
          <option>Staff</option>
        </select>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <path d="M7 10l5 5 5-5z" fill="currentColor"/>
        </svg>
      </div>

      {/* Status filter */}
      <div className="relative">
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="appearance-none bg-white border border-slate-200 rounded px-3 py-2 text-xs font-semibold text-slate-700 pr-7 focus:outline-none focus:border-slate-300 cursor-pointer"
        >
          <option>All Status</option>
          <option>Active</option>
          <option>Suspended</option>
          <option>Pending Verification</option>
        </select>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <path d="M7 10l5 5 5-5z" fill="currentColor"/>
        </svg>
      </div>

      <div className="ml-auto flex items-center gap-2">
        {/* Export */}
        <button className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 rounded text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" fill="currentColor"/>
          </svg>
          Export CSV
        </button>

        {/* Invite User */}
        <button className="flex items-center gap-1.5 px-3 py-2 bg-[#0B1C30] text-white rounded text-xs font-bold hover:bg-[#162d47] transition-colors">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
            <path d="M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="currentColor"/>
          </svg>
          Invite User
        </button>
      </div>
    </div>
  )
}
