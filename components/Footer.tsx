"use client"

import Link from "next/link"
import Image from "next/image"
import { Sparkles, Phone, Mail, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-brand-teal text-white/80 pt-20 pb-10">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 pb-16 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-2xl tracking-tight">
              <div className="relative h-10 w-10 rounded-xl overflow-hidden shadow-md border border-white/10">
                <Image
                  src="/logo.jpeg"
                  alt="Gentala Logo"
                  fill
                  sizes="40px"
                  className="object-cover"
                />
              </div>
              <span>Gentala</span>
            </Link>
            <p className="text-sm font-light leading-relaxed max-w-sm text-white/70">
              Pusat tumbuh kembang anak terpadu yang didedikasikan untuk mengoptimalkan potensi motorik, sensorik, kognitif, dan kesejahteraan emosional buah hati Anda melalui pendekatan ilmiah yang penuh kasih.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-4 text-white/60">
              <Link href="#" className="hover:text-white transition-colors duration-300" aria-label="Instagram">
                <svg className="h-5 w-5 stroke-current fill-none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
                </svg>
              </Link>
              <Link href="#" className="hover:text-white transition-colors duration-300" aria-label="Youtube">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.108C19.52 3.5 12 3.5 12 3.5s-7.52 0-9.388.555a3.002 3.002 0 0 0-2.11 2.108C0 8.03 0 12 0 12s0 3.97.502 5.837a3.003 3.003 0 0 0 2.11 2.108C4.48 20.5 12 20.5 12 20.5s7.52 0 9.388-.555a3.003 3.003 0 0 0 2.11-2.108C24 15.97 24 12 24 12s0-3.97-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </Link>
              <Link href="#" className="hover:text-white transition-colors duration-300" aria-label="Facebook">
                <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Navigation Links (Fixed typo from NAVIPASI to NAVIGASI) */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">NAVIGASI</h4>
            <nav className="flex flex-col gap-3.5 text-sm font-light">
              <Link href="#" className="hover:text-white transition-colors duration-300">Beranda</Link>
              <Link href="#services" className="hover:text-white transition-colors duration-300">Layanan</Link>
              <Link href="#gallery" className="hover:text-white transition-colors duration-300">Fasilitas</Link>
              <Link href="#faq" className="hover:text-white transition-colors duration-300">FAQ</Link>
            </nav>
          </div>

          {/* Program Links */}
          <div className="md:col-span-2 flex flex-col gap-4">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">PROGRAM</h4>
            <nav className="flex flex-col gap-3.5 text-sm font-light">
              <Link href="/daftar?service=sensory" className="hover:text-white transition-colors duration-300">Daycare Harian</Link>
              <Link href="/daftar?service=speech" className="hover:text-white transition-colors duration-300">PAUD Terintegrasi</Link>
              <Link href="/daftar?service=psychology" className="hover:text-white transition-colors duration-300">Biro Psikologi</Link>
              <Link href="/daftar?service=motoric" className="hover:text-white transition-colors duration-300">Program Parenting</Link>
              <Link href="/daftar?service=social" className="hover:text-white transition-colors duration-300">Kelas Gymnastic</Link>
              <Link href="/daftar?service=parenting" className="hover:text-white transition-colors duration-300">Aviary</Link>
            </nav>
          </div>

          {/* Contact Info */}
          <div className="md:col-span-3 flex flex-col gap-4 text-sm font-light">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider">HUBUNGI KAMI</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-white/50 shrink-0 mt-0.5" />
                <span className="leading-relaxed text-white/70">Jl. Bunga Melati No. 42, Kebayoran Baru, Jakarta Selatan</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-white/50 shrink-0" />
                <a href="tel:+62215551234" className="hover:text-white transition-colors duration-300 text-white/70">(021) 555-1234</a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-white/50 shrink-0" />
                <a href="mailto:info@gentala.id" className="hover:text-white transition-colors duration-300 text-white/70">info@gentala.id</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-light text-white/55">
          <p>
            © {new Date().getFullYear()} Gentala Child Development Center. Hak Cipta Dilindungi.{" "}
            <Link href="/admin/login" className="hover:text-white transition-colors ml-1">
              • Portal Staf
            </Link>
          </p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
