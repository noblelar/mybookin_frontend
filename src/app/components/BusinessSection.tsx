import { CheckmarkIcon } from "@/app/icons"

interface Feature {
  title: string
  description: string
}

const features: Feature[] = [
  {
    title: "Automated Payouts",
    description: "Global split-payments across multiple sub-entities and staff members instantly.",
  },
  {
    title: "Resource Management",
    description: "Track equipment, rooms, and staff capacity to prevent double-bookings automatically.",
  },
  {
    title: "Flexible Plans",
    description: "Architect-grade dashboards for both enterprise chains and solo practitioners.",
  },
]

export default function BusinessSection() {
  return (
    <section className="sa-biz-section">
      <div className="sa-biz-gradient" />
      <div className="sa-biz-inner">
        {/* Left content */}
        <div className="sa-biz-content">
          <h2 className="sa-biz-heading">
            Master Your Domain.<br />
            Scale Your Business.
          </h2>

          <p className="sa-biz-description">
            The Sovereign Architect provides more than just a calendar. It&apos;s a full-stack command center for multi-tenant resource management.
          </p>

          <div className="sa-feature-list">
            {features.map((feature) => (
              <div key={feature.title} className="sa-feature-item">
                <div className="sa-feature-check">
                  <CheckmarkIcon />
                </div>
                <div className="sa-feature-text">
                  <h4 className="sa-feature-title">{feature.title}</h4>
                  <p className="sa-feature-desc">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          <a href="#" className="sa-register-btn">Register Your Business</a>
        </div>

        {/* Right — Revenue Monitor */}
        <div className="sa-revenue-card">
          <div className="sa-revenue-header">
            <span className="sa-revenue-title">Revenue Monitor</span>
            <span className="sa-revenue-growth">+14.2% This Week</span>
          </div>

          <div className="sa-revenue-bars">
            <div className="sa-bar-track">
              <div className="sa-bar-fill" style={{ width: "76%" }} />
            </div>
            <div className="sa-bar-track">
              <div className="sa-bar-fill" style={{ width: "46%" }} />
            </div>
            <div className="sa-bar-track">
              <div className="sa-bar-fill" style={{ width: "91%" }} />
            </div>
          </div>

          <div className="sa-revenue-stats">
            <div className="sa-stat-item">
              <span className="sa-stat-label">Active Now</span>
              <span className="sa-stat-value">24/25</span>
            </div>
            <div className="sa-stat-item">
              <span className="sa-stat-label">Revenue Online</span>
              <span className="sa-stat-value">£12,400</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
