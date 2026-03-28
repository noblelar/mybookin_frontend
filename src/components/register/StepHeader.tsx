interface StepHeaderProps {
  currentStep: number
  totalSteps: number
  title: string
  percentComplete: number
}

export default function StepHeader({
  currentStep,
  totalSteps,
  title,
  percentComplete,
}: StepHeaderProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Step indicator */}
      <p className="font-inter text-[10px] font-black uppercase tracking-[2px] text-[#76777D]">
        Step {String(currentStep).padStart(2, '0')} /{' '}
        {String(totalSteps).padStart(2, '0')}
      </p>

      {/* Title + Percent row */}
      <div className="flex items-end justify-between gap-4">
        <h1 className="font-manrope text-3xl md:text-[40px] font-extrabold text-[#0B1C30] leading-none tracking-[-2px]">
          {title}
        </h1>
        <span className="font-inter text-xs font-black uppercase tracking-[1.2px] text-[#76777D] whitespace-nowrap pb-1">
          {percentComplete}% Complete
        </span>
      </div>

      {/* Progress bar */}
      <div className="flex gap-1 w-full">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className="h-[3px] flex-1 transition-colors duration-300"
            style={{
              background:
                i < currentStep
                  ? '#0B1C30'
                  : i === currentStep
                  ? '#CBD5E1'
                  : '#E2E8F0',
            }}
          />
        ))}
      </div>
    </div>
  )
}
