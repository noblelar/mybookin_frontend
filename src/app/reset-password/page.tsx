import LoginFooter from '@/components/login/LoginFooter'
import LoginHeroPanel from '@/components/login/LoginHeroPanel'
import ResetPasswordForm from '@/components/auth/ResetPasswordForm'

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 lg:w-[52%] flex-shrink-0">
        <LoginHeroPanel />
      </div>

      <div className="flex-1 flex flex-col bg-white min-h-screen md:min-h-0">
        <div className="flex-1 flex flex-col justify-between px-6 sm:px-10 lg:px-16 py-12 overflow-y-auto">
          <div className="w-full max-w-[420px] mx-auto flex flex-col gap-8">
            <ResetPasswordForm />
            <LoginFooter />
          </div>
        </div>
      </div>
    </div>
  )
}
