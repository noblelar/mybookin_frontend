import Navigation from '@/components/Navigation'
import HeroSection from '@/components/HeroSection'
import CategoryBar from '@/components/CategoryBar'
import FeaturedDestinations from '@/components/FeaturedDestinations'
import HowItWorks from '@/components/HowItWorks'
import BusinessSection from '@/components/BusinessSection'
import Testimonials from '@/components/Testimonials'
import Footer from '@/components/Footer'

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
