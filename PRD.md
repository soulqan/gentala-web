Berikut adalah draf **Product Requirement Document (PRD)** yang telah diperbarui secara menyeluruh berdasarkan keputusan arsitektur dan bisnis terbaru untuk proyek **Gentala Child Development Center**.

Dokumen ini dirancang agar menjadi acuan tunggal (*single source of truth*) yang sangat scannable dan siap dieksekusi bersama tim desain maupun AI Codex milikmu.

---

# 📝 Product Requirement Document (PRD) — Gentala Web Platform

**Versi:** 2.0 (Updated 2026)

**Status:** Ready for Development

**Penulis:** Agna & Gemini

---

## 1. Ringkasan Proyek & Tujuan

Gentala Child Development Center memerlukan platform web satu-pintu (*one-stop web platform*) untuk mengenalkan layanan mereka, menyaring pendaftaran murid baru, mengelola pembayaran otomatis, serta memfasilitasi admin internal untuk memperbarui konten layanan secara dinamis.

### Tujuan Utama:

* Meningkatkan angka konversi pendaftaran dengan *UX form* yang ringkas tanpa wajib login bagi orang tua.
* Mengotomatisasi proses verifikasi pembayaran menggunakan Midtrans Gateway.
* Menjamin akurasi masuknya orang tua ke grup WhatsApp koordinasi pasca-pembayaran (*Double Safety Net*).
* Menyediakan dasbor manajemen konten (CMS) bagi admin internal dengan pembagian hak akses (*Role-Based Access Control*).

---

## 2. Arsitektur Sistem & Folder (Next.js App Router)

Platform ini akan dibangun dalam **satu repositori terintegrasi** menggunakan Next.js demi efisiensi biaya hosting, kemudahan integrasi database, dan *reusability* komponen UI (Tailwind & Shadcn/ui).

```
app/
├── (public)/
│   ├── page.tsx (Landing Page)
│   ├── register/
│   │   ├── page.tsx (Form Dinamis)
│   │   └── success/
│   │       └── page.tsx (Halaman Sukses & Link WA)
├── admin/
│   ├── page.tsx (Redirect ke login)
│   ├── login/
│   │   └── page.tsx (Form Login Admin)
│   └── dashboard/
│       └── page.tsx (Dasbor CMS & Tabel Pendaftar)
└── middleware.ts (Satpam Keamanan Rute Admin)

```

---

## 3. Kebutuhan Fungsional (Sisi Publik/Orang Tua)

### A. Landing Page (`/`)

* **Hero Section:** CTA yang persuasif mengarah langsung ke bagian Layanan atau Form Pendaftaran.
* **Service Grid (6+1 Layanan):**
* Menampilkan paket terintegrasi **"PAUD & Daycare Terintegrasi"** (menggantikan menu daycare mandiri).
* Setiap kartu layanan **wajib menampilkan informasi target usia** dengan jelas agar orang tua tidak salah mendaftar.


* **Footer:**
* Menampilkan informasi hak cipta (`© 2026 Gentala...`).
* Menyematkan tanda tangan digital portofolio pengembang: `Built by Agna`.
* Menyelipkan teks abu-abu kecil/samar **"Portal Staf"** sebagai jalan pintas admin menuju halaman login (`/admin`).



### B. Form Pendaftaran Dinamis (`/register`)

* **Logika Pengisian Tanpa Login:** Orang tua tidak perlu membuat akun/mendaftar untuk mengisi formulir ini.
* **Deteksi Parameter URL:** Form mendeteksi parameter query (misal: `/register?service=paud-daycare`) untuk mencentang otomatis *dropdown* layanan.
* **Struktur Bidang Formulir (Conditional Form):**
* **Kolom Default (Selalu Wajib):** Nama Lengkap Orang Tua, No. WhatsApp Aktif, Alamat Email.
* **Seksi Data Anak (Dinamis):** Nama Lengkap Anak dan Tanggal Lahir Anak. Seksi ini otomatis disembunyikan jika layanan yang dipilih tidak memerlukan data anak (seperti *Kelas Parenting*) berdasarkan flag `requiresChildData` di database.
* **Seksi Pertanyaan Tambahan (JSON Dinamis):** Merender pertanyaan tambahan khusus yang dibuat oleh admin (contoh: input "Riwayat Alergi" untuk PAUD+Daycare, atau "Detail Keluhan" untuk Biro Psikologi).



