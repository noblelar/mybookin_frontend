export default function Navigation() {
  return (
    <nav
      className="sticky top-0 z-50 w-full"
      style={{
        background: 'rgba(248, 250, 252, 0.80)',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        backdropFilter: 'blur(6px)',
      }}
    >
      <div className="flex h-16 max-w-[1280px] mx-auto px-4 md:px-6 justify-between items-center">
        {/* Logo */}
        <a
          href="/"
          className="font-inter text-xs md:text-sm font-black tracking-tight text-[#0B1C30] flex-shrink-0 whitespace-nowrap flex items-center gap-1"
        >
          <span>Sovereign Architect</span>
          <span style={{ color: '#235AFF' }}>with</span>
          <span>MyBookins</span>
        </a>

        {/* Nav Links - Hidden on mobile */}
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          <li>
            <a
              href="#"
              className="font-inter text-sm font-bold text-[#0F172A] tracking-[-0.025em] pb-1 border-b-2 border-[#0F172A]"
            >
              Discover
            </a>
          </li>
          <li>
            <a
              href="#"
              className="font-inter text-sm font-bold text-[#64748B] tracking-[-0.025em] hover:text-[#0F172A] transition-colors"
            >
              How it Works
            </a>
          </li>
          <li>
            <a
              href="#"
              className="font-inter text-sm font-bold text-[#64748B] tracking-[-0.025em] hover:text-[#0F172A] transition-colors"
            >
              For Businesses
            </a>
          </li>
          <li>
            <a
              href="#"
              className="font-inter text-sm font-bold text-[#64748B] tracking-[-0.025em] hover:text-[#0F172A] transition-colors"
            >
              Pricing
            </a>
          </li>
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          <a
            href="#"
            className="font-inter text-xs md:text-sm font-bold text-[#64748B] uppercase tracking-[0.1em] px-2 md:px-4 py-2 hover:text-[#0F172A] transition-colors hidden md:block"
          >
            Admin
          </a>
          <a
            href="#"
            className="font-inter text-xs md:text-sm font-bold text-white uppercase tracking-[0.1em] bg-black px-3 md:px-6 py-2 md:py-2.5 hover:bg-gray-900 transition-colors shadow-md"
          >
            <span className="md:hidden">Get</span>
            <span className="hidden md:inline">Get Started</span>
          </a>
        </div>
      </div>
      {/* Bottom divider */}
      <div className="h-px bg-[rgba(226,232,240,0.50)]" />
    </nav>
  )
}
