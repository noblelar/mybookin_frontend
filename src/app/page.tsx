import Navigation from "@/app/components/Navigation"
import HeroSection from "@/app/components/HeroSection"
import CategoryBar from "@/app/components/CategoryBar"
import FeaturedDestinations from "@/app/components/FeaturedDestinations"
import HowItWorks from "@/app/components/HowItWorks"
import BusinessSection from "@/app/components/BusinessSection"
import Testimonials from "@/app/components/Testimonials"
import Footer from "@/app/components/Footer"

export default function Home() {
  return (
    <>
      <Navigation />
      <HeroSection />
      <CategoryBar />
      <FeaturedDestinations />
      <HowItWorks />
      <BusinessSection />
      <Testimonials />
      <Footer />
    </>
  )
}
