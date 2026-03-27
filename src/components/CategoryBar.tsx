import {
  BarberIcon,
  HairIcon,
  NailsIcon,
  RestaurantIcon,
  TutorIcon,
  SpaIcon,
  FitnessIcon,
} from "@/components/icons"

const categories = [
  { label: "Barber", icon: BarberIcon, active: true },
  { label: "Hair", icon: HairIcon },
  { label: "Nails", icon: NailsIcon },
  { label: "Restaurant", icon: RestaurantIcon },
  { label: "Tutor", icon: TutorIcon },
  { label: "Spa", icon: SpaIcon },
  { label: "Fitness", icon: FitnessIcon },
]

export default function CategoryBar() {
  return (
    <div className="w-full bg-blue-light py-6 border-b border-border-subtle">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-center gap-4 overflow-x-auto pb-2">
          <span className="font-inter text-xs font-bold text-muted uppercase tracking-widest whitespace-nowrap pr-4">
            Browse Niches
          </span>

          {categories.map((category) => {
            const IconComponent = category.icon
            return (
              <a
                key={category.label}
                href="#"
                className={`flex items-center gap-2 px-5 py-2 rounded-xl whitespace-nowrap font-inter text-sm font-bold transition-all ${
                  category.active
                    ? "bg-black text-white"
                    : "bg-gray-200 text-navy hover:bg-gray-300"
                }`}
              >
                <IconComponent />
                {category.label}
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
