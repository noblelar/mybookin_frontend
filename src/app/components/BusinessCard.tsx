import { StarIcon, LocationIcon } from "@/app/icons"

interface BusinessCardProps {
  name: string
  image: string
  badge: string
  badgeStyle: "green" | "dark"
  rating: number
  location: string
  price: string
}

export default function BusinessCard({
  name,
  image,
  badge,
  badgeStyle,
  rating,
  location,
  price,
}: BusinessCardProps) {
  const badgeClass =
    badgeStyle === "green" ? "sa-card-badge-green" : "sa-card-badge-dark"

  return (
    <div className="sa-business-card">
      <div className="sa-card-image-wrap">
        <img src={image} alt={name} />
        <span className={`sa-card-badge ${badgeClass}`}>{badge}</span>
      </div>
      <div className="sa-card-body">
        <div className="sa-card-name-row">
          <h3 className="sa-card-name">{name}</h3>
          <span className="sa-card-rating">
            <StarIcon />
            {rating}
          </span>
        </div>
        <div className="sa-card-location">
          <LocationIcon />
          {location}
        </div>
        <div className="sa-card-divider" />
        <div className="sa-card-pricing-row">
          <span className="sa-card-label">Investment</span>
          <span className="sa-card-price">{price}</span>
        </div>
      </div>
    </div>
  )
}
