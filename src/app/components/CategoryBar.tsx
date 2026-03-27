import {
  BarberIcon,
  HairIcon,
  NailsIcon,
  RestaurantIcon,
  TutorIcon,
  SpaIcon,
  FitnessIcon,
} from "@/app/icons"

interface Category {
  label: string
  icon: React.ComponentType
  active?: boolean
}

const categories: Category[] = [
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
    <div className="sa-category-bar">
      <div className="sa-category-inner">
        <span className="sa-category-label">Browse Niches</span>

        {categories.map((category) => {
          const IconComponent = category.icon
          return (
            <a
              key={category.label}
              href="#"
              className={`sa-category-btn ${category.active ? "active" : ""}`}
            >
              <IconComponent />
              {category.label}
            </a>
          )
        })}
      </div>
    </div>
  )
}
