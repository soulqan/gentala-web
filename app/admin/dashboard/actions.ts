"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { checkAdminAuthorization, getAllowedServiceIds } from "@/lib/rbac"
import { hashPassword } from "@/lib/crypto"
import { AdminRole } from "@prisma/client"

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete("admin_session_email")
  redirect("/admin/login")
}

async function getAuthenticatedAdmin() {
  const cookieStore = await cookies()
  const emailCookie = cookieStore.get("admin_session_email")
  if (!emailCookie || !emailCookie.value) {
    return null
  }
  const email = emailCookie.value.trim().toLowerCase()
  return await checkAdminAuthorization(email)
}

export async function updateServiceAction(
  adminEmail: string,
  serviceId: string,
  data: {
    name: string
    price: number
    description: string
    schedule: string
    slots: number
    requiresChildData: boolean
    customFields: Array<{ label: string; type: string; required: boolean }>
    advantages: string[]
    ageRange: string
  }
) {
  // 1. Authenticate server-side from session cookies
  const profile = await getAuthenticatedAdmin()
  if (!profile) {
    return { success: false, error: "Unauthorized. Admin session not found." }
  }
  const verifiedEmail = profile.email

  // Fetch the service first to inspect creator
  const service = await prisma.service.findUnique({
    where: { id: serviceId }
  })
  if (!service) {
    return { success: false, error: "Layanan tidak ditemukan." }
  }

  // 2. Perform RBAC verification
  const allowedServiceIds = getAllowedServiceIds(profile.role)

  // Rule: Master can edit anything. Creator can edit. Or if it's a system service mapped to their role.
  const isCreator = service.createdBy === verifiedEmail
  const isSystemMapped = service.createdBy === "system" && 
                        allowedServiceIds !== null && 
                        allowedServiceIds.includes(serviceId)

  const isAllowed = profile.role === "MASTER" || isCreator || isSystemMapped

  if (!isAllowed) {
    return { success: false, error: "Access Denied. Hanya pembuat layanan dan Master Admin yang dapat mengedit layanan ini." }
  }

  // 3. Mutate database records
  try {
    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: {
        name: data.name.trim(),
        price: data.price,
        description: data.description,
        schedule: data.schedule.trim(),
        slots: data.slots,
        requiresChildData: data.requiresChildData,
        ageRange: data.ageRange.trim(),
        customFields: JSON.parse(JSON.stringify(data.customFields)), // ensures proper JSON serialization
        advantages: JSON.parse(JSON.stringify(data.advantages))
      }
    })
    
    // 4. Revalidate cache
    revalidatePath("/admin/dashboard")
    revalidatePath("/")
    revalidatePath(`/layanan/${serviceId}`)
    
    return { success: true, service: updatedService }
  } catch (error) {
    console.error("Error updating service:", error)
    return { success: false, error: "Database update failed." }
  }
}

export async function createServiceAction(
  adminEmail: string,
  data: {
    id: string
    name: string
    price: number
    description: string
    schedule: string
    slots: number
    requiresChildData: boolean
    customFields: Array<{ label: string; type: string; required: boolean }>
    advantages: string[]
    ageRange: string
  }
) {
  // 1. Authenticate admin
  const profile = await getAuthenticatedAdmin()
  if (!profile) {
    return { success: false, error: "Unauthorized." }
  }
  const verifiedEmail = profile.email

  // 2. Resolve final ID: append role prefix if not MASTER
  let finalId = data.id.trim().toLowerCase()
  if (profile.role !== "MASTER") {
    const prefix = profile.role.toLowerCase() + "-"
    if (!finalId.startsWith(prefix)) {
      finalId = prefix + finalId
    }
  }

  // 3. Insert into database
  try {
    const exists = await prisma.service.findUnique({ where: { id: finalId } })
    if (exists) {
      return { success: false, error: `ID Layanan "${finalId}" sudah terdaftar.` }
    }

    const newService = await prisma.service.create({
      data: {
        id: finalId,
        name: data.name.trim(),
        price: data.price,
        description: data.description.trim(),
        schedule: data.schedule.trim(),
        slots: data.slots,
        requiresChildData: data.requiresChildData,
        customFields: JSON.parse(JSON.stringify(data.customFields)),
        advantages: JSON.parse(JSON.stringify(data.advantages)),
        ageRange: data.ageRange.trim(),
        createdBy: verifiedEmail
      }
    })

    revalidatePath("/admin/dashboard")
    revalidatePath("/")
    revalidatePath(`/layanan/${finalId}`)
    return { success: true, service: newService }
  } catch (error) {
    console.error("Error creating service:", error)
    return { success: false, error: "Failed to create service in database." }
  }
}

export async function createAdminAction(
  adminEmail: string,
  email: string,
  role: AdminRole,
  password: string
) {
  // 1. Authenticate & Verify MASTER role
  const profile = await getAuthenticatedAdmin()
  if (!profile || profile.role !== "MASTER") {
    return { success: false, error: "Access Denied. Only MASTER admins can manage other admins." }
  }

  const cleanEmail = email.trim().toLowerCase()
  if (!cleanEmail) {
    return { success: false, error: "Email cannot be empty." }
  }
  if (!password || password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters long." }
  }

  try {
    const exists = await prisma.adminProfile.findUnique({ where: { email: cleanEmail } })
    if (exists) {
      return { success: false, error: "An admin profile with this email already exists." }
    }

    const newAdmin = await prisma.adminProfile.create({
      data: {
        email: cleanEmail,
        password: hashPassword(password),
        role
      }
    })

    revalidatePath("/admin/dashboard")
    return { success: true, admin: newAdmin }
  } catch (error) {
    console.error("Error creating admin:", error)
    return { success: false, error: "Database creation failed." }
  }
}

