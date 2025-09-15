"use client"

import type React from "react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { FaPlus, FaImage, FaTags, FaBoxes, FaChartLine } from "react-icons/fa"
import type { Product } from "@/lib/products"

interface ProductFormModalProps {
  product?: Product
  onSave: (product: Partial<Product>) => void
  trigger?: React.ReactNode
}

export function ProductFormModal({ product, onSave, trigger }: ProductFormModalProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || 0,
    originalPrice: product?.originalPrice || 0,
    category: product?.category || "",
    image: product?.image || "",
    images: product?.images || [],
    inStock: product?.inStock ?? true,
    featured: product?.featured ?? false,
    tags: product?.tags || [],
    quantity: product?.quantity || 0,
    lowStockThreshold: product?.lowStockThreshold || 5,
  })
  const [newTag, setNewTag] = useState("")
  const [newImage, setNewImage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    setOpen(false)
    if (!product) {
      setFormData({
        name: "",
        description: "",
        price: 0,
        originalPrice: 0,
        category: "",
        image: "",
        images: [],
        inStock: true,
        featured: false,
        tags: [],
        quantity: 0,
        lowStockThreshold: 5,
      })
    }
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] })
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({ ...formData, tags: formData.tags.filter((tag) => tag !== tagToRemove) })
  }

  const addImage = () => {
    if (newImage.trim() && !formData.images.includes(newImage.trim())) {
      setFormData({ ...formData, images: [...formData.images, newImage.trim()] })
      setNewImage("")
    }
  }

  const removeImage = (imageToRemove: string) => {
    setFormData({ ...formData, images: formData.images.filter((img) => img !== imageToRemove) })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button className="bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover">
            <FaPlus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            {product ? (
              <>
                <FaBoxes className="h-5 w-5 text-secondary" />
                Edit Product
              </>
            ) : (
              <>
                <FaPlus className="h-5 w-5 text-primary" />
                Add New Product
              </>
            )}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information Section */}
          <div className="space-y-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
            <h3 className="font-semibold text-primary flex items-center gap-2">
              <FaBoxes className="h-4 w-4" />
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Fashion">Fashion</SelectItem>
                    <SelectItem value="Home & Garden">Home & Garden</SelectItem>
                    <SelectItem value="Sports">Sports</SelectItem>
                    <SelectItem value="Books">Books</SelectItem>
                    <SelectItem value="Beauty">Beauty</SelectItem>
                    <SelectItem value="Toys">Toys</SelectItem>
                    <SelectItem value="Automotive">Automotive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed product description..."
                rows={4}
                className="resize-none"
              />
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-4 p-4 bg-success/5 rounded-lg border border-success/10">
            <h3 className="font-semibold text-success flex items-center gap-2">
              <FaChartLine className="h-4 w-4" />
              Pricing & Inventory
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice">Original Price ($)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: Number.parseFloat(e.target.value) || 0 })}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity">Stock Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || 0 })}
                  placeholder="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
                <Input
                  id="lowStockThreshold"
                  type="number"
                  min="0"
                  value={formData.lowStockThreshold}
                  onChange={(e) =>
                    setFormData({ ...formData, lowStockThreshold: Number.parseInt(e.target.value) || 5 })
                  }
                  placeholder="5"
                />
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-4 p-4 bg-info/5 rounded-lg border border-info/10">
            <h3 className="font-semibold text-info flex items-center gap-2">
              <FaImage className="h-4 w-4" />
              Product Images
            </h3>

            <div className="space-y-2">
              <Label htmlFor="image">Main Image URL *</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/main-image.jpg"
              />
            </div>

            <div className="space-y-2">
              <Label>Additional Images</Label>
              <div className="flex gap-2">
                <Input
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  placeholder="https://example.com/additional-image.jpg"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                />
                <Button type="button" onClick={addImage} variant="outline" size="sm">
                  Add
                </Button>
              </div>
              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.images.map((img, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      Image {index + 1}
                      <button
                        type="button"
                        onClick={() => removeImage(img)}
                        className="ml-1 text-xs hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Tags Section */}
          <div className="space-y-4 p-4 bg-secondary/5 rounded-lg border border-secondary/10">
            <h3 className="font-semibold text-secondary flex items-center gap-2">
              <FaTags className="h-4 w-4" />
              Tags & Settings
            </h3>

            <div className="space-y-2">
              <Label>Product Tags</Label>
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag (e.g., bestseller, new, sale)"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button type="button" onClick={addTag} variant="outline" size="sm">
                  Add Tag
                </Button>
              </div>
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="flex items-center gap-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 text-xs hover:text-destructive"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Switch
                  id="inStock"
                  checked={formData.inStock}
                  onCheckedChange={(checked) => setFormData({ ...formData, inStock: checked })}
                />
                <Label htmlFor="inStock" className="font-medium">
                  In Stock
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured" className="font-medium">
                  Featured Product
                </Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover"
            >
              {product ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
