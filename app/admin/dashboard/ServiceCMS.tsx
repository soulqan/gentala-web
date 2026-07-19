"use client"

import * as React from "react"
import { updateServiceAction, createServiceAction } from "./actions"
import { Edit, Plus, Trash2, X, Info, HelpCircle } from "lucide-react"

interface CustomField {
  label: string
  type: string
  required: boolean
}

interface Service {
  id: string
  name: string
  price: number
  description: string
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
  // Editing States
  const [editingService, setEditingService] = React.useState<Service | null>(null)
  const [priceInput, setPriceInput] = React.useState(0)
  const [descriptionInput, setDescriptionInput] = React.useState("")
  const [requiresChildDataInput, setRequiresChildDataInput] = React.useState(true)
  const [customFieldsInput, setCustomFieldsInput] = React.useState<CustomField[]>([])
  
  // Creation States
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [newId, setNewId] = React.useState("")
  const [newName, setNewName] = React.useState("")
  const [newPrice, setNewPrice] = React.useState(0)
  const [newDescription, setNewDescription] = React.useState("")
  const [newSlots, setNewSlots] = React.useState(10)
  const [newRequiresChildData, setNewRequiresChildData] = React.useState(true)
  const [newCustomFields, setNewCustomFields] = React.useState<CustomField[]>([])

  // Status States
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState("")
  const [successMsg, setSuccessMsg] = React.useState("")

  const openEditModal = (service: Service) => {
    setEditingService(service)
    setPriceInput(service.price)
    setDescriptionInput(service.description)
    setRequiresChildDataInput(service.requiresChildData)
    
    // Parse customFields safely
    let parsedFields: CustomField[] = []
    if (Array.isArray(service.customFields)) {
      parsedFields = service.customFields as CustomField[]
    } else if (typeof service.customFields === "string") {
      try {
        parsedFields = JSON.parse(service.customFields)
      } catch (e) {
        parsedFields = []
      }
    }
    setCustomFieldsInput(parsedFields.map(f => ({ ...f }))) // deep copy
    setErrorMsg("")
    setSuccessMsg("")
  }

  // Edit fields builders
  const handleAddField = () => {
    setCustomFieldsInput([
      ...customFieldsInput,
      { label: "", type: "text", required: false }
    ])
  }

  const handleRemoveField = (index: number) => {
    setCustomFieldsInput(customFieldsInput.filter((_, idx) => idx !== index))
  }

  const handleFieldChange = (index: number, key: keyof CustomField, value: any) => {
    const updated = [...customFieldsInput]
    updated[index] = {
      ...updated[index],
      [key]: value
    }
    setCustomFieldsInput(updated)
  }

  // Creation fields builders
  const handleNewAddField = () => {
    setNewCustomFields([
      ...newCustomFields,
      { label: "", type: "text", required: false }
    ])
  }

  const handleNewRemoveField = (index: number) => {
    setNewCustomFields(newCustomFields.filter((_, idx) => idx !== index))
  }

  const handleNewFieldChange = (index: number, key: keyof CustomField, value: any) => {
    const updated = [...newCustomFields]
    updated[index] = {
      ...updated[index],
      [key]: value
    }
    setNewCustomFields(updated)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingService) return

    if (priceInput < 0) {
      setErrorMsg("Harga layanan tidak boleh negatif.")
      return
    }
    if (!descriptionInput.trim()) {
      setErrorMsg("Deskripsi layanan tidak boleh kosong.")
      return
    }
    if (customFieldsInput.some(field => !field.label.trim())) {
      setErrorMsg("Semua kolom kustom harus memiliki label.")
      return
    }

