import { StarIcon, VerifiedCheckIcon, ArrowLeftIcon, ArrowRightIcon } from "@/app/icons"

interface Review {
  quote: string
  author: string
  role: string
  image: string
}

const reviews: Review[] = [
  {
    quote:
      "The most precise booking system I've ever encountered. Managing 12 locations across London used to be a nightmare until I found MyBookIns.",
    author: "Marcus T.",
    role: "Enterprise Owner",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/b1300631cb29f01d963d09791de71f8683dafad9?width=80",
  },
  {
    quote:
      "I love how I can see the exact staff member's profile and reviews before I commit. The interface is stunningly simple to navigate.",
    author: "Sarah Jenkins",
    role: "Power User",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/9983a564b8c383cdb8949630f0f164ead3fcfe4f?width=80",
  },
  {
    quote:
      "The Stripe integration is flawless. I never have to worry about payment security or staff commission calculation anymore.",
    author: "David Chen",
    role: "Studio Director",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/8c088a9c7625c7b54fff538728cdcf1186f08f9d?width=80",
  },
]

export default function Testimonials() {
  return (
    <section className="sa-testimonials">
      <div className="sa-testimonials-inner">
        <div className="sa-testimonials-header">
          <h2 className="sa-testimonials-heading">Voices from the Grid</h2>
          <div className="sa-testimonial-nav">
            <button className="sa-nav-arrow" aria-label="Previous">
              <ArrowLeftIcon />
            </button>
            <button className="sa-nav-arrow" aria-label="Next">
              <ArrowRightIcon />
            </button>
          </div>
        </div>

        <div className="sa-reviews-grid">
          {reviews.map((review) => (
            <div key={review.author} className="sa-review-card">
              <div className="sa-stars">
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <p className="sa-review-quote">&ldquo;{review.quote}&rdquo;</p>
              <div className="sa-review-footer">
                <div className="sa-reviewer">
                  <div className="sa-reviewer-avatar">
                    <img src={review.image} alt={review.author} />
                  </div>
                  <div>
                    <p className="sa-reviewer-name">{review.author}</p>
                    <p className="sa-reviewer-role">{review.role}</p>
                  </div>
                </div>
                <span className="sa-verified-badge">
                  <VerifiedCheckIcon />
                  Verified Booking
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
