export default function DiscoveryHeader() {
  return (
    <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-5 flex items-center justify-between">
      <h1 className="text-[#0B1C30] font-extrabold text-2xl md:text-3xl tracking-tight font-['Manrope',sans-serif]">
        Discovery Catalog
      </h1>
      <button className="flex items-center gap-2 text-sm font-bold text-[#0B1C30] hover:opacity-70 transition-opacity">
        <span>View Maps</span>
        {/* Grid/map icon */}
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 6H5V18H3V6ZM7 6H9V18H7V6ZM11 6H13V18H11V6ZM15 6H17V18H15V6ZM19 6H21V18H19V6ZM3 3H21V5H3V3ZM3 19H21V21H3V19Z" fill="#0B1C30"/>
        </svg>
      </button>
    </div>
  )
}
