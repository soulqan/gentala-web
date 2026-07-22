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

export async function updateServiceAction(
  adminEmail: string,
  serviceId: string,
  data: {
    price: number
    description: string
    schedule: string
    requiresChildData: boolean
    customFields: Array<{ label: string; type: string; required: boolean }>
  }
) {
  // 1. Authenticate server-side
  const profile = await checkAdminAuthorization(adminEmail)
  if (!profile) {
    return { success: false, error: "Unauthorized. Admin profile not found." }
  }

  // 2. Perform RBAC verification
  const allowedServiceIds = getAllowedServiceIds(profile.role)
  if (allowedServiceIds !== null && !allowedServiceIds.includes(serviceId)) {
    return { success: false, error: "Access Denied. You do not have permission to update this service." }
  }

  // 3. Mutate database records
  try {
    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: {
        price: data.price,
        description: data.description,
        schedule: data.schedule.trim(),
        requiresChildData: data.requiresChildData,
        customFields: JSON.parse(JSON.stringify(data.customFields)) // ensures proper JSON serialization
      }
    })
    
    // 4. Revalidate cache
    revalidatePath("/admin/dashboard")
    
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
  }
) {
  // 1. Authenticate & Verify MASTER role
  const profile = await checkAdminAuthorization(adminEmail)
  if (!profile) {
    return { success: false, error: "Unauthorized." }
  }
  if (profile.role !== "MASTER") {
    return { success: false, error: "Access Denied. Only MASTER admins can create new services." }
  }

  // 2. Insert into database
  try {
    const exists = await prisma.service.findUnique({ where: { id: data.id } })
    if (exists) {
      return { success: false, error: `Service ID "${data.id}" already exists.` }
    }

    const newService = await prisma.service.create({
      data: {
        id: data.id.trim().toLowerCase(),
        name: data.name.trim(),
        price: data.price,
        description: data.description.trim(),
        schedule: data.schedule.trim(),
        slots: data.slots,
        requiresChildData: data.requiresChildData,
        customFields: JSON.parse(JSON.stringify(data.customFields))
      }
    })

    revalidatePath("/admin/dashboard")
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
  const profile = await checkAdminAuthorization(adminEmail)
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
  const profile = await checkAdminAuthorization(adminEmail)
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
  const profile = await checkAdminAuthorization(adminEmail)
  if (!profile || profile.role !== "MASTER") {
    return { success: false, error: "Access Denied. Only MASTER admins can manage other admins." }
  }

  try {
    const target = await prisma.adminProfile.findUnique({ where: { id: targetId } })
    if (!target) {
      return { success: false, error: "Admin profile not found." }
    }

    // Prevent self-deletion
    if (target.email === adminEmail) {
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
  const profile = await checkAdminAuthorization(adminEmail)
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

    // 4. Handle slot increments/decrements atomically
    if (currentStatus !== "FAILED" && targetStatus === "FAILED") {
      // Re-add 1 slot back to the program
      await prisma.service.update({
        where: { id: registration.serviceId },
        data: { slots: { increment: 1 } }
      })
    } else if (currentStatus === "FAILED" && targetStatus !== "FAILED") {
      // Re-claim 1 slot from the program
      const service = await prisma.service.findUnique({
        where: { id: registration.serviceId }
      })

      if (!service) {
        return { success: false, error: "Program layanan tidak ditemukan." }
      }

      if (service.slots <= 0) {
        return { success: false, error: "Gagal memulihkan status. Kuota kelas saat ini sudah penuh." }
      }

      await prisma.service.update({
        where: { id: registration.serviceId },
        data: { slots: { decrement: 1 } }
      })
    }

    // 5. Update registration record
    const updated = await prisma.registration.update({
      where: { id: registrationId },
      data: { status: targetStatus }
    })

    // 6. Revalidate caches
    revalidatePath("/admin/dashboard")
    revalidatePath("/")
    revalidatePath(`/layanan/${registration.serviceId}`)
    revalidatePath("/register/success")

    return { success: true, registration: updated }
  } catch (error) {
    console.error("Error updating registration status:", error)
    return { success: false, error: "Gagal mengubah status pendaftaran." }
  }
}

