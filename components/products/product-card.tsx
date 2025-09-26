"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AddToCartButton } from "./add-to-cart-button"
import { WishlistButton } from "./wishlist-button"
import { FaStar } from "react-icons/fa"
import type { Product } from "@/lib/products"
import Image from "next/image"
import Link from "next/link"

interface ProductCardProps {
  product: Product
  viewMode?: "grid" | "list"
  highlightTerm?: string
}

export function ProductCard({ product, viewMode = "grid", highlightTerm }: ProductCardProps) {
  console.log("[v0] ProductCard rendering:", product.name, "Image URL:", product.image)
  console.log("[v0] Image starts with data:", product.image?.startsWith("data:"))
  console.log("[v0] Image length:", product.image?.length)

  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const stockDisplay = () => {
    if (!product.inStock) return null
    if (product.quantity !== undefined) {
      if (product.quantity <= (product.lowStockThreshold || 5)) {
        return (
          <Badge variant="secondary" className="text-xs">
            Only {product.quantity} left
          </Badge>
        )
      }
      if (product.quantity < 10) {
        return <span className="text-xs text-muted-foreground">{product.quantity} in stock</span>
      }
    }
    return null
  }

  const highlightText = (text: string) => {
    if (!highlightTerm) return text
    const regex = new RegExp(`(${highlightTerm})`, "gi")
    return text.replace(regex, "<mark>$1</mark>")
  }

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <div className="relative w-24 h-24 flex-shrink-0">
              <Link href={`/products/${product.id}`}>
                <Image
                  src={product.image || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover rounded-md"
                />
              </Link>
              {discountPercentage > 0 && (
                <Badge className="absolute -top-2 -left-2 bg-destructive text-destructive-foreground">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <Link href={`/products/${product.id}`}>
                    <h3
                      className="font-semibold text-lg hover:text-primary transition-colors line-clamp-1"
                      dangerouslySetInnerHTML={{ __html: highlightText(product.name) }}
                    />
                  </Link>
                  <p className="text-muted-foreground text-sm line-clamp-2 mt-1">{product.description}</p>
                  <div className="flex items-center mt-2 space-x-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <FaStar
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span className="ml-1 text-sm text-muted-foreground">({product.reviewCount})</span>
                    </div>
                    {stockDisplay()}
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl font-bold text-primary">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-lg text-muted-foreground line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <AddToCartButton product={product} size="sm" />
                    <WishlistButton product={product} size="sm" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 overflow-hidden">
      <div className="relative">
        <Link href={`/products/${product.id}`}>
          <div className="relative h-48 overflow-hidden">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-200"
            />
          </div>
        </Link>
        {discountPercentage > 0 && (
          <Badge className="absolute top-2 left-2 bg-destructive text-destructive-foreground">
            -{discountPercentage}%
          </Badge>
        )}
        {!product.inStock && (
          <Badge variant="secondary" className="absolute top-2 right-2">
            Out of Stock
          </Badge>
        )}
      </div>
      <CardContent className="p-4">
        <div className="space-y-2">
          <Link href={`/products/${product.id}`}>
            <h3
              className="font-semibold text-lg hover:text-primary transition-colors line-clamp-2"
              dangerouslySetInnerHTML={{ __html: highlightText(product.name) }}
            />
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-1 text-sm text-muted-foreground">({product.reviewCount})</span>
            </div>
            {stockDisplay()}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xl font-bold text-primary">${product.price}</span>
              {product.originalPrice && (
                <span className="ml-2 text-sm text-muted-foreground line-through">${product.originalPrice}</span>
              )}
            </div>
          </div>
          <div className="flex space-x-2 pt-2">
            <AddToCartButton product={product} className="flex-1" />
            <WishlistButton product={product} size="sm" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
