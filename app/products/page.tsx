"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { ProductCard } from "@/components/products/product-card"
import { ProductFilters } from "@/components/products/product-filters"
import { products, searchProductsEnhanced, filterProducts, sortProducts, type Product } from "@/lib/products"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { FaThLarge, FaList } from "react-icons/fa"

export default function ProductsPage() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [sortBy, setSortBy] = useState("name")
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [highlightTerm, setHighlightTerm] = useState("")

  const updateProducts = (query: string = searchQuery, filters: any = {}) => {
    let result = products

    // Apply search with enhanced functionality
    if (query) {
      const searchResult = searchProductsEnhanced(query)
      result = searchResult.products
      setHighlightTerm(searchResult.highlightTerm)
    } else {
      setHighlightTerm("")
    }

    // Apply filters
    result = filterProducts(result, filters)

    // Apply sorting
    result = sortProducts(result, sortBy)

    setFilteredProducts(result)
  }

  const handleFiltersChange = (filters: any) => {
    updateProducts(searchQuery, filters)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    updateProducts(query)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
    const sorted = sortProducts(filteredProducts, value)
    setFilteredProducts(sorted)
  }

  useEffect(() => {
    updateProducts()
  }, [sortBy])

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-muted-foreground">Discover our amazing collection of products</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters
              onFiltersChange={handleFiltersChange}
              onSearchChange={handleSearchChange}
              totalProducts={products.length}
              filteredProducts={filteredProducts}
            />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <p className="text-muted-foreground">
                Showing {filteredProducts.length} of {products.length} products
                {searchQuery && <span className="ml-2 text-primary">for "{searchQuery}"</span>}
              </p>
              <div className="flex items-center space-x-4">
                {/* View Mode Toggle */}
                <div className="flex items-center space-x-1 border rounded-md p-1">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="h-8 w-8 p-0"
                  >
                    <FaThLarge className="h-3 w-3" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="h-8 w-8 p-0"
                  >
                    <FaList className="h-3 w-3" />
                  </Button>
                </div>

                {/* Enhanced Sort Options */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Sort by:</span>
                  <Select value={sortBy} onValueChange={handleSortChange}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Name A-Z</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="rating">Highest Rated</SelectItem>
                      <SelectItem value="popularity">Most Popular</SelectItem>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="discount">Biggest Discount</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Products Display */}
            {filteredProducts.length > 0 ? (
              <div className={viewMode === "grid" ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} highlightTerm={highlightTerm} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg mb-4">No products found matching your criteria.</p>
                {searchQuery && (
                  <Button variant="outline" onClick={() => handleSearchChange("")}>
                    Clear Search
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
