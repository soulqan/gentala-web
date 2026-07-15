"use client"

import { ShieldCheck, Layers, Award } from "lucide-react"

export default function Pillars() {
  const pillars = [
    {
      icon: <Layers className="h-6 w-6 text-brand-teal" />,
      title: "Terintegrasi",
      description: "Mengharmonisasikan stimulus motorik, sensorik, kognitif, dan bimbingan psikologis dalam satu tempat."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-brand-teal" />,
      title: "Aman & Higienis",
      description: "Sarana bermain dan belajar yang dirancang khusus dengan bahan non-toxic dan sterilisasi berkala."
    },
    {
      icon: <Award className="h-6 w-6 text-brand-teal" />,
      title: "Berkualitas",
      description: "Program dirancang dan didampingi langsung oleh terapis ahli serta psikolog anak berpengalaman."
    }
  ]

  return (
    <section className="bg-white py-12 border-y border-slate-100 shadow-xs">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {pillars.map((pillar, index) => (
            <div
              key={index}
              className="flex items-start gap-4 px-4 py-6 md:py-2 transition-transform duration-300 hover:translate-y-[-2px]"
            >
              <div className="flex-shrink-0 bg-brand-teal/5 p-3 rounded-2xl">
                {pillar.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1 tracking-tight">
                  {pillar.title}
                </h3>
                <p className="text-sm text-slate-500 font-light leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
