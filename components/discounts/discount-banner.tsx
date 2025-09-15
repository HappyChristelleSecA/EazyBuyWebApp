"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FaTag, FaTimes, FaClock } from "react-icons/fa"
import { getActiveDiscounts, type Discount } from "@/lib/discounts"

export function DiscountBanner() {
  const [activeDiscounts, setActiveDiscounts] = useState<Discount[]>([])
  const [dismissedDiscounts, setDismissedDiscounts] = useState<string[]>([])

  useEffect(() => {
    const discounts = getActiveDiscounts()
    setActiveDiscounts(discounts.slice(0, 3)) // Show max 3 banners

    // Load dismissed discounts from localStorage
    const dismissed = localStorage.getItem("dismissed-discounts")
    if (dismissed) {
      setDismissedDiscounts(JSON.parse(dismissed))
    }
  }, [])

  const dismissDiscount = (discountId: string) => {
    const updated = [...dismissedDiscounts, discountId]
    setDismissedDiscounts(updated)
    localStorage.setItem("dismissed-discounts", JSON.stringify(updated))
  }

  const visibleDiscounts = activeDiscounts.filter((discount) => !dismissedDiscounts.includes(discount.id))

  if (visibleDiscounts.length === 0) return null

  return (
    <div className="space-y-2">
      {visibleDiscounts.map((discount) => (
        <Card key={discount.id} className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FaTag className="h-5 w-5 text-primary" />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-primary">{discount.code}</span>
                    <Badge variant="secondary" className="text-xs">
                      {discount.type === "percentage"
                        ? `${discount.value}% OFF`
                        : discount.type === "fixed_amount"
                          ? `$${discount.value} OFF`
                          : discount.type === "free_shipping"
                            ? "FREE SHIPPING"
                            : "SPECIAL OFFER"}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{discount.description}</p>
                  {discount.minimumOrderAmount && (
                    <p className="text-xs text-gray-600">Minimum order: ${discount.minimumOrderAmount}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {discount.endDate && (
                  <div className="text-xs text-gray-600 flex items-center">
                    <FaClock className="h-3 w-3 mr-1" />
                    Expires {discount.endDate.toLocaleDateString()}
                  </div>
                )}
                <Button variant="ghost" size="sm" onClick={() => dismissDiscount(discount.id)} className="h-6 w-6 p-0">
                  <FaTimes className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
