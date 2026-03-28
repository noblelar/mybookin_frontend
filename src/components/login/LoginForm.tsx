'use client'

import { useState } from 'react'

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2045C17.64 8.5664 17.5827 7.9527 17.4764 7.3636H9V10.845H13.8436C13.635 11.97 13.0009 12.9232 12.0477 13.5613V15.8195H14.9564C16.6582 14.2527 17.64 11.9455 17.64 9.2045Z" fill="#4285F4"/>
    <path d="M9 18C11.43 18 13.4673 17.1941 14.9564 15.8195L12.0477 13.5613C11.2418 14.1013 10.2109 14.4204 9 14.4204C6.65591 14.4204 4.67182 12.8372 3.96409 10.71H0.957275V13.0418C2.43818 15.9832 5.48182 18 9 18Z" fill="#34A853"/>
    <path d="M3.96409 10.71C3.78409 10.17 3.68182 9.5932 3.68182 9C3.68182 8.4068 3.78409 7.83 3.96409 7.29V4.9582H0.957273C0.347727 6.1732 0 7.5477 0 9C0 10.4523 0.347727 11.8268 0.957273 13.0418L3.96409 10.71Z" fill="#FBBC05"/>
    <path d="M9 3.57955C10.3214 3.57955 11.5077 4.03364 12.4405 4.92545L15.0218 2.34409C13.4632 0.891818 11.4259 0 9 0C5.48182 0 2.43818 2.01682 0.957275 4.95818L3.96409 7.29C4.67182 5.16273 6.65591 3.57955 9 3.57955Z" fill="#EA4335"/>
  </svg>
)

const AppleIcon = () => (
  <svg width="16" height="18" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13.1714 9.5614C13.1564 7.9314 13.8564 6.6914 15.2714 5.7814C14.4664 4.6414 13.2414 4.0164 11.6264 3.9014C10.0964 3.7914 8.4264 4.8114 7.8164 4.8114C7.1714 4.8114 5.6864 3.9414 4.5264 3.9414C2.1264 3.9764 -0.123596 5.8514 -0.123596 9.6814C-0.123596 10.8314 0.0914043 12.0214 0.521404 13.2514C1.1064 14.8664 3.1064 18.6464 5.1914 18.5864C6.2764 18.5614 7.0514 17.8264 8.4564 17.8264C9.8214 17.8264 10.5364 18.5864 11.7464 18.5864C13.8514 18.5564 15.6664 15.0964 16.2264 13.4764C13.3514 12.0714 13.1714 9.6514 13.1714 9.5614ZM10.7114 2.4514C11.8514 1.0914 11.7464 -0.148596 11.7114 -0.598596C10.6964 -0.538596 9.5164 0.111404 8.8414 0.921404C8.0964 1.7914 7.6564 2.8714 7.7564 4.0564C8.8564 4.1414 9.8514 3.5514 10.7114 2.4514Z" fill="#191B24"/>
  </svg>
)

const EyeOpenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12C2.73 16.39 7 19.5 12 19.5C17 19.5 21.27 16.39 23 12C21.27 7.61 17 4.5 12 4.5ZM12 17C9.24 17 7 14.76 7 12C7 9.24 9.24 7 12 7C14.76 7 17 9.24 17 12C17 14.76 14.76 17 12 17ZM12 9C10.34 9 9 10.34 9 12C9 13.66 10.34 15 12 15C13.66 15 15 13.66 15 12C15 10.34 13.66 9 12 9Z" fill="currentColor"/>
  </svg>
)

const EyeClosedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 7C14.76 7 17 9.24 17 12C17 12.65 16.87 13.26 16.64 13.83L19.56 16.75C21.07 15.49 22.26 13.86 22.99 12C21.26 7.61 16.99 4.5 11.99 4.5C10.59 4.5 9.25 4.75 8.01 5.2L10.17 7.36C10.74 7.13 11.35 7 12 7ZM2 4.27L4.28 6.55L4.74 7.01C3.08 8.3 1.78 10.02 1 12C2.73 16.39 7 19.5 12 19.5C13.55 19.5 15.03 19.2 16.38 18.66L16.8 19.08L19.73 22L21 20.73L3.27 3L2 4.27ZM7.53 9.8L9.08 11.35C9.03 11.56 9 11.78 9 12C9 13.66 10.34 15 12 15C12.22 15 12.44 14.97 12.65 14.92L14.2 16.47C13.53 16.8 12.79 17 12 17C9.24 17 7 14.76 7 12C7 11.21 7.2 10.47 7.53 9.8ZM11.84 9.02L14.99 12.17L15.01 12.01C15.01 10.35 13.67 9.01 12.01 9.01L11.84 9.02Z" fill="currentColor"/>
  </svg>
)

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Heading */}
      <div className="flex flex-col gap-2">
        <h2 className="font-manrope text-3xl font-extrabold text-[#0B1C30] tracking-[-0.5px]">
          Welcome Back
        </h2>
        <p className="font-inter text-sm font-normal text-[#64748B]">
          Access your architectural dashboard and tenant metrics.
        </p>
      </div>

      {/* Social Auth */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          className="flex items-center justify-center gap-3 w-full py-3 px-4 border border-[rgba(198,198,205,0.50)] font-inter text-sm font-medium text-[#0B1C30] hover:bg-[#F8F9FF] transition-colors"
        >
          <GoogleIcon />
          Continue with Google
        </button>
        <button
          type="button"
          className="flex items-center justify-center gap-3 w-full py-3 px-4 border border-[rgba(198,198,205,0.50)] font-inter text-sm font-medium text-[#0B1C30] hover:bg-[#F8F9FF] transition-colors"
        >
          <AppleIcon />
          Continue with Apple
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-[rgba(198,198,205,0.40)]" />
        <span className="font-inter text-[10px] font-black uppercase tracking-[1.4px] text-[#76777D]">
          Or Sign In With Email
        </span>
        <div className="flex-1 h-px bg-[rgba(198,198,205,0.40)]" />
      </div>

      {/* Email + Password */}
      <div className="flex flex-col gap-4">
        {/* Email */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="login-email"
            className="font-inter text-[10px] font-black uppercase tracking-[1.2px] text-[#0B1C30]"
          >
            Email Address
          </label>
          <input
            id="login-email"
            type="email"
            placeholder="e.g., alex@email.com"
            className="w-full font-inter text-sm font-medium text-[#0B1C30] placeholder:text-[#A0A3AB] bg-white border border-[rgba(198,198,205,0.40)] px-4 py-3.5 outline-none focus:border-[#0B1C30] transition-colors"
          />
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="font-inter text-[10px] font-black uppercase tracking-[1.2px] text-[#0B1C30]"
            >
              Password
            </label>
            <a
              href="#"
              className="font-inter text-xs font-bold text-[#0B1C30] hover:underline"
            >
              Forgot Password?
            </a>
          </div>
          <div className="relative flex items-center border border-[rgba(198,198,205,0.40)] bg-white focus-within:border-[#0B1C30] transition-colors">
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              defaultValue="••••••••"
              className="flex-1 font-inter text-sm font-medium text-[#0B1C30] placeholder:text-[#A0A3AB] bg-transparent px-4 py-3.5 outline-none pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 text-[#76777D] hover:text-[#0B1C30] transition-colors"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Sign In CTA */}
      <button
        type="submit"
        className="w-full font-inter text-sm font-black uppercase tracking-[1.4px] text-white bg-black py-4 hover:bg-gray-900 transition-colors shadow-lg"
      >
        Sign In
      </button>

      {/* Sign Up Link */}
      <p className="font-inter text-sm font-normal text-[#64748B] text-center">
        New to MyBookins?{' '}
        <a
          href="/register"
          className="font-bold text-[#0B1C30] hover:underline"
        >
          Sign Up
        </a>
      </p>
    </div>
  )
}
