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

  console.log("[v0] AddToCartButton rendered for product:", product.name)
  console.log("[v0] Current cart items count:", items.length)

  const isInCart = items.some((item) => item.id === product.id)

  const handleAddToCart = () => {
    console.log("[v0] Add to Cart button clicked for:", product.name)
    console.log("[v0] Product stock status:", { inStock: product.inStock, outOfOrder: product.outOfOrder })
    console.log("[v0] Quantity to add:", quantity)

    if (!product.inStock || product.outOfOrder) {
      console.log("[v0] ❌ Cannot add to cart - product not available")
      return
    }

    console.log("[v0] ✅ Adding product to cart...")
    addToCart(product, quantity)
    console.log("[v0] ✅ addToCart function called")

    setIsAdded(true)
    console.log("[v0] ✅ Set isAdded to true")

    // Reset the added state after 2 seconds
    setTimeout(() => {
      setIsAdded(false)
      console.log("[v0] Reset isAdded to false")
    }, 2000)
  }

  if (!product.inStock || product.outOfOrder) {
    const statusText = product.outOfOrder ? "Out of Order" : "Out of Stock"
    console.log("[v0] Showing disabled button:", statusText)
    return (
      <Button size={size} disabled className={className}>
        {statusText}
      </Button>
    )
  }

  const cartItem = items.find((item) => item.id === product.id)
  const currentCartQuantity = cartItem ? cartItem.quantity : 0
  const availableQuantity = product.quantity || 0
  const atMaxQuantity = availableQuantity > 0 && currentCartQuantity >= availableQuantity

  console.log("[v0] Cart quantity check:", {
    currentCartQuantity,
    availableQuantity,
    atMaxQuantity,
    isInCart,
  })

  if (atMaxQuantity) {
    console.log("[v0] Showing max quantity reached button")
    return (
      <Button size={size} disabled className={className}>
        Max Quantity Reached
      </Button>
    )
  }

  console.log("[v0] Showing active Add to Cart button, isAdded:", isAdded)

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
