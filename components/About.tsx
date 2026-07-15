"use client";

import Image from "next/image";
import Link from "next/link";
import { Check, Sparkles } from "lucide-react";

export default function About() {
  const points = [
    {
      title: "Layanan Terintegrasi",
      description:
        "Fasilitas daycare, PAUD, Biro Psikologi, dan pusat tumbuh kembang dalam satu atap.",
    },
    {
      title: "Tenaga Tersertifikasi",
      description:
        "Diasuh langsung oleh tim pendidik dan pengasuh profesional yang memiliki sertifikasi keselamatan anak.",
    },
    {
      title: "Kurikulum Berbasis Riset",
      description:
        "Program stimulasi aktif yang dirancang khusus sesuai tahap perkembangan usia anak.",
    },
    {
      title: "Laporan Digital Transparan",
      description:
        "Kemudahan memantau milestone dan aktivitas harian anak secara real-time lewat aplikasi.",
    },
  ];

  return (
    <section id="about" className="py-20 lg:py-28 bg-white overflow-hidden">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Image */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <div className="relative w-full max-w-[500px] aspect-square rounded-[2rem] overflow-hidden shadow-xl border border-slate-100/80 transition-transform duration-500 hover:scale-[1.01]">
              <Image
                src="/about-consultation.png"
                alt="Sesi Konsultasi Psikologi Gentala"
                fill
                sizes="(max-w-768px) 100vw, 500px"
                className="object-cover"
              />
            </div>
          </div>

          {/* Right Column: Copy/Text */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-semibold uppercase tracking-wider mb-6">
              <span>Tentang Kami</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 leading-[1.2] mb-6">
              Mendedikasikan Diri untuk{" "}
              <span className="text-brand-teal">Masa Emas</span> Tumbuh Kembang
              Anak
            </h2>

            <p className="text-slate-600 font-light leading-relaxed text-sm sm:text-base mb-8 max-w-xl">
              Gentala adalah pelopor pusat tumbuh kembang anak terpadu yang
              didirikan untuk memberikan standar pengasuhan terbaik. Kami
              memadukan keahlian klinis dengan lingkungan yang hangat dan aman
              demi mengoptimalkan setiap fase emas pertumbuhan buah hati Anda.
            </p>
            <p className="text-slate-700 font-semibold leading-relaxed text-md md:text-lg mb-4 max-w-xl">
              Mengapa Memilih Gentala?
            </p>

            {/* Core Points list */}
            <div className="flex flex-col gap-5 w-full text-left mb-8">
              {points.map((point, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 bg-brand-teal/10 text-brand-teal p-1.5 rounded-full h-fit mt-1">
                    <Check className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-slate-800 tracking-tight mb-1">
                      {point.title}
                    </h4>
                    <p className="text-sm text-slate-500 font-light leading-relaxed">
                      {point.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* <Link
              href="#services"
              className="inline-flex items-center justify-center rounded-full bg-brand-teal px-8 py-3.5 text-sm font-semibold text-white hover:bg-brand-teal/95 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Lihat Program Layanan
            </Link> */}
          </div>
        </div>
      </div>
    </section>
  );
}
