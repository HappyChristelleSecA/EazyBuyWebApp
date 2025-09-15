export interface InventoryItem {
  productId: string
  quantity: number
  lowStockThreshold: number
  reserved: number
  lastUpdated: Date
  supplier?: string
  location?: string
}

export interface InventoryTransaction {
  id: string
  productId: string
  type: "purchase" | "sale" | "adjustment" | "return" | "reservation" | "release"
  quantity: number
  previousQuantity: number
  newQuantity: number
  reason?: string
  userId?: string
  date: Date
}

export interface StockAlert {
  id: string
  productId: string
  productName: string
  type: "low_stock" | "out_of_stock" | "overstock"
  currentQuantity: number
  threshold: number
  severity: "low" | "medium" | "high"
  date: Date
  acknowledged: boolean
}

// Mock inventory data
export const inventory: InventoryItem[] = [
  {
    productId: "1",
    quantity: 25,
    lowStockThreshold: 10,
    reserved: 3,
    lastUpdated: new Date(),
    supplier: "TechSupplier Inc",
    location: "Warehouse A",
  },
  {
    productId: "2",
    quantity: 8,
    lowStockThreshold: 15,
    reserved: 2,
    lastUpdated: new Date(),
    supplier: "GadgetWorld",
    location: "Warehouse A",
  },
  {
    productId: "3",
    quantity: 45,
    lowStockThreshold: 20,
    reserved: 5,
    lastUpdated: new Date(),
    supplier: "FashionHub",
    location: "Warehouse B",
  },
  {
    productId: "4",
    quantity: 12,
    lowStockThreshold: 8,
    reserved: 1,
    lastUpdated: new Date(),
    supplier: "HomeDecor Ltd",
    location: "Warehouse B",
  },
  {
    productId: "5",
    quantity: 30,
    lowStockThreshold: 12,
    reserved: 4,
    lastUpdated: new Date(),
    supplier: "SportsPro",
    location: "Warehouse C",
  },
  {
    productId: "6",
    quantity: 18,
    lowStockThreshold: 10,
    reserved: 2,
    lastUpdated: new Date(),
    supplier: "BookWorld",
    location: "Warehouse C",
  },
  {
    productId: "7",
    quantity: 5,
    lowStockThreshold: 15,
    reserved: 1,
    lastUpdated: new Date(),
    supplier: "TechSupplier Inc",
    location: "Warehouse A",
  },
  {
    productId: "8",
    quantity: 0,
    lowStockThreshold: 10,
    reserved: 0,
    lastUpdated: new Date(),
    supplier: "FashionHub",
    location: "Warehouse B",
  },
]

// Mock transaction history
export const inventoryTransactions: InventoryTransaction[] = [
  {
    id: "txn-1",
    productId: "1",
    type: "purchase",
    quantity: 50,
    previousQuantity: 0,
    newQuantity: 50,
    reason: "Initial stock",
    userId: "admin",
    date: new Date("2024-01-01"),
  },
  {
    id: "txn-2",
    productId: "1",
    type: "sale",
    quantity: -22,
    previousQuantity: 50,
    newQuantity: 28,
    reason: "Customer orders",
    date: new Date("2024-01-15"),
  },
  {
    id: "txn-3",
    productId: "2",
    type: "adjustment",
    quantity: -2,
    previousQuantity: 10,
    newQuantity: 8,
    reason: "Damaged items",
    userId: "admin",
    date: new Date("2024-01-20"),
  },
]

export const getInventoryByProductId = (productId: string): InventoryItem | undefined => {
  return inventory.find((item) => item.productId === productId)
}

export const getAvailableQuantity = (productId: string): number => {
  const item = getInventoryByProductId(productId)
  return item ? Math.max(0, item.quantity - item.reserved) : 0
}

export const isInStock = (productId: string): boolean => {
  return getAvailableQuantity(productId) > 0
}

export const isLowStock = (productId: string): boolean => {
  const item = getInventoryByProductId(productId)
  return item ? item.quantity <= item.lowStockThreshold : false
}

