import type { Product } from "./products"
import { getAvailableQuantity } from "./inventory"

export interface CartItem {
  id: string
  product: Product
  quantity: number
  addedAt: Date
}

export interface CartState {
  items: CartItem[]
  total: number
  itemCount: number
  isOpen: boolean
}

export const calculateCartTotal = (items: CartItem[]): number => {
  return items.reduce((total, item) => total + item.product.price * item.quantity, 0)
}

export const calculateItemCount = (items: CartItem[]): number => {
  return items.reduce((count, item) => count + item.quantity, 0)
}

export const getCartFromStorage = (userId?: string): CartItem[] => {
  if (typeof window === "undefined") return []

  try {
    const cartKey = userId ? `eazybuy_cart_${userId}` : "eazybuy_cart_guest"
    const cartData = localStorage.getItem(cartKey)
    if (!cartData) return []

    const items = JSON.parse(cartData)
    // Convert date strings back to Date objects
    return items.map((item: any) => ({
      ...item,
      addedAt: new Date(item.addedAt),
    }))
  } catch {
    return []
  }
}

export const saveCartToStorage = (items: CartItem[], userId?: string): void => {
  if (typeof window === "undefined") return

  try {
    const cartKey = userId ? `eazybuy_cart_${userId}` : "eazybuy_cart_guest"
    localStorage.setItem(cartKey, JSON.stringify(items))
  } catch (error) {
    console.error("Failed to save cart to storage:", error)
  }
}

export const clearUserCart = (userId?: string): void => {
  if (typeof window === "undefined") return

  try {
    const cartKey = userId ? `eazybuy_cart_${userId}` : "eazybuy_cart_guest"
    localStorage.removeItem(cartKey)
  } catch (error) {
    console.error("Failed to clear user cart:", error)
  }
}

export const addToCart = (items: CartItem[], product: Product, quantity = 1): CartItem[] => {
  console.log("[v0] lib/cart addToCart called with:", { productName: product.name, quantity })
  console.log("[v0] Product availability:", { inStock: product.inStock, outOfOrder: product.outOfOrder })

  if (!product.inStock || product.outOfOrder) {
    console.warn(`[v0] ❌ Cannot add ${product.name} to cart: product is out of stock or out of order`)
    return items
  }

  const availableQuantity = getAvailableQuantity(product.id)
  console.log("[v0] Available quantity for product:", availableQuantity)

  const existingItem = items.find((item) => item.id === product.id)
  const currentCartQuantity = existingItem ? existingItem.quantity : 0
  const requestedTotalQuantity = currentCartQuantity + quantity

  console.log("[v0] Quantity check:", {
    currentCartQuantity,
    requestedTotalQuantity,
    availableQuantity,
  })

  // Check if requested quantity exceeds available stock
  if (requestedTotalQuantity > availableQuantity) {
    const maxAddable = Math.max(0, availableQuantity - currentCartQuantity)
    console.warn(
      `[v0] ❌ Cannot add ${quantity} of ${product.name}. Only ${maxAddable} available to add (${availableQuantity} total, ${currentCartQuantity} already in cart)`,
    )

    // Add only what's available, if any
    if (maxAddable > 0) {
      quantity = maxAddable
      console.log("[v0] ⚠️ Adjusted quantity to:", quantity)
    } else {
      console.log("[v0] ❌ Cannot add any more items")
      return items // Cannot add any more
    }
  }

  if (existingItem) {
    console.log("[v0] ✅ Updating existing item quantity")
    const updatedItems = items.map((item) =>
      item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
    )
    console.log(
      "[v0] Updated items:",
      updatedItems.map((item) => ({ name: item.product.name, qty: item.quantity })),
    )
    return updatedItems
  }

  const newItem: CartItem = {
    id: product.id,
    product,
    quantity,
    addedAt: new Date(),
  }

  console.log("[v0] ✅ Adding new item to cart:", { name: newItem.product.name, quantity: newItem.quantity })
  const newItems = [...items, newItem]
  console.log(
    "[v0] Final cart items:",
    newItems.map((item) => ({ name: item.product.name, qty: item.quantity })),
  )

  return newItems
}

export const removeFromCart = (items: CartItem[], productId: string): CartItem[] => {
  return items.filter((item) => item.id !== productId)
}

export const updateCartItemQuantity = (items: CartItem[], productId: string, quantity: number): CartItem[] => {
  if (quantity <= 0) {
    return removeFromCart(items, productId)
  }

  const item = items.find((item) => item.id === productId)
  if (item) {
    const availableQuantity = getAvailableQuantity(productId)

    // Check if the product is still available
    if (!item.product.inStock || item.product.outOfOrder) {
      console.warn(`[v0] ❌ Cannot update ${item.product.name}: product is out of stock or out of order`)
      return removeFromCart(items, productId) // Remove from cart if no longer available
    }

    // Limit quantity to available stock
    if (quantity > availableQuantity) {
      console.warn(
        `[v0] ❌ Cannot set quantity to ${quantity} for ${item.product.name}. Only ${availableQuantity} available`,
      )
      quantity = Math.max(0, availableQuantity)

      if (quantity === 0) {
        return removeFromCart(items, productId)
      }
    }
  }

  return items.map((item) => (item.id === productId ? { ...item, quantity } : item))
}

export const clearCart = (): CartItem[] => {
  return []
}

export const validateCartStock = (
  items: CartItem[],
): { validItems: CartItem[]; removedItems: CartItem[]; updatedItems: CartItem[] } => {
  const validItems: CartItem[] = []
  const removedItems: CartItem[] = []
  const updatedItems: CartItem[] = []

  items.forEach((item) => {
    // Check if product is still available
    if (!item.product.inStock || item.product.outOfOrder) {
      removedItems.push(item)
      return
    }

    const availableQuantity = getAvailableQuantity(item.id)

    if (availableQuantity === 0) {
      removedItems.push(item)
    } else if (item.quantity > availableQuantity) {
      const updatedItem = { ...item, quantity: availableQuantity }
      updatedItems.push(updatedItem)
      validItems.push(updatedItem)
    } else {
      validItems.push(item)
    }
  })

  return { validItems, removedItems, updatedItems }
}
