export interface Product {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  category: string
  image: string
  images: string[]
  rating: number
  reviewCount: number
  inStock: boolean
  featured: boolean
  tags: string[]
  quantity?: number
  lowStockThreshold?: number
}

export interface ProductCategory {
  id: string
  name: string
  slug: string
  description: string
  image: string
}

// Mock product categories
export const categories: ProductCategory[] = [
  {
    id: "1",
    name: "Electronics",
    slug: "electronics",
    description: "Latest gadgets and electronic devices",
    image: "/images/categories/electronics.png",
  },
  {
    id: "2",
    name: "Fashion",
    slug: "fashion",
    description: "Trendy clothing and accessories",
    image: "/trendy-fashion-clothing-accessories-collection.jpg",
  },
  {
    id: "3",
    name: "Home & Garden",
    slug: "home-garden",
    description: "Everything for your home and garden",
    image: "/beautiful-home-garden-decor-furniture-collection.jpg",
  },
  {
    id: "4",
    name: "Sports",
    slug: "sports",
    description: "Sports equipment and fitness gear",
    image: "/sports-equipment-fitness-gear-collection.jpg",
  },
  {
    id: "5",
    name: "Books",
    slug: "books",
    description: "Books for every reader",
    image: "/collection-of-books-library-reading-materials.jpg",
  },
  {
    id: "6",
    name: "Food & Beverages",
    slug: "food-beverages",
    description: "Gourmet food and premium beverages",
    image: "/gourmet-food-premium-beverages-collection.jpg",
  },
]

