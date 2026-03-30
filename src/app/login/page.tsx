import LoginHeroPanel from '@/components/login/LoginHeroPanel'
import LoginForm from '@/components/login/LoginForm'
import LoginFooter from '@/components/login/LoginFooter'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left — Hero Panel (hidden on mobile, shown md+) */}
      <div className="hidden md:flex md:w-1/2 lg:w-[52%] flex-shrink-0">
        <LoginHeroPanel />
      </div>

      {/* Right — Auth Panel */}
      <div className="flex-1 flex flex-col bg-white min-h-screen md:min-h-0">
        {/* Scrollable form area */}
        <div className="flex-1 flex flex-col justify-between px-6 sm:px-10 lg:px-16 py-12 overflow-y-auto">
          <div className="w-full max-w-[420px] mx-auto flex flex-col gap-8">
            <LoginForm />
            <LoginFooter />
          </div>
        </div>
      </div>
    </div>
  )
}
