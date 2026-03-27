import { CheckmarkIcon } from './icons'

const features = [
  {
    title: 'Automated Payouts',
    description: 'Global split-payments across multiple sub-entities and staff members instantly.',
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
    <section className="w-full py-24 px-6 bg-navy overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 gap-16 items-center">
          {/* Left Side */}
          <div className="flex flex-col gap-8">
            {/* Heading */}
            <h2 className="font-manrope text-5xl font-bold text-white leading-tight">
              Master Your Domain.
              <br />
              Scale Your Business.
            </h2>

            {/* Description */}
            <p className="text-sm leading-relaxed opacity-80">
              The MyBookins platform provides more than just a calendar. It's a
              full-stack command center for multi-tenant resource management.
            </p>

            {/* Features */}
            <div className="flex flex-col gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex gap-4 items-start">
                  {/* Checkmark */}
                  <div className="flex-shrink-0 w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center mt-1">
                    <CheckmarkIcon />
                  </div>

                  {/* Content */}
                  <div className="flex flex-col gap-1">
                    <h4 className="text-white font-bold text-lg">
                      {feature.title}
                    </h4>
                    <p className="text-sm opacity-60">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Button */}
            <button className="bg-white text-navy font-black text-sm uppercase tracking-wider py-5 px-10 rounded hover:bg-gray-100 transition-colors w-fit">
              Register Your Business
            </button>
          </div>

          {/* Right Side - Dashboard Preview */}
          <div className="flex flex-col gap-8">
            {/* Revenue Monitor Card */}
            <div className="border border-white/10 bg-white backdrop-blur rounded p-8">
              {/* Header */}
              <div className="flex justify-between items-center pb-4 border-b border-border-subtle mb-6">
                <span className="text-navy text-xs font-black uppercase tracking-wider">
                  Revenue Monitor
                </span>
                <span className="text-green text-xs font-bold">
                  +14.2% This Week
                </span>
              </div>

              {/* Progress Bars */}
              <div className="flex flex-col gap-4">
                <div className="h-8 bg-blue-light rounded overflow-hidden">
                  <div className="h-full w-3/4 bg-navy"></div>
                </div>
                <div className="h-8 bg-blue-light rounded overflow-hidden">
                  <div className="h-full w-1/2 bg-navy"></div>
                </div>
                <div className="h-8 bg-blue-light rounded overflow-hidden">
                  <div className="h-full w-5/6 bg-navy"></div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-border-subtle">
                <button className="w-12 h-12 flex items-center justify-center text-navy hover:bg-blue-light rounded transition-colors">
                  <svg
                    width="20"
                    height="16"
                    viewBox="0 0 20 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M7 14L0 7L7 0L8.4 1.4L3.825 6H20V8H3.825L8.425 12.6L7 14Z"
                      fill="currentColor"
                    />
                  </svg>
                </button>
                <button className="w-12 h-12 flex items-center justify-center text-navy hover:bg-blue-light rounded transition-colors">
                  <svg
                    width="20"
                    height="16"
                    viewBox="0 0 20 16"
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
          </div>
        </div>
      </div>
    </section>
  )
}