// Mock products data
export const products: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    description: "Premium quality wireless headphones with noise cancellation and 30-hour battery life.",
    price: 199.99,
    originalPrice: 249.99,
    category: "Electronics",
    image: "/premium-wireless-bluetooth-headphones-with-noise-c.jpg",
    images: [
      "/wireless-bluetooth-headphones-front-view.jpg",
      "/wireless-bluetooth-headphones-side-profile.jpg",
      "/wireless-bluetooth-headphones-back-view.jpg",
    ],
    rating: 4.5,
    reviewCount: 128,
    inStock: true,
    featured: true,
    tags: ["wireless", "bluetooth", "noise-cancelling"],
    quantity: 50,
    lowStockThreshold: 10,
  },
  {
    id: "2",
    name: "Smart Fitness Watch",
    description: "Track your fitness goals with this advanced smartwatch featuring heart rate monitoring and GPS.",
    price: 299.99,
    category: "Electronics",
    image: "/modern-smart-fitness-watch-with-colorful-display.jpg",
    images: ["/smart-fitness-watch-display-screen.jpg", "/smart-fitness-watch-band-closeup.jpg"],
    rating: 4.3,
    reviewCount: 89,
    inStock: true,
    featured: true,
    tags: ["smartwatch", "fitness", "gps"],
    quantity: 30,
    lowStockThreshold: 5,
  },
  {
    id: "3",
    name: "Organic Cotton T-Shirt",
    description: "Comfortable and sustainable organic cotton t-shirt available in multiple colors.",
    price: 29.99,
    originalPrice: 39.99,
    category: "Fashion",
    image: "/premium-organic-cotton-t-shirt-in-natural-colors.jpg",
    images: ["/organic-cotton-t-shirt-front-view.jpg", "/organic-cotton-t-shirt-back-view.jpg"],
    rating: 4.7,
    reviewCount: 203,
    inStock: true,
    featured: false,
    tags: ["organic", "cotton", "sustainable"],
    quantity: 20,
    lowStockThreshold: 5,
  },
  {
    id: "4",
    name: "Modern Table Lamp",
    description: "Sleek and modern table lamp with adjustable brightness and USB charging port.",
    price: 79.99,
    category: "Home & Garden",
    image: "/elegant-modern-table-lamp-with-warm-lighting.jpg",
    images: ["/modern-table-lamp-illuminated.jpg", "/modern-table-lamp-turned-off.jpg"],
    rating: 4.2,
    reviewCount: 56,
    inStock: true,
    featured: false,
    tags: ["lamp", "modern", "usb-charging"],
    quantity: 15,
    lowStockThreshold: 3,
  },
  {
    id: "5",
    name: "Yoga Mat Premium",
    description: "High-quality non-slip yoga mat perfect for all types of yoga and exercise.",
    price: 49.99,
    category: "Sports",
    image: "/premium-yoga-mat-rolled-up-in-beautiful-colors.jpg",
    images: ["/premium-yoga-mat-rolled-up.jpg", "/premium-yoga-mat-unrolled-on-floor.jpg"],
    rating: 4.6,
    reviewCount: 174,
    inStock: true,
    featured: true,
    tags: ["yoga", "exercise", "non-slip"],
    quantity: 10,
    lowStockThreshold: 2,
  },
  {
    id: "6",
    name: "JavaScript: The Complete Guide",
    description: "Comprehensive guide to modern JavaScript programming with practical examples.",
    price: 34.99,
    category: "Books",
    image: "/modern-javascript-programming-book-cover-design.jpg",
    images: ["/javascript-book-cover.jpg", "/javascript-programming-book-open-pages.jpg"],
    rating: 4.8,
    reviewCount: 312,
    inStock: true,
    featured: false,
    tags: ["javascript", "programming", "guide"],
    quantity: 5,
    lowStockThreshold: 1,
  },
  {
    id: "7",
    name: "Wireless Phone Charger",
    description: "Fast wireless charging pad compatible with all Qi-enabled devices.",
    price: 24.99,
    originalPrice: 34.99,
    category: "Electronics",
    image: "/sleek-wireless-phone-charging-pad-modern-design.jpg",
    images: ["/wireless-charging-pad-with-phone-charging.jpg", "/wireless-charger-led-indicator-close-up.jpg"],
    rating: 4.1,
    reviewCount: 67,
    inStock: true,
    featured: false,
    tags: ["wireless", "charger", "qi-enabled"],
    quantity: 25,
    lowStockThreshold: 5,
  },
  {
    id: "8",
    name: "Designer Sunglasses",
    description: "Stylish designer sunglasses with UV protection and polarized lenses.",
    price: 149.99,
    category: "Fashion",
    image: "/stylish-designer-sunglasses-uv-protection.jpg",
    images: ["/designer-sunglasses-side-view-elegant.jpg", "/sunglasses-polarized-lenses-close-up.jpg"],
    rating: 4.4,
    reviewCount: 91,
    inStock: false,
    featured: false,
    tags: ["sunglasses", "designer", "uv-protection"],
    quantity: 0,
    lowStockThreshold: 1,
  },
  {
    id: "9",
    name: "Professional Camera Lens",
    description: "High-quality 50mm prime lens for professional photography with excellent bokeh.",
    price: 899.99,
    originalPrice: 1099.99,
    category: "Electronics",
    image: "/professional-camera-lens-50mm-prime-photography.jpg",
    images: ["/camera-lens-mounted-on-professional-camera.jpg", "/camera-lens-bokeh-effect-demonstration.jpg"],
    rating: 4.9,
    reviewCount: 156,
    inStock: true,
    featured: true,
    tags: ["camera", "lens", "photography", "professional"],
    quantity: 8,
    lowStockThreshold: 2,
  },
  {
    id: "10",
    name: "Luxury Leather Handbag",
    description: "Handcrafted genuine leather handbag with elegant design and premium quality.",
    price: 299.99,
    originalPrice: 399.99,
    category: "Fashion",
    image: "/luxury-leather-handbag-handcrafted-elegant-design.jpg",
    images: ["/luxury-leather-handbag-interior-compartments.jpg", "/leather-handbag-strap-and-hardware-details.jpg"],
    rating: 4.6,
    reviewCount: 89,
    inStock: true,
    featured: true,
    tags: ["handbag", "leather", "luxury", "fashion"],
    quantity: 12,
    lowStockThreshold: 3,
  },
  {
    id: "11",
    name: "Smart Home Security Camera",
    description: "4K wireless security camera with night vision and motion detection.",
    price: 179.99,
    category: "Electronics",
    image: "/smart-home-security-camera-4k-wireless-night-visio.jpg",
    images: ["/security-camera-mounted-on-wall.jpg", "/security-camera-night-vision-footage.jpg"],
    rating: 4.4,
    reviewCount: 234,
    inStock: true,
    featured: false,
    tags: ["security", "camera", "smart-home", "4k"],
    quantity: 18,
    lowStockThreshold: 5,
  },
  {
    id: "12",
    name: "Ergonomic Office Chair",
    description: "Premium ergonomic office chair with lumbar support and adjustable height.",
    price: 449.99,
    originalPrice: 599.99,
    category: "Home & Garden",
    image: "/ergonomic-office-chair-lumbar-support-adjustable-h.jpg",
    images: ["/office-chair-side-profile-ergonomic-design.jpg", "/office-chair-adjustment-controls-close-up.jpg"],
    rating: 4.7,
    reviewCount: 167,
    inStock: true,
    featured: true,
    tags: ["office", "chair", "ergonomic", "furniture"],
    quantity: 6,
    lowStockThreshold: 2,
  },
  {
    id: "13",
    name: "Professional Tennis Racket",
    description: "High-performance tennis racket used by professional players worldwide.",
    price: 249.99,
    category: "Sports",
    image: "/professional-tennis-racket-high-performance-sports.jpg",
    images: ["/tennis-racket-string-pattern-close-up.jpg", "/tennis-racket-grip-and-handle-details.jpg"],
    rating: 4.8,
    reviewCount: 92,
    inStock: true,
    featured: false,
    tags: ["tennis", "racket", "professional", "sports"],
    quantity: 14,
    lowStockThreshold: 3,
  },
  {
    id: "14",
    name: "Artisan Chocolate Box",
    description: "Handcrafted premium chocolates made with finest ingredients from around the world.",
    price: 49.99,
    category: "Food & Beverages",
    image: "/handcrafted-premium-artisan-chocolate-box-with-fin.jpg",
    images: [
      "/artisan-chocolate-box-opened-showing-premium-choco.jpg",
      "/handcrafted-chocolates-arranged-in-elegant-box.jpg",
    ],
    rating: 4.8,
    reviewCount: 124,
    inStock: true,
    featured: true,
    tags: ["chocolate", "artisan", "premium", "handcrafted"],
    quantity: 19,
    lowStockThreshold: 4,
  },
  {
    id: "15",
    name: "Mechanical Gaming Keyboard",
    description: "RGB backlit mechanical keyboard with tactile switches for gaming enthusiasts.",
    price: 159.99,
    originalPrice: 199.99,
    category: "Electronics",
    image: "/rgb-backlit-mechanical-gaming-keyboard-with-tactil.jpg",
    images: [
      "/mechanical-keyboard-front-view-with-rgb-lighting.jpg",
      "/gaming-keyboard-side-profile-showing-switches.jpg",
    ],
    rating: 4.5,
    reviewCount: 145,
    inStock: true,
    featured: false,
    tags: ["keyboard", "gaming", "mechanical", "rgb"],
    quantity: 22,
    lowStockThreshold: 5,
  },
  {
    id: "16",
    name: "Silk Scarf Collection",
    description: "Luxurious silk scarf with hand-painted artistic design, perfect for any occasion.",
    price: 89.99,
    category: "Fashion",
    image: "/luxurious-silk-scarf-with-hand-painted-artistic-de.jpg",
    images: ["/silk-scarf-front-view-with-artistic-pattern.jpg", "/luxury-silk-scarf-draped-elegantly.jpg"],
    rating: 4.6,
    reviewCount: 73,
    inStock: true,
    featured: false,
    tags: ["scarf", "silk", "luxury", "artistic"],
    quantity: 16,
    lowStockThreshold: 4,
  },
  {
    id: "17",
    name: "Indoor Plant Collection",
    description: "Beautiful collection of low-maintenance indoor plants perfect for home decoration.",
    price: 39.99,
    category: "Home & Garden",
    image: "/beautiful-collection-of-low-maintenance-indoor-pla.jpg",
    images: ["/indoor-plants-in-decorative-pots.jpg", "/green-indoor-plants-collection-arranged-beautifull.jpg"],
    rating: 4.3,
    reviewCount: 198,
    inStock: true,
    featured: false,
    tags: ["plants", "indoor", "decoration", "low-maintenance"],
    quantity: 28,
    lowStockThreshold: 6,
  },
  {
    id: "18",
    name: "Fitness Resistance Bands Set",
    description: "Complete set of resistance bands for full-body workouts at home or gym.",
    price: 34.99,
    originalPrice: 49.99,
    category: "Sports",
    image: "/complete-set-of-fitness-resistance-bands-for-full-.jpg",
    images: [
      "/resistance-bands-set-laid-out-showing-different-st.jpg",
      "/fitness-resistance-bands-in-use-for-workout.jpg",
    ],
    rating: 4.4,
    reviewCount: 156,
    inStock: true,
    featured: false,
    tags: ["fitness", "resistance-bands", "workout", "home-gym"],
    quantity: 31,
    lowStockThreshold: 7,
  },
  {
    id: "19",
    name: "Gift Card Collection",
    description: "Digital gift cards available in various denominations for the perfect gift.",
    price: 50.0,
    category: "Food & Beverages",
    image: "/elegant-gift-card-collection-with-various-denomina.jpg",
    images: ["/digital-gift-card-design-with-elegant-typography.jpg", "/gift-card-presentation-in-premium-packaging.jpg"],
    rating: 4.9,
    reviewCount: 67,
    inStock: true,
    featured: false,
    tags: ["gift-card", "digital", "present", "versatile"],
    quantity: 100,
    lowStockThreshold: 10,
  },
  {
    id: "20",
    name: "Vintage Vinyl Record Player",
    description: "Classic turntable with modern features, perfect for vinyl enthusiasts.",
    price: 399.99,
    originalPrice: 499.99,
    category: "Electronics",
    image: "/vintage-vinyl-record-player-turntable-with-modern-.jpg",
    images: ["/vintage-turntable-playing-vinyl-record-close-up.jpg", "/record-player-tonearm-and-cartridge-detail.jpg"],
    rating: 4.7,
    reviewCount: 87,
    inStock: true,
    featured: true,
    tags: ["turntable", "vinyl", "vintage", "music"],
    quantity: 9,
    lowStockThreshold: 2,
  },
]

