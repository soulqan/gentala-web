"use client"

import * as React from "react"
import { Search, Download, ClipboardList, X } from "lucide-react"

interface Service {
  id: string
  name: string
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

interface RegistrationsTableProps {
  registrations: Registration[]
  services: Service[]
}

export default function RegistrationsTable({
  registrations,
  services
}: RegistrationsTableProps) {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState("ALL")
  const [serviceFilter, setServiceFilter] = React.useState("ALL")
  const [selectedAnswers, setSelectedAnswers] = React.useState<{
    parentName: string
    answers: Record<string, any>
  } | null>(null)

  // Map service ID to service Name for quick access
  const serviceMap = React.useMemo(() => {
    return new Map(services.map(s => [s.id, s.name]))
  }, [services])

  // Filtered registrations list
  const filteredRegistrations = React.useMemo(() => {
    return registrations.filter(reg => {
      const parentMatch = reg.parentName.toLowerCase().includes(searchTerm.toLowerCase())
      const childMatch = reg.childName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
      const searchMatch = parentMatch || childMatch

      const statusMatch = statusFilter === "ALL" || reg.status === statusFilter
      const serviceMatch = serviceFilter === "ALL" || reg.serviceId === serviceFilter

      return searchMatch && statusMatch && serviceMatch
    })
  }, [registrations, searchTerm, statusFilter, serviceFilter])

  // Export to CSV helper
  const exportToCSV = () => {
    const headers = [
      "ID Registrasi",
      "Tanggal Daftar",
      "Nama Orang Tua",
      "WhatsApp",
      "Email",
      "Layanan",
      "Nama Anak",
      "Tanggal Lahir Anak",
      "Status",
      "Catatan / Jawaban Kustom"
    ]

    const rows = filteredRegistrations.map(reg => {
      const createdDate = new Date(reg.createdAt).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric"
      })
      const dob = reg.childDob 
        ? new Date(reg.childDob).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
        : "-"

      // Format custom answers JSON to single text string
      let customText = ""
      if (reg.customAnswers && typeof reg.customAnswers === "object") {
        customText = Object.entries(reg.customAnswers)
          .map(([key, val]) => `${key}: ${val}`)
          .join(" | ")
      }

      // Escape quotes for CSV safety
      const escape = (text: string) => `"${text.replace(/"/g, '""')}"`

      return [
        escape(reg.id),
        escape(createdDate),
        escape(reg.parentName),
        escape(reg.whatsapp),
        escape(reg.email),
        escape(serviceMap.get(reg.serviceId) || reg.serviceId),
        escape(reg.childName || "-"),
        escape(dob),
        escape(reg.status),
        escape(customText)
      ].join(",")
    })

    const csvContent = [headers.join(","), ...rows].join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `pendaftaran-gentala-${new Date().toISOString().slice(0, 10)}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold">
            SUCCESS
          </span>
        )
      case "FAILED":
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100 text-xs font-semibold">
            FAILED
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 text-xs font-semibold">
            PENDING
          </span>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white border border-slate-200/60 p-5 rounded-2xl shadow-[0_4px_20px_rgba(13,92,102,0.02)]">
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto flex-grow max-w-3xl">
          {/* Search Input */}
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Cari nama orang tua atau anak..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal bg-slate-50/50"
            />
          </div>

          {/* Service filter */}
          <select
            value={serviceFilter}
            onChange={e => setServiceFilter(e.target.value)}
            className="h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal bg-white"
          >
            <option value="ALL">Semua Layanan</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal bg-white"
          >
            <option value="ALL">Semua Status</option>
            <option value="PENDING">PENDING</option>
            <option value="SUCCESS">SUCCESS</option>
            <option value="FAILED">FAILED</option>
          </select>
        </div>

        {/* CSV export button */}
        <button
          onClick={exportToCSV}
          disabled={filteredRegistrations.length === 0}
          className="h-10 px-4 inline-flex items-center gap-2 rounded-xl bg-brand-teal text-white hover:bg-brand-teal/95 disabled:bg-slate-100 disabled:text-slate-400 disabled:border-transparent text-xs font-semibold shadow-sm transition-colors duration-200 cursor-pointer disabled:cursor-not-allowed"
        >
          <Download className="h-4 w-4" />
          <span>Ekspor ke CSV</span>
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(13,92,102,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Orang Tua</th>
                <th className="py-4 px-6">Kontak & Email</th>
                <th className="py-4 px-6">Layanan</th>
                <th className="py-4 px-6">Anak</th>
                <th className="py-4 px-6">Lahir Anak</th>
                <th className="py-4 px-6 text-center">Jawaban Kustom</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6">Tgl Daftar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {filteredRegistrations.length > 0 ? (
                filteredRegistrations.map(reg => {
                  const regDate = new Date(reg.createdAt).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })
                  const dob = reg.childDob
                    ? new Date(reg.childDob).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })
                    : "-"

                  const hasCustomAnswers = reg.customAnswers && Object.keys(reg.customAnswers).length > 0

                  return (
                    <tr key={reg.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6 font-semibold text-slate-900">{reg.parentName}</td>
                      <td className="py-4 px-6 leading-relaxed">
                        <div className="font-medium text-slate-800">{reg.whatsapp}</div>
                        <div className="text-[10px] text-slate-400 font-light">{reg.email}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-brand-teal">
                          {serviceMap.get(reg.serviceId) || reg.serviceId}
                        </span>
                      </td>
                      <td className="py-4 px-6 font-medium">{reg.childName || "-"}</td>
                      <td className="py-4 px-6 text-slate-500 font-light">{dob}</td>
                      <td className="py-4 px-6 text-center">
                        {hasCustomAnswers ? (
                          <button
                            onClick={() => setSelectedAnswers({ parentName: reg.parentName, answers: reg.customAnswers })}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-teal/10 hover:text-brand-teal text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            <ClipboardList className="h-3.5 w-3.5" />
                            <span>Lihat Catatan</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 italic font-light">-</span>
                        )}
                      </td>
                      <td className="py-4 px-6 text-center">{getStatusBadge(reg.status)}</td>
                      <td className="py-4 px-6 text-slate-500 font-light">{regDate}</td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-light bg-slate-50/20">
                    Tidak ditemukan data pendaftaran yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="py-3.5 px-6 bg-slate-50 border-t border-slate-100 text-[10px] text-slate-400 font-semibold flex justify-between">
          <span>Menampilkan {filteredRegistrations.length} dari {registrations.length} pendaftaran</span>
          <span>Gentala Child Development Center</span>
        </div>
      </div>

      {/* Custom Answers Modal */}
      {selectedAnswers && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 shadow-2xl rounded-3xl w-full max-w-md overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Catatan Khusus Pendaftar</h3>
                <p className="text-[10px] text-slate-400 font-light">Orang Tua: {selectedAnswers.parentName}</p>
              </div>
              <button
                onClick={() => setSelectedAnswers(null)}
                className="h-8 w-8 rounded-full inline-flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4 max-h-[300px] overflow-y-auto">
              {Object.entries(selectedAnswers.answers).map(([key, value]) => (
                <div key={key} className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <h5 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{key}</h5>
                  <p className="text-xs text-slate-800 font-medium leading-relaxed whitespace-pre-wrap">{String(value)}</p>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setSelectedAnswers(null)}
                className="h-9 px-4 rounded-full bg-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-300/80 transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
