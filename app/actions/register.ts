"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export interface RegistrationInput {
  serviceId: string
  parentName: string
  whatsapp: string
  email: string
  childName?: string | null
  childDob?: string | null // ISO string or date string from inputs
  customAnswers?: Record<string, any>
}

export async function createRegistration(formData: RegistrationInput) {
  const { serviceId, parentName, whatsapp, email, childName, childDob, customAnswers } = formData

  // 1. Basic server-side input validation
  if (!serviceId || !parentName || !whatsapp || !email) {
    return { success: false, error: "Mohon lengkapi seluruh kolom wajib (Layanan, Nama Orang Tua, WhatsApp, dan Email)." }
  }

  try {
    // 2. Perform transactional verification and decrement
    const result = await prisma.$transaction(async (tx) => {
      const service = await tx.service.findUnique({
        where: { id: serviceId }
      })

      if (!service) {
        throw new Error("Layanan stimulasi tidak ditemukan di database.")
      }

      if (service.slots <= 0) {
        throw new Error("Maaf, kuota pendaftaran untuk layanan ini telah habis/penuh.")
      }

      // Decrement slot value by 1
      await tx.service.update({
        where: { id: serviceId },
        data: { slots: service.slots - 1 }
      })

      // Convert childDob if present
      const childDobDate = childDob ? new Date(childDob) : null

      // Create the registration record
      const registration = await tx.registration.create({
        data: {
          serviceId,
          parentName: parentName.trim(),
          whatsapp: whatsapp.trim(),
          email: email.trim().toLowerCase(),
          childName: childName ? childName.trim() : null,
          childDob: childDobDate,
          customAnswers: customAnswers || {},
          status: "PENDING"
        }
      })

      return registration
    })

    // Revalidate paths to update live slot quotas on the home page and cms panels
    revalidatePath("/")
    revalidatePath("/admin/dashboard")
    revalidatePath(`/layanan/${serviceId}`)

    return { success: true, id: result.id }
  } catch (error: any) {
    console.error("Registration failed:", error)
    return { success: false, error: error.message || "Terjadi kesalahan internal saat menyimpan pendaftaran." }
  }
}
