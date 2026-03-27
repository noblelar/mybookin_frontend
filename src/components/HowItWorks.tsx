const steps = [
  {
    number: '01',
    title: 'Discover',
    description:
      'Browse elite service providers filtered by location, rating, and real-time availability. Our engine cross-references millions of data points to find your match.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5.5 14.5L12.5 12.5L14.5 5.5L7.5 7.5L5.5 14.5ZM10 11.5C9.58333 11.5 9.22917 11.3542 8.9375 11.0625C8.64583 10.7708 8.5 10.4167 8.5 10C8.5 9.58333 8.64583 9.22917 8.9375 8.9375C9.22917 8.64583 9.58333 8.5 10 8.5C10.4167 8.5 10.7708 8.64583 11.0625 8.9375C11.3542 9.22917 11.5 9.58333 11.5 10C11.5 10.4167 11.3542 10.7708 11.0625 11.0625C10.7708 11.3542 10.4167 11.5 10 11.5ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2167 18 14.1042 17.2208 15.6625 15.6625C17.2208 14.1042 18 12.2167 18 10C18 7.78333 17.2208 5.89583 15.6625 4.3375C14.1042 2.77917 12.2167 2 10 2C7.78333 2 5.89583 2.77917 4.3375 4.3375C2.77917 5.89583 2 7.78333 2 10C2 12.2167 2.77917 14.1042 4.3375 15.6625C5.89583 17.2208 7.78333 18 10 18Z" fill="white"/>
      </svg>
    ),
    borderRight: true,
  },
  {
    number: '02',
    title: 'Customise',
    description:
      'Select your specific service, choose your preferred staff member, and allocate physical resources with granular precision. Your booking, your rules.',
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 18V12H10V14H18V16H10V18H8ZM0 16V14H6V16H0ZM4 12V10H0V8H4V6H6V12H4ZM8 10V8H18V10H8ZM12 6V0H14V2H18V4H14V6H12ZM0 4V2H10V4H0Z" fill="white"/>
      </svg>
    ),
    borderRight: true,
  },
  {
    number: '03',
    title: 'Secure Pay',
    description:
      'Finalise with confidence via Stripe or PayPal. Enterprise-grade encryption ensures your transaction is handled with sovereign security protocols.',
    icon: (
      <svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M13 9C12.1667 9 11.4583 8.70833 10.875 8.125C10.2917 7.54167 10 6.83333 10 6C10 5.16667 10.2917 4.45833 10.875 3.875C11.4583 3.29167 12.1667 3 13 3C13.8333 3 14.5417 3.29167 15.125 3.875C15.7083 4.45833 16 5.16667 16 6C16 6.83333 15.7083 7.54167 15.125 8.125C14.5417 8.70833 13.8333 9 13 9ZM6 12C5.45 12 4.97917 11.8042 4.5875 11.4125C4.19583 11.0208 4 10.55 4 10V2C4 1.45 4.19583 0.979167 4.5875 0.5875C4.97917 0.195833 5.45 0 6 0H20C20.55 0 21.0208 0.195833 21.4125 0.5875C21.8042 0.979167 22 1.45 22 2V10C22 10.55 21.8042 11.0208 21.4125 11.4125C21.0208 11.8042 20.55 12 20 12H6ZM8 10H18C18 9.45 18.1958 8.97917 18.5875 8.5875C18.9792 8.19583 19.45 8 20 8V4C19.45 4 18.9792 3.80417 18.5875 3.4125C18.1958 3.02083 18 2.55 18 2H8C8 2.55 7.80417 3.02083 7.4125 3.4125C7.02083 3.80417 6.55 4 6 4V8C6.55 8 7.02083 8.19583 7.4125 8.5875C7.80417 8.97917 8 9.45 8 10ZM19 16H2C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V3H2V14H19V16ZM6 10V2V10Z" fill="white"/>
      </svg>
    ),
    borderRight: false,
  },
]

export default function HowItWorks() {
  return (
    <section
      className="w-full"
      style={{
        background: '#EFF4FF',
        paddingTop: '96px',
        paddingBottom: '96px',
      }}
    >
      <div
        className="mx-auto px-6 flex flex-col gap-20"
        style={{ maxWidth: '1280px' }}
      >
        {/* Header */}
        <div className="flex flex-col items-center gap-4">
          <p
            className="font-inter font-black uppercase text-center"
            style={{
              fontSize: '10px',
              color: '#76777D',
              letterSpacing: '4px',
            }}
          >
            The Workflow
          </p>
          <h2
            className="font-manrope font-extrabold text-center"
            style={{
              fontSize: '48px',
              color: '#0B1C30',
              lineHeight: '48px',
              letterSpacing: '-2.4px',
            }}
          >
            Architecture of a Booking
          </h2>
        </div>

        {/* Steps Grid */}
        <div
          className="grid"
          style={{
            background: '#FFF',
            border: '1px solid rgba(198, 198, 205, 0.20)',
            gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          }}
        >
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col relative p-12"
              style={{
                borderRight: step.borderRight
                  ? '1px solid rgba(198, 198, 205, 0.20)'
                  : undefined,
              }}
            >
              {/* Background Number */}
              <div
                className="absolute font-inter font-black leading-none"
                style={{
                  fontSize: '72px',
                  color: '#DCE9FF',
                  top: '24px',
                  right: '25px',
                }}
              >
                {step.number}
              </div>

              {/* Icon */}
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{
                  width: '48px',
                  height: '48px',
                  background: '#000',
                  marginBottom: '32px',
                }}
              >
                {step.icon}
              </div>

              {/* Title */}
              <h3
                className="font-manrope font-bold"
                style={{
                  fontSize: '24px',
                  color: '#0B1C30',
                  lineHeight: '32px',
                  letterSpacing: '-0.6px',
                  marginBottom: '16px',
                }}
              >
                {step.title}
              </h3>

              {/* Description */}
              <p
                className="font-inter font-normal text-sm"
                style={{ color: '#45464D', lineHeight: '22.75px' }}
              >
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
