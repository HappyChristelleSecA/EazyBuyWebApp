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
import { FaPlus, FaImage, FaTags, FaBoxes, FaChartLine, FaTrash, FaEye, FaExclamationTriangle } from "react-icons/fa"
import type { Product } from "@/lib/products"
import { markProductOutOfOrder, restoreProductFromOutOfOrder } from "@/lib/inventory"

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
    visible: product?.visible ?? true,
    tags: product?.tags || [],
    quantity: product?.quantity || 0,
    lowStockThreshold: product?.lowStockThreshold || 5,
    outOfOrder: product?.outOfOrder ?? false,
    outOfOrderReason: product?.outOfOrderReason || "",
  })
  const [newTag, setNewTag] = useState("")
  const [newImage, setNewImage] = useState("")
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)
  const [additionalImageFiles, setAdditionalImageFiles] = useState<File[]>([])
  const [imagePreview, setImagePreview] = useState<string>("")

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size must be less than 5MB")
        return
      }

      setMainImageFile(file)
      const base64 = await fileToBase64(file)
      setFormData({ ...formData, image: base64 })
      setImagePreview(base64)
    }
  }

  const handleAdditionalImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Validate files
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        alert("Please select only image files")
        return
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Each image must be less than 5MB")
        return
      }
    }

    const base64Images = await Promise.all(files.map((file) => fileToBase64(file)))
    setAdditionalImageFiles([...additionalImageFiles, ...files])
    setFormData({
      ...formData,
      images: [...formData.images, ...base64Images],
    })
  }

  const removeUploadedImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    const newFiles = additionalImageFiles.filter((_, i) => i !== index)
    setFormData({ ...formData, images: newImages })
    setAdditionalImageFiles(newFiles)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (product && product.id) {
      if (formData.outOfOrder && !product.outOfOrder) {
        markProductOutOfOrder(product.id, formData.outOfOrderReason || "Marked out of order by admin")
      } else if (!formData.outOfOrder && product.outOfOrder) {
        restoreProductFromOutOfOrder(product.id)
      }
    }

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
        visible: true,
        tags: [],
        quantity: 0,
        lowStockThreshold: 5,
        outOfOrder: false,
        outOfOrderReason: "",
      })
      setMainImageFile(null)
      setAdditionalImageFiles([])
      setImagePreview("")
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
                  disabled={formData.outOfOrder}
                  className={formData.outOfOrder ? "opacity-50 cursor-not-allowed" : ""}
                />
                {formData.outOfOrder && (
                  <p className="text-xs text-destructive flex items-center gap-1">
                    <FaExclamationTriangle className="h-3 w-3" />
                    Cannot modify stock while out of order
                  </p>
                )}
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

            {/* Out of Order Section */}
            <div className="space-y-4 p-4 bg-destructive/5 rounded-lg border border-destructive/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="outOfOrder"
                    checked={formData.outOfOrder}
                    onCheckedChange={(checked) => {
                      setFormData({
                        ...formData,
                        outOfOrder: checked,
                        outOfOrderReason: checked ? formData.outOfOrderReason : "",
                      })
                    }}
                  />
                  <Label htmlFor="outOfOrder" className="font-medium flex items-center gap-2">
                    <FaExclamationTriangle className="h-4 w-4 text-destructive" />
                    Mark as Out of Order
                  </Label>
                </div>
                {formData.outOfOrder && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <FaExclamationTriangle className="h-3 w-3" />
                    Out of Order
                  </Badge>
                )}
              </div>

              {formData.outOfOrder && (
                <div className="space-y-2">
                  <Label htmlFor="outOfOrderReason">Reason for Out of Order Status</Label>
                  <Textarea
                    id="outOfOrderReason"
                    value={formData.outOfOrderReason}
                    onChange={(e) => setFormData({ ...formData, outOfOrderReason: e.target.value })}
                    placeholder="Explain why this product is out of order (e.g., quality issues, supplier problems, maintenance required)"
                    rows={2}
                    className="resize-none"
                  />
                  <p className="text-xs text-muted-foreground">
                    This reason will be logged in the inventory system and may be visible to other admins.
                  </p>
                </div>
              )}

              {formData.outOfOrder && (
                <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                  <div className="flex items-start gap-2">
                    <FaExclamationTriangle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-destructive">Out of Order Restrictions:</p>
                      <ul className="mt-1 text-muted-foreground space-y-1">
                        <li>• Stock quantity cannot be modified</li>
                        <li>• Product will not be available for purchase</li>
                        <li>• Existing orders may be affected</li>
                        <li>• Inventory alerts will be generated</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Images Section */}
          <div className="space-y-4 p-4 bg-info/5 rounded-lg border border-info/10">
            <h3 className="font-semibold text-info flex items-center gap-2">
              <FaImage className="h-4 w-4" />
              Product Images
            </h3>

            <div className="space-y-2">
              <Label htmlFor="mainImage">Main Product Image *</Label>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    id="mainImage"
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Upload an image file (JPG, PNG, GIF) - Max 5MB</p>
                </div>
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-16 h-16 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                      onClick={() => {
                        setMainImageFile(null)
                        setImagePreview("")
                        setFormData({ ...formData, image: "" })
                      }}
                    >
                      <FaTrash className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Additional Images</Label>
              <div className="space-y-3">
                <div>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesUpload}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/90"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Upload multiple images - Max 5MB each</p>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {formData.images.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img || "/placeholder.svg"}
                          alt={`Additional ${index + 1}`}
                          className="w-full h-16 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                          onClick={() => removeUploadedImage(index)}
                        >
                          <FaTrash className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-muted">
                <Label className="text-sm text-muted-foreground">Or add image by URL</Label>
                <div className="flex gap-2 mt-1">
                  <Input
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addImage())}
                  />
                  <Button type="button" onClick={addImage} variant="outline" size="sm">
                    Add URL
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Tags & Settings Section */}
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
                  disabled={formData.outOfOrder}
                />
                <Label htmlFor="inStock" className={`font-medium ${formData.outOfOrder ? "opacity-50" : ""}`}>
                  In Stock
                </Label>
                {formData.outOfOrder && (
                  <span className="text-xs text-muted-foreground">(Disabled - Out of Order)</span>
                )}
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
              <div className="flex items-center space-x-2">
                <Switch
                  id="visible"
                  checked={formData.visible}
                  onCheckedChange={(checked) => setFormData({ ...formData, visible: checked })}
                />
                <Label htmlFor="visible" className="font-medium flex items-center gap-1">
                  <FaEye className="h-3 w-3" />
                  Visible to Users
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
