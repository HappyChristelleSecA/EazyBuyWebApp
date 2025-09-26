"use client"
import type React from "react"
import { Header } from "@/components/layout/header"
import { DashboardNav } from "./dashboard-nav"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BackButton } from "@/components/ui/back-button"

interface DashboardLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
}

export function DashboardLayout({ children, title, description }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>My Account</CardTitle>
              </CardHeader>
              <CardContent>
                <BackButton fallbackUrl="/" className="w-full mb-4" variant="outline">
                  Back to Store
                </BackButton>
                <DashboardNav />
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
