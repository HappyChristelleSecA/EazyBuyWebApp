"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import {
  type WishlistItem,
  getWishlistFromStorage,
  saveWishlistToStorage,
  addToWishlist as addToWishlistUtil,
  removeFromWishlist as removeFromWishlistUtil,
  isInWishlist as isInWishlistUtil,
  clearUserWishlist,
} from "@/lib/wishlist"
import type { Product } from "@/lib/products"
import { useAuth } from "@/hooks/use-auth"

interface WishlistContextType {
  items: WishlistItem[]
  itemCount: number
  addToWishlist: (product: Product) => void
  removeFromWishlist: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clearWishlist: () => void
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const wishlistItems = getWishlistFromStorage(user?.id)
    setItems(wishlistItems)
    setIsLoaded(true)
  }, [user?.id])

  useEffect(() => {
    if (isLoaded) {
      saveWishlistToStorage(items, user?.id)
    }
  }, [items, isLoaded, user?.id])

  useEffect(() => {
    if (!user && isLoaded) {
      setItems([])
    }
  }, [user, isLoaded])

  const addToWishlist = (product: Product) => {
    setItems((prev) => addToWishlistUtil(prev, product))
  }

  const removeFromWishlist = (productId: string) => {
    setItems((prev) => removeFromWishlistUtil(prev, productId))
  }

  const isInWishlist = (productId: string): boolean => {
    return isInWishlistUtil(items, productId)
  }

  const clearWishlist = () => {
    setItems([])
    clearUserWishlist(user?.id)
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        itemCount: items.length,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
