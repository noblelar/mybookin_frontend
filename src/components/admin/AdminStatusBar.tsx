export default function AdminStatusBar() {
  return (
    <footer className="h-9 bg-white border-t border-slate-200 flex items-center justify-between px-4 md:px-6 flex-shrink-0">
      <div className="flex items-center gap-3 md:gap-6">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0"></span>
          <span className="text-[10px] font-black tracking-[1.2px] uppercase text-slate-500 whitespace-nowrap">
            <span className="hidden sm:inline">Instance Status: </span>Healthy
          </span>
        </div>
        <span className="hidden md:block text-[10px] font-black tracking-[1.5px] uppercase text-slate-400">
          Shard: North America East
        </span>
      </div>
      <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">
        <span className="hidden sm:inline">© 2024 </span>MyBookins
      </span>
    </footer>
  )
}
