"use client"

import { useAuth } from "@/hooks/use-auth"
import { useCart } from "@/hooks/use-cart"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getUserOrderStats } from "@/lib/orders"
import { FaBox, FaShoppingCart, FaHeart, FaUser, FaChartLine } from "react-icons/fa"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function DashboardPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { itemCount, total } = useCart()
  const router = useRouter()
  const [orderStats, setOrderStats] = useState({ totalOrders: 0, totalSpent: 0, recentOrders: [] })

  useEffect(() => {
    console.log("[v0] Dashboard auth check:", { isLoading, isAuthenticated, user: user?.email })

    if (!isLoading && !isAuthenticated) {
      console.log("[v0] Redirecting to auth from dashboard")
      router.push("/auth")
    }
  }, [isAuthenticated, isLoading, router])

  useEffect(() => {
    if (user) {
      const stats = getUserOrderStats(user.id)
      setOrderStats(stats)
    }
  }, [user])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || !user) {
    return null // This will trigger the redirect in useEffect
  }

  return (
    <DashboardLayout title="Dashboard" description="Welcome back! Here's an overview of your account.">
      {/* Welcome Section */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <FaUser className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">Welcome back, {user.name}!</h2>
              <p className="text-muted-foreground">
                {user.role === "admin" ? "Administrator Account" : "Customer Account"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <FaBox className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orderStats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">All time orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
            <FaChartLine className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${orderStats.totalSpent.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Lifetime spending</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cart Items</CardTitle>
            <FaShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itemCount}</div>
            <p className="text-xs text-muted-foreground">${total.toFixed(2)} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Wishlist</CardTitle>
            <FaHeart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Saved items</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Recent Orders</CardTitle>
          <Button variant="outline" asChild>
            <Link href="/dashboard/orders">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {orderStats.recentOrders.length > 0 ? (
            <div className="space-y-4">
              {orderStats.recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div>
                      <p className="font-medium">Order #{order.id}</p>
                      <p className="text-sm text-muted-foreground">
                        {order.orderDate.toLocaleDateString()} • {order.items.length} items
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge
                      className={`${order.status === "delivered" ? "bg-green-100 text-green-800" : order.status === "shipped" ? "bg-blue-100 text-blue-800" : "bg-yellow-100 text-yellow-800"}`}
                    >
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </Badge>
                    <p className="font-medium">${order.total.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <FaBox className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No orders yet</p>
              <Button className="mt-4" asChild>
                <Link href="/products">Start Shopping</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  )
}
