"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { ArrowLeft, Phone, Mail, User, Calendar, Sparkles, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createRegistration } from "../actions/register"

interface CustomField {
  label: string
  type: string
  required: boolean
}

interface Service {
  id: string
  name: string
  price: number
  slots: number
  requiresChildData: boolean
  customFields: CustomField[]
}

interface RegistrationFormClientProps {
  services: Service[]
  initialServiceId: string
}

export default function RegistrationFormClient({ services, initialServiceId }: RegistrationFormClientProps) {
  const router = useRouter()

  // Form states
  const [parentName, setParentName] = React.useState("")
  const [whatsapp, setWhatsapp] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [serviceId, setServiceId] = React.useState(initialServiceId)
  const [childName, setChildName] = React.useState("")
  const [childDob, setChildDob] = React.useState("")
  const [customAnswers, setCustomAnswers] = React.useState<Record<string, string>>({})

  // Status states
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState("")

  // Active service helper
  const selectedService = services.find(s => s.id === serviceId)

  // Reset custom answers when service changes
  React.useEffect(() => {
    setCustomAnswers({})
    setErrorMsg("")
  }, [serviceId])

  const handleCustomAnswerChange = (label: string, value: string) => {
    setCustomAnswers(prev => ({
      ...prev,
      [label]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Client-side validations
    if (!serviceId) {
      setErrorMsg("Silakan pilih program layanan terlebih dahulu.")
      return
    }
    if (!parentName.trim() || parentName.trim().length < 3) {
      setErrorMsg("Nama lengkap orang tua wajib diisi (minimal 3 karakter).")
      return
    }
    if (!whatsapp.trim() || whatsapp.trim().length < 10) {
      setErrorMsg("Nomor WhatsApp wajib diisi (minimal 10 digit).")
      return
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMsg("Alamat email wajib diisi dengan format email yang valid.")
      return
    }

    // Conditional child data validation
    if (selectedService?.requiresChildData) {
      if (!childName.trim()) {
        setErrorMsg("Nama lengkap anak wajib diisi untuk layanan ini.")
        return
      }
      if (!childDob) {
        setErrorMsg("Tanggal lahir anak wajib diisi untuk layanan ini.")
        return
      }
    }

    // Conditional custom fields validation
    if (selectedService?.customFields) {
      for (const field of selectedService.customFields) {
        if (field.required && !customAnswers[field.label]?.trim()) {
          setErrorMsg(`Kolom "${field.label}" wajib diisi.`)
          return
        }
      }
    }

    setIsSubmitting(true)
    setErrorMsg("")

    try {
      const res = await createRegistration({
        serviceId,
        parentName,
        whatsapp,
        email,
        childName: selectedService?.requiresChildData ? childName : null,
        childDob: selectedService?.requiresChildData ? childDob : null,
        customAnswers
      })

      if (res.success) {
        router.push(`/register/success?id=${res.id}`)
      } else {
        setErrorMsg(res.error || "Gagal mengirimkan pendaftaran.")
        setIsSubmitting(false)
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Terjadi kesalahan koneksi jaringan. Silakan coba lagi.")
      setIsSubmitting(false)
    }
  }

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between py-8 relative overflow-hidden">
      {/* Background Blurs */}
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

      {/* Main Content */}
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

          <form onSubmit={handleSubmit}>
            <CardContent className="p-8 space-y-8">
              {errorMsg && (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-600 font-semibold flex items-start gap-2.5 animate-in fade-in duration-200">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Section 1: Service Selection */}
              <div className="space-y-5">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-brand-teal/10 text-brand-teal font-bold text-xs">1</div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Pilih Layanan Utama</h3>
                </div>

                <div className="space-y-2">
                  <label htmlFor="service" className="text-xs font-semibold text-slate-700">Pilih Layanan Utama <span className="text-rose-500">*</span></label>
                  <Select
                    onValueChange={setServiceId}
                    defaultValue={serviceId}
                    value={serviceId}
                  >
                    <SelectTrigger className="h-12 border-slate-200 focus:ring-brand-teal/20 focus:border-brand-teal text-slate-800 text-sm">
                      <SelectValue placeholder="Pilih kelas atau konsultasi..." />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((item) => (
                        <SelectItem key={item.id} value={item.id} disabled={item.slots <= 0}>
                          {item.name} ({formatIDR(item.price)}) - {item.slots > 0 ? `Tersedia (${item.slots} Kursi)` : "Kuota Penuh"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Section 2: Parent Info */}
              <div className="space-y-5">
                <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                  <div className="flex items-center justify-center h-6 w-6 rounded-full bg-brand-teal/10 text-brand-teal font-bold text-xs">2</div>
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
                        value={parentName}
                        onChange={e => setParentName(e.target.value)}
                        className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all duration-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="whatsapp" className="text-xs font-semibold text-slate-700">Nomor WhatsApp Aktif <span className="text-rose-500">*</span></label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        id="whatsapp"
                        type="tel"
                        placeholder="Contoh: 081234567890"
                        value={whatsapp}
                        onChange={e => setWhatsapp(e.target.value)}
                        className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all duration-200"
                      />
                    </div>
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
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all duration-200"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Child Info (Conditional) */}
              {selectedService?.requiresChildData && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-brand-teal/10 text-brand-teal font-bold text-xs">3</div>
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
                          value={childName}
                          onChange={e => setChildName(e.target.value)}
                          className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="childDob" className="text-xs font-semibold text-slate-700">Tanggal Lahir Anak <span className="text-rose-500">*</span></label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        <input
                          id="childDob"
                          type="date"
                          value={childDob}
                          onChange={e => setChildDob(e.target.value)}
                          className="w-full h-12 pl-11 pr-4 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all duration-200"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 4: Dynamic Custom Fields (Conditional) */}
              {selectedService?.customFields && selectedService.customFields.length > 0 && (
                <div className="space-y-5 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3 pb-2 border-b border-slate-100">
                    <div className="flex items-center justify-center h-6 w-6 rounded-full bg-brand-teal/10 text-brand-teal font-bold text-xs">
                      {selectedService.requiresChildData ? "4" : "3"}
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800">Keterangan Tambahan</h3>
                  </div>

                  <div className="space-y-5">
                    {selectedService.customFields.map((field, idx) => (
                      <div key={idx} className="space-y-2">
                        <label className="text-xs font-semibold text-slate-700">
                          {field.label} {field.required && <span className="text-rose-500">*</span>}
                        </label>
                        {field.type === "textarea" ? (
                          <textarea
                            rows={4}
                            required={field.required}
                            placeholder={`Masukkan ${field.label.toLowerCase()}...`}
                            value={customAnswers[field.label] || ""}
                            onChange={e => handleCustomAnswerChange(field.label, e.target.value)}
                            className="w-full p-4 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all duration-200 resize-none leading-relaxed"
                          />
                        ) : (
                          <input
                            type="text"
                            required={field.required}
                            placeholder={`Masukkan ${field.label.toLowerCase()}...`}
                            value={customAnswers[field.label] || ""}
                            onChange={e => handleCustomAnswerChange(field.label, e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all duration-200"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="p-8 bg-slate-50/50 border-t border-slate-100 flex flex-col gap-4 sm:flex-row sm:justify-between items-center">
              <span className="text-xs text-slate-400 font-light flex items-center gap-1">
                <span className="text-rose-500">*</span> Wajib diisi secara lengkap
              </span>
              <button
                type="submit"
                disabled={isSubmitting || selectedService?.slots === 0}
                className="w-full sm:w-auto inline-flex items-center justify-center rounded-full bg-brand-teal px-8 py-3.5 text-sm font-semibold text-white hover:bg-brand-teal/95 transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting 
                  ? "Memproses Pendaftaran..." 
                  : (selectedService?.slots === 0 ? "Kuota Kelas Penuh" : "Kirim Pendaftaran")}
              </button>
            </CardFooter>
          </form>
        </Card>
      </main>

      <footer className="container mx-auto px-6 max-w-3xl mt-8 text-center text-xs text-slate-400 font-light">
        <p>© 2026 Gentala. Semua hak cipta dilindungi.</p>
      </footer>
    </div>
  )
}
