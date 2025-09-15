"use client"

import { useAuth } from "@/hooks/use-auth"
import { useWishlist } from "@/hooks/use-wishlist"
import { useCart } from "@/hooks/use-cart"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, Trash2, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function WishlistPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const { items, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth")
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <DashboardLayout title="Wishlist" description="Your saved items and favorites">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  const handleAddToCart = (product: any) => {
    addToCart(product)
    removeFromWishlist(product.id)
  }

  return (
    <DashboardLayout title="Wishlist" description="Your saved items and favorites">
      {items.length > 0 ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-muted-foreground">{items.length} items in your wishlist</p>
            <Button variant="outline" onClick={clearWishlist}>
              Clear All
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <Card key={item.id} className="group hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-0">
                  <div className="relative overflow-hidden rounded-t-lg">
                    <Link href={`/products/${item.product.id}`}>
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        width={300}
                        height={300}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white text-red-500 hover:text-red-600"
                      onClick={() => removeFromWishlist(item.product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    {!item.product.inStock && (
                      <Badge variant="secondary" className="absolute bottom-2 right-2">
                        Out of Stock
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="mb-2">
                      <Badge variant="outline" className="text-xs">
                        {item.product.category}
                      </Badge>
                    </div>
                    <Link href={`/products/${item.product.id}`}>
                      <h3 className="font-semibold text-lg mb-2 hover:text-primary transition-colors line-clamp-2">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{item.product.description}</p>
                    <div className="flex items-center mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="ml-1 text-sm font-medium">{item.product.rating}</span>
                        <span className="ml-1 text-sm text-muted-foreground">({item.product.reviewCount})</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-primary">${item.product.price}</span>
                        {item.product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${item.product.originalPrice}
                          </span>
                        )}
                      </div>
                      <Button size="sm" onClick={() => handleAddToCart(item.product)} disabled={!item.product.inStock}>
                        <ShoppingCart className="mr-2 h-4 w-4" />
                        Add to Cart
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">Added {item.addedAt.toLocaleDateString()}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-6">Save items you love to your wishlist and shop them later.</p>
            <Button asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  )
}
