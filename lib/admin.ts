import { products } from "./products"
import { mockOrders } from "./orders"

export interface AdminStats {
  totalRevenue: number
  totalOrders: number
  totalProducts: number
  totalUsers: number
  revenueGrowth: number
  orderGrowth: number
  topSellingProducts: Array<{
    id: string
    name: string
    sales: number
    revenue: number
  }>
  recentOrders: Array<{
    id: string
    customerName: string
    total: number
    status: string
    date: Date
  }>
  salesData: Array<{
    month: string
    revenue: number
    orders: number
  }>
}

export const getAdminStats = (): AdminStats => {
  const totalRevenue = mockOrders.reduce((sum, order) => sum + order.total, 0)
  const totalOrders = mockOrders.length
  const totalProducts = products.length
  const totalUsers = 150 // Mock user count

  // Mock growth percentages
  const revenueGrowth = 12.5
  const orderGrowth = 8.3

  // Top selling products (mock data)
  const topSellingProducts = [
    { id: "1", name: "Wireless Bluetooth Headphones", sales: 45, revenue: 8999.55 },
    { id: "3", name: "Organic Cotton T-Shirt", sales: 32, revenue: 959.68 },
    { id: "5", name: "Yoga Mat Premium", sales: 28, revenue: 1399.72 },
  ]

  // Recent orders
  const recentOrders = mockOrders.slice(0, 5).map((order) => ({
    id: order.id,
    customerName: order.shippingAddress.name,
    total: order.total,
    status: order.status,
    date: order.orderDate,
  }))

  // Sales data for chart (mock data)
  const salesData = [
    { month: "Jan", revenue: 12400, orders: 45 },
    { month: "Feb", revenue: 15600, orders: 52 },
    { month: "Mar", revenue: 18200, orders: 61 },
    { month: "Apr", revenue: 16800, orders: 58 },
    { month: "May", revenue: 21500, orders: 72 },
    { month: "Jun", revenue: 19300, orders: 65 },
  ]

  return {
    totalRevenue,
    totalOrders,
    totalProducts,
    totalUsers,
    revenueGrowth,
    orderGrowth,
    topSellingProducts,
    recentOrders,
    salesData,
  }
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: "admin" | "user"
  joinDate: Date
  totalOrders: number
  totalSpent: number
  status: "active" | "inactive"
}

export const getAdminUsers = (): AdminUser[] => {
  if (typeof window === "undefined") {
    // Return default users during SSR
    return [
      {
        id: "1",
        name: "Admin User",
        email: "admin@eazybuy.com",
        role: "admin",
        joinDate: new Date("2024-01-01"),
        totalOrders: 0,
        totalSpent: 0,
        status: "active",
      },
      {
        id: "2",
        name: "John Doe",
        email: "user@example.com",
        role: "user",
        joinDate: new Date("2024-01-15"),
        totalOrders: 3,
        totalSpent: 354.74,
        status: "active",
      },
    ]
  }

  const mockUsers = JSON.parse(localStorage.getItem("allUsers") || "[]")

  // If no users in localStorage, return default users
  if (mockUsers.length === 0) {
    return [
      {
        id: "1",
        name: "Admin User",
        email: "admin@eazybuy.com",
        role: "admin",
        joinDate: new Date("2024-01-01"),
        totalOrders: 0,
        totalSpent: 0,
        status: "active",
      },
      {
        id: "2",
        name: "John Doe",
        email: "user@example.com",
        role: "user",
        joinDate: new Date("2024-01-15"),
        totalOrders: 3,
        totalSpent: 354.74,
        status: "active",
      },
    ]
  }

  // Convert auth users to admin user format
  return mockUsers.map((user: any) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    joinDate: new Date(user.createdAt),
    totalOrders: 0,
    totalSpent: 0,
    status: "active",
  }))
}
