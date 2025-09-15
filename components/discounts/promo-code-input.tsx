"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FaTag, FaTimes, FaCheck } from "react-icons/fa"
import { getDiscountByCode, validateDiscount, type DiscountApplication } from "@/lib/discounts"

interface PromoCodeInputProps {
  appliedDiscounts: DiscountApplication[]
  onApplyDiscount: (code: string) => void
  onRemoveDiscount: (discountId: string) => void
  cartItems: any[]
  subtotal: number
  className?: string
}

export function PromoCodeInput({
  appliedDiscounts,
  onApplyDiscount,
  onRemoveDiscount,
  cartItems,
  subtotal,
  className,
}: PromoCodeInputProps) {
  const [promoCode, setPromoCode] = useState("")
  const [error, setError] = useState("")
  const [isApplying, setIsApplying] = useState(false)

  const handleApplyCode = async () => {
    if (!promoCode.trim()) return

    setIsApplying(true)
    setError("")

    // Check if code is already applied
    if (appliedDiscounts.some((d) => d.discountCode.toLowerCase() === promoCode.toLowerCase())) {
      setError("This discount is already applied")
      setIsApplying(false)
      return
    }

    const discount = getDiscountByCode(promoCode)
    if (!discount) {
      setError("Invalid promo code")
      setIsApplying(false)
      return
    }

    const validation = validateDiscount(discount, cartItems, subtotal)
    if (!validation.valid) {
      setError(validation.reason || "Cannot apply this discount")
      setIsApplying(false)
      return
    }

    // Check stackability
    if (!discount.isStackable && appliedDiscounts.length > 0) {
      setError("This discount cannot be combined with other offers")
      setIsApplying(false)
      return
    }

    onApplyDiscount(promoCode)
    setPromoCode("")
    setIsApplying(false)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleApplyCode()
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Applied Discounts */}
      {appliedDiscounts.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm font-medium">Applied Discounts</Label>
          {appliedDiscounts.map((discount) => (
            <div
              key={discount.discountId}
              className="flex items-center justify-between p-3 bg-green-50 rounded-md border border-green-200"
            >
              <div className="flex items-center space-x-2">
                <FaCheck className="h-4 w-4 text-green-600" />
                <div>
                  <span className="font-medium text-green-800">{discount.discountCode}</span>
                  <p className="text-sm text-green-600">{discount.discountName}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  -${discount.discountAmount.toFixed(2)}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveDiscount(discount.discountId)}
                  className="h-6 w-6 p-0 text-green-600 hover:text-green-800"
                >
                  <FaTimes className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Promo Code Input */}
      <div className="space-y-2">
        <Label htmlFor="promo">Promo Code</Label>
        <div className="flex space-x-2">
          <div className="relative flex-1">
            <FaTag className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="promo"
              placeholder="Enter promo code"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              onKeyPress={handleKeyPress}
              className="pl-10"
            />
          </div>
          <Button variant="outline" onClick={handleApplyCode} disabled={!promoCode.trim() || isApplying}>
            {isApplying ? "Applying..." : "Apply"}
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-muted-foreground">Try: WELCOME10, SAVE20, FREESHIP, ELECTRONICS15</div>
      </div>
    </div>
  )
}