export const getStockAlerts = (): StockAlert[] => {
  const alerts: StockAlert[] = []

  inventory.forEach((item) => {
    const product = require("./products").products.find((p: any) => p.id === item.productId)
    if (!product) return

    if (item.quantity === 0) {
      alerts.push({
        id: `alert-${item.productId}-out`,
        productId: item.productId,
        productName: product.name,
        type: "out_of_stock",
        currentQuantity: item.quantity,
        threshold: 0,
        severity: "high",
        date: new Date(),
        acknowledged: false,
      })
    } else if (item.quantity <= item.lowStockThreshold) {
      alerts.push({
        id: `alert-${item.productId}-low`,
        productId: item.productId,
        productName: product.name,
        type: "low_stock",
        currentQuantity: item.quantity,
        threshold: item.lowStockThreshold,
        severity: item.quantity <= item.lowStockThreshold / 2 ? "high" : "medium",
        date: new Date(),
        acknowledged: false,
      })
    }
  })

  return alerts.sort((a, b) => {
    const severityOrder = { high: 3, medium: 2, low: 1 }
    return severityOrder[b.severity] - severityOrder[a.severity]
  })
}

export const reserveStock = (productId: string, quantity: number): boolean => {
  const item = getInventoryByProductId(productId)
  if (!item || getAvailableQuantity(productId) < quantity) {
    return false
  }

  item.reserved += quantity
  item.lastUpdated = new Date()

  // Add transaction record
  inventoryTransactions.push({
    id: `txn-${Date.now()}`,
    productId,
    type: "reservation",
    quantity: -quantity,
    previousQuantity: item.quantity,
    newQuantity: item.quantity,
    reason: "Stock reserved for order",
    date: new Date(),
  })

  return true
}

export const releaseReservedStock = (productId: string, quantity: number): void => {
  const item = getInventoryByProductId(productId)
  if (!item) return

  item.reserved = Math.max(0, item.reserved - quantity)
  item.lastUpdated = new Date()

  // Add transaction record
  inventoryTransactions.push({
    id: `txn-${Date.now()}`,
    productId,
    type: "release",
    quantity: quantity,
    previousQuantity: item.quantity,
    newQuantity: item.quantity,
    reason: "Reserved stock released",
    date: new Date(),
  })
}

export const updateStock = (productId: string, newQuantity: number, reason?: string, userId?: string): boolean => {
  const item = getInventoryByProductId(productId)
  if (!item) return false

  const previousQuantity = item.quantity
  const quantityChange = newQuantity - previousQuantity

  item.quantity = newQuantity
  item.lastUpdated = new Date()

  // Add transaction record
  inventoryTransactions.push({
    id: `txn-${Date.now()}`,
    productId,
    type: quantityChange > 0 ? "purchase" : "adjustment",
    quantity: quantityChange,
    previousQuantity,
    newQuantity,
    reason: reason || "Manual adjustment",
    userId,
    date: new Date(),
  })

  return true
}

export const processOrder = (productId: string, quantity: number): boolean => {
  const item = getInventoryByProductId(productId)
  if (!item || item.reserved < quantity) {
    return false
  }

  // Reduce both reserved and actual quantity
  item.reserved -= quantity
  item.quantity -= quantity
  item.lastUpdated = new Date()

  // Add transaction record
  inventoryTransactions.push({
    id: `txn-${Date.now()}`,
    productId,
    type: "sale",
    quantity: -quantity,
    previousQuantity: item.quantity + quantity,
    newQuantity: item.quantity,
    reason: "Order fulfilled",
    date: new Date(),
  })

  return true
}

export const getInventoryReport = () => {
  const totalProducts = inventory.length
  const lowStockItems = inventory.filter((item) => isLowStock(item.productId)).length
  const outOfStockItems = inventory.filter((item) => item.quantity === 0).length
  const totalValue = inventory.reduce((sum, item) => {
    const product = require("./products").products.find((p: any) => p.id === item.productId)
    return sum + (product ? product.price * item.quantity : 0)
  }, 0)

  return {
    totalProducts,
    lowStockItems,
    outOfStockItems,
    totalValue,
    alerts: getStockAlerts(),
  }
}

export const bulkUpdateStock = (
  updates: Array<{ productId: string; quantity: number; reason?: string }>,
  userId?: string,
): boolean => {
  try {
    updates.forEach((update) => {
      updateStock(update.productId, update.quantity, update.reason, userId)
    })
    return true
  } catch (error) {
    console.error("Bulk update failed:", error)
    return false
  }
}
