export default function DiscoveryFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-auto">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[#0F172A] font-extrabold text-sm uppercase tracking-tight">
            MyBookIns
          </span>
          <span className="text-[#64748B] text-xs">
            © 2024 MyBookIns. All rights reserved.
          </span>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-5 flex-wrap">
          {['Privacy Policy', 'Terms of Service', 'Help Center', 'API Documentation'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-[#64748B] text-xs font-medium hover:text-[#0F172A] transition-colors"
            >
              {link}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  )
}
