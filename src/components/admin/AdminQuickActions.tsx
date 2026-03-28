export default function AdminQuickActions() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {/* Manual Settlement */}
      <button className="flex items-center gap-3 bg-white border border-slate-200 p-4 hover:bg-slate-50 transition-colors text-left group">
        <div className="w-10 h-10 bg-[#1E40AF] flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" fill="white"/>
          </svg>
        </div>
        <div>
          <div className="text-sm font-bold text-[#0B1C30] group-hover:text-blue-800 transition-colors">Manual Settlement</div>
          <div className="text-xs text-slate-400 mt-0.5">Bypass automated cycle</div>
        </div>
      </button>

      {/* Flag Business */}
      <button className="flex items-center gap-3 bg-white border border-slate-200 p-4 hover:bg-slate-50 transition-colors text-left group">
        <div className="w-10 h-10 bg-[#F97316] flex items-center justify-center flex-shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.4 6L14 4H5v17h2v-7h5.6l.4 2h7V6z" fill="white"/>
          </svg>
        </div>
        <div>
          <div className="text-sm font-bold text-[#0B1C30] group-hover:text-orange-700 transition-colors">Flag Business</div>
          <div className="text-xs text-slate-400 mt-0.5">Review for policy violation</div>
        </div>
      </button>
    </div>
  )
}
