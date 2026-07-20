import type { Metadata } from "next"
import Navbar from "@/components/Navbar"
import Hero from "@/components/Hero"
import Pillars from "@/components/Pillars"
import About from "@/components/About"
import ServiceGrid from "@/components/ServiceGrid"
import Spotlight from "@/components/Spotlight"
import FAQAccordion from "@/components/FAQAccordion"
import Footer from "@/components/Footer"
import { prisma } from "@/lib/prisma"

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

export default async function Home() {
  // Fetch services from DB
  const dbServices = await prisma.service.findMany({
    orderBy: { createdAt: "asc" }
  })

  // Normalize properties for client-safe serialization
  const services = dbServices.map(s => ({
    id: s.id,
    name: s.name,
    price: s.price,
    description: s.description,
    schedule: s.schedule,
    slots: s.slots,
    requiresChildData: s.requiresChildData,
    customFields: typeof s.customFields === "string" ? JSON.parse(s.customFields) : s.customFields
  }))

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
        <ServiceGrid dbServices={services} />
        
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
