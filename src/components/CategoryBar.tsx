import {
  BarberIcon,
  HairIcon,
  NailsIcon,
  RestaurantIcon,
  TutorIcon,
  SpaIcon,
  FitnessIcon,
} from '@/components/icons'

const categories = [
  { label: 'Barber', icon: BarberIcon, active: true },
  { label: 'Hair', icon: HairIcon },
  { label: 'Nails', icon: NailsIcon },
  { label: 'Restaurant', icon: RestaurantIcon },
  { label: 'Tutor', icon: TutorIcon },
  { label: 'Spa', icon: SpaIcon },
  { label: 'Fitness', icon: FitnessIcon },
]

export default function CategoryBar() {
  return (
    <div
      className="w-full overflow-hidden border-b"
      style={{
        background: '#F8F9FF',
        borderColor: 'rgba(198, 198, 205, 0.15)',
      }}
    >
      <div
        className="flex items-center gap-4 overflow-x-auto px-6"
        style={{ padding: '24px' }}
      >
        {/* Label */}
        <div className="flex-shrink-0 pr-4">
          <span
            className="font-inter text-[10px] font-black uppercase"
            style={{ color: '#76777D', letterSpacing: '1px' }}
          >
            Browse Niches
          </span>
        </div>

        {/* Category Chips */}
        {categories.map((category) => {
          const IconComponent = category.icon
          return (
            <a
              key={category.label}
              href="#"
              className="flex items-center gap-2 px-5 py-2 flex-shrink-0 transition-all"
              style={{
                borderRadius: '12px',
                background: category.active ? '#000' : '#E1E2ED',
              }}
            >
              <span
                style={{
                  color: category.active ? '#FFF' : '#191B24',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <IconComponent />
              </span>
              <span
                className="font-inter text-xs font-bold uppercase"
                style={{
                  color: category.active ? '#FFF' : '#191B24',
                  letterSpacing: '0.6px',
                }}
              >
                {category.label}
              </span>
            </a>
          )
        })}
      </div>
    </div>
  )
}
