import BusinessCard from "./BusinessCard"

const destinations = [
  {
    name: "Iron & Taper Studio",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/d508ac7f547631f26d8bd728c36d889f72ae660e?width=764",
    badge: "Open Now",
    badgeStyle: "green" as const,
    rating: 4.9,
    location: "London, UK",
    price: "Starting from £35",
  },
  {
    name: "The Core Alignment",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/e7ab092d1192ceaa63c643f8c9b5ffca8c505cef?width=764",
    badge: "Open Now",
    badgeStyle: "green" as const,
    rating: 5.0,
    location: "Manchester, UK",
    price: "Starting from £60",
  },
  {
    name: "Lumina Wellness",
    image: "https://api.builder.io/api/v1/image/assets/TEMP/a6d0450add48b3844ecd97a59f50a2d889bb3aec?width=764",
    badge: "Booked Today",
    badgeStyle: "dark" as const,
    rating: 4.8,
    location: "Edinburgh, UK",
    price: "Starting from £85",
  },
]

export default function FeaturedDestinations() {
  return (
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
          {destinations.map((dest) => (
            <BusinessCard key={dest.name} {...dest} />
          ))}
        </div>
      </div>
    </section>
  )
}
