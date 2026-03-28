'use client'

import { useState } from 'react'

type AlertVariant = 'error' | 'warning' | 'info' | 'success'

interface LoginAlertBannerProps {
  variant?: AlertVariant
  title: string
  message: string
  dismissible?: boolean
}

const variantStyles: Record<AlertVariant, { bg: string; border: string; icon: string; titleColor: string; msgColor: string }> = {
  error: {
    bg: 'bg-red-50',
    border: 'border-l-4 border-red-500',
    icon: 'text-red-500',
    titleColor: 'text-red-800',
    msgColor: 'text-red-700',
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-l-4 border-amber-500',
    icon: 'text-amber-500',
    titleColor: 'text-amber-800',
    msgColor: 'text-amber-700',
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-l-4 border-blue-500',
    icon: 'text-blue-500',
    titleColor: 'text-blue-800',
    msgColor: 'text-blue-700',
  },
  success: {
    bg: 'bg-green-50',
    border: 'border-l-4 border-green-500',
    icon: 'text-green-500',
    titleColor: 'text-green-800',
    msgColor: 'text-green-700',
  },
}

const AlertCircleIcon = ({ className }: { className?: string }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-1-7v2h2v-2h-2zm0-8v6h2V7h-2z"
      fill="currentColor"
    />
  </svg>
)

const CloseIcon = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
      fill="currentColor"
    />
  </svg>
)

export default function LoginAlertBanner({
  variant = 'error',
  title,
  message,
  dismissible = true,
}: LoginAlertBannerProps) {
  const [visible, setVisible] = useState(true)
  const styles = variantStyles[variant]

  if (!visible) return null

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 ${styles.bg} ${styles.border}`}
      role="alert"
    >
      <AlertCircleIcon className={`flex-shrink-0 mt-0.5 ${styles.icon}`} />

      <div className="flex-1 min-w-0">
        <p className={`font-inter text-sm font-bold ${styles.titleColor}`}>
          {title}
        </p>
        <p className={`font-inter text-sm font-normal mt-0.5 ${styles.msgColor}`}>
          {message}
        </p>
      </div>

      {dismissible && (
        <button
          onClick={() => setVisible(false)}
          className={`flex-shrink-0 ${styles.icon} hover:opacity-70 transition-opacity`}
          aria-label="Dismiss"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  )
}
