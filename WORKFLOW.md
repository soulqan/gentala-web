# PANDUAN WORKFLOW & STRUKTUR FILE - GENTALA WEB APPLICATION

Dokumentasi ini menjelaskan alur kerja (*system workflow*) aplikasi Gentala Child Development Center serta memberikan rincian referensi file/folder bagi developer yang ingin melakukan modifikasi di masa mendatang.

---

## 🔄 1. Alur Kerja Sistem (System Workflow)

### A. Alur Publik (Orang Tua Murid)
1. **Pendaratan (Landing Page)**: Orang tua mengakses halaman utama (`/`).
2. **Eksplorasi Kelas**: Orang tua melihat kartu program layanan stimulasi (data ditarik langsung dari database secara real-time untuk slot kuota & harga).
3. **Detail Informasi**: Mengklik kartu program tidak mengarahkan langsung ke halaman register, melainkan membuka **popup modal** detail (menggunakan Shadcn/ui `Dialog`).
4. **Registrasi**: Mengklik tombol "Daftar & Bayar Sekarang" akan mengarahkan pengguna ke formulir pendaftaran di rute `/register?serviceId=id-layanan` atau `/daftar?serviceId=id-layanan`.
5. **Formulir & Data Anak**: Formulir pendaftaran bersifat adaptif. Ia membaca parameter rute dan merender kolom isian utama serta kolom kustom dinamis yang diatur oleh Admin.
6. **Submit**: Registrasi disimpan di database Supabase PostgreSQL dan secara otomatis mengurangi jumlah slot/kuota layanan tersebut (*decrement*).

### B. Alur Administratif (Staf Gentala)
1. **Autentikasi Aman**: Staf mengakses `/admin/login`. Menginput email dan password terdaftar. Sistem mencocokkan hash SHA-256 kata sandi di database.
2. **Validasi Peran (RBAC)**: Setelah sukses login, sistem mengecek peran staf (`AdminRole`):
   * **MASTER**: Akses mutlak. Dapat melihat semua registrasi, mengedit semua layanan, membuat layanan baru, dan mengelola profil admin lain.
   * **PAUD, PSIKOLOGI, PARENTING, GYMNASTIC**: Hanya dapat melihat data registrasi dan mengedit layanan yang sesuai dengan hak akses (scope) perannya.
3. **Manajemen Pendaftar**: Admin melihat arsip data registrasi murid, menyaring data, mengekspor ke spreadsheet (CSV), serta merubah status pendaftaran.
4. **CMS Konten**: Admin merubah tarif, deskripsi, toggle data anak, atau kolom kustom layanan yang langsung tersinkronisasi ke landing page publik.

---

## 📁 2. Peta Folder Utama

