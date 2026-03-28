interface FormInputProps {
  label: string
  type?: string
  placeholder?: string
  id: string
}

export default function FormInput({
  label,
  type = 'text',
  placeholder,
  id,
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
        type={type}
        placeholder={placeholder}
        className="w-full font-inter text-sm font-medium text-[#0B1C30] placeholder:text-[#A0A3AB] bg-white border border-[rgba(198,198,205,0.40)] px-4 py-3.5 outline-none focus:border-[#0B1C30] transition-colors"
      />
    </div>
  )
}
