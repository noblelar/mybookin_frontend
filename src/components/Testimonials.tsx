const testimonials = [
  {
    quote:
      '"The most precise booking system I\'ve ever encountered. Managing 12 locations across London used to be a nightmare until I found MyBookins."',
    author: 'Marcus T.',
    role: 'Enterprise Owner',
    image:
      'https://api.builder.io/api/v1/image/assets/TEMP/b1300631cb29f01d963d09791de71f8683dafad9?width=80',
    rating: 5,
  },
  {
    quote:
      '"I love how I can see the exact staff member\'s profile and reviews before I commit. The interface is stunningly simple to navigate."',
    author: 'Sarah Jenkins',
    role: 'Power User',
    image:
      'https://api.builder.io/api/v1/image/assets/TEMP/9983a564b8c383cdb8949630f0f164ead3fcfe4f?width=80',
    rating: 5,
  },
  {
    quote:
      '"The Stripe integration is flawless. I never have to worry about payment security or staff commission calculation anymore."',
    author: 'David Chen',
    role: 'Studio Director',
    image:
      'https://api.builder.io/api/v1/image/assets/TEMP/8c088a9c7625c7b54fff538728cdcf1186f08f9d?width=80',
    rating: 5,
  },
]

const StarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.23125 11.0833L3.17917 6.98542L0 4.22917L4.2 3.86458L5.83333 0L7.46667 3.86458L11.6667 4.22917L8.4875 6.98542L9.43542 11.0833L5.83333 8.91042L2.23125 11.0833Z" fill="black"/>
  </svg>
)

const VerifiedIcon = () => (
  <svg width="10" height="9" viewBox="0 0 10 9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.16667 8.75L2.375 7.41667L0.875 7.08333L1.02083 5.54167L0 4.375L1.02083 3.20833L0.875 1.66667L2.375 1.33333L3.16667 0L4.58333 0.604167L6 0L6.79167 1.33333L8.29167 1.66667L8.14583 3.20833L9.16667 4.375L8.14583 5.54167L8.29167 7.08333L6.79167 7.41667L6 8.75L4.58333 8.14583L3.16667 8.75ZM3.52083 7.6875L4.58333 7.22917L5.66667 7.6875L6.25 6.6875L7.39583 6.41667L7.29167 5.25L8.0625 4.375L7.29167 3.47917L7.39583 2.3125L6.25 2.0625L5.64583 1.0625L4.58333 1.52083L3.5 1.0625L2.91667 2.0625L1.77083 2.3125L1.875 3.47917L1.10417 4.375L1.875 5.25L1.77083 6.4375L2.91667 6.6875L3.52083 7.6875ZM4.14583 5.85417L6.5 3.5L5.91667 2.89583L4.14583 4.66667L3.25 3.79167L2.66667 4.375L4.14583 5.85417Z" fill="#065F46"/>
  </svg>
)

export default function Testimonials() {
  return (
    <section
      className="w-full"
      style={{
        background: '#F8F9FF',
        paddingTop: '48px',
        paddingBottom: '48px',
      }}
    >
      <div
        className="mx-auto px-4 md:px-6 flex flex-col gap-8 md:gap-12"
        style={{ maxWidth: '1280px' }}
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <h2
            className="font-manrope font-extrabold"
            style={{
              fontSize: 'clamp(24px, 5vw, 36px)',
              color: '#0B1C30',
              letterSpacing: '-1.8px',
              lineHeight: '1.1',
            }}
          >
            Voices from the Grid
          </h2>

          {/* Navigation Arrows - Hidden on mobile */}
          <div className="flex gap-3 hidden md:flex">
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

        {/* Cards Grid */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(300px, 100%), 1fr))',
            gap: '20px',
          }}
        >
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="flex flex-col gap-6 p-10"
              style={{
                background: '#FFF',
                border: '1px solid rgba(198, 198, 205, 0.10)',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              }}
            >
              {/* Stars */}
              <div className="flex items-center gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>

              {/* Quote */}
              <p
                className="font-inter font-medium text-base"
                style={{ color: '#0B1C30', lineHeight: '26px' }}
              >
                {testimonial.quote}
              </p>

              {/* Author Row */}
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className="overflow-hidden flex-shrink-0"
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '12px',
                      background: '#DCE9FF',
                    }}
                  >
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <span
                      className="font-inter font-bold text-sm"
                      style={{ color: '#0B1C30' }}
                    >
                      {testimonial.author}
                    </span>
                    <span
                      className="font-inter font-black text-[10px] uppercase"
                      style={{ color: '#76777D', letterSpacing: '1px' }}
                    >
                      {testimonial.role}
                    </span>
                  </div>
                </div>

                {/* Verified Badge */}
                <div
                  className="flex items-center gap-1 px-2 py-1"
                  style={{ background: '#D1FAE5' }}
                >
                  <VerifiedIcon />
                  <span
                    className="font-inter font-black uppercase"
                    style={{
                      fontSize: '8px',
                      color: '#065F46',
                      letterSpacing: '0.8px',
                    }}
                  >
                    Verified Booking
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
