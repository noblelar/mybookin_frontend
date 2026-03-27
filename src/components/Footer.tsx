import {
  TwitterIcon,
  ShieldIcon,
  LockIcon,
} from './icons'

export default function Footer() {
  return (
    <footer className="w-full bg-footer-bg border-t border-border-subtle">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Main Grid */}
        <div className="grid grid-cols-6 gap-8 mb-12">
          {/* Brand Column (2 cols) */}
          <div className="col-span-2 flex flex-col gap-4">
            <h1 className="font-inter text-xl font-black uppercase tracking-tight text-navy">
              MyBookins
            </h1>
            <p className="text-body text-xs leading-relaxed font-medium">
              The definitive multi-tenant engine for service-based businesses
              who value precision, density, and professional aesthetics.
            </p>
          </div>

          {/* Platform Links */}
          <div className="flex flex-col gap-3">
            <p className="text-navy text-xs font-medium uppercase tracking-wider">
              Platform
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="#"
                  className="text-body text-xs font-medium uppercase tracking-wider hover:text-navy transition-colors"
                >
                  Discover
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-body text-xs font-medium uppercase tracking-wider hover:text-navy transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-body text-xs font-medium uppercase tracking-wider hover:text-navy transition-colors"
                >
                  API Docs
                </a>
              </li>
            </ul>
          </div>

          {/* Business Links */}
          <div className="flex flex-col gap-3">
            <p className="text-navy text-xs font-medium uppercase tracking-wider">
              Business
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="#"
                  className="text-body text-xs font-medium uppercase tracking-wider hover:text-navy transition-colors"
                >
                  Register
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-body text-xs font-medium uppercase tracking-wider hover:text-navy transition-colors"
                >
                  Admin Login
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-body text-xs font-medium uppercase tracking-wider hover:text-navy transition-colors"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-3">
            <p className="text-navy text-xs font-medium uppercase tracking-wider">
              Legal
            </p>
            <ul className="flex flex-col gap-2">
              <li>
                <a
                  href="#"
                  className="text-body text-xs font-medium uppercase tracking-wider hover:text-navy transition-colors"
                >
                  Privacy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-body text-xs font-medium uppercase tracking-wider hover:text-navy transition-colors"
                >
                  Terms
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-body text-xs font-medium uppercase tracking-wider hover:text-navy transition-colors"
                >
                  Compliance
                </a>
              </li>
            </ul>
          </div>

          {/* Social Icons */}
          <div className="flex flex-col gap-4">
            <p className="text-navy text-xs font-medium uppercase tracking-wider">
              Social
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center text-body hover:text-navy hover:bg-blue-light rounded transition-colors"
              >
                <TwitterIcon />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center text-body hover:text-navy hover:bg-blue-light rounded transition-colors"
              >
                <ShieldIcon />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center text-body hover:text-navy hover:bg-blue-light rounded transition-colors"
              >
                <LockIcon />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border-subtle pt-8 flex justify-between items-center">
          <p className="text-body text-xs font-medium">
            © 2024 MyBookins. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="#"
              className="text-body text-xs font-medium hover:text-navy transition-colors"
            >
              Status
            </a>
            <a
              href="#"
              className="text-body text-xs font-medium hover:text-navy transition-colors"
            >
              Feedback
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
