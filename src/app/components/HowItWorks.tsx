import {
  DiscoverStepIcon,
  CustomiseStepIcon,
  SecurePayStepIcon,
} from "@/app/icons"

interface Step {
  number: string
  title: string
  description: string
  icon: React.ComponentType
}

const steps: Step[] = [
  {
    number: "01",
    title: "Discover",
    description:
      "Browse elite service providers filtered by location, rating, and real-time availability. Our engine cross-references millions of data points to find your match.",
    icon: DiscoverStepIcon,
  },
  {
    number: "02",
    title: "Customise",
    description:
      "Select your specific service, choose your preferred staff member, and allocate physical resources with granular precision. Your booking, your rules.",
    icon: CustomiseStepIcon,
  },
  {
    number: "03",
    title: "Secure Pay",
    description:
      "Finalise with confidence via Stripe or PayPal. Enterprise-grade encryption ensures your transaction is handled with sovereign security protocols.",
    icon: SecurePayStepIcon,
  },
]

export default function HowItWorks() {
  return (
    <section className="sa-how-it-works">
      <div className="sa-how-inner">
        <div className="sa-how-header">
          <p className="sa-section-eyebrow">The Workflow</p>
          <h2 className="sa-how-heading">Architecture of a Booking</h2>
        </div>

        <div className="sa-steps-grid">
          {steps.map((step) => {
            const IconComponent = step.icon
            return (
              <div key={step.number} className="sa-step">
                <span className="sa-step-number">{step.number}</span>
                <div className="sa-step-icon">
                  <IconComponent />
                </div>
                <h3 className="sa-step-title">{step.title}</h3>
                <p className="sa-step-description">{step.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
