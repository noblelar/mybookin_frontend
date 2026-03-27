export default function Footer() {
  return (
    <footer
      className="w-full"
      style={{
        background: '#F1F5F9',
        borderTop: '1px solid #E2E8F0',
        padding: '48px 24px',
      }}
    >
      <div
        className="mx-auto flex flex-col gap-12"
        style={{ maxWidth: '1280px' }}
      >
        {/* Main Grid */}
        <div
          className="grid gap-8"
          style={{
            gridTemplateColumns: 'repeat(6, minmax(0, 1fr))',
          }}
        >
          {/* Brand Column (2 cols) */}
          <div
            className="flex flex-col gap-4"
            style={{ gridColumn: 'span 2' }}
          >
            <span
              className="font-inter font-extrabold uppercase"
              style={{
                fontSize: '20px',
                color: '#0F172A',
                lineHeight: '28px',
                letterSpacing: '-1px',
              }}
            >
              MyBookins
            </span>
            <p
              className="font-inter font-medium text-xs"
              style={{
                color: '#64748B',
                lineHeight: '19.5px',
                maxWidth: '320px',
              }}
            >
              The definitive multi-tenant engine for service-based businesses
              who value precision, density, and professional aesthetics.
            </p>
          </div>

          {/* Platform Links */}
          <div className="flex flex-col gap-3">
            <p
              className="font-inter font-medium text-xs uppercase pb-2"
              style={{ color: '#0F172A', letterSpacing: '1.2px' }}
            >
              Platform
            </p>
            {['Discover', 'Pricing', 'API Docs'].map((link) => (
              <a
                key={link}
                href="#"
                className="font-inter font-medium text-xs uppercase hover:text-[#0F172A] transition-colors"
                style={{ color: '#64748B', letterSpacing: '1.2px' }}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Business Links */}
          <div className="flex flex-col gap-3">
            <p
              className="font-inter font-medium text-xs uppercase pb-2"
              style={{ color: '#0F172A', letterSpacing: '1.2px' }}
            >
              Business
            </p>
            {['Register', 'Admin Login', 'Support'].map((link) => (
              <a
                key={link}
                href="#"
                className="font-inter font-medium text-xs uppercase hover:text-[#0F172A] transition-colors"
                style={{ color: '#64748B', letterSpacing: '1.2px' }}
              >
                {link}
              </a>
            ))}
          </div>

          {/* Legal Links */}
          <div className="flex flex-col gap-3">
            <p
              className="font-inter font-medium text-xs uppercase pb-2"
              style={{ color: '#0F172A', letterSpacing: '1.2px' }}
            >
              Legal
            </p>
            {['Privacy Policy', 'Terms of Service', 'Compliance'].map(
              (link) => (
                <a
                  key={link}
                  href="#"
                  className="font-inter font-medium text-xs uppercase hover:text-[#0F172A] transition-colors"
                  style={{ color: '#64748B', letterSpacing: '1.2px' }}
                >
                  {link}
                </a>
              )
            )}
          </div>

          {/* Social */}
          <div className="flex flex-col gap-3">
            <p
              className="font-inter font-medium text-xs uppercase pb-2"
              style={{ color: '#0F172A', letterSpacing: '1.2px' }}
            >
              Social
            </p>
            <div className="flex gap-3">
              {/* Twitter / X */}
              <a href="#" className="hover:opacity-70 transition-opacity">
                <svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.75 0H18.818L12.118 7.62L20 18H13.831L9.011 11.696L3.502 18H0.432L7.592 9.86L0 0H6.328L10.695 5.746L15.75 0ZM14.678 16.17H16.374L5.405 1.736H3.581L14.678 16.17Z" fill="#94A3B8"/>
                </svg>
              </a>
              {/* Shield / LinkedIn */}
              <a href="#" className="hover:opacity-70 transition-opacity">
                <svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 20C5.68333 19.4167 3.77083 18.0875 2.2625 16.0125C0.754167 13.9375 0 11.6333 0 9.1V3L8 0L16 3V9.1C16 11.6333 15.2458 13.9375 13.7375 16.0125C12.2292 18.0875 10.3167 19.4167 8 20ZM8 17.9C9.61667 17.4 10.9667 16.4125 12.05 14.9375C13.1333 13.4625 13.7667 11.8167 13.95 10H8V2.125L2 4.375V9.1C2 9.28333 2 9.43333 2 9.55C2 9.66667 2.01667 9.81667 2.05 10H8V17.9Z" fill="#94A3B8"/>
                </svg>
              </a>
              {/* Lock */}
              <a href="#" className="hover:opacity-70 transition-opacity">
                <svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 21C1.45 21 0.979167 20.8042 0.5875 20.4125C0.195833 20.0208 0 19.55 0 19V9C0 8.45 0.195833 7.97917 0.5875 7.5875C0.979167 7.19583 1.45 7 2 7H3V5C3 3.61667 3.4875 2.4375 4.4625 1.4625C5.4375 0.4875 6.61667 0 8 0C9.38333 0 10.5625 0.4875 11.5375 1.4625C12.5125 2.4375 13 3.61667 13 5V7H14C14.55 7 15.0208 7.19583 15.4125 7.5875C15.8042 7.97917 16 8.45 16 9V19C16 19.55 15.8042 20.0208 15.4125 20.4125C15.0208 20.8042 14.55 21 14 21H2ZM2 19H14V9H2V19ZM8 16C8.55 16 9.02083 15.8042 9.4125 15.4125C9.80417 15.0208 10 14.55 10 14C10 13.45 9.80417 12.9792 9.4125 12.5875C9.02083 12.1958 8.55 12 8 12C7.45 12 6.97917 12.1958 6.5875 12.5875C6.19583 12.9792 6 13.45 6 14C6 14.55 6.19583 15.0208 6.5875 15.4125C6.97917 15.8042 7.45 16 8 16ZM5 7H11V5C11 4.16667 10.7083 3.45833 10.125 2.875C9.54167 2.29167 8.83333 2 8 2C7.16667 2 6.45833 2.29167 5.875 2.875C5.29167 3.45833 5 4.16667 5 5V7ZM2 19V9V19Z" fill="#94A3B8"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          className="flex justify-between items-center pt-6"
          style={{ borderTop: '1px solid #E2E8F0' }}
        >
          <p
            className="font-inter font-medium text-xs"
            style={{ color: '#64748B' }}
          >
            © 2024 MyBookins. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
