import {
  SearchIcon,
  CategoryIcon,
  ChevronDownIcon,
  SearchArrowIcon,
} from "@/app/icons"

export default function HeroSection() {
  return (
    <section className="sa-hero">
      <div className="sa-hero-inner">
        {/* Left: Content */}
        <div className="sa-hero-content">
          <span className="sa-hero-badge">Omni-Channel Architecture</span>

          <h1 className="sa-hero-heading">
            Your Favorite<br />
            Services,<br />
            <span className="sa-hero-heading-light">Simplified.</span>
          </h1>

          <p className="sa-hero-description">
            Book experts, reserve resources, and manage appointments in one
            click. A Sovereign system built for absolute precision and zero
            friction.
          </p>

          {/* Search Bar */}
          <div className="sa-search-bar">
            <div className="sa-search-input-wrap">
              <SearchIcon />
              <div className="sa-search-input-text">
                <span className="sa-search-placeholder">What are you looking for?</span>
              </div>
            </div>

            <div className="sa-search-category">
              <CategoryIcon />
              <span className="sa-search-category-label">Category</span>
              <ChevronDownIcon />
            </div>

            <button className="sa-search-btn">
              <SearchArrowIcon />
              Search Nearby
            </button>
          </div>
        </div>

        {/* Right: Dual Visual */}
        <div className="sa-hero-visual">
          {/* Main image — Business Architect View */}
          <div className="sa-hero-img-main">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/f2aa736095396c625377fa3822964fee02b028e5?width=943"
              alt="Business Architect dashboard view"
            />
            <span className="sa-img-tag sa-img-tag-black">Business Architect View</span>
          </div>
          {/* Overlay image — User Interface */}
          <div className="sa-hero-img-overlay">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/7112e148ef0f9b526f7070a4f02abfee6a33df1c?width=501"
              alt="User interface view"
            />
            <span className="sa-img-tag sa-img-tag-gray" style={{ top: 24, left: 24 }}>User Interface</span>
          </div>
        </div>
      </div>
    </section>
  )
}
