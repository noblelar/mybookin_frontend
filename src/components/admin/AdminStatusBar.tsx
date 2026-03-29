export default function AdminStatusBar() {
  return (
    <footer className="h-10 bg-white border-t border-slate-200 flex items-center justify-between px-6 flex-shrink-0">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span className="text-[10px] font-black tracking-[1.5px] uppercase text-slate-500">
            Instance Status: Healthy
          </span>
        </div>
        <span className="text-[10px] font-black tracking-[1.5px] uppercase text-slate-400">
          Shard: North America East
        </span>
      </div>
      <span className="text-[10px] text-slate-400 font-medium">
        © 2024 MyBookins. All rights reserved.
      </span>
    </footer>
  )
}
