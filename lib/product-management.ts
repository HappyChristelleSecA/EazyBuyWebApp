import { type Product, products as defaultProducts, refreshProductsCache } from "./products"

// Global in-memory storage for products
let memoryProducts: Product[] = [...defaultProducts]
let isInitialized = false

const IMAGES_STORAGE_KEY = "eazybuy_product_images"

const saveImagesToStorage = (images: Record<string, { image?: string; images?: string[] }>): void => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(IMAGES_STORAGE_KEY, JSON.stringify(images))
    console.log("[v0] Successfully saved images to localStorage:", Object.keys(images).length, "products")
    Object.entries(images).forEach(([productKey, imageData]) => {
      console.log(`[v0] Saved image for product ${productKey}:`, {
        hasImage: !!imageData.image,
        imageStartsWithData: imageData.image?.startsWith("data:"),
        imageLength: imageData.image?.length || 0,
        hasImages: !!imageData.images?.length,
      })
    })
  } catch (error) {
    console.warn("[v0] Failed to save images to localStorage:", error)
  }
}

const loadImagesFromStorage = (): Record<string, { image?: string; images?: string[] }> => {
  if (typeof window === "undefined") return {}

  try {
    const stored = localStorage.getItem(IMAGES_STORAGE_KEY)
    if (stored) {
      const images = JSON.parse(stored)
      console.log("[v0] Successfully loaded images from localStorage:", Object.keys(images).length, "products")
      Object.entries(images).forEach(([productId, imageData]: [string, any]) => {
        console.log(`[v0] Loaded image for product ${productId}:`, {
          hasImage: !!imageData.image,
          imageStartsWithData: imageData.image?.startsWith("data:"),
          imageLength: imageData.image?.length || 0,
          hasImages: !!imageData.images?.length,
        })
      })
      return images
    }
  } catch (error) {
    console.warn("[v0] Failed to load images from localStorage:", error)
  }

  return {}
}

let memoryProductImages: Record<string, { image?: string; images?: string[] }> = {}

const compressProductForStorage = (product: Product): Product => {
  return {
    ...product,
    // For localStorage, use placeholders to save space, but keep original in memory
    image: product.image?.startsWith("data:")
      ? `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(product.name)}`
      : product.image,
    images:
      product.images?.map((img) =>
        img.startsWith("data:")
          ? `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(product.name)}`
          : img,
      ) || [],
  }
}

const decompressProductFromStorage = (product: Product): Product => {
  // Try to find saved images by ID first, then by name as fallback
  const savedImages = memoryProductImages[product.id] || memoryProductImages[product.name]

  if (savedImages) {
    console.log("[v0] Decompressing product with saved images:", product.name, "ID:", product.id)
    console.log("[v0] Found images using key:", memoryProductImages[product.id] ? "ID" : "name")
    console.log("[v0] Original product image:", {
      hasImage: !!product.image,
      imageStartsWithData: product.image?.startsWith("data:"),
      imageLength: product.image?.length || 0,
    })
    console.log("[v0] Saved image data:", {
      hasImage: !!savedImages.image,
      imageStartsWithData: savedImages.image?.startsWith("data:"),
      imageLength: savedImages.image?.length || 0,
    })

    const restoredProduct = {
      ...product,
      image: savedImages.image || product.image,
      images: savedImages.images || product.images,
    }

    console.log("[v0] Restored product image:", {
      hasImage: !!restoredProduct.image,
      imageStartsWithData: restoredProduct.image?.startsWith("data:"),
      imageLength: restoredProduct.image?.length || 0,
    })

    return restoredProduct
  }

  console.log("[v0] Decompressing product without saved images:", product.name, "ID:", product.id)
  console.log("[v0] Available image keys:", Object.keys(memoryProductImages))
  return {
    ...product,
    // Keep the original image if it exists, otherwise use placeholder
    image: product.image || `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(product.name)}`,
    images: product.images || [],
  }
}

const tryLoadFromLocalStorage = (): Product[] | null => {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem("eazybuy_products")
    if (stored) {
      const parsedProducts = JSON.parse(stored)
      if (Array.isArray(parsedProducts) && parsedProducts.length > 0) {
        console.log("[v0] Successfully loaded from localStorage:", parsedProducts.length, "products")
        return parsedProducts.map(decompressProductFromStorage)
      }
    }
  } catch (error) {
    console.warn("[v0] Failed to load from localStorage:", error)
  }

  return null
}

const trySaveToLocalStorage = (products: Product[]): void => {
  if (typeof window === "undefined") return

  try {
    const compressedProducts = products.map(compressProductForStorage)
    const jsonString = JSON.stringify(compressedProducts)
    localStorage.setItem("eazybuy_products", jsonString)
    console.log("[v0] Successfully saved to localStorage:", products.length, "products")
  } catch (error) {
    console.warn("[v0] Failed to save to localStorage (using memory only):", error)
  }
}