export async function updateAdminAction(
  adminEmail: string,
  targetId: string,
  role: AdminRole,
  password?: string
) {
  // 1. Authenticate & Verify MASTER role
  const profile = await getAuthenticatedAdmin()
  if (!profile || profile.role !== "MASTER") {
    return { success: false, error: "Access Denied. Only MASTER admins can manage other admins." }
  }

  try {
    const updateData: any = { role }
    if (password && password.trim().length >= 6) {
      updateData.password = hashPassword(password.trim())
    } else if (password && password.trim().length > 0) {
      return { success: false, error: "New password must be at least 6 characters." }
    }

    const updated = await prisma.adminProfile.update({
      where: { id: targetId },
      data: updateData
    })

    revalidatePath("/admin/dashboard")
    return { success: true, admin: updated }
  } catch (error) {
    console.error("Error updating admin:", error)
    return { success: false, error: "Database update failed." }
  }
}

export async function deleteAdminAction(adminEmail: string, targetId: string) {
  // 1. Authenticate & Verify MASTER role
  const profile = await getAuthenticatedAdmin()
  if (!profile || profile.role !== "MASTER") {
    return { success: false, error: "Access Denied. Only MASTER admins can manage other admins." }
  }

  try {
    const target = await prisma.adminProfile.findUnique({ where: { id: targetId } })
    if (!target) {
      return { success: false, error: "Admin profile not found." }
    }

    // Prevent self-deletion
    if (target.email === profile.email) {
      return { success: false, error: "Self-deletion is not allowed." }
    }

    await prisma.adminProfile.delete({
      where: { id: targetId }
    })

    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error("Error deleting admin:", error)
    return { success: false, error: "Database deletion failed." }
  }
}

export async function updateRegistrationStatusAction(
  adminEmail: string,
  registrationId: string,
  status: string
) {
  // 1. Authenticate admin
  const profile = await getAuthenticatedAdmin()
  if (!profile) {
    return { success: false, error: "Unauthorized. Admin profile not found." }
  }

  // 2. Perform validation on status value
  if (!["PENDING", "SUCCESS", "FAILED"].includes(status)) {
    return { success: false, error: "Status pendaftaran tidak valid." }
  }

  try {
    // 3. Find registration
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId }
    })

    if (!registration) {
      return { success: false, error: "Data pendaftaran tidak ditemukan." }
    }

    const currentStatus = registration.status
    const targetStatus = status

    if (currentStatus === targetStatus) {
      return { success: true }
    }

    // 4. Update registration status and adjust slots atomically in a transaction
    const updated = await prisma.$transaction(async (tx) => {
      if (currentStatus !== "FAILED" && targetStatus === "FAILED") {
        // Re-add 1 slot back to the program
        await tx.service.update({
          where: { id: registration.serviceId },
          data: { slots: { increment: 1 } }
        })
      } else if (currentStatus === "FAILED" && targetStatus !== "FAILED") {
        // Re-claim 1 slot from the program
        const exists = await tx.service.findUnique({
          where: { id: registration.serviceId },
          select: { id: true }
        })

        if (!exists) {
          throw new Error("Program layanan tidak ditemukan.")
        }

        const updatedService = await tx.service.update({
          where: { id: registration.serviceId },
          data: { slots: { decrement: 1 } }
        })

        if (updatedService.slots < 0) {
          throw new Error("Gagal memulihkan status. Kuota kelas saat ini sudah penuh.")
        }
      }

      // 5. Update registration record
      return await tx.registration.update({
        where: { id: registrationId },
        data: { status: targetStatus }
      })
    })

    // 6. Revalidate caches
    revalidatePath("/admin/dashboard")
    revalidatePath("/")
    revalidatePath(`/layanan/${registration.serviceId}`)
    revalidatePath("/register/success")

    return { success: true, registration: updated }
  } catch (error: any) {
    console.error("Error updating registration status:", error)
    return { success: false, error: error.message || "Gagal mengubah status pendaftaran." }
  }
}

export async function deleteServiceAction(adminEmail: string, serviceId: string) {
  // 1. Authenticate admin
  const profile = await getAuthenticatedAdmin()
  if (!profile) {
    return { success: false, error: "Unauthorized. Admin profile not found." }
  }

  try {
    // 2. Fetch service to check creator
    const service = await prisma.service.findUnique({
      where: { id: serviceId }
    })

    if (!service) {
      return { success: false, error: "Layanan tidak ditemukan." }
    }

    // 3. Verify permissions: only MASTER or creator can delete
    const isCreator = service.createdBy === profile.email
    const isAllowed = profile.role === "MASTER" || isCreator

    if (!isAllowed) {
      return { success: false, error: "Access Denied. Hanya pembuat layanan dan Master Admin yang dapat menghapus layanan ini." }
    }

    // 4. Delete service and all associated registrations in a transaction
    await prisma.$transaction([
      prisma.registration.deleteMany({
        where: { serviceId }
      }),
      prisma.service.delete({
        where: { id: serviceId }
      })
    ])

    // 5. Revalidate cache paths
    revalidatePath("/admin/dashboard")
    revalidatePath("/")
    revalidatePath(`/layanan/${serviceId}`)

    return { success: true }
  } catch (error) {
    console.error("Error deleting service:", error)
    return { success: false, error: "Gagal menghapus layanan dari database." }
  }
}


