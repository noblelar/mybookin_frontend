const LockIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 8H17V6C17 3.24 14.76 1 12 1C9.24 1 7 3.24 7 6V8H6C4.9 8 4 8.9 4 10V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V10C20 8.9 19.1 8 18 8ZM12 17C10.9 17 10 16.1 10 15C10 13.9 10.9 13 12 13C13.1 13 14 13.9 14 15C14 16.1 13.1 17 12 17ZM15.1 8H8.9V6C8.9 4.29 10.29 2.9 12 2.9C13.71 2.9 15.1 4.29 15.1 6V8Z"
      fill="white"
    />
  </svg>
)

const slides = [
  {
    icon: <LockIcon />,
    title: 'Architectural Security Protocols',
    description:
      'Your account is encrypted with bank-grade security standards. Every interaction is logged and protected within your sovereign tenant space.',
  },
  {
    icon: <LockIcon />,
    title: 'Zero-Knowledge Architecture',
    description:
      'We never store unencrypted data. Your credentials are hashed using industry-leading standards, ensuring absolute sovereignty over your information.',
  },
  {
    icon: <LockIcon />,
    title: 'Multi-Factor Authentication',
    description:
      'Add an extra layer of protection with MFA. Biometric, TOTP, and hardware key support included in every plan at no extra cost.',
  },
]

interface SecurityInfoCardProps {
  activeSlide?: number
}

export default function SecurityInfoCard({ activeSlide = 0 }: SecurityInfoCardProps) {
  const slide = slides[activeSlide] ?? slides[0]

  return (
    <div className="flex flex-col justify-between h-full bg-[#EFF4FF] p-8 md:p-10">
      {/* Content */}
      <div className="flex flex-col gap-5 flex-1 justify-center">
        {/* Icon */}
        <div className="flex items-center justify-center w-14 h-14 bg-black flex-shrink-0">
          {slide.icon}
        </div>

        {/* Title */}
        <h3 className="font-manrope text-xl md:text-2xl font-extrabold text-[#0B1C30] leading-tight tracking-[-0.6px]">
          {slide.title}
        </h3>

        {/* Description */}
        <p className="font-inter text-sm font-normal text-[#45464D] leading-relaxed">
          {slide.description}
        </p>
      </div>

      {/* Pagination dots */}
      <div className="flex items-center gap-2 pt-8">
        {slides.map((_, i) => (
          <div
            key={i}
            className="rounded-full transition-all duration-300"
            style={{
              width: i === activeSlide ? '8px' : '8px',
              height: '8px',
              background: i === activeSlide ? '#0B1C30' : 'rgba(11,28,48,0.25)',
            }}
          />
        ))}
      </div>
    </div>
  )
}