// Get products from memory (with localStorage fallback on first load)
export const getStoredProducts = (): Product[] => {
  if (!isInitialized) {
    memoryProductImages = loadImagesFromStorage()
    console.log("[v0] Loaded images from storage:", Object.keys(memoryProductImages).length, "products have images")

    // Try to load from localStorage on first access
    const storedProducts = tryLoadFromLocalStorage()
    if (storedProducts && storedProducts.length > 0) {
      memoryProducts = storedProducts
      console.log("[v0] Initialized from localStorage:", memoryProducts.length, "products")
    } else {
      console.log("[v0] Using default products:", memoryProducts.length, "products")
    }
    isInitialized = true
  }

  console.log("[v0] Returning products from memory:", memoryProducts.length)
  return [...memoryProducts] // Return a copy to prevent external mutations
}

// Save products to memory (with localStorage backup attempt)
export const saveProducts = (products: Product[]): void => {
  console.log("[v0] Saving products to memory:", products.length)

  // Store original images separately in memory and localStorage
  products.forEach((product) => {
    if (product.image?.startsWith("data:") || product.images?.some((img) => img.startsWith("data:"))) {
      console.log("[v0] Storing images for product:", product.name, "ID:", product.id)
      const imageData = {
        image: product.image,
        images: product.images,
      }
      // Store using both ID and name as keys for better retrieval
      memoryProductImages[product.id] = imageData
      memoryProductImages[product.name] = imageData
    }
  })

  saveImagesToStorage(memoryProductImages)

  memoryProducts = [...products] // Store a copy

  // Try to backup to localStorage but don't fail if it doesn't work
  trySaveToLocalStorage(products)

  refreshProductsCache()

  console.log("[v0] Products saved to memory successfully")
}

// Add a new product
export const addProduct = (productData: Partial<Product>): Product => {
  console.log("[v0] Starting product addition process")
  console.log("[v0] Product data to add:", productData)

  const newProduct: Product = {
    id: `product-${Date.now()}`,
    name: productData.name || "",
    description: productData.description || "",
    price: productData.price || 0,
    originalPrice: productData.originalPrice,
    category: productData.category || "",
    image:
      productData.image ||
      `/placeholder.svg?height=400&width=400&query=${encodeURIComponent(productData.name || "product")}`,
    images: productData.images || [],
    inStock: productData.inStock ?? true,
    featured: productData.featured ?? false,
    visible: productData.visible ?? true,
    rating: 4.5,
    reviewCount: 0,
    tags: productData.tags || [],
    quantity: productData.quantity || 0,
    lowStockThreshold: productData.lowStockThreshold || 5,
    createdAt: new Date().toISOString(),
  }

  console.log("[v0] Created new product object:", newProduct)

  const currentProducts = getStoredProducts()
  console.log("[v0] Current products count before addition:", currentProducts.length)

  const updatedProducts = [newProduct, ...currentProducts] // Add to beginning for newest first
  console.log("[v0] Updated products count after addition:", updatedProducts.length)

  saveProducts(updatedProducts)
  console.log("[v0] Product saved:", newProduct.name, "ID:", newProduct.id)
  console.log("[v0] Product addition process completed")

  return newProduct
}

// Update an existing product
export const updateProduct = (productId: string, productData: Partial<Product>): boolean => {
  const currentProducts = getStoredProducts()
  const productIndex = currentProducts.findIndex((p) => p.id === productId)

  if (productIndex === -1) {
    console.error("[v0] Product not found for update:", productId)
    return false
  }

  currentProducts[productIndex] = { ...currentProducts[productIndex], ...productData }
  saveProducts(currentProducts)

  console.log("[v0] Product updated:", productId)
  return true
}

// Delete a product
export const deleteProduct = (productId: string): boolean => {
  const currentProducts = getStoredProducts()
  const filteredProducts = currentProducts.filter((p) => p.id !== productId)

  if (filteredProducts.length === currentProducts.length) {
    console.error("[v0] Product not found for deletion:", productId)
    return false
  }

  saveProducts(filteredProducts)
  console.log("[v0] Product deleted:", productId)
  return true
}

// Initialize products storage with defaults if empty
export const initializeProductStorage = (): void => {
  if (!isInitialized) {
    // This will trigger the initialization logic in getStoredProducts
    getStoredProducts()
    console.log("[v0] Product storage initialized")
  }
}

export const toggleProductVisibility = (productId: string): boolean => {
  const currentProducts = getStoredProducts()
  const productIndex = currentProducts.findIndex((p) => p.id === productId)

  if (productIndex === -1) {
    console.error("[v0] Product not found for visibility toggle:", productId)
    return false
  }

  const currentVisibility = currentProducts[productIndex].visible
  currentProducts[productIndex].visible = currentVisibility === false ? true : false

  saveProducts(currentProducts)
  console.log("[v0] Product visibility toggled:", productId, "now visible:", currentProducts[productIndex].visible)
  return true
}
