"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SearchAutocomplete } from "./search-autocomplete"
import { categories, getFilterCounts } from "@/lib/products"
import { FaFilter, FaTimes, FaTag, FaFire, FaStar } from "react-icons/fa"

interface ProductFiltersProps {
  onFiltersChange: (filters: {
    category?: string
    minPrice?: number
    maxPrice?: number
    inStock?: boolean
    minRating?: number
    onSale?: boolean
  }) => void
  onSearchChange: (query: string) => void
  totalProducts?: number
  filteredProducts?: any[]
}

export function ProductFilters({
  onFiltersChange,
  onSearchChange,
  totalProducts = 0,
  filteredProducts = [],
}: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState({
    category: "all",
    minPrice: "",
    maxPrice: "",
    inStock: false,
    minRating: "any",
    onSale: false,
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [filterCounts, setFilterCounts] = useState<any>({})

  useEffect(() => {
    const counts = getFilterCounts(filteredProducts.length > 0 ? filteredProducts : undefined)
    setFilterCounts(counts)
  }, [filteredProducts])

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    // Convert to proper types and filter out empty values
    const processedFilters: any = {}
    if (newFilters.category !== "all") processedFilters.category = newFilters.category
    if (newFilters.minPrice) processedFilters.minPrice = Number.parseFloat(newFilters.minPrice)
    if (newFilters.maxPrice) processedFilters.maxPrice = Number.parseFloat(newFilters.maxPrice)
    if (newFilters.inStock) processedFilters.inStock = newFilters.inStock
    if (newFilters.minRating !== "any") processedFilters.minRating = Number.parseFloat(newFilters.minRating)
    if (newFilters.onSale) processedFilters.onSale = newFilters.onSale

    onFiltersChange(processedFilters)
  }

  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    onSearchChange(query)
  }

  const clearFilters = () => {
    const clearedFilters = {
      category: "all",
      minPrice: "",
      maxPrice: "",
      inStock: false,
      minRating: "any",
      onSale: false,
    }
    setFilters(clearedFilters)
    setSearchQuery("")
    onFiltersChange({})
    onSearchChange("")
  }

  const quickFilters = [
    { label: "On Sale", icon: FaTag, action: () => handleFilterChange("onSale", !filters.onSale) },
    { label: "Top Rated", icon: FaStar, action: () => handleFilterChange("minRating", "4") },
    { label: "Popular", icon: FaFire, action: () => handleFilterChange("category", "Electronics") },
  ]

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value !== "all" && value !== "any" && value !== "" && value !== false,
  ).length

  return (
    <div className="space-y-4">
      {/* Enhanced Search Bar */}
      <SearchAutocomplete
        value={searchQuery}
        onChange={setSearchQuery}
        onSearch={handleSearchChange}
        placeholder="Search products..."
      />

      <div className="flex flex-wrap gap-2">
        {quickFilters.map((filter, index) => (
          <Button key={index} variant="outline" size="sm" onClick={filter.action} className="text-xs bg-transparent">
            <filter.icon className="h-3 w-3 mr-1" />
            {filter.label}
          </Button>
        ))}
      </div>

      {/* Mobile Filter Toggle */}
      <div className="md:hidden">
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="w-full">
          <FaFilter className="h-4 w-4 mr-2" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters */}
      <Card className={`${isOpen ? "block" : "hidden"} md:block`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg">Filters</CardTitle>
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <FaTimes className="h-4 w-4 mr-1" />
            Clear
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Category Filter */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={filters.category} onValueChange={(value) => handleFilterChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    <div className="flex items-center justify-between w-full">
                      <span>{category.name}</span>
                      {filterCounts.categories?.[category.name] && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {filterCounts.categories[category.name]}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Price Range</Label>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleFilterChange("minPrice", "0")
                  handleFilterChange("maxPrice", "50")
                }}
                className="text-xs"
              >
                Under $50
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  handleFilterChange("minPrice", "50")
                  handleFilterChange("maxPrice", "200")
                }}
                className="text-xs"
              >
                $50 - $200
              </Button>
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Min"
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange("minPrice", e.target.value)}
              />
              <Input
                placeholder="Max"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inStock"
                  checked={filters.inStock}
                  onCheckedChange={(checked) => handleFilterChange("inStock", checked)}
                />
                <Label htmlFor="inStock">In Stock Only</Label>
              </div>
              {filterCounts.inStock > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {filterCounts.inStock}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="onSale"
                  checked={filters.onSale}
                  onCheckedChange={(checked) => handleFilterChange("onSale", checked)}
                />
                <Label htmlFor="onSale">On Sale</Label>
              </div>
              {filterCounts.onSale > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {filterCounts.onSale}
                </Badge>
              )}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2">
            <Label>Minimum Rating</Label>
            <Select value={filters.minRating} onValueChange={(value) => handleFilterChange("minRating", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Any Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Rating</SelectItem>
                {[4, 3, 2, 1].map((rating) => (
                  <SelectItem key={rating} value={rating.toString()}>
                    <div className="flex items-center justify-between w-full">
                      <span>{rating}+ Stars</span>
                      {filterCounts.ratings?.[`${rating}+`] && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          {filterCounts.ratings[`${rating}+`]}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
