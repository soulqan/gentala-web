"use client"

import * as React from "react"
import { createAdminAction, updateAdminAction, deleteAdminAction } from "./actions"
import { Plus, Trash2, Edit, X, UserPlus, ShieldAlert, KeyRound } from "lucide-react"

interface AdminProfile {
  id: string
  email: string
  role: string
  createdAt: Date | string
}

interface AdminManagementProps {
  admins: AdminProfile[]
  adminEmail: string
}

export default function AdminManagement({ admins, adminEmail }: AdminManagementProps) {
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [editingAdmin, setEditingAdmin] = React.useState<AdminProfile | null>(null)
  
  // Create Form State
  const [newEmail, setNewEmail] = React.useState("")
  const [newRole, setNewRole] = React.useState("PAUD")
  const [newPassword, setNewPassword] = React.useState("")

  // Edit Form State
  const [editRole, setEditRole] = React.useState("PAUD")
  const [editPassword, setEditPassword] = React.useState("")

  // Status State
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMsg, setErrorMsg] = React.useState("")
  const [successMsg, setSuccessMsg] = React.useState("")

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await createAdminAction(adminEmail, newEmail, newRole as any, newPassword)
      if (res.success) {
        setSuccessMsg("Staf admin baru berhasil ditambahkan!")
        setNewEmail("")
        setNewPassword("")
        setNewRole("PAUD")
        setTimeout(() => {
          setIsCreateModalOpen(false)
        }, 1000)
      } else {
        setErrorMsg(res.error || "Gagal membuat akun staf.")
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Terjadi kesalahan koneksi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingAdmin) return

    setIsSubmitting(true)
    setErrorMsg("")
    setSuccessMsg("")

    try {
      const res = await updateAdminAction(adminEmail, editingAdmin.id, editRole as any, editPassword || undefined)
      if (res.success) {
        setSuccessMsg("Akun staf admin berhasil diperbarui!")
        setEditPassword("")
        setTimeout(() => {
          setEditingAdmin(null)
        }, 1000)
      } else {
        setErrorMsg(res.error || "Gagal memperbarui akun.")
      }
    } catch (err) {
      console.error(err)
      setErrorMsg("Terjadi kesalahan koneksi.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (targetId: string, email: string) => {
    if (email === adminEmail) {
      alert("Anda tidak dapat menghapus akun Anda sendiri.")
      return
    }

    if (!confirm(`Apakah Anda yakin ingin menghapus staf admin "${email}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return
    }

    try {
      const res = await deleteAdminAction(adminEmail, targetId)
      if (res.success) {
        alert("Akun staf admin berhasil dihapus.")
      } else {
        alert(res.error || "Gagal menghapus akun.")
      }
    } catch (err) {
      console.error(err)
      alert("Terjadi kesalahan koneksi database.")
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "MASTER": return "Master Admin"
      case "PAUD": return "Admin PAUD & Daycare"
      case "PSIKOLOGI": return "Admin Biro Psikologi"
      case "PARENTING": return "Admin Parenting"
      case "GYMNASTIC": return "Admin Gymnastic"
      default: return role
    }
  }

  return (
    <div className="space-y-6">
      {/* Management Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white border border-slate-200/60 p-6 rounded-3xl shadow-[0_4px_20px_rgba(13,92,102,0.02)]">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-slate-900 leading-snug">Manajemen Akses Staf Admin</h3>
          <p className="text-xs text-slate-500 font-light leading-relaxed">
            Halaman khusus Master Admin untuk menambah staf admin baru, menetapkan peran, serta memperbarui kata sandi login.
          </p>
        </div>
        <button
          onClick={() => {
            setIsCreateModalOpen(true)
            setErrorMsg("")
            setSuccessMsg("")
          }}
          className="h-10 px-4 inline-flex items-center gap-1.5 rounded-full bg-brand-teal text-white hover:bg-brand-teal/95 text-xs font-semibold shadow-sm transition-colors duration-200 cursor-pointer"
        >
          <UserPlus className="h-4 w-4" />
          <span>Tambah Staf Admin</span>
        </button>
      </div>

      {/* Admins Table list */}
      <div className="bg-white border border-slate-200/60 rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(13,92,102,0.02)]">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                <th className="py-4 px-6">Email Staf</th>
                <th className="py-4 px-6">Peran Akses (Scope)</th>
                <th className="py-4 px-6">Tanggal Dibuat</th>
                <th className="py-4 px-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {admins.map(adm => {
                const isSelf = adm.email === adminEmail
                return (
                  <tr key={adm.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6 font-semibold text-slate-900 flex items-center gap-2">
                      <span>{adm.email}</span>
                      {isSelf && (
                        <span className="text-[9px] px-1.5 py-0.5 bg-brand-teal/10 text-brand-teal font-extrabold rounded uppercase tracking-wider shrink-0">
                          Saya
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        adm.role === "MASTER" 
                          ? "bg-brand-teal/10 text-brand-teal" 
                          : "bg-slate-100 text-slate-600"
                      }`}>
                        {getRoleLabel(adm.role)}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-slate-500 font-light">
                      {new Date(adm.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric"
                      })}
                    </td>
                    <td className="py-4 px-6 text-right space-x-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingAdmin(adm)
                          setEditRole(adm.role)
                          setEditPassword("")
                          setErrorMsg("")
                          setSuccessMsg("")
                        }}
                        className="h-8 w-8 rounded-lg inline-flex items-center justify-center text-slate-500 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(adm.id, adm.email)}
                        disabled={isSelf}
                        className="h-8 w-8 rounded-lg inline-flex items-center justify-center text-rose-500 hover:bg-rose-50 border border-transparent hover:border-rose-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 shadow-2xl rounded-3xl w-full max-w-md overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200 flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Tambah Staf Admin Baru</h3>
                <p className="text-[10px] text-slate-400 font-light">Buat identitas login admin baru di Gentala</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="h-8 w-8 rounded-full inline-flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-xs text-rose-600 font-semibold rounded-xl">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-xs text-emerald-600 font-semibold rounded-xl">
                  {successMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Email Staf *</label>
                <input
                  type="email"
                  required
                  placeholder="staf@gentala.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Kata Sandi Baru *</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Min. 6 Karakter"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Peran Akses (Role Scope) *</label>
                <select
                  value={newRole}
                  onChange={e => setNewRole(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 bg-white"
                >
                  <option value="PAUD">Admin PAUD & Daycare</option>
                  <option value="PSIKOLOGI">Admin Biro Psikologi</option>
                  <option value="PARENTING">Admin Parenting</option>
                  <option value="GYMNASTIC">Admin Gymnastic</option>
                  <option value="MASTER">Master Admin (Akses Mutlak)</option>
                </select>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="h-10 px-4 rounded-full bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 px-5 inline-flex items-center justify-center rounded-full bg-brand-teal text-white hover:bg-brand-teal/95 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Menambahkan..." : "Tambah Staf"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Editing Modal */}
      {editingAdmin && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 shadow-2xl rounded-3xl w-full max-w-md overflow-hidden animate-in fade-in-50 zoom-in-95 duration-200 flex flex-col">
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Ubah Profil Staf Admin</h3>
                <p className="text-[10px] text-slate-400 font-light">Email: {editingAdmin.email}</p>
              </div>
              <button
                onClick={() => setEditingAdmin(null)}
                className="h-8 w-8 rounded-full inline-flex items-center justify-center hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-xs text-rose-600 font-semibold rounded-xl">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-100 text-xs text-emerald-600 font-semibold rounded-xl">
                  {successMsg}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Peran Akses (Role Scope) *</label>
                <select
                  value={editRole}
                  onChange={e => setEditRole(e.target.value)}
                  disabled={editingAdmin.email === adminEmail}
                  className="w-full h-10 px-3 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 bg-white disabled:opacity-50"
                >
                  <option value="PAUD">Admin PAUD & Daycare</option>
                  <option value="PSIKOLOGI">Admin Biro Psikologi</option>
                  <option value="PARENTING">Admin Parenting</option>
                  <option value="GYMNASTIC">Admin Gymnastic</option>
                  <option value="MASTER">Master Admin (Akses Mutlak)</option>
                </select>
                {editingAdmin.email === adminEmail && (
                  <p className="text-[10px] text-amber-600 font-medium flex items-center gap-1.5 mt-2">
                    <ShieldAlert className="h-4 w-4 shrink-0 text-amber-500" />
                    <span>Anda tidak dapat mengubah peran akun Anda sendiri demi keamanan dasbor.</span>
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700">Kata Sandi Baru (Kosongkan jika tidak diubah)</label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Min. 6 Karakter"
                    value={editPassword}
                    onChange={e => setEditPassword(e.target.value)}
                    className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-teal/20 focus:border-brand-teal"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="h-10 px-4 rounded-full bg-slate-100 text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-10 px-5 inline-flex items-center justify-center rounded-full bg-brand-teal text-white hover:bg-brand-teal/95 text-xs font-semibold transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
