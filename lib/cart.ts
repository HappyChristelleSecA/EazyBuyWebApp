import type { Product } from "./products"

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
  const existingItem = items.find((item) => item.id === product.id)

  if (existingItem) {
    return items.map((item) => (item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item))
  }

  const newItem: CartItem = {
    id: product.id,
    product,
    quantity,
    addedAt: new Date(),
  }

  return [...items, newItem]
}

export const removeFromCart = (items: CartItem[], productId: string): CartItem[] => {
  return items.filter((item) => item.id !== productId)
}

export const updateCartItemQuantity = (items: CartItem[], productId: string, quantity: number): CartItem[] => {
  if (quantity <= 0) {
    return removeFromCart(items, productId)
  }

  return items.map((item) => (item.id === productId ? { ...item, quantity } : item))
}

export const clearCart = (): CartItem[] => {
  return []
}
