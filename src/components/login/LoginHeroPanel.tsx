const stats = [
  { value: '12.4k', label: 'Managed Assets' },
  { value: '99.9%', label: 'System Uptime' },
]

const ShieldIcon = () => (
  <svg
    width="14"
    height="16"
    viewBox="0 0 14 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7 16C4.9 14.9333 3.20833 13.4083 1.925 11.425C0.641667 9.44167 0 7.3 0 5V2L7 0L14 2V5C14 7.3 13.3583 9.44167 12.075 11.425C10.7917 13.4083 9.1 14.9333 7 16Z"
      fill="white"
    />
  </svg>
)

export default function LoginHeroPanel() {
  return (
    <div className="relative flex flex-col justify-between min-h-[300px] md:min-h-screen bg-[#0B1C30] overflow-hidden">
      {/* Background building image with dark overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url('https://api.builder.io/api/v1/image/assets/TEMP/f2aa736095396c625377fa3822964fee02b028e5?width=943')`,
        }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-[#0B1C30]/75" />

      {/* Subtle dot-grid texture overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(198,198,205,0.6) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-between h-full p-8 md:p-12 lg:p-16 min-h-[inherit]">
        {/* Logo badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-sm border border-white/20 w-fit">
          <ShieldIcon />
          <span className="font-inter text-sm font-bold text-white uppercase tracking-[0.5px]">
            MyBookins
          </span>
        </div>

        {/* Main content */}
        <div className="flex flex-col gap-6 mt-auto">
          <h1 className="font-manrope font-extrabold text-white leading-tight tracking-[-1.5px] text-3xl md:text-4xl lg:text-5xl">
            Design your destiny
            <br />
            with mathematical
            <br />
            precision.
          </h1>

          <p className="font-inter text-sm md:text-base font-normal text-white/70 leading-relaxed max-w-sm">
            The platform for multi-tenant property management and structural
            business scaling. Built for those who demand authority over their
            data.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-10 pt-4 border-t border-white/15">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col gap-1">
                <span className="font-manrope text-2xl md:text-3xl font-extrabold text-white leading-none">
                  {stat.value}
                </span>
                <span className="font-inter text-[10px] font-black uppercase tracking-[1.5px] text-white/50">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
