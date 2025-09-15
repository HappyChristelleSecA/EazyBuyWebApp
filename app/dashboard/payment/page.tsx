"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FaCreditCard, FaPlus, FaEdit, FaTrash } from "react-icons/fa"

interface PaymentMethod {
  id: string
  type: "card" | "paypal"
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
}

export default function PaymentPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [paymentMethods] = useState<PaymentMethod[]>([
    {
      id: "1",
      type: "card",
      last4: "4242",
      brand: "Visa",
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
  ])

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push("/auth")
    }
  }, [isAuthenticated, user, isLoading, router])

  if (isLoading) {
    return (
      <DashboardLayout title="Payment Methods" description="Manage your payment methods and billing information">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading payment methods...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <DashboardLayout title="Payment Methods" description="Manage your payment methods and billing information">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">Securely store your payment methods for faster checkout</p>
          <Button>
            <FaPlus className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </div>

        {paymentMethods.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {paymentMethods.map((method) => (
              <Card key={method.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center space-x-2">
                    <FaCreditCard className="h-4 w-4" />
                    <CardTitle className="text-lg">
                      {method.brand} •••• {method.last4}
                    </CardTitle>
                    {method.isDefault && <Badge variant="secondary">Default</Badge>}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon">
                      <FaEdit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-destructive">
                      <FaTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      Expires {method.expiryMonth?.toString().padStart(2, "0")}/{method.expiryYear}
                    </p>
                  </div>
                  {!method.isDefault && (
                    <Button variant="outline" size="sm" className="mt-4 bg-transparent">
                      Set as Default
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FaCreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No payment methods saved</h3>
              <p className="text-muted-foreground mb-6">Add a payment method for faster and secure checkout.</p>
              <Button>
                <FaPlus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
