import FormInput from './FormInput'
import PasswordInput from './PasswordInput'
import SocialAuthButton from './SocialAuthButton'

export default function AccountDetailsForm() {
  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Name row */}
      <div className="flex flex-col sm:flex-row gap-4">
        <FormInput
          id="first-name"
          label="First Name"
          placeholder="e.g. Julian"
        />
        <FormInput
          id="last-name"
          label="Last Name"
          placeholder="e.g. Vane"
        />
      </div>

      {/* Email */}
      <FormInput
        id="email"
        label="Email Address"
        type="email"
        placeholder="julian.vane@architect.com"
      />

      {/* Password */}
      <PasswordInput
        id="password"
        label="Create Password"
        placeholder="Min. 12 characters"
      />

      {/* CTA */}
      <button
        type="submit"
        className="w-full font-inter text-sm font-black uppercase tracking-[1.4px] text-white bg-black py-4 hover:bg-gray-900 transition-colors shadow-xl"
      >
        Initialize Account
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-[rgba(198,198,205,0.40)]" />
        <span className="font-inter text-[10px] font-black uppercase tracking-[1.4px] text-[#76777D]">
          Or Continue With
        </span>
        <div className="flex-1 h-px bg-[rgba(198,198,205,0.40)]" />
      </div>

      {/* Social Buttons */}
      <div className="flex gap-3">
        <SocialAuthButton provider="google" />
        <SocialAuthButton provider="apple" />
      </div>
    </div>
  )
}