export const getProductById = (id: string): Product | undefined => {
  return products.find((product) => product.id === id)
}

export const getProductsByCategory = (category: string): Product[] => {
  return products.filter((product) => product.category.toLowerCase() === category.toLowerCase())
}

export const getFeaturedProducts = (): Product[] => {
  return products.filter((product) => product.featured)
}

export const searchProducts = (query: string): Product[] => {
  const lowercaseQuery = query.toLowerCase()
  return products.filter(
    (product) =>
      product.name.toLowerCase().includes(lowercaseQuery) ||
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)),
  )
}

export const getSearchSuggestions = (query: string, limit = 5): string[] => {
  if (!query || query.length < 2) return []

  const lowercaseQuery = query.toLowerCase()
  const suggestions = new Set<string>()

  // Add product names that match
  products.forEach((product) => {
    if (product.name.toLowerCase().includes(lowercaseQuery)) {
      suggestions.add(product.name)
    }
  })

  // Add categories that match
  categories.forEach((category) => {
    if (category.name.toLowerCase().includes(lowercaseQuery)) {
      suggestions.add(category.name)
    }
  })

  // Add tags that match
  products.forEach((product) => {
    product.tags.forEach((tag) => {
      if (tag.toLowerCase().includes(lowercaseQuery)) {
        suggestions.add(tag)
      }
    })
  })

  return Array.from(suggestions).slice(0, limit)
}

