'use client'

import { useState, type FormEvent } from 'react'

import { getSocialProviderLabel, type SocialProvider } from '@/lib/firebase-client'

type SocialProfileCompletionCardProps = {
  provider: SocialProvider
  disabled?: boolean
  onSubmit: (firstName: string, lastName: string) => void | Promise<void>
  onCancel?: () => void
}

export default function SocialProfileCompletionCard({
  provider,
  disabled = false,
  onSubmit,
  onCancel,
}: SocialProfileCompletionCardProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')

  const providerLabel = getSocialProviderLabel(provider)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    await onSubmit(firstName, lastName)
  }

  return (
    <div className="rounded-2xl border border-[rgba(11,28,48,0.12)] bg-[#F8FAFC] p-5">
      <div className="flex flex-col gap-2">
        <h3 className="font-manrope text-lg font-extrabold text-[#0B1C30]">
          Finish your {providerLabel} sign-in
        </h3>
        <p className="font-inter text-sm text-[#64748B]">
          {providerLabel} did not send us your full name. Add it once so we can create your
          MyBookIns profile correctly.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-2">
            <span className="font-inter text-[10px] font-black uppercase tracking-[1.2px] text-[#0B1C30]">
              First Name
            </span>
            <input
              type="text"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              disabled={disabled}
              className={`w-full border border-[rgba(198,198,205,0.50)] bg-white px-4 py-3 text-sm font-medium text-[#0B1C30] outline-none transition-colors focus:border-[#0B1C30] ${
                disabled ? 'cursor-not-allowed opacity-60' : ''
              }`}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="font-inter text-[10px] font-black uppercase tracking-[1.2px] text-[#0B1C30]">
              Last Name
            </span>
            <input
              type="text"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              disabled={disabled}
              className={`w-full border border-[rgba(198,198,205,0.50)] bg-white px-4 py-3 text-sm font-medium text-[#0B1C30] outline-none transition-colors focus:border-[#0B1C30] ${
                disabled ? 'cursor-not-allowed opacity-60' : ''
              }`}
            />
          </label>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="submit"
            disabled={disabled}
            className={`flex-1 px-4 py-3 text-sm font-black uppercase tracking-[1.2px] text-white transition-colors ${
              disabled ? 'cursor-not-allowed bg-slate-500' : 'bg-black hover:bg-gray-900'
            }`}
          >
            {disabled ? 'Finishing...' : `Continue With ${providerLabel}`}
          </button>
          {onCancel ? (
            <button
              type="button"
              onClick={onCancel}
              disabled={disabled}
              className={`px-4 py-3 text-sm font-bold uppercase tracking-[1.2px] text-[#0B1C30] transition-colors ${
                disabled
                  ? 'cursor-not-allowed opacity-60'
                  : 'border border-[rgba(198,198,205,0.50)] bg-white hover:bg-slate-50'
              }`}
            >
              Cancel
            </button>
          ) : null}
        </div>
      </form>
    </div>
  )
}
