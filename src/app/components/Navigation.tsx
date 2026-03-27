export default function Navigation() {
  return (
    <nav className="sa-nav">
      <div className="sa-nav-inner">
        <a href="/" className="sa-nav-logo">MyBookins</a>

        <ul className="sa-nav-links">
          <li><a href="#" className="sa-nav-link active">Discover</a></li>
          <li><a href="#" className="sa-nav-link">How it Works</a></li>
          <li><a href="#" className="sa-nav-link">For Businesses</a></li>
          <li><a href="#" className="sa-nav-link">Pricing</a></li>
        </ul>

        <div className="sa-nav-actions">
          <a href="#" className="sa-btn-ghost">Admin Login</a>
          <a href="#" className="sa-btn-black">Get Started</a>
        </div>
      </div>
      <div className="sa-nav-divider" />
    </nav>
  )
}