export const searchProductsEnhanced = (query: string): { products: Product[]; highlightTerm: string } => {
  if (!query) return { products, highlightTerm: "" }

  const lowercaseQuery = query.toLowerCase()
  const results = products.filter((product) => {
    const nameMatch = product.name.toLowerCase().includes(lowercaseQuery)
    const descriptionMatch = product.description.toLowerCase().includes(lowercaseQuery)
    const tagMatch = product.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery))
    const categoryMatch = product.category.toLowerCase().includes(lowercaseQuery)

    return nameMatch || descriptionMatch || tagMatch || categoryMatch
  })

  // Sort by relevance (name matches first, then description, then tags)
  results.sort((a, b) => {
    const aNameMatch = a.name.toLowerCase().includes(lowercaseQuery)
    const bNameMatch = b.name.toLowerCase().includes(lowercaseQuery)

    if (aNameMatch && !bNameMatch) return -1
    if (!aNameMatch && bNameMatch) return 1

    // If both or neither match name, sort by rating
    return b.rating - a.rating
  })

  return { products: results, highlightTerm: query }
}

export const getFilterCounts = (baseProducts: Product[] = products) => {
  const counts = {
    categories: {} as Record<string, number>,
    priceRanges: {
      "0-25": 0,
      "25-50": 0,
      "50-100": 0,
      "100-200": 0,
      "200+": 0,
    },
    ratings: {
      "4+": 0,
      "3+": 0,
      "2+": 0,
      "1+": 0,
    },
    inStock: 0,
    onSale: 0,
  }

  baseProducts.forEach((product) => {
    // Category counts
    counts.categories[product.category] = (counts.categories[product.category] || 0) + 1

    // Price range counts
    if (product.price <= 25) counts.priceRanges["0-25"]++
    else if (product.price <= 50) counts.priceRanges["25-50"]++
    else if (product.price <= 100) counts.priceRanges["50-100"]++
    else if (product.price <= 200) counts.priceRanges["100-200"]++
    else counts.priceRanges["200+"]++

    // Rating counts
    if (product.rating >= 4) counts.ratings["4+"]++
    if (product.rating >= 3) counts.ratings["3+"]++
    if (product.rating >= 2) counts.ratings["2+"]++
    if (product.rating >= 1) counts.ratings["1+"]++

    // Stock and sale counts
    if (product.inStock) counts.inStock++
    if (product.originalPrice && product.originalPrice > product.price) counts.onSale++
  })

  return counts
}

