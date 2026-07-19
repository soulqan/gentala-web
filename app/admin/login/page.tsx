import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { hashPassword } from "@/lib/crypto"
import { ArrowLeft, Lock, Mail, Sparkles, UserCheck, KeyRound } from "lucide-react"

async function ensureDefaultAdminProfiles() {
  const defaultAdmins = [
    { email: "admin@gentala.com", role: "MASTER" as const, password: "admin123" },
    { email: "paud@gentala.com", role: "PAUD" as const, password: "paud123" },
    { email: "psikologi@gentala.com", role: "PSIKOLOGI" as const, password: "psikologi123" },
    { email: "parenting@gentala.com", role: "PARENTING" as const, password: "parenting123" },
    { email: "gymnastic@gentala.com", role: "GYMNASTIC" as const, password: "gymnastic123" }
  ]

  for (const adm of defaultAdmins) {
    await prisma.adminProfile.upsert({
      where: { email: adm.email },
      update: {},
      create: {
        email: adm.email,
        password: hashPassword(adm.password),
        role: adm.role
      }
    })
  }
}

export default async function AdminLoginPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  // Pre-seed default testing profiles on server load
  await ensureDefaultAdminProfiles()

  const resolvedParams = await searchParams
  let errorMsg = ""
  if (resolvedParams.error === "unauthorized") {
    errorMsg = "Akses ditolak. Email tidak terdaftar sebagai staf admin."
  } else if (resolvedParams.error === "invalid_credentials") {
    errorMsg = "Email atau password salah. Silakan periksa kembali."
  }

  async function loginAction(formData: FormData) {
    "use server"
    const email = (formData.get("email") as string || "").trim().toLowerCase()
    const password = formData.get("password") as string

    if (!email || !password) {
      redirect("/admin/login?error=invalid_credentials")
    }

    const hashedPassword = hashPassword(password)
    const profile = await prisma.adminProfile.findFirst({
      where: {
        email,
        password: hashedPassword
      }
    })

    if (!profile) {
      redirect("/admin/login?error=invalid_credentials")
    }

    const cookieStore = await cookies()
    cookieStore.set("admin_session_email", profile.email, {
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/"
    })
    redirect("/admin/dashboard")
  }

  async function quickLoginAction(email: string) {
    "use server"
    const profile = await prisma.adminProfile.findUnique({
      where: { email }
    })

    if (!profile) {
      redirect("/admin/login?error=unauthorized")
    }

    const cookieStore = await cookies()
    cookieStore.set("admin_session_email", profile.email, {
      maxAge: 60 * 60 * 24,
      path: "/"
    })
    redirect("/admin/dashboard")
  }

  const demoAccounts = [
    { email: "admin@gentala.com", label: "Master Admin", pass: "admin123" },
    { email: "paud@gentala.com", label: "Admin PAUD & Daycare", pass: "paud123" },
    { email: "psikologi@gentala.com", label: "Admin Biro Psikologi", pass: "psikologi123" },
    { email: "parenting@gentala.com", label: "Admin Parenting", pass: "parenting123" },
    { email: "gymnastic@gentala.com", label: "Admin Gymnastic", pass: "gymnastic123" }
  ]

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between py-12 relative overflow-hidden">
      {/* Decorative Blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-teal/5 rounded-full blur-3xl -z-10 translate-x-20 -translate-y-20" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-brand-sage/5 rounded-full blur-3xl -z-10 -translate-x-20 translate-y-20" />

      {/* Simplified Header */}
      <header className="container mx-auto px-6 max-w-md mb-6">
        <Link href="/" className="flex items-center gap-2 text-brand-teal font-bold text-lg justify-center tracking-tight">
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
      </header>

      {/* Main Login Card */}
      <main className="container mx-auto px-6 max-w-md flex-grow flex flex-col justify-center">
        <div className="bg-white border border-slate-200/60 shadow-[0_10px_40px_rgba(13,92,102,0.04)] rounded-3xl p-8 w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-brand-teal/10 text-brand-teal text-xs font-semibold uppercase tracking-wider mb-3">
              <Lock className="h-3.5 w-3.5" />
              <span>Portal Keamanan Staf</span>
            </div>
            <h2 className="text-xl font-extrabold text-slate-900 leading-tight">
              Masuk ke Dasbor Admin
            </h2>
            <p className="text-xs text-slate-500 font-light mt-1.5 leading-relaxed">
              Silakan masukkan email terdaftar staf Gentala beserta kata sandi yang sesuai.
            </p>
          </div>

          {errorMsg && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-600 font-medium leading-relaxed">
              {errorMsg}
            </div>
          )}

          <form action={loginAction} className="space-y-4">
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-slate-700">Email Staf <span className="text-rose-500">*</span></label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="staf@gentala.com"
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all duration-200"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-slate-700">Kata Sandi <span className="text-rose-500">*</span></label>
              <div className="relative">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full h-11 pl-11 pr-4 rounded-xl border border-slate-200 text-sm text-slate-800 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal transition-all duration-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 mt-2 inline-flex items-center justify-center rounded-full bg-brand-teal text-sm font-semibold text-white hover:bg-brand-teal/95 transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer"
            >
              Masuk Dasbor
            </button>
          </form>

          {/* Quick Login Section for Developer Review */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400 text-center mb-4 flex items-center justify-center gap-1.5">
              <Sparkles className="h-3 w-3 text-brand-teal" />
              <span>Simulasi Uji Coba (Bypass Cepat)</span>
            </h4>
            <div className="grid grid-cols-1 gap-2.5">
              {demoAccounts.map((demo) => (
                <form key={demo.email} action={quickLoginAction.bind(null, demo.email)}>
                  <button
                    type="submit"
                    className="w-full h-12 px-4 inline-flex items-center justify-between rounded-xl bg-slate-50 border border-slate-100 hover:bg-brand-teal/5 hover:border-brand-teal/25 text-left text-xs font-semibold text-slate-700 hover:text-brand-teal transition-all duration-200 cursor-pointer"
                  >
                    <span className="flex flex-col">
                      <span className="flex items-center gap-1.5">
                        <UserCheck className="h-3.5 w-3.5 text-slate-400" />
                        <span>{demo.label}</span>
                      </span>
                      <span className="text-[9px] text-slate-400 font-light mt-0.5">{demo.email}</span>
                    </span>
                    <span className="text-[10px] bg-slate-200/50 text-slate-500 px-2 py-0.5 rounded font-mono">
                      pass: {demo.pass}
                    </span>
                  </button>
                </form>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Simplified Footer */}
      <footer className="container mx-auto px-6 max-w-md mt-6 text-center">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-brand-teal transition-colors font-light">
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Kembali ke Halaman Utama</span>
        </Link>
      </footer>
    </div>
  )
}
