import * as React from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Navbar from "@/components/Navbar"
import { prisma } from "@/lib/prisma"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, 
  Users, 
  ArrowRight, 
  Home, 
  ChevronRight, 
  CheckCircle2,
  Brain,
  MessageSquareText,
  HeartPulse,
  Activity,
  Trees
} from "lucide-react"

interface PageProps {
  params: Promise<{ id: string }>
}

const STATIC_ICONS: { [key: string]: React.ReactNode } = {
  "daycare-harian": <Brain className="h-10 w-10 text-brand-teal" />,
  "paud-terintegrasi": <MessageSquareText className="h-10 w-10 text-brand-teal" />,
  "biro-psikologi": <HeartPulse className="h-10 w-10 text-brand-teal" />,
  "program-parenting": <Activity className="h-10 w-10 text-brand-teal" />,
  "kelas-gymnastic": <Users className="h-10 w-10 text-brand-teal" />,
  "aviary": <Trees className="h-10 w-10 text-brand-teal" />,
}

const STATIC_AGE_RANGES: { [key: string]: string } = {
  "daycare-harian": "3 Bulan - 5 Tahun",
  "paud-terintegrasi": "2 - 6 Tahun",
  "biro-psikologi": "0 - 10 Tahun",
  "program-parenting": "Untuk Orang Tua",
  "kelas-gymnastic": "1 - 8 Tahun",
  "aviary": "1 - 10 Tahun",
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const serviceId = resolvedParams.id

  // 1. Fetch service details from Supabase database
  const service = await prisma.service.findUnique({
    where: { id: serviceId }
  })

  if (!service) {
    notFound()
  }

  // Determine static assets mapping
  const icon = STATIC_ICONS[service.id] || <Activity className="h-10 w-10 text-brand-teal" />
  const ageRange = STATIC_AGE_RANGES[service.id] || "Semua Usia"

  // Determine slot status badge
  let badgeText = "Kuota Tersedia"
  let badgeClass = "bg-brand-teal/10 text-brand-teal border-brand-teal/20"
  if (service.slots <= 0) {
    badgeText = "Kuota Penuh"
    badgeClass = "bg-rose-50 text-rose-600 border-rose-100"
  } else if (service.slots < 5) {
    badgeText = `Sisa ${service.slots} Kursi`
    badgeClass = "bg-amber-50 text-amber-700 border-amber-200"
  }

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(value)
  }

  // Parse customFields safely
  let customFields: Array<{ label: string; type: string; required: boolean }> = []
  if (Array.isArray(service.customFields)) {
    customFields = service.customFields as any
  } else if (typeof service.customFields === "string") {
    try {
      customFields = JSON.parse(service.customFields)
    } catch (e) {
      customFields = []
    }
  }

  return (
    <>
      <Navbar />

      <main className="flex-grow pt-28 pb-20 bg-[#F8FAFC]">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Breadcrumbs Navigation */}
          <nav className="flex items-center gap-2 text-slate-400 text-xs mb-8">
            <Link href="/" className="hover:text-brand-teal transition-colors flex items-center gap-1 font-light">
              <Home className="h-3.5 w-3.5" />
              <span>Beranda</span>
            </Link>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="font-light text-slate-400">Layanan</span>
            <ChevronRight className="h-3 w-3 shrink-0" />
            <span className="font-semibold text-slate-500 truncate">{service.name}</span>
          </nav>

          {/* Main Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Left Visual/Metadata Panel */}
            <div className="md:col-span-5 space-y-6">
              <div className="bg-white border border-slate-200/60 shadow-[0_10px_40px_rgba(13,92,102,0.02)] rounded-3xl p-6 flex flex-col items-center text-center">
                <div className="h-20 w-20 rounded-2xl bg-brand-teal/5 border border-brand-teal/10 flex items-center justify-center mb-5">
                  {icon}
                </div>
                
                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badgeClass} mb-4`}>
                  {badgeText}
                </span>

                <h3 className="text-base font-bold text-slate-900 leading-tight mb-2">
                  {service.name}
                </h3>
                
                <div className="text-xs font-semibold text-brand-teal bg-brand-teal/5 px-3 py-1 rounded-full mb-6">
                  Rentang Usia: {ageRange}
                </div>

                <div className="w-full pt-5 border-t border-slate-100 space-y-3.5 text-left text-xs font-light text-slate-500">
                  <div className="flex justify-between">
                    <span>Sisa Quota:</span>
                    <span className="font-semibold text-slate-800">{service.slots} Kursi</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data Anak:</span>
                    <span className="font-semibold text-slate-800">
                      {service.requiresChildData ? "Wajib Diisi" : "Tidak Diperlukan"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Dokumentasi:</span>
                    <span className="font-semibold text-slate-800">Kuitansi Resmi & Slip Rekam</span>
                  </div>
                </div>
              </div>

              {/* Quality Standards Summary */}
              <div className="bg-white border border-slate-200/60 shadow-[0_10px_40px_rgba(13,92,102,0.02)] rounded-3xl p-6 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Keunggulan Layanan</h4>
                <div className="space-y-3 text-xs font-light text-slate-600">
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-teal shrink-0 mt-0.5" />
                    <span>Dipandu oleh staf medis & terapis berlisensi resmi.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-teal shrink-0 mt-0.5" />
                    <span>Laporan rekam tumbuh kembang anak berkala.</span>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <CheckCircle2 className="h-4 w-4 text-brand-teal shrink-0 mt-0.5" />
                    <span>Fasilitas integrasi sensori standar internasional.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Information & Booking Details Panel */}
            <div className="md:col-span-7 bg-white border border-slate-200/60 shadow-[0_10px_40px_rgba(13,92,102,0.03)] rounded-3xl p-8 space-y-6">
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight mb-2">
                  {service.name}
                </h1>
                <p className="text-xs text-slate-400 font-light">Gentala Child Development Center</p>
              </div>

              {/* Service Description Section */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Deskripsi Program</h3>
                <p className="text-sm font-light text-slate-600 leading-relaxed font-sans whitespace-pre-wrap">
                  {service.description}
                </p>
              </div>

              {/* Schedule Section */}
              <div className="space-y-3 pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Jadwal Operasional Kelas</h3>
                <div className="flex items-center gap-2.5 p-3.5 bg-slate-50/50 border border-slate-100 rounded-xl">
                  <Calendar className="h-4.5 w-4.5 text-brand-teal shrink-0" />
                  <span className="text-xs font-semibold text-slate-700">
                    {service.schedule || "Senin - Jumat, 08:00 - 16:00"}
                  </span>
                </div>
              </div>

              {/* Dynamic custom form questions preview */}
              {customFields.length > 0 && (
                <div className="space-y-3 pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Formulir Kustom Tambahan</h3>
                  <p className="text-[10px] text-slate-455 font-light leading-normal mb-2">
                    Untuk menunjang asesmen awal, pendaftaran program ini memerlukan informasi tambahan berupa:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {customFields.map((field, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-3 bg-slate-50/50 border border-slate-100 rounded-xl">
                        <CheckCircle2 className="h-4 w-4 text-brand-teal/60 shrink-0" />
                        <span className="text-xs font-medium text-slate-600 truncate">
                          {field.label} {field.required && <span className="text-rose-500 font-bold">*</span>}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Price Details Card (Moved to bottom) */}
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-6">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                    Total Biaya Pendaftaran
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-extrabold text-brand-teal tracking-tight">
                      {formatIDR(service.price)}
                    </span>
                    <span className="text-xs text-slate-400 font-light">/ program</span>
                  </div>
                </div>
                
                <Link
                  href={service.slots > 0 ? `/register?serviceId=${service.id}` : "#"}
                  className={`h-11 px-6 inline-flex items-center gap-2 justify-center rounded-full text-xs font-semibold shadow-md transition-all duration-300 ${
                    service.slots > 0 
                      ? "bg-brand-teal text-white hover:bg-brand-teal/95 hover:shadow-lg cursor-pointer" 
                      : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none pointer-events-none"
                  }`}
                >
                  <span>{service.slots > 0 ? "Daftar Sekarang" : "Kuota Layanan Penuh"}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
