import { StarIcon, VerifiedCheckIcon } from './icons'

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

export default function Testimonials() {
  return (
    <section className="w-full py-24 px-6 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col gap-12">
        {/* Header with Navigation */}
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-4">
            <p className="text-border-subtle text-xs font-black uppercase tracking-widest">
              Social Proof
            </p>
            <h2 className="font-manrope text-4xl font-bold text-navy">
              Loved by Thousands
            </h2>
          </div>

          {/* Navigation Arrows */}
          <div className="flex gap-4">
            <button className="w-12 h-12 flex items-center justify-center text-navy border border-border-subtle hover:bg-blue-light rounded transition-colors">
              <svg
                width="20"
                height="14"
                viewBox="0 0 20 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 14L0 7L7 0L8.4 1.4L3.825 6H20V8H3.825L8.425 12.6L7 14Z"
                  fill="currentColor"
                />
              </svg>
            </button>
            <button className="w-12 h-12 flex items-center justify-center text-navy border border-border-subtle hover:bg-blue-light rounded transition-colors">
              <svg
                width="20"
                height="14"
                viewBox="0 0 20 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M13 14L11.575 12.6L16.175 8H0V6H16.175L11.6 1.4L13 0L20 7L13 14Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="border border-border-subtle bg-white rounded-lg p-10 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-6"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <svg
                    key={i}
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.23125 11.0833L3.17917 6.98542L0 4.22917L4.2 3.86458L5.83333 0L7.46667 3.86458L11.6667 4.22917L8.4875 6.98542L9.43542 11.0833L5.83333 8.91042L2.23125 11.0833Z"
                      fill="black"
                    />
                  </svg>
                ))}
              </div>

              {/* Quote */}
              <p className="text-navy font-inter text-base leading-relaxed">
                {testimonial.quote}
              </p>

              {/* Author Info */}
              <div className="flex justify-between items-center pt-4 border-t border-border-subtle">
                <div className="flex items-center gap-3">
                  <img
                    src={testimonial.image}
                    alt={testimonial.author}
                    className="w-10 h-10 rounded-lg object-cover"
                  />
                  <div className="flex flex-col">
                    <p className="text-navy font-bold text-sm">
                      {testimonial.author}
                    </p>
                    <p className="text-border-subtle text-xs font-black uppercase tracking-wider">
                      {testimonial.role}
                    </p>
                  </div>
                </div>

                {/* Verified Badge */}
                <div className="flex items-center gap-1 bg-green/20 px-2 py-1 rounded">
                  <VerifiedCheckIcon />
                  <span className="text-green text-xs font-black uppercase tracking-wider">
                    Verified
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
