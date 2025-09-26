import type { Product } from "./products"

export type OrderStatus =
  | "pending"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "return_requested"
  | "returned"
  | "refunded"

export interface OrderItem {
  id: string
  product: Product
  quantity: number
  price: number
}

export interface Order {
  id: string
  userId: string
  items: OrderItem[]
  total: number
  subtotal: number
  shipping: number
  tax: number
  status: OrderStatus
  orderDate: Date
  estimatedDelivery?: Date
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  trackingNumber?: string
  shippingMethod?: {
    id: string
    name: string
    cost: number
    estimatedDays: string
  }
}

// Mock orders data
export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    userId: "2",
    items: [
      {
        id: "1",
        product: {
          id: "1",
          name: "Wireless Bluetooth Headphones",
          description: "Premium quality wireless headphones with noise cancellation and 30-hour battery life.",
          price: 199.99,
          originalPrice: 249.99,
          category: "Electronics",
          image: "/wireless-bluetooth-headphones.png",
          images: ["/wireless-bluetooth-headphones-front.png", "/wireless-bluetooth-headphones-side.png"],
          rating: 4.5,
          reviewCount: 128,
          inStock: true,
          featured: true,
          tags: ["wireless", "bluetooth", "noise-cancelling"],
        },
        quantity: 1,
        price: 199.99,
      },
    ],
    subtotal: 199.99,
    shipping: 0,
    tax: 16.0,
    total: 215.99,
    status: "delivered",
    orderDate: new Date("2024-01-15"),
    estimatedDelivery: new Date("2024-01-18"),
    trackingNumber: "TRK123456789",
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    shippingMethod: {
      id: "SHM-001",
      name: "Free Shipping",
      cost: 0,
      estimatedDays: "7-10 days",
    },
  },
  {
    id: "ORD-002",
    userId: "2",
    items: [
      {
        id: "3",
        product: {
          id: "3",
          name: "Organic Cotton T-Shirt",
          description: "Comfortable and sustainable organic cotton t-shirt available in multiple colors.",
          price: 29.99,
          originalPrice: 39.99,
          category: "Fashion",
          image: "/organic-cotton-t-shirt.png",
          images: ["/organic-cotton-t-shirt-front.png", "/organic-cotton-t-shirt-back.png"],
          rating: 4.7,
          reviewCount: 203,
          inStock: true,
          featured: false,
          tags: ["organic", "cotton", "sustainable"],
        },
        quantity: 2,
        price: 29.99,
      },
    ],
    subtotal: 59.98,
    shipping: 9.99,
    tax: 4.8,
    total: 74.77,
    status: "shipped",
    orderDate: new Date("2024-01-20"),
    estimatedDelivery: new Date("2024-01-25"),
    trackingNumber: "TRK987654321",
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    shippingMethod: {
      id: "SHM-002",
      name: "Standard Shipping",
      cost: 9.99,
      estimatedDays: "5-7 days",
    },
  },
  {
    id: "ORD-003",
    userId: "2",
    items: [
      {
        id: "5",
        product: {
          id: "5",
          name: "Yoga Mat Premium",
          description: "High-quality non-slip yoga mat perfect for all types of yoga and exercise.",
          price: 49.99,
          category: "Sports",
          image: "/premium-yoga-mat.png",
          images: ["/premium-yoga-mat-rolled.png", "/premium-yoga-mat-unrolled.png"],
          rating: 4.6,
          reviewCount: 174,
          inStock: true,
          featured: true,
          tags: ["yoga", "exercise", "non-slip"],
        },
        quantity: 1,
        price: 49.99,
      },
    ],
    subtotal: 49.99,
    shipping: 9.99,
    tax: 4.0,
    total: 63.98,
    status: "processing",
    orderDate: new Date("2024-01-22"),
    estimatedDelivery: new Date("2024-01-28"),
    trackingNumber: "TRK987654321",
    shippingAddress: {
      name: "John Doe",
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
    shippingMethod: {
      id: "SHM-003",
      name: "Express Shipping",
      cost: 19.99,
      estimatedDays: "3-5 days",
    },
  },
]

export const getOrdersByUserId = (userId: string): Order[] => {
  return mockOrders.filter((order) => order.userId === userId)
}

export const getOrderById = (orderId: string): Order | undefined => {
  return mockOrders.find((order) => order.id === orderId)
}

