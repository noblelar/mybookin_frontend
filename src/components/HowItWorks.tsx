import {
  DiscoverStepIcon,
  CustomiseStepIcon,
  SecurePayStepIcon,
} from './icons'

const steps = [
  {
    number: '01',
    title: 'Discover',
    description:
      'Browse elite service providers filtered by location, rating, and real-time availability. Our engine cross-references millions of data points to find your match.',
    icon: DiscoverStepIcon,
  },
  {
    number: '02',
    title: 'Customise',
    description:
      'Select your specific service, choose your preferred staff member, and allocate physical resources with granular precision. Your booking, your rules.',
    icon: CustomiseStepIcon,
  },
  {
    number: '03',
    title: 'Secure Pay',
    description:
      'Finalise with confidence via Stripe or PayPal. Enterprise-grade encryption ensures your transaction is handled with sovereign security protocols.',
    icon: SecurePayStepIcon,
  },
]

export default function HowItWorks() {
  return (
    <section className="w-full py-24 px-6 bg-blue-light">
      <div className="max-w-6xl mx-auto flex flex-col gap-20">
        {/* Header */}
        <div className="flex flex-col items-center gap-4">
          <p className="text-border-subtle text-xs font-black uppercase tracking-widest">
            The Workflow
          </p>
          <h2 className="font-manrope text-5xl font-bold text-navy text-center">
            Architecture of a Booking
          </h2>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-3 border border-border-subtle bg-white">
          {steps.map((step, index) => {
            const IconComponent = step.icon
            return (
              <div
                key={index}
                className={`p-12 flex flex-col relative ${
                  index !== steps.length - 1
                    ? 'border-r border-border-subtle'
                    : ''
                }`}
              >
                {/* Background Number */}
                <div className="absolute top-6 right-6 text-blue-light text-6xl font-black">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-12 h-12 bg-navy rounded flex items-center justify-center mb-6 relative z-10">
                  <IconComponent />
                </div>

                {/* Content */}
                <h3 className="font-manrope text-2xl font-bold text-navy mb-6">
                  {step.title}
                </h3>

                <p className="text-body text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
