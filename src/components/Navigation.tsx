export default function Navigation() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 shadow-sm backdrop-blur-md border-b border-border-subtle">
      <div className="flex h-16 max-w-6xl mx-auto px-6 justify-between items-center">
        {/* Logo */}
        <a href="/" className="font-inter text-xl font-bold letter-spacing-wide uppercase text-navy">
          MyBookins
        </a>

        {/* Nav Links */}
        <ul className="flex items-center gap-8 list-none m-0 p-0">
          <li><a href="#" className="font-inter text-sm font-bold text-navy hover:text-body transition-colors">Discover</a></li>
          <li><a href="#" className="font-inter text-sm font-bold text-body hover:text-navy transition-colors">How it Works</a></li>
          <li><a href="#" className="font-inter text-sm font-bold text-body hover:text-navy transition-colors">For Businesses</a></li>
          <li><a href="#" className="font-inter text-sm font-bold text-body hover:text-navy transition-colors">Pricing</a></li>
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <a href="#" className="font-inter text-sm font-bold text-body hover:text-navy transition-colors px-4 py-2">
            Admin Login
          </a>
          <a href="#" className="font-inter text-sm font-bold text-white bg-black hover:bg-gray-800 transition-colors px-6 py-2.5 rounded-lg shadow-md">
            Get Started
          </a>
        </div>
      </div>
    </nav>
  )
}
