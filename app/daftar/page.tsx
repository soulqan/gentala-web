"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useSearchParams, useRouter } from "next/navigation"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ArrowLeft, CheckCircle2, Calendar, Phone, Mail, User, ShieldAlert, Sparkles } from "lucide-react"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

// Backward-compatible service keys mapping
const SERVICE_MAPPINGS: { [key: string]: string } = {
  "sensory": "daycare-harian",
  "daycare-harian": "daycare-harian",
  "speech": "paud-terintegrasi",
  "paud-terintegrasi": "paud-terintegrasi",
  "psychology": "biro-psikologi",
  "biro-psikologi": "biro-psikologi",
  "motoric": "program-parenting",
  "program-parenting": "program-parenting",
  "social": "kelas-gymnastic",
  "kelas-gymnastic": "kelas-gymnastic",
  "parenting": "aviary",
  "aviary": "aviary"
}

const SERVICES_LIST = [
  { value: "daycare-harian", label: "Daycare Harian" },
  { value: "paud-terintegrasi", label: "PAUD Terintegrasi" },
  { value: "biro-psikologi", label: "Biro Psikologi" },
  { value: "program-parenting", label: "Program Parenting" },
  { value: "kelas-gymnastic", label: "Kelas Gymnastic" },
  { value: "aviary", label: "Aviary" }
]

// Zod Schema Definition with conditional validation
const baseSchema = z.object({
  parentName: z.string().min(3, "Nama lengkap orang tua minimal 3 karakter"),
  whatsapp: z.string()
    .min(10, "Nomor WhatsApp minimal 10 digit")
    .regex(/^[0-9+-\s]+$/, "Nomor WhatsApp hanya boleh berisi angka"),
  email: z.string().email("Format alamat email tidak valid"),
  childName: z.string().min(2, "Nama lengkap anak minimal 2 karakter"),
  childDob: z.string().min(1, "Tanggal lahir anak wajib diisi"),
  service: z.string().min(1, "Silakan pilih jenis layanan"),
  medicalHistory: z.string().optional(),
  complaints: z.string().optional()
})

const registrationSchema = baseSchema.superRefine((data, ctx) => {
  if (data.service === "biro-psikologi") {
    if (!data.complaints || data.complaints.trim().length < 10) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Detail keluhan wajib diisi minimal 10 karakter untuk Biro Psikologi",
        path: ["complaints"]
      })
    }
  }
})

type RegistrationFormValues = z.infer<typeof registrationSchema>

function RegistrationForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [isSuccessOpen, setIsSuccessOpen] = React.useState(false)
  const [submittedData, setSubmittedData] = React.useState<RegistrationFormValues | null>(null)

  // Resolve initial service from search param
  const serviceParam = searchParams.get("serviceId") || searchParams.get("service")
  const resolvedService = serviceParam ? (SERVICE_MAPPINGS[serviceParam.toLowerCase()] || serviceParam) : ""

  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      parentName: "",
      whatsapp: "",
      email: "",
      childName: "",
      childDob: "",
      service: resolvedService,
      medicalHistory: "",
      complaints: ""
    }
  })

  const selectedService = watch("service")

  const onSubmit = async (data: RegistrationFormValues) => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Validated Form Data:", JSON.stringify(data, null, 2))
    setSubmittedData(data)
    setIsSuccessOpen(true)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between py-8 relative overflow-hidden">
      {/* Background Decorative Gradient Blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl -z-10 translate-x-20 -translate-y-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-sage/5 rounded-full blur-3xl -z-10 -translate-x-20 translate-y-20" />

      {/* Header */}
      <header className="container mx-auto px-6 max-w-3xl mb-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-brand-teal font-bold text-lg tracking-tight">
            <div className="relative h-8 w-8 rounded-xl overflow-hidden shadow-inner border border-slate-100 bg-white">
              <Image
                src="/logo.jpeg"
                alt="Gentala Logo"
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <span>Gentala</span>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-brand-teal transition-colors font-medium">
            <ArrowLeft className="h-4 w-4" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </header>

      {/* Form Container */}
      <main className="container mx-auto px-6 max-w-3xl flex-grow flex items-center justify-center">
        <Card className="w-full bg-white border border-slate-200/60 shadow-[0_10px_40px_rgba(13,92,102,0.04)] rounded-3xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-semibold uppercase tracking-wider mb-3">
              <Sparkles className="h-3 w-3" />
              <span>Registrasi Kelas</span>
            </div>
            <CardTitle className="text-2xl font-extrabold text-slate-900 leading-tight">
              Pendaftaran Layanan Tumbuh Kembang
            </CardTitle>
            <CardDescription className="text-slate-500 font-light mt-2 text-sm sm:text-base leading-relaxed">
              Lengkapi formulir terpadu berikut. Tanpa login awal untuk pengalaman pendaftaran yang lebih cepat dan aman bagi keluarga Anda.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="p-8 space-y-8">
              
              {/* Section 1: Parent Info */}
              <div className="space-y-5">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-brand-teal/10 text-brand-teal font-bold text-xs">1</div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Data Orang Tua / Wali</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="parentName" className="text-xs font-semibold text-slate-700">Nama Lengkap Orang Tua <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="parentName"
                        type="text"
                        placeholder="Contoh: Sarah Wijaya"
                        className={cn(
                          "w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all duration-200",
                          errors.parentName && "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500"
                        )}
                        {...register("parentName")}
                      />
                    </div>
                    {errors.parentName && (
                      <p className="text-xs text-rose-500 font-medium">{errors.parentName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="whatsapp" className="text-xs font-semibold text-slate-700">Nomor WhatsApp Aktif <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="whatsapp"
                        type="tel"
                        placeholder="Contoh: 081234567890"
                        className={cn(
                          "w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all duration-200",
                          errors.whatsapp && "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500"
                        )}
                        {...register("whatsapp")}
                      />
                    </div>
                    {errors.whatsapp && (
                      <p className="text-xs text-rose-500 font-medium">{errors.whatsapp.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-xs font-semibold text-slate-700">Alamat Email <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                      id="email"
                      type="email"
                      placeholder="Contoh: sarah@email.com"
                      className={cn(
                        "w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all duration-200",
                        errors.email && "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500"
                      )}
                      {...register("email")}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-rose-500 font-medium">{errors.email.message}</p>
                  )}
                </div>
              </div>

              {/* Section 2: Child Info */}
              <div className="space-y-5">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-brand-teal/10 text-brand-teal font-bold text-xs">2</div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Data Anak</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="childName" className="text-xs font-semibold text-slate-700">Nama Lengkap Anak <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="childName"
                        type="text"
                        placeholder="Contoh: Kenzo Arkan"
                        className={cn(
                          "w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all duration-200",
                          errors.childName && "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500"
                        )}
                        {...register("childName")}
                      />
                    </div>
                    {errors.childName && (
                      <p className="text-xs text-rose-500 font-medium">{errors.childName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="childDob" className="text-xs font-semibold text-slate-700">Tanggal Lahir Anak <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      <input
                        id="childDob"
                        type="date"
                        className={cn(
                          "w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all duration-200",
                          errors.childDob && "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500"
                        )}
                        {...register("childDob")}
                      />
                    </div>
                    {errors.childDob && (
                      <p className="text-xs text-rose-500 font-medium">{errors.childDob.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Section 3: Service Selection */}
              <div className="space-y-5">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-brand-teal/10 text-brand-teal font-bold text-xs">3</div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Detail Program & Layanan</h3>
                </div>

                <div className="space-y-2">
                  <label htmlFor="service" className="text-xs font-semibold text-slate-700">Pilih Layanan Utama <span className="text-rose-500">*</span></label>
                  <Controller
                    name="service"
                    control={control}
                    render={({ field }) => (
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <SelectTrigger className={cn(
                          "h-12 border-slate-200 focus:ring-brand-teal/20 focus:border-brand-teal text-slate-800 text-sm",
                          errors.service && "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500"
                        )}>
                          <SelectValue placeholder="Pilih kelas atau konsultasi..." />
                        </SelectTrigger>
                        <SelectContent>
                          {SERVICES_LIST.map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                  {errors.service && (
                    <p className="text-xs text-rose-500 font-medium">{errors.service.message}</p>
                  )}
                </div>

                {/* Conditional Fields based on service choice */}
                {selectedService === "daycare-harian" && (
                  <div className="space-y-2 p-5 bg-brand-teal/5 rounded-2xl border border-brand-teal/10 animate-in fade-in slide-in-from-top-3 duration-300">
                    <div className="flex items-center gap-1.5 text-brand-teal text-xs font-bold uppercase tracking-wider">
                      <ShieldAlert className="h-4 w-4" />
                      <span>Riwayat Kesehatan & Medis Anak (Opsional)</span>
                    </div>
                    <textarea
                      id="medicalHistory"
                      placeholder="Masukkan catatan alergi makanan/obat, riwayat asma, atau kebutuhan obat-obatan rutin anak jika ada..."
                      rows={3}
                      className="w-full mt-2 p-4 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all duration-200 resize-none"
                      {...register("medicalHistory")}
                    />
                  </div>
                )}

                {selectedService === "biro-psikologi" && (
                  <div className="space-y-2 p-5 bg-brand-teal/5 rounded-2xl border border-brand-teal/10 animate-in fade-in slide-in-from-top-3 duration-300">
                    <div className="flex items-center gap-1.5 text-brand-teal text-xs font-bold uppercase tracking-wider">
                      <ShieldAlert className="h-4 w-4" />
                      <span>Detail Keluhan / Catatan Perkembangan <span className="text-rose-500">*</span></span>
                    </div>
                    <textarea
                      id="complaints"
                      placeholder="Ceritakan detail keluhan atau fokus masalah tumbuh kembang yang ingin dikonsultasikan bersama psikolog (contoh: keterlambatan bicara, masalah emosional, gangguan fokus)..."
                      rows={4}
                      className={cn(
                        "w-full mt-2 p-4 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all duration-200 resize-none",
                        errors.complaints && "border-rose-500 focus:ring-rose-500/20 focus:border-rose-500"
                      )}
                      {...register("complaints")}
                    />
                    {errors.complaints && (
                      <p className="text-xs text-rose-500 font-medium mt-1">{errors.complaints.message}</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>

            <CardFooter className="p-8 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-4 sm:flex-row sm:justify-between items-center">
              <span className="text-xs text-slate-400 font-light flex items-center gap-1">
                <span className="text-rose-500">*</span> Wajib diisi secara lengkap
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-brand-teal px-8 py-3.5 text-sm font-semibold text-white hover:bg-brand-teal/95 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Memproses..." : "Kirim Pendaftaran"}
              </button>
            </CardFooter>
          </form>
        </Card>
      </main>

      {/* Simplified Footer */}
      <footer className="container mx-auto px-6 max-w-3xl mt-8 text-center text-xs text-slate-400 font-light">
        <p>© 2026 Gentala. Semua hak cipta dilindungi.</p>
      </footer>

      {/* Success Dialog Modal (React state-based glassmorphic modal overlay) */}
      {isSuccessOpen && submittedData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full border border-slate-200 shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center text-center">
              <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4 animate-bounce" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-tight">
                Pendaftaran Berhasil Dikirim!
              </h2>
              <p className="text-slate-500 font-light text-sm mt-2 leading-relaxed">
                Terima kasih telah mempercayakan tumbuh kembang buah hati Anda bersama Gentala. Tim kami akan menghubungi Anda melalui WhatsApp dalam waktu 1x24 jam untuk koordinasi jadwal.
              </p>

              {/* Data Summary Grid */}
              <div className="w-full mt-6 bg-[#F8FAFC] border border-slate-100 rounded-2xl p-5 text-left space-y-3.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-1.5">Ringkasan Pendaftaran</h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <span className="text-slate-400">Pendaftar</span>
                  <span className="col-span-2 text-slate-700 font-medium">{submittedData.parentName}</span>
                  
                  <span className="text-slate-400">WhatsApp</span>
                  <span className="col-span-2 text-slate-700 font-medium">{submittedData.whatsapp}</span>

                  <span className="text-slate-400">Anak</span>
                  <span className="col-span-2 text-slate-700 font-medium">{submittedData.childName} ({new Date().getFullYear() - new Date(submittedData.childDob).getFullYear()} Thn)</span>

                  <span className="text-slate-400">Layanan</span>
                  <span className="col-span-2 text-brand-teal font-semibold">
                    {SERVICES_LIST.find((s) => s.value === submittedData.service)?.label}
                  </span>
                </div>
              </div>

              <button
                onClick={() => {
                  setIsSuccessOpen(false)
                  router.push("/")
                }}
                className="w-full mt-6 inline-flex items-center justify-center rounded-full bg-brand-teal py-3 text-sm font-semibold text-white hover:bg-brand-teal/95 transition-all shadow-md"
              >
                Kembali ke Beranda
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function RegistrationPage() {
  return (
    <React.Suspense fallback={
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-full border-4 border-brand-teal/20 border-t-brand-teal animate-spin" />
          <span className="text-sm font-semibold text-brand-teal tracking-wide animate-pulse">Memuat Formulir Gentala...</span>
        </div>
      </div>
    }>
      <RegistrationForm />
    </React.Suspense>
  )
}
