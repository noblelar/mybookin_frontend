import { TwitterIcon, ShieldIcon, LockIcon } from "@/app/icons"

interface FooterLink {
  label: string
  href: string
}

interface FooterColumn {
  title: string
  links: FooterLink[]
}

const footerColumns: FooterColumn[] = [
  {
    title: "Platform",
    links: [
      { label: "Discover", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "API Docs", href: "#" },
    ],
  },
  {
    title: "Business",
    links: [
      { label: "Register", href: "#" },
      { label: "Admin Login", href: "#" },
      { label: "Support", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "Twitter", href: "#" },
      { label: "LinkedIn", href: "#" },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="sa-footer">
      <div className="sa-footer-inner">
        <div className="sa-footer-grid">
          {/* Brand */}
          <div>
            <a href="/" className="sa-footer-brand-name">MyBookIns</a>
            <p className="sa-footer-brand-desc">
              The definitive multi-tenant engine for service-based businesses who value precision, density, and professional aesthetics.
            </p>
          </div>

          {/* Footer columns */}
          {footerColumns.map((column) => (
            <div key={column.title}>
              <p className="sa-footer-col-title">{column.title}</p>
              {column.links.map((link) => (
                <a key={link.label} href={link.href} className="sa-footer-link">
                  {link.label}
                </a>
              ))}
              {column.title === "Social" && (
                <div className="sa-footer-social-icons">
                  <TwitterIcon />
                  <ShieldIcon />
                  <LockIcon />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="sa-footer-bottom">
          <p className="sa-footer-copyright">
            &copy; 2024 MyBookIns. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
