import Navbar from "../components/Navbar"
import HeroSection from "../components/HeroSection"
import UniversityTicker from "../components/UniversityTicker"
import StatsSection from "../components/StatsSection"
import WhySection from "../components/WhySection"
import HowSection from "../components/HowSection"
import TestimonialsSection from "../components/TestimonialsSection"
import EventsSection from "../components/EventsSection"
import ContactSection from "../components/ContactSection"
import Footer from "../components/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <UniversityTicker />
        <StatsSection />
        <WhySection />
        <HowSection />
        <TestimonialsSection />
        <EventsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  )
}