export const getOrderStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800"
    case "processing":
      return "bg-blue-100 text-blue-800"
    case "shipped":
      return "bg-purple-100 text-purple-800"
    case "delivered":
      return "bg-green-100 text-green-800"
    case "cancelled":
      return "bg-red-100 text-red-800"
    case "return_requested":
      return "bg-orange-100 text-orange-800"
    case "returned":
      return "bg-gray-100 text-gray-800"
    case "refunded":
      return "bg-indigo-100 text-indigo-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export const getOrderStatusText = (status: OrderStatus): string => {
  switch (status) {
    case "pending":
      return "Pending"
    case "processing":
      return "Processing"
    case "shipped":
      return "Shipped"
    case "delivered":
      return "Delivered"
    case "cancelled":
      return "Cancelled"
    case "return_requested":
      return "Return Requested"
    case "returned":
      return "Returned"
    case "refunded":
      return "Refunded"
    default:
      return "Unknown"
  }
}

export interface OrderTrackingEvent {
  id: string
  orderId: string
  status: OrderStatus
  timestamp: Date
  location?: string
  description: string
  carrier?: string
}

export interface OrderTracking {
  orderId: string
  trackingNumber: string
  carrier: string
  currentStatus: OrderStatus
  estimatedDelivery: Date
  events: OrderTrackingEvent[]
  deliveryAddress: string
}

export interface EnhancedOrder extends Order {
  trackingEvents: OrderTrackingEvent[]
  carrier?: string
  deliveryInstructions?: string
}

export const mockTrackingEvents: OrderTrackingEvent[] = [
  // Events for ORD-001 (delivered)
  {
    id: "EVT-001",
    orderId: "ORD-001",
    status: "pending",
    timestamp: new Date("2024-01-15T10:00:00"),
    description: "Order placed and payment confirmed",
  },
  {
    id: "EVT-002",
    orderId: "ORD-001",
    status: "processing",
    timestamp: new Date("2024-01-15T14:30:00"),
    description: "Order is being prepared for shipment",
  },
  {
    id: "EVT-003",
    orderId: "ORD-001",
    status: "shipped",
    timestamp: new Date("2024-01-16T09:15:00"),
    location: "New York, NY",
    description: "Package shipped from fulfillment center",
    carrier: "FedEx",
  },
  {
    id: "EVT-004",
    orderId: "ORD-001",
    status: "shipped",
    timestamp: new Date("2024-01-17T11:45:00"),
    location: "Newark, NJ",
    description: "Package in transit",
    carrier: "FedEx",
  },
  {
    id: "EVT-005",
    orderId: "ORD-001",
    status: "delivered",
    timestamp: new Date("2024-01-18T15:20:00"),
    location: "123 Main St, New York, NY",
    description: "Package delivered successfully",
    carrier: "FedEx",
  },
  // Events for ORD-002 (shipped)
  {
    id: "EVT-006",
    orderId: "ORD-002",
    status: "pending",
    timestamp: new Date("2024-01-20T11:30:00"),
    description: "Order placed and payment confirmed",
  },
  {
    id: "EVT-007",
    orderId: "ORD-002",
    status: "processing",
    timestamp: new Date("2024-01-21T08:00:00"),
    description: "Order is being prepared for shipment",
  },
  {
    id: "EVT-008",
    orderId: "ORD-002",
    status: "shipped",
    timestamp: new Date("2024-01-22T10:30:00"),
    location: "New York, NY",
    description: "Package shipped from fulfillment center",
    carrier: "UPS",
  },
  {
    id: "EVT-009",
    orderId: "ORD-002",
    status: "shipped",
    timestamp: new Date("2024-01-23T14:15:00"),
    location: "Philadelphia, PA",
    description: "Package in transit",
    carrier: "UPS",
  },
  // Events for ORD-003 (processing)
  {
    id: "EVT-010",
    orderId: "ORD-003",
    status: "pending",
    timestamp: new Date("2024-01-22T16:45:00"),
    description: "Order placed and payment confirmed",
  },
  {
    id: "EVT-011",
    orderId: "ORD-003",
    status: "processing",
    timestamp: new Date("2024-01-23T09:00:00"),
    description: "Order is being prepared for shipment",
  },
]

export const getTrackingEventsByOrderId = (orderId: string): OrderTrackingEvent[] => {
  return mockTrackingEvents.filter((event) => event.orderId === orderId)
}

