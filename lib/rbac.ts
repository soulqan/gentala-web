import { AdminRole } from "@prisma/client"
import { prisma } from "./prisma"

export const ROLE_SERVICE_MAPPINGS: Record<Exclude<AdminRole, "MASTER">, string[]> = {
  PAUD: ["daycare-harian", "paud-terintegrasi"],
  PSIKOLOGI: ["biro-psikologi"],
  PARENTING: ["program-parenting"],
  GYMNASTIC: ["kelas-gymnastic", "aviary"],
}

export async function checkAdminAuthorization(email: string) {
  if (!email) return null
  
  try {
    const profile = await prisma.adminProfile.findUnique({
      where: { email },
    })
    return profile
  } catch (error) {
    console.error("Error checking admin authorization:", error)
    return null
  }
}

export function getAllowedServiceIds(role: AdminRole): string[] | null {
  if (role === "MASTER") {
    return null // Null signifies all services are allowed
  }
  return ROLE_SERVICE_MAPPINGS[role] || []
}