export const filterProducts = (
  products: Product[],
  filters: {
    category?: string
    minPrice?: number
    maxPrice?: number
    inStock?: boolean
    minRating?: number
  },
): Product[] => {
  return products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false
    if (filters.minPrice && product.price < filters.minPrice) return false
    if (filters.maxPrice && product.price > filters.maxPrice) return false
    if (filters.inStock !== undefined && product.inStock !== filters.inStock) return false
    if (filters.minRating && product.rating < filters.minRating) return false
    return true
  })
}

export const sortProducts = (products: Product[], sortBy: string): Product[] => {
  const sorted = [...products]

  switch (sortBy) {
    case "price-low":
      return sorted.sort((a, b) => a.price - b.price)
    case "price-high":
      return sorted.sort((a, b) => b.price - a.price)
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating)
    case "popularity":
      return sorted.sort((a, b) => b.reviewCount - a.reviewCount)
    case "newest":
      return sorted.sort((a, b) => Number.parseInt(b.id) - Number.parseInt(a.id))
    case "discount":
      return sorted.sort((a, b) => {
        const aDiscount = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0
        const bDiscount = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0
        return bDiscount - aDiscount
      })
    case "name":
    default:
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
  }
}

export const getProductWithInventory = (
  id: string,
): (Product & { availableQuantity: number; isLowStock: boolean }) | undefined => {
  const product = getProductById(id)
  if (!product) return undefined

  // Import inventory functions dynamically to avoid circular dependency
  const { getAvailableQuantity, isLowStock } = require("./inventory")

  return {
    ...product,
    availableQuantity: getAvailableQuantity(id),
    isLowStock: isLowStock(id),
  }
}

export const getProductsWithInventory = (): Array<Product & { availableQuantity: number; isLowStock: boolean }> => {
  const { getAvailableQuantity, isLowStock } = require("./inventory")

  return products.map((product) => ({
    ...product,
    availableQuantity: getAvailableQuantity(product.id),
    isLowStock: isLowStock(product.id),
  }))
}
