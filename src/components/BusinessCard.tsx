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
  return (
    <div
      className="flex flex-col overflow-hidden"
      style={{
        background: '#FFF',
        border: '1px solid rgba(198, 198, 205, 0.10)',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      }}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden" style={{ height: '256px' }}>
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        {/* Status Badge */}
        <div
          className="absolute top-4 left-4 px-2 py-1"
          style={{
            background:
              badgeStyle === 'green'
                ? '#059669'
                : 'rgba(0, 0, 0, 0.40)',
            backdropFilter: badgeStyle === 'dark' ? 'blur(4px)' : undefined,
          }}
        >
          <span
            className="font-inter text-[10px] font-bold uppercase text-white block"
            style={{ letterSpacing: '1px' }}
          >
            {badge}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="flex flex-col gap-2 p-6">
        {/* Title & Rating Row */}
        <div className="flex justify-between items-start gap-2">
          <h3
            className="font-manrope font-bold"
            style={{
              fontSize: '20px',
              color: '#0B1C30',
              lineHeight: '28px',
              letterSpacing: '-0.5px',
            }}
          >
            {name}
          </h3>
          {/* Rating Badge */}
          <div
            className="flex items-center gap-1 px-2 py-0.5 flex-shrink-0"
            style={{ background: '#DCE9FF' }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1.9125 9.5L2.725 5.9875L0 3.625L3.6 3.3125L5 0L6.4 3.3125L10 3.625L7.275 5.9875L8.0875 9.5L5 7.6375L1.9125 9.5Z"
                fill="#0B1C30"
              />
            </svg>
            <span
              className="font-inter text-xs font-bold"
              style={{ color: '#0B1C30' }}
            >
              {rating}
            </span>
          </div>
        </div>

        {/* Location Row */}
        <div className="flex items-center gap-2 pb-4">
          <svg
            width="10"
            height="12"
            viewBox="0 0 10 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.66667 5.83333C4.9875 5.83333 5.26215 5.7191 5.49062 5.49062C5.7191 5.26215 5.83333 4.9875 5.83333 4.66667C5.83333 4.34583 5.7191 4.07118 5.49062 3.84271C5.26215 3.61424 4.9875 3.5 4.66667 3.5C4.34583 3.5 4.07118 3.61424 3.84271 3.84271C3.61424 4.07118 3.5 4.34583 3.5 4.66667C3.5 4.9875 3.61424 5.26215 3.84271 5.49062C4.07118 5.7191 4.34583 5.83333 4.66667 5.83333ZM4.66667 10.1208C5.85278 9.03194 6.73264 8.04271 7.30625 7.15312C7.87986 6.26354 8.16667 5.47361 8.16667 4.78333C8.16667 3.72361 7.82882 2.8559 7.15312 2.18021C6.47743 1.50451 5.64861 1.16667 4.66667 1.16667C3.68472 1.16667 2.8559 1.50451 2.18021 2.18021C1.50451 2.8559 1.16667 3.72361 1.16667 4.78333C1.16667 5.47361 1.45347 6.26354 2.02708 7.15312C2.60069 8.04271 3.48056 9.03194 4.66667 10.1208ZM4.66667 11.6667C3.10139 10.3347 1.93229 9.09757 1.15937 7.95521C0.386458 6.81285 0 5.75556 0 4.78333C0 3.325 0.469097 2.16319 1.40729 1.29792C2.34549 0.432639 3.43194 0 4.66667 0C5.90139 0 6.98785 0.432639 7.92604 1.29792C8.86424 2.16319 9.33333 3.325 9.33333 4.78333C9.33333 5.75556 8.94688 6.81285 8.17396 7.95521C7.40104 9.09757 6.23194 10.3347 4.66667 11.6667Z"
              fill="#45464D"
            />
          </svg>
          <span
            className="font-inter text-xs font-medium uppercase"
            style={{ color: '#45464D', letterSpacing: '1.2px' }}
          >
            {location}
          </span>
        </div>

        {/* Divider */}
        <div className="h-px w-full" style={{ background: '#EFF4FF' }} />

        {/* Price Row */}
        <div className="flex justify-between items-center pt-2">
          <span
            className="font-inter text-[10px] font-black uppercase"
            style={{ color: '#76777D', letterSpacing: '1px' }}
          >
            Investment
          </span>
          <span
            className="font-inter text-sm font-extrabold"
            style={{ color: '#0B1C30' }}
          >
            {price}
          </span>
        </div>
      </div>
    </div>
  )
}
