"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { logoutAction } from "./actions"
import RegistrationsTable from "./RegistrationsTable"
import ServiceCMS from "./ServiceCMS"
import AdminManagement from "./AdminManagement"
import { Shield, ClipboardList, Database, LogOut, LayoutDashboard, User, Users } from "lucide-react"

interface Service {
  id: string
  name: string
  price: number
  description: string
  slots: number
  requiresChildData: boolean
  customFields: any
  createdAt: Date | string
  updatedAt: Date | string
}

interface Registration {
  id: string
  serviceId: string
  parentName: string
  whatsapp: string
  email: string
  childName: string | null
  childDob: Date | string | null
  customAnswers: any
  status: string
  createdAt: Date | string
}

interface AdminProfile {
  id: string
  email: string
  role: string
  createdAt: Date | string
}

interface DashboardClientProps {
  adminEmail: string
  adminRole: string
  services: Service[]
  registrations: Registration[]
  admins?: AdminProfile[]
}

export default function DashboardClient({
  adminEmail,
  adminRole,
  services,
  registrations,
  admins = []
}: DashboardClientProps) {
  const [activeTab, setActiveTab] = React.useState<"registrations" | "cms" | "admins">("registrations")

  const getRoleBadge = (role: string) => {
    switch (role) {
      case "MASTER":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-teal text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
            <Shield className="h-3 w-3" />
            <span>Master Admin</span>
          </span>
        )
      case "PAUD":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
            <Shield className="h-3 w-3" />
            <span>Admin PAUD</span>
          </span>
        )
      case "PSIKOLOGI":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
            <Shield className="h-3 w-3" />
            <span>Admin Psikologi</span>
          </span>
        )
      case "PARENTING":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
            <Shield className="h-3 w-3" />
            <span>Admin Parenting</span>
          </span>
        )
      case "GYMNASTIC":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
            <Shield className="h-3 w-3" />
            <span>Admin Gymnastic</span>
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500 text-white text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
            <Shield className="h-3 w-3" />
            <span>Staf Admin</span>
          </span>
        )
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row">
      {/* Sidebar Panel */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200/60 flex flex-col justify-between shrink-0">
        <div className="p-6">
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2 text-brand-teal font-bold text-lg mb-8 tracking-tight">
            <div className="relative h-8 w-8 rounded-xl overflow-hidden shadow-inner border border-slate-100 bg-white">
              <Image
                src="/logo.jpeg"
                alt="Gentala Logo"
                fill
                sizes="32px"
                className="object-cover"
              />
            </div>
            <span>Gentala Admin</span>
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab("registrations")}
              className={`w-full h-10 px-4 inline-flex items-center gap-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "registrations"
                  ? "bg-brand-teal/10 text-brand-teal"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <ClipboardList className="h-4.5 w-4.5" />
              <span>Arsip Registrasi</span>
            </button>
            <button
              onClick={() => setActiveTab("cms")}
              className={`w-full h-10 px-4 inline-flex items-center gap-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                activeTab === "cms"
                  ? "bg-brand-teal/10 text-brand-teal"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Database className="h-4.5 w-4.5" />
              <span>CMS Layanan</span>
            </button>
            {adminRole === "MASTER" && (
              <button
                onClick={() => setActiveTab("admins")}
                className={`w-full h-10 px-4 inline-flex items-center gap-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  activeTab === "admins"
                    ? "bg-brand-teal/10 text-brand-teal"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Users className="h-4.5 w-4.5" />
                <span>Kelola Staf Admin</span>
              </button>
            )}
          </nav>
        </div>

        {/* User Session Footer inside Sidebar */}
        <div className="p-6 border-t border-slate-100 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-100 border border-slate-200/50 flex items-center justify-center shrink-0">
                <User className="h-4 w-4 text-slate-500" />
              </div>
              <div className="overflow-hidden">
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Identitas Staf</p>
                <p className="text-xs text-slate-700 font-semibold truncate leading-tight mt-0.5" title={adminEmail}>
                  {adminEmail}
                </p>
              </div>
            </div>
            <div className="pt-1">{getRoleBadge(adminRole)}</div>
          </div>

          <form action={logoutAction} className="pt-2">
            <button
              type="submit"
              className="w-full h-10 inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-100 transition-all duration-300 cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Keluar Dasbor</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-grow p-6 md:p-10 space-y-8 overflow-y-auto max-h-screen">
        {/* Top bar header */}
        <header className="flex justify-between items-center border-b border-slate-200/50 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-slate-400 text-xs">
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Dasbor</span>
              <span>/</span>
              <span className="font-semibold text-slate-600 capitalize">
                {activeTab === "registrations" ? "Arsip Registrasi" : activeTab === "cms" ? "CMS Layanan" : "Kelola Staf Admin"}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-slate-900 leading-tight">
              {activeTab === "registrations" 
                ? "Manajemen Pendaftaran Murid" 
                : activeTab === "cms" 
                  ? "Content Management System (CMS)" 
                  : "Manajemen Akun Staf Admin"
              }
            </h1>
          </div>
        </header>

        {/* Tab contents wrapper */}
        <div className="animate-in fade-in duration-300">
          {activeTab === "registrations" && (
            <RegistrationsTable registrations={registrations} services={services} />
          )}
          {activeTab === "cms" && (
            <ServiceCMS services={services} adminEmail={adminEmail} adminRole={adminRole} />
          )}
          {activeTab === "admins" && (
            <AdminManagement admins={admins} adminEmail={adminEmail} />
          )}
        </div>
      </main>
    </div>
  )
}
