const features = [
  {
    title: 'Automated Payouts',
    description:
      'Global split-payments across multiple sub-entities and staff members instantly.',
  },
  {
    title: 'Resource Management',
    description:
      'Track equipment, rooms, and staff capacity to prevent double-bookings automatically.',
  },
  {
    title: 'Flexible Plans',
    description:
      'Architect-grade dashboards for both enterprise chains and solo practitioners.',
  },
]

export default function BusinessSection() {
  return (
    <section
      className="w-full overflow-hidden"
      style={{
        background: '#000',
        paddingTop: '48px',
        paddingBottom: '48px',
      }}
    >
      <div
        className="mx-auto px-4 md:px-6 flex flex-col md:flex-row md:items-center gap-8 md:gap-16"
        style={{ maxWidth: '1280px' }}
      >
        {/* Left Side */}
        <div className="flex flex-col gap-8 flex-1">
          {/* Heading */}
          <h2
            className="font-manrope font-extrabold text-white"
            style={{
              fontSize: 'clamp(28px, 5vw, 48px)',
              lineHeight: '1.2',
              letterSpacing: '-2.4px',
            }}
          >
            Master Your Domain.
            <br />
            Scale Your Business.
          </h2>

          {/* Description */}
          <div style={{ maxWidth: '512px', opacity: 0.8 }}>
            <p
              className="font-inter font-medium text-sm md:text-lg"
              style={{ color: '#DAE2FD', lineHeight: '1.6' }}
            >
              The MyBookins platform provides more than just a calendar. It's a
              full-stack command center for multi-tenant resource management.
            </p>
          </div>

          {/* Features List */}
          <div className="flex flex-col gap-6 py-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-4">
                {/* Checkmark Circle */}
                <div className="flex-shrink-0 pt-1">
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '12px',
                      border: '1px solid #BEC6E0',
                    }}
                  >
                    <svg
                      width="9"
                      height="7"
                      viewBox="0 0 9 7"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M2.85 6.0125L0 3.1625L0.7125 2.45L2.85 4.5875L7.4375 0L8.15 0.7125L2.85 6.0125Z"
                        fill="white"
                      />
                    </svg>
                  </div>
                </div>

                {/* Feature Content */}
                <div className="flex flex-col gap-1">
                  <h4
                    className="font-inter font-bold text-white"
                    style={{ fontSize: '18px', lineHeight: '28px' }}
                  >
                    {feature.title}
                  </h4>
                  <p
                    className="font-inter font-normal text-sm text-white"
                    style={{ opacity: 0.6, lineHeight: '20px' }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button
            className="font-inter font-black text-sm uppercase text-black hover:bg-gray-100 transition-colors w-fit"
            style={{
              background: '#FFF',
              padding: '20px 40px',
              letterSpacing: '2.8px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            Register Your Business
          </button>
        </div>

        {/* Right Side — Dashboard Preview */}
        <div className="flex-1">
          <div
            className="flex flex-col gap-8 p-8"
            style={{
              background: '#FFF',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* Revenue Monitor Header */}
            <div
              className="flex justify-between items-center pb-4"
              style={{ borderBottom: '1px solid rgba(198, 198, 205, 0.20)' }}
            >
              <span
                className="font-inter font-black text-[10px] uppercase"
                style={{ color: '#0B1C30', letterSpacing: '1px' }}
              >
                Revenue Monitor
              </span>
              <span
                className="font-inter font-bold text-xs"
                style={{ color: '#059669' }}
              >
                +14.2% This Week
              </span>
            </div>

            {/* Progress Bars */}
            <div className="flex flex-col gap-4">
              {/* Bar 1 — ~75% */}
              <div
                className="h-8 relative"
                style={{ background: '#EFF4FF' }}
              >
                <div
                  className="absolute left-0 top-0 h-full"
                  style={{ width: '75%', background: '#000' }}
                />
              </div>
              {/* Bar 2 — ~45% */}
              <div
                className="h-8 relative"
                style={{ background: '#EFF4FF' }}
              >
                <div
                  className="absolute left-0 top-0 h-full"
                  style={{ width: '45%', background: '#000' }}
                />
              </div>
              {/* Bar 3 — ~90% */}
              <div
                className="h-8 relative"
                style={{ background: '#EFF4FF' }}
              >
                <div
                  className="absolute left-0 top-0 h-full"
                  style={{ width: '90%', background: '#000' }}
                />
              </div>
            </div>

            {/* Stats Row */}
            <div
              className="grid grid-cols-2 gap-4 pt-4"
              style={{ borderTop: '1px solid rgba(198, 198, 205, 0.20)' }}
            >
              <div className="flex flex-col gap-1">
                <span
                  className="font-inter font-black text-[10px] uppercase"
                  style={{ color: '#76777D', letterSpacing: '1px' }}
                >
                  Active Now
                </span>
                <span
                  className="font-manrope font-bold text-2xl"
                  style={{ color: '#0B1C30' }}
                >
                  24/25
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span
                  className="font-inter font-black text-[10px] uppercase"
                  style={{ color: '#76777D', letterSpacing: '1px' }}
                >
                  Revenue Online
                </span>
                <span
                  className="font-manrope font-bold text-2xl"
                  style={{ color: '#0B1C30' }}
                >
                  £12,400
                </span>
              </div>
            </div>

            {/* Navigation Arrows */}
            <div className="flex gap-2">
              <button
                className="flex items-center justify-center"
                style={{
                  width: '48px',
                  height: '48px',
                  border: '1px solid rgba(198, 198, 205, 0.30)',
                }}
              >
                <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 14L0 7L7 0L8.4 1.4L3.825 6H20V8H3.825L8.425 12.6L7 14Z" fill="#0B1C30"/>
                </svg>
              </button>
              <button
                className="flex items-center justify-center"
                style={{
                  width: '48px',
                  height: '48px',
                  border: '1px solid rgba(198, 198, 205, 0.30)',
                }}
              >
                <svg width="20" height="14" viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13 14L11.575 12.6L16.175 8H0V6H16.175L11.6 1.4L13 0L20 7L13 14Z" fill="#0B1C30"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
