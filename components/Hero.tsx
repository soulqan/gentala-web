"use client"

import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar } from "lucide-react"

export default function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden pt-32 pb-20 lg:pt-40 lg:pb-28 bg-[#F8FAFC]">
      {/* Decorative background shapes */}
      <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-brand-sage/5 rounded-full filter blur-3xl -z-10" />
      <div className="absolute bottom-10 left-10 w-[30rem] h-[30rem] bg-brand-teal/5 rounded-full filter blur-3xl -z-10" />

      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Content */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-yellow/10 text-amber-800 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
              <Calendar className="h-3.5 w-3.5" />
              <span>Pendaftaran Gelombang I Dibuka</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.1] mb-6">
              Tumbuh Kembang <span className="text-brand-teal">Optimal</span>, Penuh Kasih.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed max-w-xl mb-8">
              Gentala menghadirkan program stimulasi tumbuh kembang anak yang terintegrasi, didukung oleh fasilitas sensori canggih, ruang ramah anak, dan bimbingan psikolog profesional di masa-masa emas buah hati Anda.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              <Link
                href="/daftar"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-teal px-8 py-4 text-sm font-semibold text-white hover:bg-brand-teal/95 hover:translate-y-[-2px] transition-all duration-300 shadow-md hover:shadow-lg"
              >
                Mulai Konsultasi
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#gallery"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-sm font-semibold text-slate-700 hover:border-brand-teal hover:text-brand-teal hover:translate-y-[-2px] transition-all duration-300 shadow-xs"
              >
                Lihat Fasilitas
              </Link>
            </div>
          </div>

          {/* Right Column: Image Asset */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <div className="relative w-full max-w-[500px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white transition-transform duration-500 hover:scale-[1.02]">
              <Image
                src="/hero-playroom.png"
                alt="Fasilitas Sensory Play Gentala"
                fill
                sizes="(max-w-768px) 100vw, 500px"
                className="object-cover"
                preload={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