    setIsSubmitting(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await updateServiceAction(adminEmail, editingService.id, {
        price: priceInput,
        description: descriptionInput,
        requiresChildData: requiresChildDataInput,
        customFields: customFieldsInput
      })

      if (res.success) {
        setSuccessMsg("Layanan berhasil diperbarui!")
        setTimeout(() => {
          setEditingService(null)
        }, 1000)
      } else {
        setErrorMsg(res.error || "Gagal menyimpan perubahan.")
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Terjadi kesalahan koneksi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()

    const cleanId = newId.trim().toLowerCase()
    if (!cleanId) {
      setErrorMsg("ID Layanan wajib diisi.")
      return
    }
    if (!/^[a-z0-9-]+$/.test(cleanId)) {
      setErrorMsg("ID Layanan hanya boleh huruf kecil, angka, dan tanda hubung (-).")
      return
    }
    if (!newName.trim()) {
      setErrorMsg("Nama Layanan wajib diisi.")
      return
    }
    if (newPrice < 0) {
      setErrorMsg("Harga tidak boleh negatif.")
      return
    }
    if (!newDescription.trim()) {
      setErrorMsg("Deskripsi tidak boleh kosong.")
      return
    }
    if (newCustomFields.some(field => !field.label.trim())) {
      setErrorMsg("Semua kolom kustom harus memiliki label.")
      return
    }

    setIsSubmitting(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await createServiceAction(adminEmail, {
        id: cleanId,
        name: newName.trim(),
        price: newPrice,
        description: newDescription.trim(),
        slots: newSlots,
        requiresChildData: newRequiresChildData,
        customFields: newCustomFields
      })

      if (res.success) {
        setSuccessMsg("Layanan baru berhasil dibuat!")
        setTimeout(() => {
          setIsCreateModalOpen(false)
        }, 1000)
      } else {
        setErrorMsg(res.error || "Gagal membuat layanan baru.")
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Terjadi kesalahan koneksi.")
    } finally {
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
    <div className="space-y-6">
      {/* CMS Header Intro */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200/60 p-6 rounded-3xl shadow-[0_4px_20px_rgba(13,92,102,0.02)]">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 leading-snug font-sans">Sistem CMS Layanan Gentala</h3>
          <p className="text-xs text-slate-500 font-light leading-relaxed">
            Perubahan pada deskripsi, tarif, atau formulir di halaman ini akan langsung disinkronkan ke pendaftaran publik orang tua secara real-time.
          </p>
        </div>
        {adminRole === "MASTER" && (
          <button
            onClick={() => {
              setIsCreateModalOpen(true)
              setNewId("")
              setNewName("")
              setNewPrice(0)
              setNewDescription("")
              setNewSlots(10)
              setNewRequiresChildData(true)
              setNewCustomFields([])
              setErrorMsg("")
              setSuccessMsg("")
            }}
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
                onClick={() => openEditModal(service)}
                className="w-full h-10 inline-flex items-center justify-center gap-1.5 rounded-full bg-slate-50 border border-slate-200 hover:bg-brand-teal/5 hover:border-brand-teal/20 text-xs font-semibold text-slate-700 hover:text-brand-teal transition-colors cursor-pointer"
              >
                <Edit className="h-3.5 w-3.5" />
                <span>Edit Rincian Layanan</span>
              </button>
            </div>
          )
        })}
      </div>

      {/* Service Creation Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 shadow-2xl rounded-3xl w-full max-w-lg overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-sans">Tambah Program Layanan Baru</h3>
                <p className="text-[10px] text-slate-400 font-light font-sans">Buat kategori kelas stimulasi baru</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="h-8 w-8 rounded-full inline-flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="flex-grow overflow-y-auto p-6 space-y-5">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-600 font-semibold">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-600 font-semibold">
                  {successMsg}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">ID Layanan (Slug/ID) *</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: daycare-bulanan"
                    value={newId}
                    onChange={e => setNewId(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Nama Layanan *</label>
                  <input
                    type="text"
                    required
                    placeholder="misal: Daycare Bulanan"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Harga Layanan (IDR) *</label>
                  <input
                    type="number"
                    required
                    value={newPrice}
                    onChange={e => setNewPrice(Number(e.target.value))}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700">Kuota / Slots (Kursi) *</label>
                  <input
                    type="number"
                    required
                    value={newSlots}
                    onChange={e => setNewSlots(Number(e.target.value))}
                    className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Deskripsi Layanan *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Tuliskan deskripsi lengkap layanan..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal leading-relaxed font-light"
                />
              </div>

              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="space-y-0.5 pr-4">
                  <h5 className="text-xs font-semibold text-slate-800">Wajib Mengisi Data Anak</h5>
                  <p className="text-[10px] text-slate-500 font-light font-sans">Centang jika pendaftaran kelas ini memerlukan data anak (nama, DOB).</p>
                </div>
                <button
                  type="button"
                  onClick={() => setNewRequiresChildData(!newRequiresChildData)}
                  className={`w-11 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 focus:outline-none ${newRequiresChildData ? "bg-brand-teal" : "bg-slate-300"}`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${newRequiresChildData ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>

              {/* Dynamic columns builder for new service */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-slate-700">Formulir Kustom Tambahan</label>
                  <button
                    type="button"
                    onClick={handleNewAddField}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-teal hover:text-brand-teal/80 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Tambah Kolom</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1">
                  {newCustomFields.length > 0 ? (
                    newCustomFields.map((field, index) => (
                      <div key={index} className="flex gap-2.5 items-start p-3 border border-slate-100 rounded-xl bg-slate-50 relative group">
                        <div className="flex-grow space-y-1">
                          <input
                            type="text"
                            required
                            placeholder="Nama Kolom (misal: Riwayat Medis)"
                            value={field.label}
                            onChange={e => handleNewFieldChange(index, "label", e.target.value)}
                            className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-teal/30 focus:border-brand-teal bg-white"
                          />
                        </div>
                        <div className="w-24 shrink-0">
                          <select
                            value={field.type}
                            onChange={e => handleNewFieldChange(index, "type", e.target.value)}
                            className="w-full h-8 px-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-teal/30 focus:border-brand-teal bg-white font-light"
                          >
                            <option value="text">Text (Pendek)</option>
                            <option value="textarea">Textarea (Panjang)</option>
                            <option value="select">Select (Pilihan)</option>
                          </select>
                        </div>
                        <div className="flex flex-col items-center gap-0.5 justify-center py-1">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Wajib</span>
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={e => handleNewFieldChange(index, "required", e.target.checked)}
                            className="h-3.5 w-3.5 text-brand-teal focus:ring-brand-teal rounded border-slate-200"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleNewRemoveField(index)}
                          className="h-8 w-8 rounded-lg inline-flex items-center justify-center text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors shrink-0 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-[11px] text-slate-400 font-light border border-dashed border-slate-200 rounded-xl">
                      Tidak ada kolom kustom. Formulir pendaftaran hanya memuat data utama.
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setIsCreateModalOpen(false)}
                  className="h-10 px-4 rounded-full bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 px-5 inline-flex items-center justify-center rounded-full bg-brand-teal text-white hover:bg-brand-teal/95 text-xs font-semibold shadow-sm transition-colors cursor-pointer"
                >
                  {isSubmitting ? "Membuat..." : "Buat Layanan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Editing Modal */}
      {editingService && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 shadow-2xl rounded-3xl w-full max-w-lg overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Edit Program Layanan</h3>
                <p className="text-[10px] text-slate-400 font-light">{editingService.name}</p>
              </div>
              <button
                onClick={() => setEditingService(null)}
                className="h-8 w-8 rounded-full inline-flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-grow overflow-y-auto p-6 space-y-5">
              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-100 text-xs text-rose-600 font-semibold animate-in fade-in duration-200">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-600 font-semibold animate-in fade-in duration-200">
                  {successMsg}
                </div>
              )}

              {/* Price input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Biaya / Tarif Layanan (IDR) *</label>
                <input
                  type="number"
                  required
                  value={priceInput}
                  onChange={e => setPriceInput(Number(e.target.value))}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
                />
              </div>

              {/* Description input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Deskripsi Program *</label>
                <textarea
                  rows={3}
                  required
                  value={descriptionInput}
                  onChange={e => setDescriptionInput(e.target.value)}
                  className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal leading-relaxed font-light"
                />
              </div>

              {/* Requires child data toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className="space-y-0.5 pr-4">
                  <h5 className="text-xs font-semibold text-slate-800">Wajib Mengisi Data Anak</h5>
                  <p className="text-[10px] text-slate-500 font-light">Tentukan apakah pendaftar kelas wajib mengisi nama dan tgl lahir anak.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setRequiresChildDataInput(!requiresChildDataInput)}
                  className={`w-11 h-6 flex items-center rounded-full p-0.5 cursor-pointer transition-colors duration-300 focus:outline-none ${requiresChildDataInput ? "bg-brand-teal" : "bg-slate-300"}`}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${requiresChildDataInput ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>

              {/* Custom dynamic fields builder */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs font-semibold text-slate-700">Formulir Kustom Tambahan</label>
                    <span className="group relative">
                      <HelpCircle className="h-3.5 w-3.5 text-slate-400 cursor-pointer" />
                      <span className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-48 p-2 rounded bg-slate-900 text-[10px] text-white text-center leading-normal opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
                        Kolom isian tambahan (seperti keluhan atau riwayat medis) untuk program ini.
                      </span>
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddField}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-teal hover:text-brand-teal/80 cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Tambah Kolom</span>
                  </button>
                </div>

                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                  {customFieldsInput.length > 0 ? (
                    customFieldsInput.map((field, index) => (
                      <div key={index} className="flex gap-2.5 items-start p-3 border border-slate-100 rounded-xl bg-slate-50 relative group">
                        <div className="flex-grow space-y-1">
                          <input
                            type="text"
                            required
                            placeholder="Nama Kolom (misal: Keluhan Anak)"
                            value={field.label}
                            onChange={e => handleFieldChange(index, "label", e.target.value)}
                            className="w-full h-8 px-2.5 rounded-lg border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-brand-teal/30 focus:border-brand-teal bg-white"
                          />
                        </div>
                        <div className="w-24 shrink-0">
                          <select
                            value={field.type}
                            onChange={e => handleFieldChange(index, "type", e.target.value)}
                            className="w-full h-8 px-1.5 rounded-lg border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-1 focus:ring-brand-teal/30 focus:border-brand-teal bg-white font-light"
                          >
                            <option value="text">Text (Pendek)</option>
                            <option value="textarea">Textarea (Panjang)</option>
                            <option value="select">Select (Pilihan)</option>
                          </select>
                        </div>
                        <div className="flex flex-col items-center gap-0.5 justify-center py-1">
                          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Wajib</span>
                          <input
                            type="checkbox"
                            checked={field.required}
                            onChange={e => handleFieldChange(index, "required", e.target.checked)}
                            className="h-3.5 w-3.5 text-brand-teal focus:ring-brand-teal rounded border-slate-200"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveField(index)}
                          className="h-8 w-8 rounded-lg inline-flex items-center justify-center text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-colors shrink-0 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-[11px] text-slate-400 font-light border border-dashed border-slate-200 rounded-xl">
                      Tidak ada kolom kustom. Formulir pendaftaran hanya memuat data utama (Orang Tua & Anak).
                    </div>
                  )}
                </div>
              </div>

              {/* Form buttons */}
              <div className="pt-4 border-t border-slate-100 bg-white flex justify-end gap-2.5">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setEditingService(null)}
                  className="h-10 px-4 rounded-full bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleSave}
                  className="h-10 px-5 inline-flex items-center justify-center rounded-full bg-brand-teal text-white hover:bg-brand-teal/95 text-xs font-semibold shadow-sm transition-colors cursor-pointer disabled:bg-slate-200 disabled:text-slate-400"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
