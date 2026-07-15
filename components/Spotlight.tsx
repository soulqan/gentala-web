"use client"

import Image from "next/image"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Sparkles, Trees, Eye, Compass } from "lucide-react"

export default function Spotlight() {
  const slides = [
    {
      image: "/gallery-aviary.png",
      icon: <Trees className="h-5 w-5 text-brand-teal" />,
      title: "Aviary Walkway & Nature Exploration",
      description: "Jembatan gantung kayu ramah anak yang dirancang untuk melatih kekuatan motorik kasar, keseimbangan tubuh, serta melatih keberanian buah hati mengeksplorasi alam."
    },
    {
      image: "/gallery-sensory.png",
      icon: <Eye className="h-5 w-5 text-brand-teal" />,
      title: "Sensory & Texture Zone",
      description: "Area interaktif dengan media alam asli (air bersih, batu kali halus, serbuk kayu steril) guna mengoptimalkan respons taktil dan sensorik telapak tangan serta kaki."
    },
    {
      image: "/hero-playroom.png",
      icon: <Compass className="h-5 w-5 text-brand-teal" />,
      title: "Cognitive Playrooms",
      description: "Ruang tenang berdesain minimalis yang meminimalisir distraksi visual untuk membantu anak berkonsentrasi penuh saat bermain mainan kayu edukatif terarah."
    }
  ]

  return (
    <section id="gallery" className="py-20 lg:py-28 bg-[#88B0A0] text-white relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-white/5 rounded-full filter blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-teal/10 rounded-full filter blur-3xl" />

      <div className="container mx-auto px-6 max-w-6xl relative z-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 text-white text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Fasilitas Unggulan</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4">
            Aviary Sensory Land
          </h2>
          <div className="h-1 w-12 bg-white/40 rounded-full mb-4" />
          <p className="text-white/90 font-light max-w-xl">
            Satu-satunya wahana stimulasi sensori terpadu berbasis alam di pusat kota yang memadukan petualangan luar ruang dengan protokol keamanan ekstra.
          </p>
        </div>

        {/* Carousel layout */}
        <div className="px-4 md:px-12 relative max-w-4xl mx-auto">
          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent>
              {slides.map((slide, index) => (
                <CarouselItem key={index} className="basis-full">
                  <div className="bg-white text-slate-800 rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 flex flex-col md:flex-row h-full min-h-[400px]">
                    {/* Slide Image */}
                    <div className="relative w-full md:w-1/2 min-h-[250px] md:min-h-full">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        fill
                        sizes="(max-w-768px) 100vw, 450px"
                        className="object-cover"
                      />
                    </div>
                    {/* Slide Content */}
                    <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center">
                      <div className="inline-flex items-center justify-center bg-brand-teal/5 p-3 rounded-2xl w-fit mb-6">
                        {slide.icon}
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 md:mb-4 tracking-tight leading-tight">
                        {slide.title}
                      </h3>
                      <p className="text-slate-600 font-light text-sm sm:text-base leading-relaxed">
                        {slide.description}
                      </p>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            {/* Carousel navigation buttons shown only on desktop */}
            <CarouselPrevious className="hidden md:flex -left-12 bg-white hover:bg-slate-50 text-slate-800 border-none shadow-lg h-10 w-10 animate-in fade-in" />
            <CarouselNext className="hidden md:flex -right-12 bg-white hover:bg-slate-50 text-slate-800 border-none shadow-lg h-10 w-10 animate-in fade-in" />
          </Carousel>
        </div>
      </div>
    </section>
  )
}
