import OnboardingNavbar from '@/components/register/OnboardingNavbar'
import AccountDetailsForm from '@/components/register/AccountDetailsForm'
import SecurityInfoCard from '@/components/register/SecurityInfoCard'
import BottomActionBar from '@/components/register/BottomActionBar'

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FF]">
      {/* Top nav */}
      <OnboardingNavbar />

      {/* Main content — grows to fill viewport between nav and bottom bar */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 max-w-[1280px] w-full mx-auto px-4 md:px-6 py-10 md:py-16">
          {/* Two-column layout: form + info card */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 md:gap-6 items-start">
            {/* Left: Account form */}
            <div className="w-full max-w-lg">
              <AccountDetailsForm />
            </div>

            {/* Right: Security info card – hidden on mobile, shown md+ */}
            <div className="hidden md:block w-[240px] lg:w-[280px] self-stretch">
              <SecurityInfoCard activeSlide={0} />
            </div>
          </div>
        </div>
      </main>

      {/* Sticky bottom bar */}
      <BottomActionBar />
    </div>
  )
}
