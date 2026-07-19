# LOG PROGRES PENGEMBANGAN - GENTALA WEB APPLICATION

Dokumentasi ini mencatat riwayat milestone pengembangan platform Gentala Child Development Center secara kronologis.

---

## 📅 Milestone 3 (Hari Ini) - Portal Keamanan Staf, MASTER CRUD, CMS Baru & Slot Real-Time

### 1. Keamanan Akses & Kata Sandi
* **Penyandian Terenkripsi**: Menggunakan hash SHA-256 bawaan Node.js (`lib/crypto.ts`) untuk verifikasi kata sandi di portal login `/admin/login`, menggantikan login bypass langsung.
* **Akun Uji Coba Terenkripsi**: Seeder otomatis memperbarui kata sandi akun demo bawaan saat database diisi (`npx prisma db seed`), dengan kata sandi terstandarisasi (misal: `admin@gentala.com` -> `admin123`).
* **Proteksi Kredensial**: Pemetaan profil admin pada server component secara eksplisit menghapus parameter password hash sebelum dikirim ke browser untuk mencegah kebocoran data.

### 2. Manajemen Akses Staf (MASTER Only)
* **Panel CRUD Admin**: Menyediakan tab khusus "Kelola Staf Admin" yang mendeteksi peran aktif. Hanya admin `MASTER` yang bisa menambah staf baru, mengubah peran, menyetel ulang password, atau menghapus akun.
* **Proteksi Akun Sendiri**: Dilengkapi logika pencegahan penghapusan akun mandiri untuk menghindari ketidaksengajaan kehilangan akses MASTER.

### 3. CMS Layanan & Kolom Kustom Dinamis
* **Tambah Layanan Baru**: Tombol pembuat kategori stimulasi baru khusus akun `MASTER`, lengkap dengan pengisian slug ID unik, harga, kuota default, dan syarat pengisian data anak.
* **Kolom Kustom Dinamis**: Master admin bisa menyusun kolom kustom tambahan (misal: "Keluhan Khusus" berupa select/textarea) yang akan otomatis dirender secara dinamis di form pendaftaran murid.

### 4. UX Landing Page & Sinkronisasi Kuota Real-Time
* **Modal Detail Layanan (Shadcn Dialog)**: Klik kartu beranda memicu Dialog popup. Rincian deskripsi dan harga Rupiah (`Rp 1.500.000`) dimuat lengkap sebelum user diarahkan ke `/register?serviceId=xxx`.
* **Koneksi Slot Real-Time**: Landing page terhubung ke database Supabase secara langsung. Status sisa kuota terhitung otomatis pada badge beranda: **"Habis"** (jika 0), **"Sisa X Kursi"** (jika < 5), atau **"Tersedia"** (jika >= 5). Tombol pendaftaran otomatis terkunci jika kuota habis.
* **Bypass Hydration Error**: Injeksi script inline `MutationObserver` pada layout utama untuk membersihkan atribut `bis_skin_checked` dari ekstensi browser secara instan sebelum rendering React.

---

## 📅 Milestone 2 - Integrasi Database & Prisma ORM

* **schema.prisma**: Menetapkan pemodelan relasi database Supabase PostgreSQL untuk model `AdminProfile`, `Service`, dan `Registration`.
* **prisma.config.ts**: Sistem deteksi port pintar yang otomatis mengarahkan CLI `db push/migrate` ke koneksi langsung (port 5432) dan mengarahkan app runtime client queries ke transaction connection pooling (port 6543) dengan pgbouncer.
* **Data Seeding**: Pengisian data default 6 program stimulasi awal (Daycare, PAUD, Biro Psikologi, Kelas Gerak Gymnastic, Aviary Sensory, dan Kelas Parenting).

---

## 📅 Milestone 1 - Kerangka Dasar Landing Page & UX Optimasi

* **Navbar.tsx**: Sticky navbar glassmorphic dengan Intersection Observer untuk efek garis bawah aktif otomatis.
* **Hero.tsx**: Tata letak responsif, visual optimal menggunakan preload gambar Next.js, dan direct-CTA ke formulir pendaftaran.
* **About.tsx**: Penayangan pesan visi misi medis & edukatif Gentala dilengkapi ilustrasi konsultasi.
* **Spotlight.tsx**: Showcase area bermain alami dengan Embla Carousel responsif aman gestur swipe mobile.
* **FAQ & Footer**: Radix Accordion pertanyaan orang tua dan sinkronisasi peta tautan halaman resmi.
* **Frictionless Booking Flow**: Menghapus syarat registrasi/login akun bagi orang tua. Formulir pendaftaran langsung diakses dari beranda untuk mempermudah pendaftaran.

---

## 🚀 Status Build Produksi
Pengujian kompilasi produksi terakhir:
```bash
npm run build
```
**Hasil**: Kompilasi berhasil (**Compiled successfully**) dengan **0 Errors & 0 Warnings**.
