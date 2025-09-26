"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/loading-spinner"
import { ErrorBoundary } from "@/components/error-boundary"
import { ProductFormModal } from "@/components/admin/product-form-modal"
import type { Product } from "@/lib/products"
import {
  getStoredProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  toggleProductVisibility, // Add toggle function import
  initializeProductStorage,
} from "@/lib/product-management"
import { FaSearch, FaEdit, FaTrash, FaEye, FaPlus, FaFilter, FaDownload } from "react-icons/fa"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminProductsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [stockFilter, setStockFilter] = useState("all")
  const [productList, setProductList] = useState<Product[]>([])
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user || user.role !== "admin")) {
      console.log("[v0] Admin products access denied:", { isAuthenticated, user: user?.role })
      router.push("/")
    }
  }, [isAuthenticated, user, isLoading, router])

  useEffect(() => {
    initializeProductStorage()
    const storedProducts = getStoredProducts()
    const sortedProducts = storedProducts.sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return dateB - dateA // Newest first
    })
    setProductList(sortedProducts)
    console.log("[v0] Loaded products from storage:", sortedProducts.length)
    console.log(
      "[v0] Product names:",
      sortedProducts.map((p) => p.name),
    )
  }, [refreshTrigger])

  if (isLoading) {
    return <LoadingSpinner className="min-h-screen" />
  }

  if (!isAuthenticated || !user || user.role !== "admin") {
    return null
  }

  const filteredProducts = productList.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "inStock" && product.inStock) ||
      (stockFilter === "outOfStock" && !product.inStock)

    const matches = matchesSearch && matchesCategory && matchesStock
    if (!matches && product.name.toLowerCase().includes("my app")) {
      console.log("[v0] Product filtered out:", {
        name: product.name,
        matchesSearch,
        matchesCategory,
        matchesStock,
        searchQuery,
        categoryFilter,
        stockFilter,
        category: product.category,
        inStock: product.inStock,
      })
    }
    return matches
  })

  console.log("[v0] Total products:", productList.length)
  console.log("[v0] Filtered products:", filteredProducts.length)
  console.log(
    "[v0] Filtered product names:",
    filteredProducts.map((p) => p.name),
  )

  const categories = [...new Set(productList.map((p) => p.category))].filter(
    (category) => category && category.trim() !== "",
  )

  const handleAddProduct = (productData: Partial<Product>) => {
    console.log("[v0] Starting product addition process")
    console.log("[v0] Product data to add:", productData)

    const newProduct = addProduct(productData)
    console.log("[v0] Product added:", newProduct.name, "ID:", newProduct.id)

    setProductList((prevProducts) => {
      const updatedProducts = [newProduct, ...prevProducts]
      console.log("[v0] UI state updated with new product count:", updatedProducts.length)
      return updatedProducts
    })

    // Also trigger refresh for consistency
    setRefreshTrigger((prev) => prev + 1)

    setSearchQuery("")
    setCategoryFilter("all")
    setStockFilter("all")

    console.log("[v0] Product addition process completed - UI updated")
  }

  const handleEditProduct = (productId: string, productData: Partial<Product>) => {
    const success = updateProduct(productId, productData)
    if (success) {
      setRefreshTrigger((prev) => prev + 1)
      console.log("[v0] Product updated and list will refresh")
    }
  }

  const handleDeleteProduct = (productId: string) => {
    const success = deleteProduct(productId)
    if (success) {
      setRefreshTrigger((prev) => prev + 1)
      console.log("[v0] Product deleted and list will refresh")
    }
  }

  const handleExportProducts = () => {
    const dataStr = JSON.stringify(filteredProducts, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `products-${new Date().toISOString().split("T")[0]}.json`
    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const handleToggleVisibility = (productId: string) => {
    const success = toggleProductVisibility(productId)
    if (success) {
      setRefreshTrigger((prev) => prev + 1)
      console.log("[v0] Product visibility toggled and list will refresh")
    }
  }

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      Electronics: "bg-blue-100 text-blue-800 border-blue-200",
      Fashion: "bg-pink-100 text-pink-800 border-pink-200",
      "Home & Garden": "bg-green-100 text-green-800 border-green-200",
      Sports: "bg-orange-100 text-orange-800 border-orange-200",
      Books: "bg-purple-100 text-purple-800 border-purple-200",
      "Food & Beverages": "bg-yellow-100 text-yellow-800 border-yellow-200",
    }
    return colorMap[category] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  return (
    <ErrorBoundary>
      <AdminLayout title="Product Management" description="Manage your product catalog">
        <div className="space-y-6">
          <div className="p-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-xl border border-primary/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <FaPlus className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-primary">Enhanced Product Management</h2>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Create, manage, and organize your product catalog with advanced filtering, bulk operations, and enhanced
              product details. Use the enhanced form to add products with multiple images, inventory tracking, and SEO
              optimization.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 justify-between">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              <div className="relative flex-1 max-w-sm">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products, categories, descriptions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <FaFilter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Stock Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Stock</SelectItem>
                  <SelectItem value="inStock">In Stock</SelectItem>
                  <SelectItem value="outOfStock">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleExportProducts}
                className="flex items-center gap-2 bg-transparent"
              >
                <FaDownload className="h-4 w-4" />
                Export
              </Button>
              <ProductFormModal onSave={handleAddProduct} />
            </div>
          </div>

          <Card className="border-2 border-primary/10">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Products ({productList.length})</CardTitle>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    {productList.filter((p) => p.inStock).length} In Stock
                  </Badge>
                  <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                    {productList.filter((p) => !p.inStock).length} Out of Stock
                  </Badge>
                  {filteredProducts.length !== productList.length && (
                    <Badge variant="outline" className="bg-info/10 text-info border-info/20">
                      Showing {filteredProducts.length} of {productList.length}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="space-y-0">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className={`flex items-center space-x-4 p-6 border-b last:border-b-0 hover:bg-muted/30 transition-colors ${index % 2 === 0 ? "bg-card" : "bg-muted/10"}`}
                  >
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden flex-shrink-0 border-2 border-primary/10">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <h3 className="font-semibold text-lg text-foreground">{product.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 max-w-md">{product.description}</p>
                          <div className="flex items-center space-x-2">
                            <Badge variant="secondary" className={`${getCategoryColor(product.category)} font-medium`}>
                              {product.category}
                            </Badge>
                            <Badge
                              variant={product.inStock ? "default" : "secondary"}
                              className={
                                product.inStock
                                  ? "bg-success text-success-foreground"
                                  : "bg-warning text-warning-foreground"
                              }
                            >
                              {product.inStock ? "In Stock" : "Out of Stock"}
                            </Badge>
                            {product.featured && (
                              <Badge variant="outline" className="bg-accent/10 text-accent border-accent/20">
                                Featured
                              </Badge>
                            )}
                            {product.quantity !== undefined &&
                              product.quantity <= (product.lowStockThreshold || 5) &&
                              product.inStock && (
                                <Badge variant="outline" className="bg-warning/10 text-warning border-warning/20">
                                  Low Stock ({product.quantity})
                                </Badge>
                              )}
                            {product.createdAt && (
                              <Badge variant="outline" className="bg-info/10 text-info border-info/20 text-xs">
                                Added {new Date(product.createdAt).toLocaleDateString()}
                              </Badge>
                            )}
                            <button
                              onClick={() => handleToggleVisibility(product.id)}
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border transition-colors hover:opacity-80 ${
                                product.visible !== false
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                                  : "bg-red-50 text-red-700 border-red-200 hover:bg-red-100"
                              }`}
                              title={`Click to ${product.visible !== false ? "hide" : "show"} product from users`}
                            >
                              <FaEye className={`h-3 w-3 ${product.visible === false ? "opacity-50" : ""}`} />
                              <span>{product.visible !== false ? "Visible" : "Hidden"}</span>
                            </button>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="flex items-center space-x-2">
                            <p className="text-xl font-bold text-primary">${product.price}</p>
                            {product.originalPrice && product.originalPrice > product.price && (
                              <p className="text-sm text-muted-foreground line-through">${product.originalPrice}</p>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            ★ {product.rating} ({product.reviewCount} reviews)
                          </p>
                          {product.quantity !== undefined && (
                            <p className="text-xs text-muted-foreground">Qty: {product.quantity}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                        className="hover:bg-info/10 hover:text-info relative group"
                        title="View Product Page"
                      >
                        <Link href={`/products/${product.id}`}>
                          <FaEye className="h-4 w-4" />
                        </Link>
                      </Button>

                      <ProductFormModal
                        product={product}
                        onSave={(data) => handleEditProduct(product.id, data)}
                        trigger={
                          <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-secondary/10 hover:text-secondary"
                            title="Edit Product"
                          >
                            <FaEdit className="h-4 w-4" />
                          </Button>
                        }
                      />

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:bg-destructive/10"
                            title="Delete Product"
                          >
                            <FaTrash className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{product.name}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteProduct(product.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-muted-foreground mb-2">No products found</div>
                    <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    </ErrorBoundary>
  )
}
