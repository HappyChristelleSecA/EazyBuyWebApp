export interface Discount {
  id: string
  code: string
  name: string
  description: string
  type: "percentage" | "fixed_amount" | "free_shipping" | "buy_x_get_y"
  value: number
  minimumOrderAmount?: number
  maximumDiscountAmount?: number
  applicableCategories?: string[]
  applicableProducts?: string[]
  excludedCategories?: string[]
  excludedProducts?: string[]
  startDate: Date
  endDate: Date
  usageLimit?: number
  usageCount: number
  userUsageLimit?: number
  isActive: boolean
  isStackable: boolean
  buyQuantity?: number
  getQuantity?: number
  getFreeProduct?: string
  createdBy: string
  createdAt: Date
  updatedAt: Date
}

export interface DiscountApplication {
  discountId: string
  discountCode: string
  discountName: string
  discountType: string
  discountAmount: number
  appliedToItems?: string[]
}

export interface CartDiscount {
  subtotal: number
  shipping: number
  tax: number
  discounts: DiscountApplication[]
  totalDiscount: number
  finalTotal: number
}

// Mock discount data
export const discounts: Discount[] = [
  {
    id: "1",
    code: "WELCOME10",
    name: "Welcome Discount",
    description: "10% off your first order",
    type: "percentage",
    value: 10,
    minimumOrderAmount: 25,
    maximumDiscountAmount: 50,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    usageLimit: 1000,
    usageCount: 245,
    userUsageLimit: 1,
    isActive: true,
    isStackable: false,
    createdBy: "admin",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    code: "SAVE20",
    name: "Save $20",
    description: "$20 off orders over $100",
    type: "fixed_amount",
    value: 20,
    minimumOrderAmount: 100,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    usageLimit: 500,
    usageCount: 123,
    isActive: true,
    isStackable: true,
    createdBy: "admin",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "3",
    code: "FREESHIP",
    name: "Free Shipping",
    description: "Free shipping on all orders",
    type: "free_shipping",
    value: 0,
    minimumOrderAmount: 0,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    usageLimit: 2000,
    usageCount: 567,
    isActive: true,
    isStackable: true,
    createdBy: "admin",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "4",
    code: "ELECTRONICS15",
    name: "Electronics Sale",
    description: "15% off all electronics",
    type: "percentage",
    value: 15,
    applicableCategories: ["Electronics"],
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-06-30"),
    usageLimit: 300,
    usageCount: 89,
    isActive: true,
    isStackable: true,
    createdBy: "admin",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
  {
    id: "5",
    code: "BUY2GET1",
    name: "Buy 2 Get 1 Free",
    description: "Buy 2 items, get the cheapest one free",
    type: "buy_x_get_y",
    value: 100,
    buyQuantity: 2,
    getQuantity: 1,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    usageLimit: 100,
    usageCount: 34,
    isActive: true,
    isStackable: false,
    createdBy: "admin",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
  },
]

export const getDiscountByCode = (code: string): Discount | undefined => {
  return discounts.find(
    (discount) =>
      discount.code.toLowerCase() === code.toLowerCase() &&
      discount.isActive &&
      new Date() >= discount.startDate &&
      new Date() <= discount.endDate,
  )
}

export const validateDiscount = (
  discount: Discount,
  cartItems: any[],
  subtotal: number,
  userId?: string,
): { valid: boolean; reason?: string } => {
  // Check if discount is active and within date range
  if (!discount.isActive) {
    return { valid: false, reason: "This discount is no longer active" }
  }

  const now = new Date()
  if (now < discount.startDate || now > discount.endDate) {
    return { valid: false, reason: "This discount has expired" }
  }

  // Check usage limits
  if (discount.usageLimit && discount.usageCount >= discount.usageLimit) {
    return { valid: false, reason: "This discount has reached its usage limit" }
  }

  // Check minimum order amount
  if (discount.minimumOrderAmount && subtotal < discount.minimumOrderAmount) {
    return {
      valid: false,
      reason: `Minimum order amount of $${discount.minimumOrderAmount} required`,
    }
  }

  // Check category restrictions
  if (discount.applicableCategories && discount.applicableCategories.length > 0) {
    const hasApplicableItems = cartItems.some((item) => discount.applicableCategories!.includes(item.product.category))
    if (!hasApplicableItems) {
      return {
        valid: false,
        reason: `This discount only applies to ${discount.applicableCategories.join(", ")} items`,
      }
    }
  }

  // Check excluded categories
  if (discount.excludedCategories && discount.excludedCategories.length > 0) {
    const hasExcludedItems = cartItems.every((item) => discount.excludedCategories!.includes(item.product.category))
    if (hasExcludedItems) {
      return {
        valid: false,
        reason: `This discount cannot be applied to ${discount.excludedCategories.join(", ")} items`,
      }
    }
  }

  return { valid: true }
}

export const calculateDiscountAmount = (
  discount: Discount,
  cartItems: any[],
  subtotal: number,
  shipping: number,
): DiscountApplication => {
  let discountAmount = 0
  let appliedToItems: string[] = []

  switch (discount.type) {
    case "percentage":
      if (discount.applicableCategories && discount.applicableCategories.length > 0) {
        // Apply to specific categories only
        const applicableItemsTotal = cartItems
          .filter((item) => discount.applicableCategories!.includes(item.product.category))
          .reduce((sum, item) => sum + item.product.price * item.quantity, 0)

        discountAmount = applicableItemsTotal * (discount.value / 100)
        appliedToItems = cartItems
          .filter((item) => discount.applicableCategories!.includes(item.product.category))
          .map((item) => item.id)
      } else {
        // Apply to entire subtotal
        discountAmount = subtotal * (discount.value / 100)
        appliedToItems = cartItems.map((item) => item.id)
      }

      // Apply maximum discount limit
      if (discount.maximumDiscountAmount) {
        discountAmount = Math.min(discountAmount, discount.maximumDiscountAmount)
      }
      break

    case "fixed_amount":
      discountAmount = discount.value
      appliedToItems = cartItems.map((item) => item.id)
      break

    case "free_shipping":
      discountAmount = shipping
      break

    case "buy_x_get_y":
      if (discount.buyQuantity && discount.getQuantity) {
        // Sort items by price (ascending) to give away cheapest items
        const sortedItems = [...cartItems].sort((a, b) => a.product.price - b.product.price)
        const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
        const freeItems =
          Math.floor(totalQuantity / (discount.buyQuantity + discount.getQuantity)) * discount.getQuantity

        // Calculate discount amount based on cheapest items
        let remainingFreeItems = freeItems
        for (const item of sortedItems) {
          if (remainingFreeItems <= 0) break

          const itemsToDiscount = Math.min(remainingFreeItems, item.quantity)
          discountAmount += item.product.price * itemsToDiscount
          remainingFreeItems -= itemsToDiscount
          appliedToItems.push(item.id)
        }
      }
      break
  }

  return {
    discountId: discount.id,
    discountCode: discount.code,
    discountName: discount.name,
    discountType: discount.type,
    discountAmount: Math.round(discountAmount * 100) / 100,
    appliedToItems,
  }
}

export const calculateCartWithDiscounts = (
  cartItems: any[],
  discountCodes: string[],
  baseShipping = 0,
  taxRate = 0.08,
): CartDiscount => {
  const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  let shipping = baseShipping
  const appliedDiscounts: DiscountApplication[] = []
  let totalDiscount = 0

  // Apply discounts
  for (const code of discountCodes) {
    const discount = getDiscountByCode(code)
    if (!discount) continue

    const validation = validateDiscount(discount, cartItems, subtotal)
    if (!validation.valid) continue

    // Check if discount is stackable
    if (!discount.isStackable && appliedDiscounts.length > 0) continue

    const discountApplication = calculateDiscountAmount(discount, cartItems, subtotal, shipping)

    // Handle free shipping
    if (discount.type === "free_shipping") {
      shipping = 0
    } else {
      totalDiscount += discountApplication.discountAmount
    }

    appliedDiscounts.push(discountApplication)
  }

  const discountedSubtotal = Math.max(0, subtotal - totalDiscount)
  const tax = discountedSubtotal * taxRate
  const finalTotal = discountedSubtotal + shipping + tax

  return {
    subtotal,
    shipping,
    tax,
    discounts: appliedDiscounts,
    totalDiscount,
    finalTotal,
  }
}

export const getActiveDiscounts = (): Discount[] => {
  const now = new Date()
  return discounts.filter(
    (discount) =>
      discount.isActive &&
      now >= discount.startDate &&
      now <= discount.endDate &&
      (!discount.usageLimit || discount.usageCount < discount.usageLimit),
  )
}

export const createDiscount = (
  discountData: Omit<Discount, "id" | "usageCount" | "createdAt" | "updatedAt">,
): Discount => {
  const newDiscount: Discount = {
    ...discountData,
    id: `discount-${Date.now()}`,
    usageCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  discounts.push(newDiscount)
  return newDiscount
}

export const updateDiscount = (id: string, updates: Partial<Discount>): boolean => {
  const index = discounts.findIndex((d) => d.id === id)
  if (index === -1) return false

  discounts[index] = {
    ...discounts[index],
    ...updates,
    updatedAt: new Date(),
  }

  return true
}

export const deleteDiscount = (id: string): boolean => {
  const index = discounts.findIndex((d) => d.id === id)
  if (index === -1) return false

  discounts.splice(index, 1)
  return true
}

export const incrementDiscountUsage = (code: string): void => {
  const discount = discounts.find((d) => d.code.toLowerCase() === code.toLowerCase())
  if (discount) {
    discount.usageCount++
    discount.updatedAt = new Date()
  }
}