export const getOrderTracking = (orderId: string): OrderTracking | undefined => {
  const order = getOrderById(orderId)
  if (!order) return undefined

  const events = getTrackingEventsByOrderId(orderId)
  const latestEvent = events[events.length - 1]

  return {
    orderId,
    trackingNumber: order.trackingNumber || "N/A",
    carrier: latestEvent?.carrier || "Standard Shipping",
    currentStatus: order.status,
    estimatedDelivery: order.estimatedDelivery || new Date(),
    events,
    deliveryAddress: `${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zipCode}`,
  }
}

export const updateOrderStatus = (orderId: string, newStatus: OrderStatus, description?: string): boolean => {
  const orderIndex = mockOrders.findIndex((order) => order.id === orderId)
  if (orderIndex === -1) return false

  // Update order status
  mockOrders[orderIndex].status = newStatus

  // Add tracking event
  const newEvent: OrderTrackingEvent = {
    id: `EVT-${Date.now()}`,
    orderId,
    status: newStatus,
    timestamp: new Date(),
    description: description || `Order status updated to ${newStatus}`,
  }

  mockTrackingEvents.push(newEvent)
  return true
}

export const getOrderStatusIcon = (status: OrderStatus): string => {
  switch (status) {
    case "pending":
      return "FaClock"
    case "processing":
      return "FaCog"
    case "shipped":
      return "FaTruck"
    case "delivered":
      return "FaCheckCircle"
    case "cancelled":
      return "FaTimesCircle"
    case "return_requested":
      return "FaUndo"
    case "returned":
      return "FaRedo"
    case "refunded":
      return "FaMoneyBillAlt"
    default:
      return "FaQuestion"
  }
}

export const createOrder = (orderData: {
  userId: string
  items: OrderItem[]
  subtotal: number
  tax: number
  total: number
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
  appliedDiscounts?: { code: string; amount: number }[]
  shippingMethod?: {
    id: string
    name: string
    cost: number
    estimatedDays: string
  }
}): Order => {
  const orderId = `ORD-${Date.now()}`
  const trackingNumber = `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`

  const newOrder: Order = {
    id: orderId,
    userId: orderData.userId,
    items: orderData.items,
    subtotal: orderData.subtotal,
    shipping: orderData.shippingMethod?.cost || 0,
    tax: orderData.tax,
    total: orderData.total,
    status: "pending",
    orderDate: new Date(),
    estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    trackingNumber,
    shippingAddress: orderData.shippingAddress,
    shippingMethod: orderData.shippingMethod,
  }

  // Add to mock orders array
  mockOrders.push(newOrder)

  // Create initial tracking event
  const initialEvent: OrderTrackingEvent = {
    id: `EVT-${Date.now()}`,
    orderId,
    status: "pending",
    timestamp: new Date(),
    description: "Order placed and payment confirmed",
  }

  mockTrackingEvents.push(initialEvent)

  return newOrder
}

export const getUserOrderStats = (userId: string) => {
  const userOrders = getOrdersByUserId(userId)
  const totalOrders = userOrders.length
  const totalSpent = userOrders.reduce((sum, order) => sum + order.total, 0)

  return {
    totalOrders,
    totalSpent,
    recentOrders: userOrders.slice(-3).reverse(), // Last 3 orders, most recent first
  }
}

export const canCancelOrder = (order: Order): boolean => {
  // Can cancel within 24 hours if order is pending or processing
  const hoursSinceOrder = (Date.now() - order.orderDate.getTime()) / (1000 * 60 * 60)
  return (order.status === "pending" || order.status === "processing") && hoursSinceOrder <= 24
}

export const canReturnOrder = (order: Order): boolean => {
  // Can return within 30 days if order is delivered
  const daysSinceDelivery = (Date.now() - order.orderDate.getTime()) / (1000 * 60 * 60 * 24)
  return order.status === "delivered" && daysSinceDelivery <= 30
}

export const cancelOrder = (orderId: string, reason?: string): boolean => {
  const order = getOrderById(orderId)
  if (!order || !canCancelOrder(order)) return false

  return updateOrderStatus(orderId, "cancelled", reason || "Order cancelled by customer")
}

export const requestReturn = (orderId: string, reason?: string): boolean => {
  const order = getOrderById(orderId)
  if (!order || !canReturnOrder(order)) return false

  return updateOrderStatus(orderId, "return_requested", reason || "Return requested by customer")
}