* [`app/`](file:///Users/mycomputer/gentala-web/app): Berisi seluruh rute halaman Next.js (App Router).
  * [`app/daftar/`](file:///Users/mycomputer/gentala-web/app/daftar) & [`app/register/`](file:///Users/mycomputer/gentala-web/app/register): Halaman intake formulir registrasi orang tua.
  * [`app/admin/login/`](file:///Users/mycomputer/gentala-web/app/admin/login): Rute halaman masuk admin.
  * [`app/admin/dashboard/`](file:///Users/mycomputer/gentala-web/app/admin/dashboard): Dasbor admin, Server Actions (`actions.ts`), dan Client Components.
* [`components/`](file:///Users/mycomputer/gentala-web/components): Komponen antarmuka (UI) modular landing page.
  * [`components/ui/`](file:///Users/mycomputer/gentala-web/components/ui): Primitif komponen dasar (Radix & Tailwind) seperti Accordion, Badge, Dialog, Select, Card.
* [`lib/`](file:///Users/mycomputer/gentala-web/lib): Pustaka konfigurasi pendukung global (Prisma singleton client, logika RBAC, enkripsi password).
* [`prisma/`](file:///Users/mycomputer/gentala-web/prisma): Skema database PostgreSQL (`schema.prisma`) dan file data seeder (`seed.ts`).

---

## 🛠️ 3. Panduan Modifikasi Konten ("Jika ingin edit X, akses file Y")

Berikut adalah tabel panduan edit bagi developer untuk mempercepat navigasi kode:

| Kebutuhan Modifikasi | File / Folder yang Perlu Diedit | Deskripsi File |
| :--- | :--- | :--- |
| **Header Banner & Call To Action Utama** | [`components/Hero.tsx`](file:///Users/mycomputer/gentala-web/components/Hero.tsx) | Rincian visual beranda bagian atas. |
| **Menu Navigasi & Link Sticky Header** | [`components/Navbar.tsx`](file:///Users/mycomputer/gentala-web/components/Navbar.tsx) | Navbar glassmorphic & scroll observer. |
| **Visual/Tulisan Bagian "Tentang Kami"** | [`components/About.tsx`](file:///Users/mycomputer/gentala-web/components/About.tsx) | Tampilan visi, keunggulan, dan ilustrasi. |
| **Eksplorasi Kelas & Modal Dialog Beranda** | [`components/ServiceGrid.tsx`](file:///Users/mycomputer/gentala-web/components/ServiceGrid.tsx) | Mapping icon program, setelan badge kuota, & UI popup modal detail. |
| **Galeri Foto/Slide Aviary Sensory Land** | [`components/Spotlight.tsx`](file:///Users/mycomputer/gentala-web/components/Spotlight.tsx) | Konfigurasi Embla Carousel & daftar foto. |
| **Pertanyaan & Jawaban FAQ Orang Tua** | [`components/FAQAccordion.tsx`](file:///Users/mycomputer/gentala-web/components/FAQAccordion.tsx) | Accordion interaktif FAQ. |
| **Hubungi Kami & Peta Tautan Bawah** | [`components/Footer.tsx`](file:///Users/mycomputer/gentala-web/components/Footer.tsx) | Desain footer beranda. |
| **Kolom Validasi & Tampilan Form Orang Tua** | [`app/daftar/page.tsx`](file:///Users/mycomputer/gentala-web/app/daftar/page.tsx) | Validasi Zod schema, layout form input. |
| **Tampilan Halaman Login Admin** | [`app/admin/login/page.tsx`](file:///Users/mycomputer/gentala-web/app/admin/login/page.tsx) | Input form login & bypass akun uji coba. |
| **Fungsi Enkripsi Kata Sandi Admin** | [`lib/crypto.ts`](file:///Users/mycomputer/gentala-web/lib/crypto.ts) | Algoritma hashing SHA-256. |
| **Penetapan Scope Hak Akses Peran Admin** | [`lib/rbac.ts`](file:///Users/mycomputer/gentala-web/lib/rbac.ts) | Hak akses admin (MASTER / PAUD / PSIKOLOGI, dsb). |
| **Query Data Dashboard Server** | [`app/admin/dashboard/page.tsx`](file:///Users/mycomputer/gentala-web/app/admin/dashboard/page.tsx) | Load data prisma server untuk dasbor. |
| **Database Mutations (Server Actions)** | [`app/admin/dashboard/actions.ts`](file:///Users/mycomputer/gentala-web/app/admin/dashboard/actions.ts) | Aksi CRUD staf, buat layanan, & status update. |
| **Layout Keseluruhan Tab Dasbor Admin** | [`app/admin/dashboard/DashboardClient.tsx`](file:///Users/mycomputer/gentala-web/app/admin/dashboard/DashboardClient.tsx) | Sidebar navigasi & tab switcher admin. |
| **Tabel Registrasi Murid & Ekspor CSV** | [`app/admin/dashboard/RegistrationsTable.tsx`](file:///Users/mycomputer/gentala-web/app/admin/dashboard/RegistrationsTable.tsx) | Filter tabel pendaftaran & parser excel/CSV. |
| **CMS Edit Layanan & Tarif** | [`app/admin/dashboard/ServiceCMS.tsx`](file:///Users/mycomputer/gentala-web/app/admin/dashboard/ServiceCMS.tsx) | Form edit deskripsi & input custom fields. |
| **Kelola Profil Admin Staf Baru (MASTER)** | [`app/admin/dashboard/AdminManagement.tsx`](file:///Users/mycomputer/gentala-web/app/admin/dashboard/AdminManagement.tsx) | Modal pembuat akun staf baru & list admin. |
| **Model Relasi Database / Skema Tabel** | [`prisma/schema.prisma`](file:///Users/mycomputer/gentala-web/prisma/schema.prisma) | Definisi struktur model tabel database. |
| **Data Seed Awal / Kredensial Default** | [`prisma/seed.ts`](file:///Users/mycomputer/gentala-web/prisma/seed.ts) | Seeding awal program layanan & admin default. |
| **Global Theme Colors & Layout** | [`app/globals.css`](file:///Users/mycomputer/gentala-web/app/globals.css) & [`app/layout.tsx`](file:///Users/mycomputer/gentala-web/app/layout.tsx) | Theme colors, layout wrapper, dan script bypass error hydration. |

---

## 💾 4. Sinkronisasi Skema Database Setelah Mengubah `schema.prisma`

Apabila Anda mengedit model tabel pada [`schema.prisma`](file:///Users/mycomputer/gentala-web/prisma/schema.prisma), Anda **wajib** menjalankan perintah berikut di terminal agar database di Supabase tersinkronisasi dan Typescript mengenali tipe data baru:

```bash
# 1. Sinkronisasikan skema ke database Supabase
npx prisma db push

# 2. Regenerasi Prisma Client lokal agar types autocomplete diperbarui
npx prisma generate

# 3. Jalankan ulang dev server Anda
npm run dev
```

Jika ingin memantau isi database secara langsung via GUI lokal, Anda bisa membuka Prisma Studio dengan menjalankan:
```bash
npx prisma studio
```
