export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
  icon: string
  features: string[]
}

export const shippingMethods: ShippingMethod[] = [
  {
    id: "standard",
    name: "Standard Shipping",
    description: "Regular delivery with tracking",
    price: 9.99,
    estimatedDays: "5-7 business days",
    icon: "FaTruck",
    features: ["Free on orders over $50", "Tracking included", "Signature not required"],
  },
  {
    id: "express",
    name: "Express Shipping",
    description: "Faster delivery for urgent orders",
    price: 19.99,
    estimatedDays: "2-3 business days",
    icon: "FaShippingFast",
    features: ["Priority handling", "Tracking included", "Signature required"],
  },
  {
    id: "overnight",
    name: "Overnight Shipping",
    description: "Next business day delivery",
    price: 39.99,
    estimatedDays: "1 business day",
    icon: "FaRocket",
    features: ["Next day delivery", "Priority handling", "Signature required", "Insurance included"],
  },
]

export const getShippingMethodById = (id: string): ShippingMethod | undefined => {
  return shippingMethods.find((method) => method.id === id)
}

export const calculateShippingCost = (methodId: string, subtotal: number): number => {
  const method = getShippingMethodById(methodId)
  if (!method) return 0

  // Free standard shipping on orders over $50
  if (methodId === "standard" && subtotal >= 50) {
    return 0
  }

  return method.price
}

export const getDefaultShippingMethod = (): ShippingMethod => {
  return shippingMethods[0] // Standard shipping
}
