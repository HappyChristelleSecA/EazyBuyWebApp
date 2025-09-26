import type React from "react"
import { Header } from "@/components/layout/header"
import { AdminNav } from "./admin-nav"
import { BackButton } from "@/components/ui/back-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface AdminLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
}

export function AdminLayout({ children, title, description }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Admin Panel</CardTitle>
              </CardHeader>
              <CardContent>
                <BackButton fallbackUrl="/" className="w-full mb-4" variant="outline">
                  Back to Store
                </BackButton>
                <AdminNav />
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="mb-6">
              <h1 className="text-3xl font-bold">{title}</h1>
              {description && <p className="text-muted-foreground mt-2">{description}</p>}
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
