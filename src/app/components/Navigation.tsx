import Link from 'next/link'

export default function Navigation() {
  return (
    <nav className="sa-nav">
      <div className="sa-nav-inner">
        <Link href="/" className="sa-nav-logo">MyBookIns</Link>

        <ul className="sa-nav-links">
          <li><a href="#" className="sa-nav-link active">Discover</a></li>
          <li><a href="#" className="sa-nav-link">How it Works</a></li>
          <li><a href="#" className="sa-nav-link">For Businesses</a></li>
          <li><a href="#" className="sa-nav-link">Pricing</a></li>
        </ul>

        <div className="sa-nav-actions">
          <Link href="/admin/login" className="sa-btn-ghost">Admin Login</Link>
          <Link href="/register" className="sa-btn-black">Get Started</Link>
        </div>
      </div>
      <div className="sa-nav-divider" />
    </nav>
  )
}
