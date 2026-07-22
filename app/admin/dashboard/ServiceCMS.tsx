"use client"

import * as React from "react"
import { Edit, Plus } from "lucide-react"
import CreateServiceModal from "./CreateServiceModal"
import EditServiceModal from "./EditServiceModal"

interface Service {
  id: string
  name: string
  price: number
  description: string
  schedule: string
  slots: number
  requiresChildData: boolean
  customFields: any // JSON array of CustomField
  createdAt: Date | string
  updatedAt: Date | string
}

interface ServiceCMSProps {
  services: Service[]
  adminEmail: string
  adminRole: string
}

export default function ServiceCMS({ services, adminEmail, adminRole }: ServiceCMSProps) {
  const [editingService, setEditingService] = React.useState<Service | null>(null)
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <div className="space-y-6">
      {/* CMS Header Intro */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200/60 p-6 rounded-3xl shadow-[0_4px_20px_rgba(13,92,102,0.02)]">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 leading-snug font-sans">Sistem CMS Layanan Gentala</h3>
          <p className="text-xs text-slate-500 font-light leading-relaxed">
            Perubahan pada deskripsi, tarif, jadwal, atau formulir di halaman ini akan langsung disinkronkan ke halaman detail layanan publik secara real-time.
          </p>
        </div>
        {adminRole === "MASTER" && (
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="h-10 px-4 inline-flex items-center gap-1.5 rounded-full bg-brand-teal text-white hover:bg-brand-teal/95 text-xs font-semibold shadow-sm transition-colors duration-200 cursor-pointer shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Tambah Layanan Baru</span>
          </button>
        )}
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => {
          let fieldsCount = 0
          if (Array.isArray(service.customFields)) {
            fieldsCount = service.customFields.length
          } else if (typeof service.customFields === "string") {
            try {
              fieldsCount = JSON.parse(service.customFields).length
            } catch (e) {
              fieldsCount = 0
            }
          }

          return (
            <div
              key={service.id}
              className="bg-white border border-slate-200/60 rounded-3xl p-6 shadow-[0_4px_20px_rgba(13,92,102,0.02)] flex flex-col justify-between hover:border-brand-teal/30 hover:shadow-md transition-all duration-300"
            >
              <div>
                <div className="flex justify-between items-start gap-2 mb-4">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">{service.name}</h3>
                  <span className="text-[10px] px-2 py-0.5 bg-slate-100 rounded-md font-mono text-slate-500 uppercase">
                    {service.id}
                  </span>
                </div>
                <div className="text-sm font-extrabold text-brand-teal mb-3">
                  {formatIDR(service.price)}
                </div>
                <p className="text-xs text-slate-500 font-light leading-relaxed mb-4 line-clamp-3">
                  {service.description}
                </p>

                {/* Key parameters summary */}
                <div className="space-y-2.5 pt-4 border-t border-slate-100 mb-6">
                  <div className="flex justify-between text-xs font-light text-slate-500">
                    <span>Kuota Tersedia:</span>
                    <span className="font-semibold text-slate-800">{service.slots} Kursi</span>
                  </div>
                  <div className="flex justify-between text-xs font-light text-slate-500">
                    <span>Jadwal:</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[140px]" title={service.schedule}>
                      {service.schedule || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-light text-slate-500">
                    <span>Data Anak Diperlukan:</span>
                    <span className={`font-semibold ${service.requiresChildData ? "text-brand-teal" : "text-amber-600"}`}>
                      {service.requiresChildData ? "Ya (Wajib)" : "Tidak"}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs font-light text-slate-500">
                    <span>Formulir Kustom:</span>
                    <span className="font-semibold text-slate-800">
                      {fieldsCount > 0 ? `${fieldsCount} Kolom Aktif` : "Tidak Ada"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setEditingService(service)}
                className="w-full h-10 inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-50 border border-slate-200 hover:bg-brand-teal/5 hover:border-brand-teal/20 text-xs font-semibold text-slate-700 hover:text-brand-teal transition-colors cursor-pointer"
              >
                <Edit className="h-3.5 w-3.5" />
                <span>Edit Rincian Layanan</span>
              </button>
            </div>
          )
        })}
      </div>

      {/* Creation Modal Sub-component */}
      <CreateServiceModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        adminEmail={adminEmail}
      />

      {/* Editing Modal Sub-component */}
      <EditServiceModal
        service={editingService}
        onClose={() => setEditingService(null)}
        adminEmail={adminEmail}
      />
    </div>
  )
}
