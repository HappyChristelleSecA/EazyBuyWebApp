"use client"

import dynamic from "next/dynamic"

const AdminUsersPageClient = dynamic(() => import("./client-page"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>Loading...</p>
      </div>
    </div>
  ),
})

export default function AdminUsersPage() {
  return <AdminUsersPageClient />
}
