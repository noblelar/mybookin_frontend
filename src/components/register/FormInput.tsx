import type { ChangeEventHandler } from 'react'

interface FormInputProps {
  label: string
  type?: string
  placeholder?: string
  id: string
  name?: string
  value?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
  autoComplete?: string
  required?: boolean
  error?: string
  disabled?: boolean
}

export default function FormInput({
  label,
  type = 'text',
  placeholder,
  id,
  name,
  value,
  onChange,
  autoComplete,
  required = false,
  error,
  disabled = false,
}: FormInputProps) {
  return (
    <div className="flex flex-col gap-2 w-full">
      <label
        htmlFor={id}
        className="font-inter text-[10px] font-black uppercase tracking-[1.2px] text-[#0B1C30]"
      >
        {label}
      </label>
      <input
        id={id}
        name={name ?? id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        aria-invalid={Boolean(error)}
        className={`w-full font-inter text-sm font-medium text-[#0B1C30] placeholder:text-[#A0A3AB] bg-white border px-4 py-3.5 outline-none transition-colors ${
          error
            ? 'border-red-300 focus:border-red-500'
            : 'border-[rgba(198,198,205,0.40)] focus:border-[#0B1C30]'
        } ${disabled ? 'cursor-not-allowed opacity-60' : ''}`}
      />
      {error ? (
        <p className="font-inter text-xs font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  )
}
