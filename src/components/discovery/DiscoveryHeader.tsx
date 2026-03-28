export default function DiscoveryHeader() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 pt-5 pb-3 md:py-5 flex items-end justify-between gap-2">
      <div className="flex flex-col gap-0.5">
        {/* Mobile: "CURATED SELECTION" label | Desktop: hidden */}
        <span className="md:hidden text-[10px] font-black tracking-[1.5px] uppercase text-slate-400">
          Curated Selection
        </span>
        <h1 className="text-[#0B1C30] font-extrabold text-2xl md:text-3xl tracking-tight font-['Manrope',sans-serif] leading-tight">
          <span className="md:hidden">Nearby Specialists</span>
          <span className="hidden md:inline">Discovery Catalog</span>
        </h1>
      </div>

      <button className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-[#0B1C30] hover:opacity-70 transition-opacity flex-shrink-0 pb-1">
        <span>View Map</span>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.5 3l-.16.03L15 5.1 9 3 3.36 4.9c-.21.07-.36.25-.36.48V20.5c0 .28.22.5.5.5l.16-.03L9 18.9l6 2.1 5.64-1.9c.21-.07.36-.25.36-.48V3.5c0-.28-.22-.5-.5-.5zM15 19l-6-2.11V5l6 2.11V19z" fill="#0B1C30"/>
        </svg>
      </button>
    </div>
  )
}
