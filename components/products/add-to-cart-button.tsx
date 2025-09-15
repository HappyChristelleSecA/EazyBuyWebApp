"use client"

import { useCart } from "@/hooks/use-cart"
import { Button } from "@/components/ui/button"
import { FaShoppingCart, FaCheck } from "react-icons/fa"
import type { Product } from "@/lib/products"
import { useState } from "react"

interface AddToCartButtonProps {
  product: Product
  quantity?: number
  size?: "sm" | "default" | "lg"
  className?: string
}

export function AddToCartButton({ product, quantity = 1, size = "default", className }: AddToCartButtonProps) {
  const { addToCart, items } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const isInCart = items.some((item) => item.id === product.id)

  const handleAddToCart = () => {
    if (!product.inStock) return

    const cartItem = items.find((item) => item.id === product.id)
    const currentCartQuantity = cartItem ? cartItem.quantity : 0
    const availableQuantity = product.quantity || 0

    if (availableQuantity > 0 && currentCartQuantity >= availableQuantity) {
      return // Don't add if already at max quantity
    }

    addToCart(product, quantity)
    setIsAdded(true)

    // Reset the added state after 2 seconds
    setTimeout(() => setIsAdded(false), 2000)
  }

  if (!product.inStock) {
    return (
      <Button size={size} disabled className={className}>
        Out of Stock
      </Button>
    )
  }

  const cartItem = items.find((item) => item.id === product.id)
  const currentCartQuantity = cartItem ? cartItem.quantity : 0
  const availableQuantity = product.quantity || 999
  const atMaxQuantity = currentCartQuantity >= availableQuantity

  if (atMaxQuantity) {
    return (
      <Button size={size} disabled className={className}>
        Max Quantity Reached
      </Button>
    )
  }

  return (
    <Button size={size} onClick={handleAddToCart} className={className} variant={isInCart ? "secondary" : "default"}>
      {isAdded ? (
        <>
          <FaCheck className="h-4 w-4 mr-1" />
          Added!
        </>
      ) : (
        <>
          <FaShoppingCart className="h-4 w-4 mr-1" />
          {isInCart ? "Add More" : "Add to Cart"}
        </>
      )}
    </Button>
  )
}
