import * as React from "react"
import { prisma } from "@/lib/prisma"
import RegistrationFormClient from "./RegistrationFormClient"

interface PageProps {
  searchParams: Promise<{ serviceId?: string; service?: string }>
}

export default async function RegisterPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams
  const serviceParam = resolvedParams.serviceId || resolvedParams.service

  // 1. Query all active stimulations from Prisma
  const services = await prisma.service.findMany({
    orderBy: { createdAt: "asc" }
  })

  // 2. Safely serialize JSON properties for client consumption
  const serializedServices = services.map(s => ({
    id: s.id,
    name: s.name,
    price: s.price,
    slots: s.slots,
    requiresChildData: s.requiresChildData,
    customFields: Array.isArray(s.customFields) 
      ? s.customFields 
      : (typeof s.customFields === "string" ? JSON.parse(s.customFields) : [])
  }))

  return (
    <RegistrationFormClient 
      services={serializedServices} 
      initialServiceId={serviceParam || ""}
    />
  )
}
