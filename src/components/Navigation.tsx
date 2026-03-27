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
      <div className="flex h-16 max-w-[1280px] mx-auto px-6 justify-between items-center">
        {/* Logo */}
        <a
          href="/"
          className="font-inter text-xl font-black uppercase tracking-[-0.05em] text-[#0F172A]"
        >
          MyBookins
        </a>

        {/* Nav Links */}
        <ul className="flex items-center gap-8 list-none m-0 p-0">
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
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="font-inter text-sm font-bold text-[#64748B] uppercase tracking-[0.1em] px-4 py-2 hover:text-[#0F172A] transition-colors"
          >
            Admin Login
          </a>
          <a
            href="#"
            className="font-inter text-sm font-bold text-white uppercase tracking-[0.1em] bg-black px-6 py-2.5 hover:bg-gray-900 transition-colors shadow-md"
          >
            Get Started
          </a>
        </div>
      </div>
      {/* Bottom divider */}
      <div className="h-px bg-[rgba(226,232,240,0.50)]" />
    </nav>
  )
}
