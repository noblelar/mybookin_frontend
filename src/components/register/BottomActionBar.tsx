const SaveIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M17 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V7L17 3ZM12 19C10.34 19 9 17.66 9 16C9 14.34 10.34 13 12 13C13.66 13 15 14.34 15 16C15 17.66 13.66 19 12 19ZM15 9H5V5H15V9Z"
      fill="#64748B"
    />
  </svg>
)

const ExitIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
      fill="#64748B"
    />
  </svg>
)

export default function BottomActionBar() {
  return (
    <div className="w-full border-t border-[rgba(226,232,240,0.70)] bg-white sticky bottom-0 z-40">
      <div className="flex items-center justify-center gap-12 py-3">
        <button
          type="button"
          className="flex flex-col items-center gap-1 group"
        >
          <SaveIcon />
          <span className="font-inter text-[10px] font-medium uppercase tracking-[0.8px] text-[#64748B] group-hover:text-[#0B1C30] transition-colors">
            Save Draft
          </span>
        </button>

        <button
          type="button"
          className="flex flex-col items-center gap-1 group"
        >
          <ExitIcon />
          <span className="font-inter text-[10px] font-medium uppercase tracking-[0.8px] text-[#64748B] group-hover:text-[#0B1C30] transition-colors">
            Exit Flow
          </span>
        </button>
      </div>
    </div>
  )
}
