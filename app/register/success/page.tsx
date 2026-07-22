import * as React from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { prisma } from "@/lib/prisma"
import { 
  CheckCircle2, 
  Home, 
  MessageSquare, 
  ArrowRight, 
  ClipboardCheck, 
  Clock, 
  XCircle, 
  CreditCard 
} from "lucide-react"

interface PageProps {
  searchParams: Promise<{ id?: string }>
}

export default async function RegisterSuccessPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const id = resolvedParams.id

  if (!id) {
    notFound()
  }

  // 1. Fetch registration details from Supabase database
  const registration = await prisma.registration.findUnique({
    where: { id }
  })

  if (!registration) {
    notFound()
  }

  // 2. Fetch related service details
  const service = await prisma.service.findUnique({
    where: { id: registration.serviceId }
  })

  // Format IDR pricing
  const formatIDR = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(value)
  }

  // Parse customAnswers safely
  let customAnswers: Record<string, string> = {}
  if (registration.customAnswers) {
    if (typeof registration.customAnswers === "string") {
      try {
        customAnswers = JSON.parse(registration.customAnswers)
      } catch (e) {
        customAnswers = {}
      }
    } else {
      customAnswers = registration.customAnswers as Record<string, string>
    }
  }

  const waBase = "6281234567890" // Official Gentala Admin WhatsApp number

  // Render PENDING Status Screen (Waiting for Payment)
  if (registration.status === "PENDING") {
    const waTextPending = encodeURIComponent(
      `Halo Admin Gentala, saya baru saja melakukan pendaftaran.\n\n` +
      `*ID Registrasi:* ${registration.id}\n` +
      `*Nama Orang Tua:* ${registration.parentName}\n` +
      `*Program Layanan:* ${service?.name || "Program Stimulasi"}\n` +
      `*Biaya:* ${service ? formatIDR(service.price) : "-"}\n\n` +
      `Berikut saya lampirkan bukti transfer pembayaran pendaftaran saya.`
    )
    const whatsappUrlPending = `https://wa.me/${waBase}?text=${waTextPending}`

    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -z-10 translate-x-20 -translate-y-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-sage/5 rounded-full blur-3xl -z-10 -translate-x-20 translate-y-20" />

        <header className="container mx-auto px-6 max-w-2xl mb-6">
          <div className="flex justify-center">
            <Link href="/" className="flex items-center gap-2 text-brand-teal font-bold text-lg tracking-tight">
              <div className="relative h-8 w-8 rounded-xl overflow-hidden shadow-inner border border-slate-100 bg-white">
                <Image src="/logo.jpeg" alt="Gentala Logo" fill sizes="32px" className="object-cover" />
              </div>
              <span>Gentala</span>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-6 max-w-2xl flex-grow flex items-center justify-center">
          <div className="bg-white border border-slate-200/60 shadow-[0_15px_50px_rgba(13,92,102,0.04)] rounded-3xl p-8 sm:p-10 w-full text-center space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-500 animate-pulse">
                <Clock className="h-9 w-9" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Menunggu Pembayaran
              </h1>
              <p className="text-slate-500 font-light text-sm max-w-md mx-auto leading-relaxed">
                Pendaftaran Anda telah tersimpan. Silakan lakukan pembayaran transfer bank di bawah ini untuk mengamankan slot kursi stimulasi anak Anda.
              </p>
            </div>

            {/* Billing details card */}
            <div className="bg-amber-50/40 border border-amber-100/70 rounded-2xl p-6 text-left space-y-4">
              <div className="flex items-center gap-2 pb-2.5 border-b border-amber-100/50">
                <CreditCard className="h-4.5 w-4.5 text-amber-600" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-700">Rincian Rekening Transfer</h4>
              </div>

              <div className="grid grid-cols-3 gap-y-3.5 text-xs text-slate-700 font-light">
                <span className="text-slate-400 font-medium">Bank Penerima</span>
                <span className="col-span-2 font-bold text-slate-800">Bank Mandiri (120)</span>

                <span className="text-slate-400 font-medium">Nomor Rekening</span>
                <span className="col-span-2 font-extrabold text-brand-teal text-sm font-mono tracking-wide">
                  123-456-789-0
                </span>

                <span className="text-slate-400 font-medium">Atas Nama</span>
                <span className="col-span-2 font-bold text-slate-800">Gentala Child Development</span>

                <span className="text-slate-450 font-medium border-t border-amber-100/55 pt-3 mt-1">Total Tagihan</span>
                <span className="col-span-2 font-extrabold text-brand-teal text-base border-t border-amber-100/55 pt-2.5 mt-1">
                  {service ? formatIDR(service.price) : "-"}
                </span>
              </div>
            </div>

            {/* Note & Action Buttons */}
            <div className="space-y-4">
              <p className="text-[10px] text-slate-400 font-light max-w-sm mx-auto leading-relaxed">
                *Kursi stimulasi Anda hanya ditahan sementara. Pembayaran Anda akan diverifikasi secara manual oleh staf Gentala setelah bukti transfer dikirimkan.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link
                  href={whatsappUrlPending}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-grow h-12 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white hover:bg-[#20ba59] text-sm font-semibold shadow-md transition-colors"
                >
                  <MessageSquare className="h-5 w-5 shrink-0" />
                  <span>Kirim Bukti Transfer ke WhatsApp</span>
                </Link>
                <Link
                  href="/"
                  className="h-12 px-6 inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-semibold transition-colors"
                >
                  <Home className="h-4.5 w-4.5 shrink-0" />
                  <span>Kembali</span>
                </Link>
              </div>
            </div>
          </div>
        </main>

        <footer className="container mx-auto px-6 max-w-2xl mt-6 text-center text-xs text-slate-400 font-light">
          <p>© 2026 Gentala. Semua hak cipta dilindungi.</p>
        </footer>
      </div>
    )
  }

  // Render FAILED Status Screen
  if (registration.status === "FAILED") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between py-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/5 rounded-full blur-3xl -z-10 translate-x-20 -translate-y-20" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-sage/5 rounded-full blur-3xl -z-10 -translate-x-20 translate-y-20" />

        <header className="container mx-auto px-6 max-w-2xl mb-6">
          <div className="flex justify-center">
            <Link href="/" className="flex items-center gap-2 text-brand-teal font-bold text-lg tracking-tight">
              <div className="relative h-8 w-8 rounded-xl overflow-hidden shadow-inner border border-slate-100 bg-white">
                <Image src="/logo.jpeg" alt="Gentala Logo" fill sizes="32px" className="object-cover" />
              </div>
              <span>Gentala</span>
            </Link>
          </div>
        </header>

        <main className="container mx-auto px-6 max-w-2xl flex-grow flex items-center justify-center">
          <div className="bg-white border border-slate-200/60 shadow-[0_15px_50px_rgba(13,92,102,0.04)] rounded-3xl p-8 sm:p-10 w-full text-center space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-center">
              <div className="h-16 w-16 rounded-full bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
                <XCircle className="h-10 w-10" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Pendaftaran Dibatalkan / Gagal
              </h1>
              <p className="text-slate-505 font-light text-sm max-w-md mx-auto leading-relaxed">
                Mohon maaf, pendaftaran dengan kode registrasi di bawah ini tidak dapat kami teruskan atau telah dibatalkan karena kendala administrasi.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 text-left text-xs font-light text-slate-550 space-y-2">
              <div className="flex justify-between">
                <span>Kode Registrasi:</span>
                <span className="font-semibold text-slate-800 font-mono">{registration.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Layanan Kelas:</span>
                <span className="font-semibold text-slate-800">{service?.name || "-"}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href={`https://wa.me/${waBase}?text=Halo%20Gentala%2C%20saya%20memiliki%20kendala%20terkait%20registrasi%20${registration.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-grow h-12 inline-flex items-center justify-center gap-2 rounded-full bg-brand-teal text-white hover:bg-brand-teal/95 text-sm font-semibold shadow-md transition-colors"
              >
                <MessageSquare className="h-5 w-5 shrink-0" />
                <span>Hubungi Bantuan Admin</span>
              </Link>
              <Link
                href="/"
                className="h-12 px-6 inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-semibold transition-colors"
              >
                <Home className="h-4.5 w-4.5 shrink-0" />
                <span>Kembali ke Beranda</span>
              </Link>
            </div>
          </div>
        </main>

        <footer className="container mx-auto px-6 max-w-2xl mt-6 text-center text-xs text-slate-400 font-light">
          <p>© 2026 Gentala. Semua hak cipta dilindungi.</p>
        </footer>
      </div>
    )
  }

  // Render SUCCESS Status Screen (Payment Verified)
  const waTextSuccess = encodeURIComponent(
    `Halo Admin Gentala, pendaftaran saya telah terverifikasi sukses.\n\n` +
    `*ID Registrasi:* ${registration.id}\n` +
    `*Nama Orang Tua:* ${registration.parentName}\n` +
    `*Program Layanan:* ${service?.name || "Program Stimulasi"}\n\n` +
    `Saya ingin melakukan koordinasi jadwal kunjungan kelas anak saya.`
  )
  const whatsappUrlSuccess = `https://wa.me/${waBase}?text=${waTextSuccess}`

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between py-12 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl -z-10 translate-x-20 -translate-y-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-sage/5 rounded-full blur-3xl -z-10 -translate-x-20 translate-y-20" />

      <header className="container mx-auto px-6 max-w-2xl mb-6">
        <div className="flex justify-center">
          <Link href="/" className="flex items-center gap-2 text-brand-teal font-bold text-lg tracking-tight">
            <div className="relative h-8 w-8 rounded-xl overflow-hidden shadow-inner border border-slate-100 bg-white">
              <Image src="/logo.jpeg" alt="Gentala Logo" fill sizes="32px" className="object-cover" />
            </div>
            <span>Gentala</span>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-6 max-w-2xl flex-grow flex items-center justify-center">
        <div className="bg-white border border-slate-200/60 shadow-[0_15px_50px_rgba(13,92,102,0.06)] rounded-3xl p-8 sm:p-10 w-full text-center space-y-6 animate-in fade-in duration-300">
          <div className="flex justify-center">
            <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-500 animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Pembayaran Berhasil!
            </h1>
            <p className="text-slate-550 font-light text-sm max-w-md mx-auto leading-relaxed">
              Selamat! Pembayaran Anda telah kami verifikasi secara sukses. Kursi stimulasi anak Anda telah berhasil dipesan.
            </p>
          </div>

          {/* Summary receipt card */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 text-left space-y-4">
            <div className="flex items-center gap-2 pb-2.5 border-b border-slate-100">
              <ClipboardCheck className="h-4.5 w-4.5 text-brand-teal shrink-0" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Ringkasan Bukti Pembayaran Lunas</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-y-3.5 text-xs text-slate-600 font-light">
              <span className="text-slate-400 font-medium">ID Registrasi</span>
              <span className="sm:col-span-2 text-slate-800 font-semibold font-mono break-all">{registration.id}</span>

              <span className="text-slate-400 font-medium">Nama Orang Tua</span>
              <span className="sm:col-span-2 text-slate-850 font-semibold">{registration.parentName}</span>

              <span className="text-slate-400 font-medium">WhatsApp</span>
              <span className="sm:col-span-2 text-slate-850 font-semibold">{registration.whatsapp}</span>

              <span className="text-slate-400 font-medium">Email</span>
              <span className="sm:col-span-2 text-slate-850 font-semibold">{registration.email}</span>

              <span className="text-slate-400 font-medium">Kelas / Layanan</span>
              <span className="sm:col-span-2 text-brand-teal font-extrabold">{service?.name || "-"}</span>

              <span className="text-slate-400 font-medium">Status Pembayaran</span>
              <span className="sm:col-span-2 text-emerald-600 font-extrabold">TERVERIFIKASI (LUNAS)</span>

              {registration.childName && (
                <>
                  <span className="text-slate-400 font-medium">Nama Anak</span>
                  <span className="sm:col-span-2 text-slate-850 font-semibold">{registration.childName}</span>
                </>
              )}

              {registration.childDob && (
                <>
                  <span className="text-slate-400 font-medium">Tanggal Lahir Anak</span>
                  <span className="sm:col-span-2 text-slate-850 font-semibold">
                    {new Date(registration.childDob).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </span>
                </>
              )}

              {Object.keys(customAnswers).length > 0 && (
                <>
                  <span className="text-slate-450 font-medium sm:col-span-3 border-t border-slate-100 pt-2.5 mt-1 font-bold uppercase tracking-wider text-[10px]">
                    Jawaban Formulir Kustom
                  </span>
                  {Object.entries(customAnswers).map(([key, val]) => (
                    <React.Fragment key={key}>
                      <span className="text-slate-400 pl-2">{key}</span>
                      <span className="sm:col-span-2 text-slate-700 whitespace-pre-wrap font-medium">{val || "-"}</span>
                    </React.Fragment>
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={whatsappUrlSuccess}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-grow h-12 inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] text-white hover:bg-[#20ba59] text-sm font-semibold shadow-md transition-colors"
            >
              <MessageSquare className="h-5 w-5 shrink-0" />
              <span>Koordinasi Jadwal via WhatsApp</span>
            </Link>
            
            <Link
              href="/"
              className="h-12 px-6 inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 text-sm font-semibold transition-colors"
            >
              <Home className="h-4.5 w-4.5 shrink-0" />
              <span>Selesai</span>
            </Link>
          </div>
        </div>
      </main>

      <footer className="container mx-auto px-6 max-w-2xl mt-6 text-center text-xs text-slate-450 font-light">
        <p>© 2026 Gentala Child Development Center. Semua hak cipta dilindungi.</p>
      </footer>
    </div>
  )
}
