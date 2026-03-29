export default function OnboardingNavbar() {
  return (
    <header className="w-full border-b border-[rgba(226,232,240,0.50)] bg-[rgba(248,250,252,0.80)] backdrop-blur-sm sticky top-0 z-50">
      <div className="flex h-16 max-w-[1280px] mx-auto px-4 md:px-6 items-center justify-between">
        {/* Logo */}
        <a
          href="/"
          className="font-inter text-sm md:text-xl font-black uppercase tracking-[-0.05em] text-[#0B1C30]"
        >
          MyBookIns
        </a>

        {/* Right Actions */}
        <div className="flex items-center gap-4 md:gap-6">
          <a
            href="#"
            className="font-inter text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors hidden sm:block"
          >
            Support
          </a>
          <a
            href="#"
            className="font-inter text-sm font-medium text-[#64748B] hover:text-[#0F172A] transition-colors hidden sm:block"
          >
            Help Center
          </a>
          {/* User Avatar */}
          <button className="flex items-center justify-center w-9 h-9 rounded-full border border-[rgba(198,198,205,0.30)] hover:border-[#0F172A] transition-colors">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"
                fill="#64748B"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  )
}
