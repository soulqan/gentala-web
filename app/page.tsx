import type { Metadata } from "next"
import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Pillars from "@/components/Pillars"
import About from "@/components/About"
import ServiceGrid from "@/components/ServiceGrid"
import Spotlight from "@/components/Spotlight"
import FAQAccordion from "@/components/FAQAccordion"
import Footer from "@/components/Footer"

export const metadata: Metadata = {
  title: "Gentala - Pusat Tumbuh Kembang & Terapi Sensori Anak",
  description: "Gentala menghadirkan stimulasi tumbuh kembang anak terpadu, terapi integrasi sensori berbasis alam, terapi wicara, dan konsultasi psikologi profesional di Jakarta.",
  openGraph: {
    title: "Gentala - Pusat Tumbuh Kembang & Terapi Sensori Anak",
    description: "Gentala menghadirkan stimulasi tumbuh kembang anak terpadu, terapi integrasi sensori berbasis alam, terapi wicara, dan konsultasi psikologi profesional di Jakarta.",
    type: "website",
    locale: "id_ID",
    url: "https://gentala.id",
  }
}

export default function Home() {
  return (
    <>
      {/* Floating Glassmorphic Navbar */}
      <Navbar />
      
      {/* Main Content Area */}
      <main className="flex-grow">
        {/* Hero Section */}
        <Hero />
        
        {/* 3 Pillars Bar */}
        <Pillars />

        {/* Tentang Kami Section */}
        <About />
        
        {/* Service Grid Section */}
        <ServiceGrid />
        
        {/* Spotlight Section (Aviary Sensory Land) */}
        <Spotlight />
        
        {/* FAQ Accordion Section */}
        <FAQAccordion />
      </main>
      
      {/* Footer Section */}
      <Footer />
    </>
  )
}
