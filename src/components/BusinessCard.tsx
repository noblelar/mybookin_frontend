import { StarIcon, LocationIcon } from './icons'

interface BusinessCardProps {
  name: string
  image: string
  badge: string
  badgeStyle: 'green' | 'dark'
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
  const badgeClasses =
    badgeStyle === 'green'
      ? 'bg-green text-white'
      : 'bg-black/40 text-white backdrop-blur'

  return (
    <div className="flex flex-col border border-border-subtle bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {/* Image Container */}
      <div className="h-64 overflow-hidden bg-gray-200 relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        {/* Badge */}
        <div
          className={`absolute top-4 left-4 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${badgeClasses}`}
        >
          {badge}
        </div>
        {/* Save Button */}
        <button className="absolute bottom-4 right-4 w-9 h-9 bg-white/90 backdrop-blur rounded shadow-md hover:bg-white transition-colors flex items-center justify-center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10 18.75L2 12.5V5L0 3L10 0L20 3V12.5L10 18.75ZM10 15.75L18 10.5V4L10 1.5L2 4V10.5L10 15.75Z"
              fill="#0B1C30"
            />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-2">
        {/* Title and Rating */}
        <div className="flex justify-between items-start gap-4 mb-2">
          <h3 className="font-manrope text-xl font-bold text-navy leading-tight">
            {name}
          </h3>
          <div className="flex items-center gap-1 bg-blue-light px-2 py-1 rounded whitespace-nowrap">
            <StarIcon />
            <span className="text-navy font-bold text-sm">{rating}</span>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 pb-4 mb-4 border-b border-blue-light">
          <LocationIcon />
          <span className="text-body text-xs font-medium uppercase tracking-wider">
            {location}
          </span>
        </div>

        {/* Price */}
        <div className="flex justify-between items-center">
          <span className="text-border-subtle text-xs font-bold uppercase tracking-wider">
            Investment
          </span>
          <span className="text-navy text-sm font-bold">{price}</span>
        </div>
      </div>
    </div>
  )
}
