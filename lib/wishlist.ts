import type { Product } from "./products"

export interface WishlistItem {
  id: string
  product: Product
  addedAt: Date
}

export const getWishlistFromStorage = (userId?: string): WishlistItem[] => {
  if (typeof window === "undefined") return []

  try {
    const wishlistKey = userId ? `eazybuy_wishlist_${userId}` : "eazybuy_wishlist_guest"
    const wishlistData = localStorage.getItem(wishlistKey)
    if (!wishlistData) return []

    const items = JSON.parse(wishlistData)
    // Convert date strings back to Date objects
    return items.map((item: any) => ({
      ...item,
      addedAt: new Date(item.addedAt),
    }))
  } catch {
    return []
  }
}

export const saveWishlistToStorage = (items: WishlistItem[], userId?: string): void => {
  if (typeof window === "undefined") return

  try {
    const wishlistKey = userId ? `eazybuy_wishlist_${userId}` : "eazybuy_wishlist_guest"
    localStorage.setItem(wishlistKey, JSON.stringify(items))
  } catch (error) {
    console.error("Failed to save wishlist to storage:", error)
  }
}

export const addToWishlist = (items: WishlistItem[], product: Product): WishlistItem[] => {
  const existingItem = items.find((item) => item.id === product.id)
  if (existingItem) return items

  const newItem: WishlistItem = {
    id: product.id,
    product,
    addedAt: new Date(),
  }

  return [...items, newItem]
}

export const removeFromWishlist = (items: WishlistItem[], productId: string): WishlistItem[] => {
  return items.filter((item) => item.id !== productId)
}

export const isInWishlist = (items: WishlistItem[], productId: string): boolean => {
  return items.some((item) => item.id === productId)
}

export const clearUserWishlist = (userId?: string): void => {
  if (typeof window === "undefined") return

  try {
    const wishlistKey = userId ? `eazybuy_wishlist_${userId}` : "eazybuy_wishlist_guest"
    localStorage.removeItem(wishlistKey)
  } catch (error) {
    console.error("Failed to clear user wishlist:", error)
  }
}
