"use client"

import { useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { AdminLayout } from "@/components/admin/admin-layout"
import { InventoryDashboard } from "@/components/admin/inventory-dashboard"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorBoundary } from "@/components/error-boundary"

export default function AdminInventoryPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "admin")) {
      console.log("[v0] Admin inventory access denied:", { isAuthenticated, user: user?.role })
      router.push("/")
    }
  }, [isAuthenticated, user, isLoading, router])

  if (isLoading) {
    return <LoadingSpinner className="min-h-screen" />
  }

  if (!isAuthenticated || !user || user.role !== "admin") {
    return null
  }

  return (
    <ErrorBoundary>
      <AdminLayout title="Inventory Management" description="Monitor and manage product inventory levels">
        <InventoryDashboard />
      </AdminLayout>
    </ErrorBoundary>
  )
}
