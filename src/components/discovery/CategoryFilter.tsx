'use client'

const formatCategoryLabel = (category: string) => {
  const normalized = category.trim().toUpperCase()
  if (!normalized.length || normalized === 'ALL') return 'All Services'

  return normalized
    .toLowerCase()
    .split('_')
    .map((part) => `${part.slice(0, 1).toUpperCase()}${part.slice(1)}`)
    .join(' ')
}

interface CategoryFilterProps {
  categories: string[]
  activeCategory: string
  onChange: (category: string) => void
}

export default function CategoryFilter({
  categories,
  activeCategory,
  onChange,
}: CategoryFilterProps) {
  const allCategories = ['ALL', ...categories]

  return (
    <div className="border-b border-[rgba(198,198,205,0.2)] bg-white md:bg-[#F8F9FF]">
      <div className="max-w-[1280px] mx-auto px-4 md:px-6 py-3 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-2 min-w-max">
          {allCategories.map((category) => {
            const isActive = activeCategory === category
            const label = formatCategoryLabel(category)
            const mobileLabel = category === 'ALL' ? 'All' : label

            return (
              <button
                key={category}
                onClick={() => onChange(category)}
                className={`flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 rounded-full md:rounded-xl text-xs font-bold tracking-wide md:tracking-widest uppercase transition-all flex-shrink-0 ${
                  isActive
                    ? 'bg-black text-white'
                    : 'bg-[#E1E2ED] text-[#191B24] hover:bg-[#D1D2DE]'
                }`}
              >
                <span className="md:hidden">{mobileLabel}</span>
                <span className="hidden md:inline">{label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
