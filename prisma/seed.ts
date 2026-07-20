import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import pg from "pg"
import "dotenv/config"
import { hashPassword } from "../lib/crypto"

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log("Seeding data...")

  // Delete existing records to prevent duplication
  await prisma.adminProfile.deleteMany()
  await prisma.service.deleteMany()

  // Seed Admin Profile
  const admin = await prisma.adminProfile.create({
    data: {
      email: "admin@gentala.com",
      password: hashPassword("admin123"),
      role: "MASTER"
    }
  })
  console.log(`Created admin: ${admin.email} with role: ${admin.role}`)

  // Seed Services
  const services = [
    {
      id: "daycare-harian",
      name: "Daycare Harian",
      price: 1500000,
      description: "Layanan penitipan anak intensif selama jam kerja yang dikelola oleh pengasuh profesional dan terlatih. Fokus pada keamanan, pemenuhan nutrisi seimbang, serta rutinitas harian yang mendukung kemandirian anak.",
      schedule: "Senin - Jumat, 07:30 - 17:00",
      slots: 2,
      requiresChildData: true,
      customFields: [
        { label: "Riwayat Alergi & Medis Anak", type: "text", required: false }
      ]
    },
    {
      id: "paud-terintegrasi",
      name: "PAUD Terintegrasi",
      price: 2000000,
      description: "Pendidikan usia dini dengan kurikulum bermain sambil belajar yang dirancang khusus berbasis tahapan tumbuh kembang. Mengembangkan aspek kognitif, motorik, sosial, dan emosional anak secara seimbang.",
      schedule: "Senin - Kamis, 08:00 - 12:00",
      slots: 1,
      requiresChildData: true,
      customFields: [
        { label: "Catatan Khusus Sensorik", type: "text", required: false }
      ]
    },
    {
      id: "biro-psikologi",
      name: "Biro Psikologi",
      price: 500000,
      description: "Pusat layanan deteksi dini, asesmen tumbuh kembang, serta konsultasi mendalam bersama psikolog dan terapis anak profesional (okupasi/wicara) untuk memetakan potensi dan mengatasi hambatan anak sejak dini.",
      schedule: "Sabtu & Minggu, 09:00 - 15:00 (Dengan Perjanjian)",
      slots: 5,
      requiresChildData: true,
      customFields: [
        { label: "Detail Keluhan / Catatan Tumbuh Kembang", type: "textarea", required: true }
      ]
    },
    {
      id: "program-parenting",
      name: "Program Parenting",
      price: 350000,
      description: "Kelas edukasi dan workshop interaktif khusus orang tua untuk membangun pola asuh (parenting) yang efektif, menyelaraskan program stimulasi di rumah, serta memperkuat ikatan emosional keluarga.",
      schedule: "Sabtu (Sesuai Jadwal Seminar), 09:00 - 12:00",
      slots: 20,
      requiresChildData: false,
      customFields: []
    },
    {
      id: "kelas-gymnastic",
      name: "Kelas Gymnastic",
      price: 750000,
      description: "Program aktivitas fisik terstruktur untuk memenuhi dan mengoptimalkan kebutuhan gerak motorik kasar anak. Dipandu oleh instruktur terlatih dalam lingkungan yang aman untuk melatih kelenturan, kekuatan, dan keseimbangan.",
      schedule: "Selasa & Kamis, 14:00 - 16:00",
      slots: 3,
      requiresChildData: true,
      customFields: []
    },
    {
      id: "aviary",
      name: "Aviary",
      price: 600000,
      description: "Fasilitas stimulasi eksklusif di lingkungan semi-alami yang dirancang untuk mengasah kepekaan panca indera (sensori) anak lewat eksplorasi langsung dengan alam, tanaman, dan hewan dalam suasana yang menenangkan.",
      schedule: "Setiap Hari, 08:00 - 16:00",
      slots: 15,
      requiresChildData: true,
      customFields: []
    }
  ]

  for (const s of services) {
    const createdService = await prisma.service.create({
      data: {
        id: s.id,
        name: s.name,
        price: s.price,
        description: s.description,
        schedule: s.schedule,
        slots: s.slots,
        requiresChildData: s.requiresChildData,
        customFields: s.customFields
      }
    })
    console.log(`Created service: ${createdService.name} (ID: ${createdService.id}, Slots: ${createdService.slots})`)
  }

  console.log("Seeding complete!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
