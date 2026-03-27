import {
  SearchIcon,
  CategoryIcon,
  ChevronDownIcon,
  SearchArrowIcon,
} from "@/components/icons"

export default function HeroSection() {
  return (
    <section className="w-full bg-blue-light py-24 min-h-screen flex items-center justify-center border-b border-border-subtle">
      <div className="max-w-6xl w-full px-6 grid grid-cols-2 gap-16 items-center">
        {/* Left: Content */}
        <div className="flex flex-col gap-6">
          <div className="inline-flex w-max bg-navy px-3 py-1 rounded-lg">
            <span className="font-inter text-xs font-bold text-white uppercase tracking-widest">
              Omni-Channel Architecture
            </span>
          </div>

          <h1 className="font-manrope text-6xl font-800 leading-tight text-navy">
            Your Favorite<br />
            Services,<br />
            <span className="text-body font-300">Simplified.</span>
          </h1>

          <p className="font-inter text-lg text-body leading-relaxed max-w-md">
            Book experts, reserve resources, and manage appointments in one
            click. A Sovereign system built for absolute precision and zero
            friction.
          </p>

          {/* Search Bar */}
          <div className="flex gap-2 p-2 bg-white rounded-lg border border-border-subtle shadow-sm">
            <div className="flex items-center gap-3 px-4 flex-1 bg-blue-light rounded">
              <SearchIcon />
              <span className="font-inter text-sm text-muted">What are you looking for?</span>
            </div>

            <div className="flex items-center gap-2 px-4 bg-blue-light rounded cursor-pointer">
              <CategoryIcon />
              <span className="font-inter text-sm font-bold text-navy">Category</span>
              <ChevronDownIcon />
            </div>

            <button className="flex items-center gap-2 px-8 py-3 bg-black text-white rounded font-inter text-sm font-bold hover:bg-gray-900 transition-colors">
              <SearchArrowIcon />
              Search Nearby
            </button>
          </div>
        </div>

        {/* Right: Dual Visual */}
        <div className="relative h-96">
          {/* Main image — Business Architect View */}
          <div className="absolute right-0 top-0 w-96 h-80 rounded-lg border-2 border-blue-light bg-blue-light shadow-lg overflow-hidden">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/f2aa736095396c625377fa3822964fee02b028e5?width=943"
              alt="Business Architect dashboard view"
              className="w-full h-full object-cover opacity-80"
            />
            <div className="absolute top-4 left-4 bg-black px-3 py-1 rounded">
              <span className="font-inter text-xs font-bold text-white uppercase tracking-widest">
                Business Architect View
              </span>
            </div>
          </div>
          {/* Overlay image — User Interface */}
          <div className="absolute left-0 bottom-0 w-64 h-56 rounded-lg border-8 border-blue-light bg-white shadow-lg overflow-hidden">
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/7112e148ef0f9b526f7070a4f02abfee6a33df1c?width=501"
              alt="User interface view"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-6 left-6 bg-muted px-3 py-1 rounded">
              <span className="font-inter text-xs font-bold text-white uppercase tracking-widest">
                User Interface
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
