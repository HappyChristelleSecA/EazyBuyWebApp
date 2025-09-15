"use client"

import { Button } from "@/components/ui/button"
import { useWishlist } from "@/hooks/use-wishlist"
import { useAuth } from "@/hooks/use-auth"
import { Heart } from "lucide-react"
import type { Product } from "@/lib/products"
import { useRouter } from "next/navigation"

interface WishlistButtonProps {
  product: Product
  size?: "sm" | "default" | "lg"
}

export function WishlistButton({ product, size = "default" }: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const inWishlist = isInWishlist(product.id)

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      router.push("/auth")
      return
    }

    if (inWishlist) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
    }
  }

  return (
    <Button
      variant={inWishlist ? "default" : "outline"}
      size={size === "sm" ? "icon" : "default"}
      onClick={handleWishlistToggle}
      className={`${inWishlist ? "bg-red-500 hover:bg-red-600 text-white" : "hover:bg-red-50 hover:text-red-500"} transition-colors`}
    >
      <Heart className={`h-4 w-4 ${inWishlist ? "fill-current" : ""}`} />
      {size !== "sm" && <span className="ml-2">{inWishlist ? "Remove from Wishlist" : "Add to Wishlist"}</span>}
    </Button>
  )
}
