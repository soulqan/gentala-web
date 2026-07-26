"use client"

import * as React from "react"
import { Edit, Plus, Trash2 } from "lucide-react"
import CreateServiceModal from "./CreateServiceModal"
import EditServiceModal from "./EditServiceModal"
import { deleteServiceAction } from "./actions"

interface Service {
  id: string
  name: string
  price: number
  description: string
  schedule: string
  slots: number
  requiresChildData: boolean
  customFields: any // JSON array of CustomField
  createdBy: string
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
  const [deletingId, setDeletingId] = React.useState<string | null>(null)
  const [serviceToDelete, setServiceToDelete] = React.useState<{ id: string; name: string } | null>(null)

  const formatIDR = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0
    }).format(value)
  }

  const executeDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await deleteServiceAction(adminEmail, id)
      if (res.success) {
        setServiceToDelete(null)
      } else {
        alert(res.error || "Gagal menghapus layanan.")
      }
    } catch (err) {
      console.error(err)
      alert("Terjadi kesalahan koneksi.")
    } finally {
      setDeletingId(null)
    }
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
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="h-10 px-4 inline-flex items-center gap-1.5 rounded-full bg-brand-teal text-white hover:bg-brand-teal/95 text-xs font-semibold shadow-sm transition-colors duration-200 cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>Tambah Layanan Baru</span>
        </button>
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

              <div className="flex gap-2 w-full">
                <button
                  onClick={() => setEditingService(service)}
                  disabled={deletingId !== null}
                  className="flex-grow h-10 inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-50 border border-slate-200 hover:bg-brand-teal/5 hover:border-brand-teal/20 text-xs font-semibold text-slate-700 hover:text-brand-teal transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Edit className="h-3.5 w-3.5" />
                  <span>Edit</span>
                </button>
                {(adminRole === "MASTER" || service.createdBy === adminEmail) && (
                  <button
                    onClick={() => setServiceToDelete({ id: service.id, name: service.name })}
                    disabled={deletingId !== null}
                    className="h-10 px-3.5 inline-flex items-center justify-center rounded-full bg-rose-50 border border-rose-100 hover:bg-rose-100 hover:text-rose-700 text-rose-600 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                    title="Hapus Layanan"
                  >
                    {deletingId === service.id ? (
                      <span className="h-4 w-4 rounded-full border-2 border-rose-600/20 border-t-rose-600 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </button>
                )}
              </div>
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

      {/* Custom Delete Confirmation Modal */}
      {serviceToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-150">
          <div className="bg-white border border-slate-100 shadow-2xl rounded-3xl w-full max-w-sm overflow-hidden flex flex-col p-6 space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="h-10 w-10 rounded-full bg-rose-50 flex items-center justify-center shrink-0">
                <Trash2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-900">Hapus Program Layanan</h3>
            </div>
            
            <p className="text-xs text-slate-500 font-light leading-relaxed">
              Apakah Anda yakin ingin menghapus layanan <span className="font-semibold text-slate-800">"{serviceToDelete.name}"</span>? 
              Semua data registrasi pendaftar terkait layanan ini juga akan dihapus secara permanen dari database.
            </p>
            
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setServiceToDelete(null)}
                disabled={deletingId !== null}
                className="flex-1 h-10 rounded-full border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600 transition-colors cursor-pointer disabled:opacity-50"
              >
                Batalkan
              </button>
              <button
                type="button"
                onClick={() => executeDelete(serviceToDelete.id)}
                disabled={deletingId !== null}
                className="flex-1 h-10 rounded-full bg-rose-600 text-white hover:bg-rose-700 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
              >
                {deletingId !== null ? (
                  <span className="h-4 w-4 rounded-full border-2 border-white/20 border-t-white animate-spin" />
                ) : (
                  <span>Ya, Hapus</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
