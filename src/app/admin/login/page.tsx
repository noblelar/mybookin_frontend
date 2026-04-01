import AdminLoginForm from '@/components/login/AdminLoginForm'
import LoginFooter from '@/components/login/LoginFooter'

const ShieldIcon = () => (
  <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M7 16C4.9 14.9333 3.20833 13.4083 1.925 11.425C0.641667 9.44167 0 7.3 0 5V2L7 0L14 2V5C14 7.3 13.3583 9.44167 12.075 11.425C10.7917 13.4083 9.1 14.9333 7 16Z"
      fill="white"
    />
  </svg>
)

const adminStats = [
  { value: 'Invite Only', label: 'Admin Access' },
  { value: 'CLI Rooted', label: 'Super Admins' },
]

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 lg:w-[52%] flex-shrink-0">
        <div className="relative flex min-h-[300px] md:min-h-screen flex-col justify-between overflow-hidden bg-[#0B1C30]">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-[#0B1C30]/80" />
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                'radial-gradient(circle, rgba(198,198,205,0.6) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />

          <div className="relative z-10 flex h-full min-h-[inherit] flex-col justify-between p-8 md:p-12 lg:p-16">
            <div className="inline-flex w-fit items-center gap-2 border border-white/20 bg-white/15 px-4 py-2 backdrop-blur-sm">
              <ShieldIcon />
              <span className="font-inter text-sm font-bold uppercase tracking-[0.5px] text-white">
                MyBookIns Admin
              </span>
            </div>

            <div className="mt-auto flex flex-col gap-6">
              <h1 className="font-manrope text-3xl font-extrabold leading-tight tracking-[-1.5px] text-white md:text-4xl lg:text-5xl">
                Operate the platform
                <br />
                with deliberate,
                <br />
                elevated control.
              </h1>

              <p className="max-w-sm font-inter text-sm font-normal leading-relaxed text-white/70 md:text-base">
                Dedicated access for platform admins and super admins managing business approval,
                trust, and operational oversight across MyBookIns.
              </p>

              <div className="flex items-center gap-10 border-t border-white/15 pt-4">
                {adminStats.map((stat) => (
                  <div key={stat.label} className="flex flex-col gap-1">
                    <span className="font-manrope text-2xl font-extrabold leading-none text-white md:text-3xl">
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
      </div>

      <div className="flex flex-1 min-h-screen flex-col bg-white md:min-h-0">
        <div className="flex flex-1 flex-col justify-between overflow-y-auto px-6 py-12 sm:px-10 lg:px-16">
          <div className="mx-auto flex w-full max-w-[420px] flex-col gap-8">
            <AdminLoginForm />
            <LoginFooter />
          </div>
        </div>
      </div>
    </div>
  )
}
