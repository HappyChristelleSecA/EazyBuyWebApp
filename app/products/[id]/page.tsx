"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { getProductById, getFeaturedProducts } from "@/lib/products"
import { ProductCard } from "@/components/products/product-card"
import { AddToCartButton } from "@/components/products/add-to-cart-button"
import { ReviewSummary } from "@/components/products/review-summary"
import { ReviewList } from "@/components/products/review-list"
import { AddReviewForm } from "@/components/products/add-review-form"
import { FaStar, FaShare } from "react-icons/fa"
import { WishlistButton } from "@/components/products/wishlist-button"
import Image from "next/image"
import { notFound } from "next/navigation"
import { BackButton } from "@/components/ui/back-button"

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  const [reviewRefreshKey, setReviewRefreshKey] = useState(0)

  const product = getProductById(params.id)

  if (!product) {
    notFound()
  }

  const relatedProducts = getFeaturedProducts()
    .filter((p) => p.id !== product.id)
    .slice(0, 4)
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const handleReviewAdded = () => {
    setReviewRefreshKey(reviewRefreshKey + 1)
  }

  const handleReviewDeleted = () => {
    setReviewRefreshKey(reviewRefreshKey + 1)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton fallbackUrl="/products" className="mb-4">
            Back to Products
          </BackButton>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-96 object-cover rounded-lg"
              />
              {discountPercentage > 0 && (
                <Badge className="absolute top-4 left-4 bg-destructive text-destructive-foreground">
                  -{discountPercentage}%
                </Badge>
              )}
              {!product.inStock && (
                <Badge variant="secondary" className="absolute top-4 right-4">
                  Out of Stock
                </Badge>
              )}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {product.images.slice(0, 3).map((image, index) => (
                <Image
                  key={index}
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  width={200}
                  height={200}
                  className="w-full h-24 object-cover rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="outline" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <div className="flex items-center mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-lg font-medium">{product.rating}</span>
                  <span className="ml-2 text-muted-foreground">({product.reviewCount} reviews)</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-primary">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">${product.originalPrice}</span>
                )}
              </div>
              {discountPercentage > 0 && (
                <p className="text-green-600 font-medium">
                  You save ${(product.originalPrice! - product.price).toFixed(2)} ({discountPercentage}%)
                </p>
              )}
            </div>

            <p className="text-muted-foreground text-lg leading-relaxed">{product.description}</p>

            <div className="flex flex-wrap gap-2">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex space-x-4">
              <AddToCartButton product={product} size="lg" className="flex-1" />
              <WishlistButton product={product} size="lg" />
              <Button size="lg" variant="outline">
                <FaShare className="h-5 w-5" />
              </Button>
            </div>

            <Card>
              <CardContent className="p-4">
                <h3 className="font-semibold mb-2">Product Features</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• High-quality materials and construction</li>
                  <li>• Fast and reliable shipping</li>
                  <li>• 30-day return policy</li>
                  <li>• 1-year manufacturer warranty</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-8">
            <ReviewList productId={product.id} refreshKey={reviewRefreshKey} onReviewDeleted={handleReviewDeleted} />
            <AddReviewForm productId={product.id} onReviewAdded={handleReviewAdded} refreshKey={reviewRefreshKey} />
          </div>
          <div>
            <ReviewSummary productId={product.id} refreshKey={reviewRefreshKey} />
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-6">You Might Also Like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
