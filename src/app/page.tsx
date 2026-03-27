export default function Home() {
  return (
    <>
      {/* ── TOP NAVIGATION ── */}
      <nav className="sa-nav">
        <div className="sa-nav-inner">
          <a href="/" className="sa-nav-logo">My Bookings</a>

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

      {/* ── HERO SECTION ── */}
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
                {/* Search icon */}
                <svg width="26" height="18" viewBox="0 0 26 18" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <path d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z" fill="#76777D"/>
                </svg>
                <div className="sa-search-input-text">
                  <span className="sa-search-placeholder">What are you looking for?</span>
                </div>
              </div>

              <div className="sa-search-category">
                {/* Category icon */}
                <svg width="27" height="20" viewBox="0 0 27 20" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
                  <path d="M3.5 9L9 0L14.5 9H3.5ZM14.5 20C13.25 20 12.1875 19.5625 11.3125 18.6875C10.4375 17.8125 10 16.75 10 15.5C10 14.25 10.4375 13.1875 11.3125 12.3125C12.1875 11.4375 13.25 11 14.5 11C15.75 11 16.8125 11.4375 17.6875 12.3125C18.5625 13.1875 19 14.25 19 15.5C19 16.75 18.5625 17.8125 17.6875 18.6875C16.8125 19.5625 15.75 20 14.5 20ZM0 19.5V11.5H8V19.5H0ZM14.5 18C15.2 18 15.7917 17.7583 16.275 17.275C16.7583 16.7917 17 16.2 17 15.5C17 14.8 16.7583 14.2083 16.275 13.725C15.7917 13.2417 15.2 13 14.5 13C13.8 13 13.2083 13.2417 12.725 13.725C12.2417 14.2083 12 14.8 12 15.5C12 16.2 12.2417 16.7917 12.725 17.275C13.2083 17.7583 13.8 18 14.5 18ZM2 17.5H6V13.5H2V17.5ZM7.05 7H10.95L9 3.85L7.05 7Z" fill="#76777D"/>
                </svg>
                <span className="sa-search-category-label">Category</span>
                <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginLeft: 'auto' }}>
                  <path d="M6.2998 8.39999L10.4998 12.6L14.6998 8.39999" stroke="#6B7280" strokeWidth="1.575" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <button className="sa-search-btn">
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M4.95 9L3.525 5.475L0 4.05V3.35L9 0L5.65 9H4.95ZM5.275 7.15L7.3 1.7L1.85 3.725L4.3 4.7L5.275 7.15Z" fill="white"/>
                </svg>
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

      {/* ── CATEGORY BAR ── */}
      <div className="sa-category-bar">
        <div className="sa-category-inner">
          <span className="sa-category-label">Browse Niches</span>

          {/* Barber — Active */}
          <a href="#" className="sa-category-btn active">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.75 14.25L7.5 9L5.7375 10.7625C5.8375 10.95 5.90625 11.15 5.94375 11.3625C5.98125 11.575 6 11.7875 6 12C6 12.825 5.70625 13.5312 5.11875 14.1187C4.53125 14.7062 3.825 15 3 15C2.175 15 1.46875 14.7062 0.88125 14.1187C0.29375 13.5312 0 12.825 0 12C0 11.175 0.29375 10.4688 0.88125 9.88125C1.46875 9.29375 2.175 9 3 9C3.2125 9 3.425 9.01875 3.6375 9.05625C3.85 9.09375 4.05 9.1625 4.2375 9.2625L6 7.5L4.2375 5.7375C4.05 5.8375 3.85 5.90625 3.6375 5.94375C3.425 5.98125 3.2125 6 3 6C2.175 6 1.46875 5.70625 0.88125 5.11875C0.29375 4.53125 0 3.825 0 3C0 2.175 0.29375 1.46875 0.88125 0.88125C1.46875 0.29375 2.175 0 3 0C3.825 0 4.53125 0.29375 5.11875 0.88125C5.70625 1.46875 6 2.175 6 3C6 3.2125 5.98125 3.425 5.94375 3.6375C5.90625 3.85 5.8375 4.05 5.7375 4.2375L15 13.5V14.25H12.75ZM9.75 6.75L8.25 5.25L12.75 0.75H15V1.5L9.75 6.75ZM3 4.5C3.4125 4.5 3.76562 4.35312 4.05937 4.05937C4.35312 3.76562 4.5 3.4125 4.5 3C4.5 2.5875 4.35312 2.23438 4.05937 1.94062C3.76562 1.64687 3.4125 1.5 3 1.5C2.5875 1.5 2.23438 1.64687 1.94062 1.94062C1.64687 2.23438 1.5 2.5875 1.5 3C1.5 3.4125 1.64687 3.76562 1.94062 4.05937C2.23438 4.35312 2.5875 4.5 3 4.5ZM3 13.5C3.4125 13.5 3.76562 13.3531 4.05937 13.0594C4.35312 12.7656 4.5 12.4125 4.5 12C4.5 11.5875 4.35312 11.2344 4.05937 10.9406C3.76562 10.6469 3.4125 10.5 3 10.5C2.5875 10.5 2.23438 10.6469 1.94062 10.9406C1.64687 11.2344 1.5 11.5875 1.5 12C1.5 12.4125 1.64687 12.7656 1.94062 13.0594C2.23438 13.3531 2.5875 13.5 3 13.5Z" fill="white"/>
            </svg>
            Barber
          </a>

          {/* Hair */}
          <a href="#" className="sa-category-btn">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5.25 9.1875C4.9875 9.1875 4.76562 9.09687 4.58437 8.91562C4.40312 8.73438 4.3125 8.5125 4.3125 8.25C4.3125 7.9875 4.40312 7.76562 4.58437 7.58437C4.76562 7.40312 4.9875 7.3125 5.25 7.3125C5.5125 7.3125 5.73438 7.40312 5.91563 7.58437C6.09688 7.76562 6.1875 7.9875 6.1875 8.25C6.1875 8.5125 6.09688 8.73438 5.91563 8.91562C5.73438 9.09687 5.5125 9.1875 5.25 9.1875ZM9.75 9.1875C9.4875 9.1875 9.26562 9.09687 9.08438 8.91562C8.90313 8.73438 8.8125 8.5125 8.8125 8.25C8.8125 7.9875 8.90313 7.76562 9.08438 7.58437C9.26562 7.40312 9.4875 7.3125 9.75 7.3125C10.0125 7.3125 10.2344 7.40312 10.4156 7.58437C10.5969 7.76562 10.6875 7.9875 10.6875 8.25C10.6875 8.5125 10.5969 8.73438 10.4156 8.91562C10.2344 9.09687 10.0125 9.1875 9.75 9.1875ZM7.5 13.5C9.175 13.5 10.5938 12.9188 11.7563 11.7563C12.9188 10.5938 13.5 9.175 13.5 7.5C13.5 7.2 13.4813 6.90938 13.4438 6.62813C13.4062 6.34688 13.3375 6.075 13.2375 5.8125C12.975 5.875 12.7125 5.92188 12.45 5.95312C12.1875 5.98438 11.9125 6 11.625 6C10.4875 6 9.4125 5.75625 8.4 5.26875C7.3875 4.78125 6.525 4.1 5.8125 3.225C5.4125 4.2 4.84063 5.04688 4.09688 5.76562C3.35313 6.48438 2.4875 7.025 1.5 7.3875C1.5 7.4125 1.5 7.43125 1.5 7.44375C1.5 7.45625 1.5 7.475 1.5 7.5C1.5 9.175 2.08125 10.5938 3.24375 11.7563C4.40625 12.9188 5.825 13.5 7.5 13.5ZM7.5 15C6.4625 15 5.4875 14.8031 4.575 14.4094C3.6625 14.0156 2.86875 13.4812 2.19375 12.8062C1.51875 12.1312 0.984375 11.3375 0.590625 10.425C0.196875 9.5125 0 8.5375 0 7.5C0 6.4625 0.196875 5.4875 0.590625 4.575C0.984375 3.6625 1.51875 2.86875 2.19375 2.19375C2.86875 1.51875 3.6625 0.984375 4.575 0.590625C5.4875 0.196875 6.4625 0 7.5 0C8.5375 0 9.5125 0.196875 10.425 0.590625C11.3375 0.984375 12.1312 1.51875 12.8062 2.19375C13.4812 2.86875 14.0156 3.6625 14.4094 4.575C14.8031 5.4875 15 6.4625 15 7.5C15 8.5375 14.8031 9.5125 14.4094 10.425C14.0156 11.3375 13.4812 12.1312 12.8062 12.8062C12.1312 13.4812 11.3375 14.0156 10.425 14.4094C9.5125 14.8031 8.5375 15 7.5 15ZM6.4875 1.59375C7.0125 2.46875 7.725 3.17188 8.625 3.70312C9.525 4.23438 10.525 4.5 11.625 4.5C11.8 4.5 11.9688 4.49063 12.1313 4.47188C12.2938 4.45312 12.4625 4.43125 12.6375 4.40625C12.1125 3.53125 11.4 2.82812 10.5 2.29688C9.6 1.76562 8.6 1.5 7.5 1.5C7.325 1.5 7.15625 1.50938 6.99375 1.52813C6.83125 1.54688 6.6625 1.56875 6.4875 1.59375ZM1.81875 5.60625C2.45625 5.24375 3.0125 4.775 3.4875 4.2C3.9625 3.625 4.31875 2.98125 4.55625 2.26875C3.91875 2.63125 3.3625 3.1 2.8875 3.675C2.4125 4.25 2.05625 4.89375 1.81875 5.60625Z" fill="#191B24"/>
            </svg>
            Hair
          </a>

          {/* Nails */}
          <a href="#" className="sa-category-btn">
            <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 15V10.5H1.8C1.3 10.5 0.875 10.325 0.525 9.975C0.175 9.625 0 9.2 0 8.7C0 8.3375 0.1 8.00313 0.3 7.69688C0.5 7.39062 0.7625 7.1625 1.0875 7.0125L6 4.8375V4.35C5.55 4.1875 5.1875 3.91562 4.9125 3.53437C4.6375 3.15313 4.5 2.725 4.5 2.25C4.5 1.625 4.71875 1.09375 5.15625 0.65625C5.59375 0.21875 6.125 0 6.75 0C7.375 0 7.90625 0.21875 8.34375 0.65625C8.78125 1.09375 9 1.625 9 2.25H7.5C7.5 2.0375 7.42813 1.85938 7.28438 1.71563C7.14062 1.57188 6.9625 1.5 6.75 1.5C6.5375 1.5 6.35938 1.57188 6.21562 1.71563C6.07187 1.85938 6 2.0375 6 2.25C6 2.4625 6.07187 2.64062 6.21562 2.78437C6.35938 2.92812 6.5375 3 6.75 3C6.9625 3 7.14062 3.07188 7.28438 3.21563C7.42813 3.35938 7.5 3.5375 7.5 3.75V4.8375L12.4125 7.0125C12.7375 7.1625 13 7.39062 13.2 7.69688C13.4 8.00313 13.5 8.3375 13.5 8.7C13.5 9.2 13.325 9.625 12.975 9.975C12.625 10.325 12.2 10.5 11.7 10.5H10.5V15H3ZM1.8 9H3V8.25H10.5V9H11.7C11.7875 9 11.8594 8.96875 11.9156 8.90625C11.9719 8.84375 12 8.7625 12 8.6625C12 8.6 11.9844 8.54688 11.9531 8.50313C11.9219 8.45938 11.875 8.425 11.8125 8.4L6.75 6.15L1.6875 8.4C1.625 8.425 1.57812 8.45938 1.54688 8.50313C1.51562 8.54688 1.5 8.6 1.5 8.6625C1.5 8.7625 1.52813 8.84375 1.58438 8.90625C1.64062 8.96875 1.7125 9 1.8 9ZM4.5 13.5H9V9.75H4.5V13.5Z" fill="#191B24"/>
            </svg>
            Nails
          </a>

          {/* Restaurant */}
          <a href="#" className="sa-category-btn">
            <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2.25 15V8.1375C1.6125 7.9625 1.07812 7.6125 0.646875 7.0875C0.215625 6.5625 0 5.95 0 5.25V0H1.5V5.25H2.25V0H3.75V5.25H4.5V0H6V5.25C6 5.95 5.78438 6.5625 5.35313 7.0875C4.92188 7.6125 4.3875 7.9625 3.75 8.1375V15H2.25ZM9.75 15V9H7.5V3.75C7.5 2.7125 7.86563 1.82812 8.59688 1.09687C9.32812 0.365625 10.2125 0 11.25 0V15H9.75Z" fill="#191B24"/>
            </svg>
            Restaurant
          </a>

          {/* Tutor */}
          <a href="#" className="sa-category-btn">
            <svg width="17" height="14" viewBox="0 0 17 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.25 13.5L3 10.65V6.15L0 4.5L8.25 0L16.5 4.5V10.5H15V5.325L13.5 6.15V10.65L8.25 13.5ZM8.25 7.275L13.3875 4.5L8.25 1.725L3.1125 4.5L8.25 7.275ZM8.25 11.7937L12 9.76875V6.9375L8.25 9L4.5 6.9375V9.76875L8.25 11.7937Z" fill="#191B24"/>
            </svg>
            Tutor
          </a>

          {/* Spa */}
          <a href="#" className="sa-category-btn">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7.5 15C6.5875 14.8875 5.68125 14.6406 4.78125 14.2594C3.88125 13.8781 3.07812 13.3312 2.37188 12.6187C1.66563 11.9062 1.09375 11.0062 0.65625 9.91875C0.21875 8.83125 0 7.525 0 6V5.25H0.75C1.3875 5.25 2.04375 5.33125 2.71875 5.49375C3.39375 5.65625 4.025 5.9 4.6125 6.225C4.7625 5.15 5.10313 4.04688 5.63438 2.91563C6.16563 1.78438 6.7875 0.8125 7.5 0C8.2125 0.8125 8.83438 1.78438 9.36563 2.91563C9.89688 4.04688 10.2375 5.15 10.3875 6.225C10.975 5.9 11.6062 5.65625 12.2812 5.49375C12.9563 5.33125 13.6125 5.25 14.25 5.25H15V6C15 7.525 14.7812 8.83125 14.3438 9.91875C13.9062 11.0062 13.3344 11.9062 12.6281 12.6187C11.9219 13.3312 11.1219 13.8781 10.2281 14.2594C9.33437 14.6406 8.425 14.8875 7.5 15Z" fill="#191B24"/>
            </svg>
            Spa
          </a>

          {/* Fitness */}
          <a href="#" className="sa-category-btn">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.475 14.85L7.425 13.8L10.0875 11.1375L3.7125 4.7625L1.05 7.425L0 6.375L1.05 5.2875L0 4.2375L1.575 2.6625L0.525 1.575L1.575 0.525L2.6625 1.575L4.2375 0L5.2875 1.05L6.375 0L7.425 1.05L4.7625 3.7125L11.1375 10.0875L13.8 7.425L14.85 8.475L13.8 9.5625L14.85 10.6125L13.275 12.1875L14.325 13.275L13.275 14.325L12.1875 13.275L10.6125 14.85L9.5625 13.8L8.475 14.85Z" fill="#191B24"/>
            </svg>
            Fitness
          </a>
        </div>
      </div>

      {/* ── FEATURED DESTINATIONS ── */}
      <section className="sa-featured">
        <div className="sa-featured-inner">
          <div className="sa-section-header">
            <div className="sa-section-title-group">
              <h2 className="sa-section-heading">Featured Destinations</h2>
              <p className="sa-section-subtext">
                The most sought-after experts across the Sovereign<br />
                network, vetted for quality and consistency.
              </p>
            </div>
            <a href="#" className="sa-view-all-btn">View All Businesses</a>
          </div>

          <div className="sa-cards-grid">
            {/* Card 1 — Iron & Taper Studio */}
            <div className="sa-business-card">
              <div className="sa-card-image-wrap">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/d508ac7f547631f26d8bd728c36d889f72ae660e?width=764"
                  alt="Iron & Taper Studio"
                />
                <span className="sa-card-badge sa-card-badge-green">Open Now</span>
              </div>
              <div className="sa-card-body">
                <div className="sa-card-name-row">
                  <h3 className="sa-card-name">Iron &amp; Taper Studio</h3>
                  <span className="sa-card-rating">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.9125 9.5L2.725 5.9875L0 3.625L3.6 3.3125L5 0L6.4 3.3125L10 3.625L7.275 5.9875L8.0875 9.5L5 7.6375L1.9125 9.5Z" fill="#0B1C30"/>
                    </svg>
                    4.9
                  </span>
                </div>
                <div className="sa-card-location">
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.66667 5.83333C4.9875 5.83333 5.26215 5.7191 5.49062 5.49062C5.7191 5.26215 5.83333 4.9875 5.83333 4.66667C5.83333 4.34583 5.7191 4.07118 5.49062 3.84271C5.26215 3.61424 4.9875 3.5 4.66667 3.5C4.34583 3.5 4.07118 3.61424 3.84271 3.84271C3.61424 4.07118 3.5 4.34583 3.5 4.66667C3.5 4.9875 3.61424 5.26215 3.84271 5.49062C4.07118 5.7191 4.34583 5.83333 4.66667 5.83333ZM4.66667 10.1208C5.85278 9.03194 6.73264 8.04271 7.30625 7.15312C7.87986 6.26354 8.16667 5.47361 8.16667 4.78333C8.16667 3.72361 7.82882 2.8559 7.15312 2.18021C6.47743 1.50451 5.64861 1.16667 4.66667 1.16667C3.68472 1.16667 2.8559 1.50451 2.18021 2.18021C1.50451 2.8559 1.16667 3.72361 1.16667 4.78333C1.16667 5.47361 1.45347 6.26354 2.02708 7.15312C2.60069 8.04271 3.48056 9.03194 4.66667 10.1208ZM4.66667 11.6667C3.10139 10.3347 1.93229 9.09757 1.15937 7.95521C0.386458 6.81285 0 5.75556 0 4.78333C0 3.325 0.469097 2.16319 1.40729 1.29792C2.34549 0.432639 3.43194 0 4.66667 0C5.90139 0 6.98785 0.432639 7.92604 1.29792C8.86424 2.16319 9.33333 3.325 9.33333 4.78333C9.33333 5.75556 8.94688 6.81285 8.17396 7.95521C7.40104 9.09757 6.23194 10.3347 4.66667 11.6667Z" fill="#45464D"/>
                  </svg>
                  London, UK
                </div>
                <div className="sa-card-divider" />
                <div className="sa-card-pricing-row">
                  <span className="sa-card-label">Investment</span>
                  <span className="sa-card-price">Starting from £35</span>
                </div>
              </div>
            </div>

            {/* Card 2 — The Core Alignment */}
            <div className="sa-business-card">
              <div className="sa-card-image-wrap">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/e7ab092d1192ceaa63c643f8c9b5ffca8c505cef?width=764"
                  alt="The Core Alignment"
                />
                <span className="sa-card-badge sa-card-badge-green">Open Now</span>
              </div>
              <div className="sa-card-body">
                <div className="sa-card-name-row">
                  <h3 className="sa-card-name">The Core Alignment</h3>
                  <span className="sa-card-rating">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.9125 9.5L2.725 5.9875L0 3.625L3.6 3.3125L5 0L6.4 3.3125L10 3.625L7.275 5.9875L8.0875 9.5L5 7.6375L1.9125 9.5Z" fill="#0B1C30"/>
                    </svg>
                    5.0
                  </span>
                </div>
                <div className="sa-card-location">
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.66667 5.83333C4.9875 5.83333 5.26215 5.7191 5.49062 5.49062C5.7191 5.26215 5.83333 4.9875 5.83333 4.66667C5.83333 4.34583 5.7191 4.07118 5.49062 3.84271C5.26215 3.61424 4.9875 3.5 4.66667 3.5C4.34583 3.5 4.07118 3.61424 3.84271 3.84271C3.61424 4.07118 3.5 4.34583 3.5 4.66667C3.5 4.9875 3.61424 5.26215 3.84271 5.49062C4.07118 5.7191 4.34583 5.83333 4.66667 5.83333ZM4.66667 10.1208C5.85278 9.03194 6.73264 8.04271 7.30625 7.15312C7.87986 6.26354 8.16667 5.47361 8.16667 4.78333C8.16667 3.72361 7.82882 2.8559 7.15312 2.18021C6.47743 1.50451 5.64861 1.16667 4.66667 1.16667C3.68472 1.16667 2.8559 1.50451 2.18021 2.18021C1.50451 2.8559 1.16667 3.72361 1.16667 4.78333C1.16667 5.47361 1.45347 6.26354 2.02708 7.15312C2.60069 8.04271 3.48056 9.03194 4.66667 10.1208ZM4.66667 11.6667C3.10139 10.3347 1.93229 9.09757 1.15937 7.95521C0.386458 6.81285 0 5.75556 0 4.78333C0 3.325 0.469097 2.16319 1.40729 1.29792C2.34549 0.432639 3.43194 0 4.66667 0C5.90139 0 6.98785 0.432639 7.92604 1.29792C8.86424 2.16319 9.33333 3.325 9.33333 4.78333C9.33333 5.75556 8.94688 6.81285 8.17396 7.95521C7.40104 9.09757 6.23194 10.3347 4.66667 11.6667Z" fill="#45464D"/>
                  </svg>
                  Manchester, UK
                </div>
                <div className="sa-card-divider" />
                <div className="sa-card-pricing-row">
                  <span className="sa-card-label">Investment</span>
                  <span className="sa-card-price">Starting from £60</span>
                </div>
              </div>
            </div>

            {/* Card 3 — Lumina Wellness */}
            <div className="sa-business-card">
              <div className="sa-card-image-wrap">
                <img
                  src="https://api.builder.io/api/v1/image/assets/TEMP/a6d0450add48b3844ecd97a59f50a2d889bb3aec?width=764"
                  alt="Lumina Wellness"
                />
                <span className="sa-card-badge sa-card-badge-dark">Booked Today</span>
              </div>
              <div className="sa-card-body">
                <div className="sa-card-name-row">
                  <h3 className="sa-card-name">Lumina Wellness</h3>
                  <span className="sa-card-rating">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.9125 9.5L2.725 5.9875L0 3.625L3.6 3.3125L5 0L6.4 3.3125L10 3.625L7.275 5.9875L8.0875 9.5L5 7.6375L1.9125 9.5Z" fill="#0B1C30"/>
                    </svg>
                    4.8
                  </span>
                </div>
                <div className="sa-card-location">
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4.66667 5.83333C4.9875 5.83333 5.26215 5.7191 5.49062 5.49062C5.7191 5.26215 5.83333 4.9875 5.83333 4.66667C5.83333 4.34583 5.7191 4.07118 5.49062 3.84271C5.26215 3.61424 4.9875 3.5 4.66667 3.5C4.34583 3.5 4.07118 3.61424 3.84271 3.84271C3.61424 4.07118 3.5 4.34583 3.5 4.66667C3.5 4.9875 3.61424 5.26215 3.84271 5.49062C4.07118 5.7191 4.34583 5.83333 4.66667 5.83333ZM4.66667 10.1208C5.85278 9.03194 6.73264 8.04271 7.30625 7.15312C7.87986 6.26354 8.16667 5.47361 8.16667 4.78333C8.16667 3.72361 7.82882 2.8559 7.15312 2.18021C6.47743 1.50451 5.64861 1.16667 4.66667 1.16667C3.68472 1.16667 2.8559 1.50451 2.18021 2.18021C1.50451 2.8559 1.16667 3.72361 1.16667 4.78333C1.16667 5.47361 1.45347 6.26354 2.02708 7.15312C2.60069 8.04271 3.48056 9.03194 4.66667 10.1208ZM4.66667 11.6667C3.10139 10.3347 1.93229 9.09757 1.15937 7.95521C0.386458 6.81285 0 5.75556 0 4.78333C0 3.325 0.469097 2.16319 1.40729 1.29792C2.34549 0.432639 3.43194 0 4.66667 0C5.90139 0 6.98785 0.432639 7.92604 1.29792C8.86424 2.16319 9.33333 3.325 9.33333 4.78333C9.33333 5.75556 8.94688 6.81285 8.17396 7.95521C7.40104 9.09757 6.23194 10.3347 4.66667 11.6667Z" fill="#45464D"/>
                  </svg>
                  Edinburgh, UK
                </div>
                <div className="sa-card-divider" />
                <div className="sa-card-pricing-row">
                  <span className="sa-card-label">Investment</span>
                  <span className="sa-card-price">Starting from £85</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="sa-how-it-works">
        <div className="sa-how-inner">
          <div className="sa-how-header">
            <p className="sa-section-eyebrow">The Workflow</p>
            <h2 className="sa-how-heading">Architecture of a Booking</h2>
          </div>

          <div className="sa-steps-grid">
            {/* Step 1 */}
            <div className="sa-step">
              <span className="sa-step-number">01</span>
              <div className="sa-step-icon">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.5 14.5L12.5 12.5L14.5 5.5L7.5 7.5L5.5 14.5ZM10 11.5C9.58333 11.5 9.22917 11.3542 8.9375 11.0625C8.64583 10.7708 8.5 10.4167 8.5 10C8.5 9.58333 8.64583 9.22917 8.9375 8.9375C9.22917 8.64583 9.58333 8.5 10 8.5C10.4167 8.5 10.7708 8.64583 11.0625 8.9375C11.3542 9.22917 11.5 9.58333 11.5 10C11.5 10.4167 11.3542 10.7708 11.0625 11.0625C10.7708 11.3542 10.4167 11.5 10 11.5ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2167 18 14.1042 17.2208 15.6625 15.6625C17.2208 14.1042 18 12.2167 18 10C18 7.78333 17.2208 5.89583 15.6625 4.3375C14.1042 2.77917 12.2167 2 10 2C7.78333 2 5.89583 2.77917 4.3375 4.3375C2.77917 5.89583 2 7.78333 2 10C2 12.2167 2.77917 14.1042 4.3375 15.6625C5.89583 17.2208 7.78333 18 10 18Z" fill="white"/>
                </svg>
              </div>
              <h3 className="sa-step-title">Discover</h3>
              <p className="sa-step-description">
                Browse elite service providers filtered by location, rating, and real-time availability. Our engine cross-references millions of data points to find your match.
              </p>
            </div>

            {/* Step 2 */}
            <div className="sa-step">
              <span className="sa-step-number">02</span>
              <div className="sa-step-icon">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 18V12H10V14H18V16H10V18H8ZM0 16V14H6V16H0ZM4 12V10H0V8H4V6H6V12H4ZM8 10V8H18V10H8ZM12 6V0H14V2H18V4H14V6H12ZM0 4V2H10V4H0Z" fill="white"/>
                </svg>
              </div>
              <h3 className="sa-step-title">Customise</h3>
              <p className="sa-step-description">
                Select your specific service, choose your preferred staff member, and allocate physical resources with granular precision. Your booking, your rules.
              </p>
            </div>

            {/* Step 3 */}
            <div className="sa-step">
              <span className="sa-step-number">03</span>
              <div className="sa-step-icon">
                <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 9C12.1667 9 11.4583 8.70833 10.875 8.125C10.2917 7.54167 10 6.83333 10 6C10 5.16667 10.2917 4.45833 10.875 3.875C11.4583 3.29167 12.1667 3 13 3C13.8333 3 14.5417 3.29167 15.125 3.875C15.7083 4.45833 16 5.16667 16 6C16 6.83333 15.7083 7.54167 15.125 8.125C14.5417 8.70833 13.8333 9 13 9ZM6 12C5.45 12 4.97917 11.8042 4.5875 11.4125C4.19583 11.0208 4 10.55 4 10V2C4 1.45 4.19583 0.979167 4.5875 0.5875C4.97917 0.195833 5.45 0 6 0H20C20.55 0 21.0208 0.195833 21.4125 0.5875C21.8042 0.979167 22 1.45 22 2V10C22 10.55 21.8042 11.0208 21.4125 11.4125C21.0208 11.8042 20.55 12 20 12H6ZM8 10H18C18 9.45 18.1958 8.97917 18.5875 8.5875C18.9792 8.19583 19.45 8 20 8V4C19.45 4 18.9792 3.80417 18.5875 3.4125C18.1958 3.02083 18 2.55 18 2H8C8 2.55 7.80417 3.02083 7.4125 3.4125C7.02083 3.80417 6.55 4 6 4V8C6.55 8 7.02083 8.19583 7.4125 8.5875C7.80417 8.97917 8 9.45 8 10ZM19 16H2C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V3H2V14H19V16Z" fill="white"/>
                </svg>
              </div>
              <h3 className="sa-step-title">Secure Pay</h3>
              <p className="sa-step-description">
                Finalise with confidence via Stripe or PayPal. Enterprise-grade encryption ensures your transaction is handled with sovereign security protocols.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOR BUSINESS / SAAS PITCH ── */}
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
              <div className="sa-feature-item">
                <div className="sa-feature-check">
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.85 6.0125L0 3.1625L0.7125 2.45L2.85 4.5875L7.4375 0L8.15 0.7125L2.85 6.0125Z" fill="white"/>
                  </svg>
                </div>
                <div className="sa-feature-text">
                  <h4 className="sa-feature-title">Automated Payouts</h4>
                  <p className="sa-feature-desc">Global split-payments across multiple sub-entities and staff members instantly.</p>
                </div>
              </div>

              <div className="sa-feature-item">
                <div className="sa-feature-check">
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.85 6.0125L0 3.1625L0.7125 2.45L2.85 4.5875L7.4375 0L8.15 0.7125L2.85 6.0125Z" fill="white"/>
                  </svg>
                </div>
                <div className="sa-feature-text">
                  <h4 className="sa-feature-title">Resource Management</h4>
                  <p className="sa-feature-desc">Track equipment, rooms, and staff capacity to prevent double-bookings automatically.</p>
                </div>
              </div>

              <div className="sa-feature-item">
                <div className="sa-feature-check">
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.85 6.0125L0 3.1625L0.7125 2.45L2.85 4.5875L7.4375 0L8.15 0.7125L2.85 6.0125Z" fill="white"/>
                  </svg>
                </div>
                <div className="sa-feature-text">
                  <h4 className="sa-feature-title">Flexible Plans</h4>
                  <p className="sa-feature-desc">Architect-grade dashboards for both enterprise chains and solo practitioners.</p>
                </div>
              </div>
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
                <div className="sa-bar-fill" style={{ width: '76%' }} />
              </div>
              <div className="sa-bar-track">
                <div className="sa-bar-fill" style={{ width: '46%' }} />
              </div>
              <div className="sa-bar-track">
                <div className="sa-bar-fill" style={{ width: '91%' }} />
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

      {/* ── VOICES FROM THE GRID (Testimonials) ── */}
      <section className="sa-testimonials">
        <div className="sa-testimonials-inner">
          <div className="sa-testimonials-header">
            <h2 className="sa-testimonials-heading">Voices from the Grid</h2>
            <div className="sa-testimonial-nav">
              <button className="sa-nav-arrow" aria-label="Previous">
                <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 14L0 7L7 0L8.4 1.4L3.825 6H20V8H3.825L8.425 12.6L7 14Z" fill="#0B1C30"/>
                </svg>
              </button>
              <button className="sa-nav-arrow" aria-label="Next">
                <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 14L11.575 12.6L16.175 8H0V6H16.175L11.6 1.4L13 0L20 7L13 14Z" fill="#0B1C30"/>
                </svg>
              </button>
            </div>
          </div>

          <div className="sa-reviews-grid">
            {/* Review 1 */}
            <div className="sa-review-card">
              <div className="sa-stars">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.23125 11.0833L3.17917 6.98542L0 4.22917L4.2 3.86458L5.83333 0L7.46667 3.86458L11.6667 4.22917L8.4875 6.98542L9.43542 11.0833L5.83333 8.91042L2.23125 11.0833Z" fill="black"/>
                  </svg>
                ))}
              </div>
              <p className="sa-review-quote">
                &ldquo;The most precise booking system I&apos;ve ever encountered. Managing 12 locations across London used to be a nightmare until I found Sovereign Architect.&rdquo;
              </p>
              <div className="sa-review-footer">
                <div className="sa-reviewer">
                  <div className="sa-reviewer-avatar">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/TEMP/b1300631cb29f01d963d09791de71f8683dafad9?width=80"
                      alt="Marcus T."
                    />
                  </div>
                  <div>
                    <p className="sa-reviewer-name">Marcus T.</p>
                    <p className="sa-reviewer-role">Enterprise Owner</p>
                  </div>
                </div>
                <span className="sa-verified-badge">
                  <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.16667 8.75L2.375 7.41667L0.875 7.08333L1.02083 5.54167L0 4.375L1.02083 3.20833L0.875 1.66667L2.375 1.33333L3.16667 0L4.58333 0.604167L6 0L6.79167 1.33333L8.29167 1.66667L8.14583 3.20833L9.16667 4.375L8.14583 5.54167L8.29167 7.08333L6.79167 7.41667L6 8.75L4.58333 8.14583L3.16667 8.75Z" fill="#065F46"/>
                  </svg>
                  Verified Booking
                </span>
              </div>
            </div>

            {/* Review 2 */}
            <div className="sa-review-card">
              <div className="sa-stars">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.23125 11.0833L3.17917 6.98542L0 4.22917L4.2 3.86458L5.83333 0L7.46667 3.86458L11.6667 4.22917L8.4875 6.98542L9.43542 11.0833L5.83333 8.91042L2.23125 11.0833Z" fill="black"/>
                  </svg>
                ))}
              </div>
              <p className="sa-review-quote">
                &ldquo;I love how I can see the exact staff member&apos;s profile and reviews before I commit. The interface is stunningly simple to navigate.&rdquo;
              </p>
              <div className="sa-review-footer">
                <div className="sa-reviewer">
                  <div className="sa-reviewer-avatar">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/TEMP/9983a564b8c383cdb8949630f0f164ead3fcfe4f?width=80"
                      alt="Sarah Jenkins"
                    />
                  </div>
                  <div>
                    <p className="sa-reviewer-name">Sarah Jenkins</p>
                    <p className="sa-reviewer-role">Power User</p>
                  </div>
                </div>
                <span className="sa-verified-badge">
                  <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.16667 8.75L2.375 7.41667L0.875 7.08333L1.02083 5.54167L0 4.375L1.02083 3.20833L0.875 1.66667L2.375 1.33333L3.16667 0L4.58333 0.604167L6 0L6.79167 1.33333L8.29167 1.66667L8.14583 3.20833L9.16667 4.375L8.14583 5.54167L8.29167 7.08333L6.79167 7.41667L6 8.75L4.58333 8.14583L3.16667 8.75Z" fill="#065F46"/>
                  </svg>
                  Verified Booking
                </span>
              </div>
            </div>

            {/* Review 3 */}
            <div className="sa-review-card">
              <div className="sa-stars">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.23125 11.0833L3.17917 6.98542L0 4.22917L4.2 3.86458L5.83333 0L7.46667 3.86458L11.6667 4.22917L8.4875 6.98542L9.43542 11.0833L5.83333 8.91042L2.23125 11.0833Z" fill="black"/>
                  </svg>
                ))}
              </div>
              <p className="sa-review-quote">
                &ldquo;The Stripe integration is flawless. I never have to worry about payment security or staff commission calculation anymore.&rdquo;
              </p>
              <div className="sa-review-footer">
                <div className="sa-reviewer">
                  <div className="sa-reviewer-avatar">
                    <img
                      src="https://api.builder.io/api/v1/image/assets/TEMP/8c088a9c7625c7b54fff538728cdcf1186f08f9d?width=80"
                      alt="David Chen"
                    />
                  </div>
                  <div>
                    <p className="sa-reviewer-name">David Chen</p>
                    <p className="sa-reviewer-role">Studio Director</p>
                  </div>
                </div>
                <span className="sa-verified-badge">
                  <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3.16667 8.75L2.375 7.41667L0.875 7.08333L1.02083 5.54167L0 4.375L1.02083 3.20833L0.875 1.66667L2.375 1.33333L3.16667 0L4.58333 0.604167L6 0L6.79167 1.33333L8.29167 1.66667L8.14583 3.20833L9.16667 4.375L8.14583 5.54167L8.29167 7.08333L6.79167 7.41667L6 8.75L4.58333 8.14583L3.16667 8.75Z" fill="#065F46"/>
                  </svg>
                  Verified Booking
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="sa-footer">
        <div className="sa-footer-inner">
          <div className="sa-footer-grid">
            {/* Brand */}
            <div>
              <a href="/" className="sa-footer-brand-name">MyBookins</a>
              <p className="sa-footer-brand-desc">
                The definitive multi-tenant engine for service-based businesses who value precision, density, and professional aesthetics.
              </p>
            </div>

            {/* Platform */}
            <div>
              <p className="sa-footer-col-title">Platform</p>
              <a href="#" className="sa-footer-link">Discover</a>
              <a href="#" className="sa-footer-link">Pricing</a>
              <a href="#" className="sa-footer-link">API Docs</a>
            </div>

            {/* Business */}
            <div>
              <p className="sa-footer-col-title">Business</p>
              <a href="#" className="sa-footer-link">Register</a>
              <a href="#" className="sa-footer-link">Admin Login</a>
              <a href="#" className="sa-footer-link">Support</a>
            </div>

            {/* Legal */}
            <div>
              <p className="sa-footer-col-title">Legal</p>
              <a href="#" className="sa-footer-link">Privacy Policy</a>
              <a href="#" className="sa-footer-link">Terms of Service</a>
            </div>

            {/* Social */}
            <div>
              <p className="sa-footer-col-title">Social</p>
              <a href="#" className="sa-footer-link">Twitter</a>
              <a href="#" className="sa-footer-link">LinkedIn</a>
              <div className="sa-footer-social-icons">
                {/* Twitter icon */}
                <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.3538 0H17.0913L11.0663 6.84422L18.1663 16H12.6038L8.23253 10.4066L3.23503 16H0.495026L6.93503 8.67617L0.128906 0H5.83003L9.79003 5.11245L14.3538 0ZM13.4063 14.3784H14.9213L4.95878 1.55183H3.33128L13.4063 14.3784Z" fill="#94A3B8"/>
                </svg>
                {/* Shield icon */}
                <svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8 20C5.68333 19.4167 3.77083 18.0875 2.2625 16.0125C0.754167 13.9375 0 11.6333 0 9.1V3L8 0L16 3V9.1C16 11.6333 15.2458 13.9375 13.7375 16.0125C12.2292 18.0875 10.3167 19.4167 8 20Z" fill="#94A3B8"/>
                </svg>
                {/* Lock icon */}
                <svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2 21C1.45 21 0.979167 20.8042 0.5875 20.4125C0.195833 20.0208 0 19.55 0 19V9C0 8.45 0.195833 7.97917 0.5875 7.5875C0.979167 7.19583 1.45 7 2 7H3V5C3 3.61667 3.4875 2.4375 4.4625 1.4625C5.4375 0.4875 6.61667 0 8 0C9.38333 0 10.5625 0.4875 11.5375 1.4625C12.5125 2.4375 13 3.61667 13 5V7H14C14.55 7 15.0208 7.19583 15.4125 7.5875C15.8042 7.97917 16 8.45 16 9V19C16 19.55 15.8042 20.0208 15.4125 20.4125C15.0208 20.8042 14.55 21 14 21H2ZM8 16C8.55 16 9.02083 15.8042 9.4125 15.4125C9.80417 15.0208 10 14.55 10 14C10 13.45 9.80417 12.9792 9.4125 12.5875C9.02083 12.1958 8.55 12 8 12C7.45 12 6.97917 12.1958 6.5875 12.5875C6.19583 12.9792 6 13.45 6 14C6 14.55 6.19583 15.0208 6.5875 15.4125C6.97917 15.8042 7.45 16 8 16ZM5 7H11V5C11 4.16667 10.7083 3.45833 10.125 2.875C9.54167 2.29167 8.83333 2 8 2C7.16667 2 6.45833 2.29167 5.875 2.875C5.29167 3.45833 5 4.16667 5 5V7Z" fill="#94A3B8"/>
                </svg>
              </div>
            </div>
          </div>

          <div className="sa-footer-bottom">
            <p className="sa-footer-copyright">
              &copy; 2024 Sovereign Architect. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