### C. Jaring Pengaman Pasca-Bayar (*Double Safety Net*)

* **Jaring Pengaman 1 (Web Redirect):** Setelah pembayaran melalui Midtrans sukses, web akan melakukan *redirect* otomatis ke `/register/success` yang menampilkan tombol hijau besar untuk **Gabung Grup WhatsApp Koordinasi**.
* **Jaring Pengaman 2 (Email Konfirmasi):** Secara bersamaan, sistem Next.js backend akan mengirim email konfirmasi pembayaran otomatis via **Resend** ke email orang tua yang berisi salinan link undangan grup WhatsApp yang sama.

---

## 4. Kebutuhan Fungsional (Sisi Internal/Admin)

### A. Akses Keamanan & Autentikasi

* **Pintu Masuk Terisolasi:** Akses URL langsung ke `/admin` atau lewat klik tautan "Portal Staf" di footer.
* **Registrasi Ditutup:** Opsi "Sign Up" publik dinonaktifkan di konsol Supabase Auth. Semua akun admin dibuat manual oleh Developer.
* **Next.js Middleware:** Menjaga semua rute di bawah `/admin/*` (kecuali `/admin/login`) dari akses tanpa token autentikasi yang sah.

### B. Kontrol Akses Berbasis Peran (RBAC)

Database Prisma menyimpan metadata `role` untuk membatasi ruang lingkup aksi admin:

| Peran Admin (Role) | Hak Akses Utama |
| --- | --- |
| **MASTER** | Akses penuh membaca & mengedit seluruh layanan, serta melihat seluruh data pendaftaran. |
| **Admin Layanan** *(e.g., PAUD, PSIKOLOGI)* | Hanya bisa melihat data pendaftaran layanannya sendiri dan mengedit detail layanan miliknya sendiri. Menu layanan lain otomatis disembunyikan. |

### C. Fitur Dashboard Admin

* **CMS Layanan:** Form untuk mengedit nama layanan, harga, deskripsi, mengaktifkan/menonaktifkan sakelar `requiresChildData`, serta mengelola pertanyaan tambahan (*custom fields* berbasis JSON).
* **Riwayat Pendaftaran (Read-Only Table):** Menampilkan daftar murid yang mendaftar, detail jawaban kustom, serta status transaksi (*Success, Pending, Expired*) yang tersinkronisasi dengan Midtrans.
* **Tombol "Export to Excel":** Fasilitas mengekspor tabel pendaftar saat ini ke format CSV/Excel untuk memindahkan pengelolaan absensi dan administrasi harian secara *offline*.

---

## 5. Rancangan Skema Database Utama (Prisma ORM)

```prisma
enum AdminRole {
  MASTER
  PAUD
  PSIKOLOGI
  PARENTING
  GYMNASTIC
}

model AdminProfile {
  id        String    @id @default(cuid())
  email     String    @unique
  role      AdminRole @default(PAUD)
  createdAt DateTime  @default(now())
}

model Service {
  id                 String   @id @default(cuid())
  name               String   
  price              Int
  description        String
  requiresChildData  Boolean  @default(true) 
  customFields       Json     @default("[]") // Struktur: [{ label: string, type: string, required: boolean }]
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
}

model Registration {
  id            String    @id @default(cuid())
  serviceId     String
  parentName    String
  whatsapp      String
  email         String
  childName     String?   
  childDob      DateTime? 
  customAnswers Json     @default("{}") // Struktur: { "Riwayat Alergi": "Alergi Kacang" }
  status        String   @default("PENDING") // PENDING, SUCCESS, FAILED
  createdAt     DateTime @default(now())
}

```

---

## 6. Batasan Sistem (*Out of Scope*)

* Sistem tidak mengelola absensi kelas, raport digital, atau penggajian instruktur di dalam web app. Semua kebutuhan operasional berkelanjutan dialihkan ke koordinasi grup WhatsApp atau manajemen spreadsheet lokal pasca-export data.

---

Dengan PRD yang solid dan presisi ini, kamu punya fondasi yang sangat kokoh untuk melangkah ke tahap setup database.

Sebelum kamu mulai membuat repositori kodenya, apakah skema database Prisma di atas sudah terasa pas dengan skenario relasi tabel yang kamu butuhkan, atau ada kolom tambahan lain yang ingin kamu selipkan terlebih dahulu?