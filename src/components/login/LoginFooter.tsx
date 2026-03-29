const footerLinks = [
  { label: 'Privacy Policy', href: '#' },
  { label: 'Terms of Service', href: '#' },
  { label: 'Support', href: '#' },
]

export default function LoginFooter() {
  return (
    <footer className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-[rgba(198,198,205,0.20)]">
      <p className="font-inter text-[10px] font-medium uppercase tracking-[1px] text-[#94A3B8] text-center sm:text-left">
        © 2024 MyBookIns. All rights reserved.
      </p>
      <div className="flex items-center gap-4 flex-wrap justify-center">
        {footerLinks.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="font-inter text-[10px] font-medium uppercase tracking-[1px] text-[#94A3B8] hover:text-[#64748B] transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  )
}
