import * as React from "react"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { checkAdminAuthorization, getAllowedServiceIds } from "@/lib/rbac"
import DashboardClient from "./DashboardClient"

export default async function AdminDashboardPage() {
  const cookieStore = await cookies()
  const emailCookie = cookieStore.get("admin_session_email")

  // 1. Session validation
  if (!emailCookie || !emailCookie.value) {
    redirect("/admin/login")
  }

  const email = emailCookie.value.trim().toLowerCase()

  // 2. Profile and Authorization validation
  const profile = await checkAdminAuthorization(email)
  if (!profile) {
    // Clear invalid session cookie and redirect
    cookieStore.delete("admin_session_email")
    redirect("/admin/login?error=unauthorized")
  }

  // 3. Resolve RBAC filters (combining system-mapped services & user-created services)
  const allowedServiceIds = getAllowedServiceIds(profile.role) || []
  const myCreatedServices = await prisma.service.findMany({
    where: { createdBy: profile.email },
    select: { id: true }
  })
  const myCreatedIds = myCreatedServices.map(s => s.id)
  const allAccessibleServiceIds = [...new Set([...allowedServiceIds, ...myCreatedIds])]

  // 4. Fetch filtered Services from database
  const services = await prisma.service.findMany({
    where: profile.role === "MASTER"
      ? {}
      : { id: { in: allAccessibleServiceIds } },
    orderBy: { createdAt: "asc" }
  })

  // 5. Fetch filtered Registrations from database
  const registrations = await prisma.registration.findMany({
    where: profile.role === "MASTER"
      ? {}
      : { serviceId: { in: allAccessibleServiceIds } },
    orderBy: { createdAt: "desc" }
  })

  // 6. Fetch admins list if logged-in user has MASTER role
  const admins = profile.role === "MASTER"
    ? await prisma.adminProfile.findMany({
        orderBy: { createdAt: "desc" }
      })
    : []

  // 7. Return layout container passing query arrays
  return (
    <DashboardClient
      adminEmail={profile.email}
      adminRole={profile.role}
      services={services.map(s => ({
        ...s,
        customFields: typeof s.customFields === "string" ? JSON.parse(s.customFields) : s.customFields
      }))}
      registrations={registrations.map(r => ({
        ...r,
        customAnswers: typeof r.customAnswers === "string" ? JSON.parse(r.customAnswers) : r.customAnswers
      }))}
      admins={admins.map(a => ({
        id: a.id,
        email: a.email,
        role: a.role,
        createdAt: a.createdAt
      }))}
    />
  )
}
