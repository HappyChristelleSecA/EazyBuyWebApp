"use client"

import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { PaymentModal } from "@/components/payment/payment-modal"
import { DiscountBanner } from "@/components/discounts/discount-banner"
import { PromoCodeInput } from "@/components/discounts/promo-code-input"
import { FaShoppingCart, FaPlus, FaMinus, FaTrash, FaArrowLeft } from "react-icons/fa"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { calculateCartWithDiscounts, incrementDiscountUsage } from "@/lib/discounts"

export default function CartPage() {
  const { items, itemCount, updateQuantity, removeFromCart, clearCart } = useCart()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [appliedDiscountCodes, setAppliedDiscountCodes] = useState<string[]>([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentInProgress, setPaymentInProgress] = useState(false)

  const baseShipping = 9.99
  const cartCalculation = calculateCartWithDiscounts(
    items,
    appliedDiscountCodes,
    items.reduce((sum, item) => sum + item.product.price * item.quantity, 0) > 50 ? 0 : baseShipping,
    0.08,
  )

  const handleApplyDiscount = (code: string) => {
    if (!appliedDiscountCodes.includes(code.toUpperCase())) {
      setAppliedDiscountCodes([...appliedDiscountCodes, code.toUpperCase()])
    }
  }

  const handleRemoveDiscount = (discountId: string) => {
    const discountToRemove = cartCalculation.discounts.find((d) => d.discountId === discountId)
    if (discountToRemove) {
      setAppliedDiscountCodes(appliedDiscountCodes.filter((code) => code !== discountToRemove.discountCode))
    }
  }

  const handleCheckout = () => {
    if (!isAuthenticated) {
      router.push("/auth")
      return
    }

    // Increment usage count for applied discounts
    appliedDiscountCodes.forEach((code) => {
      incrementDiscountUsage(code)
    })

    setPaymentInProgress(true)
    setShowPaymentModal(true)
  }

  const handlePaymentModalClose = () => {
    setShowPaymentModal(false)
    setPaymentInProgress(false)
    setAppliedDiscountCodes([]) // Clear discounts after successful payment
  }

  if (items.length === 0 && !paymentInProgress) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <FaShoppingCart className="h-24 w-24 text-muted-foreground mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Button size="lg" asChild>
              <Link href="/products">
                <FaArrowLeft className="mr-2 h-4 w-4" />
                Continue Shopping
              </Link>
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">{itemCount} items in your cart</p>
        </div>

        <div className="mb-6">
          <DiscountBanner />
        </div>

        {(items.length > 0 || paymentInProgress) && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative h-24 w-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.image || "/placeholder.svg"}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg mb-1">{item.product.name}</h3>
                            <Badge variant="outline" className="mb-2">
                              {item.product.category}
                            </Badge>
                            <p className="text-muted-foreground text-sm line-clamp-2">{item.product.description}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-destructive hover:text-destructive"
                            onClick={() => removeFromCart(item.id)}
                          >
                            <FaTrash className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center space-x-3">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <FaMinus className="h-4 w-4" />
                            </Button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <FaPlus className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                            <p className="text-sm text-muted-foreground">${item.product.price} each</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <div className="flex justify-between items-center pt-4">
                <Button variant="outline" asChild>
                  <Link href="/products">
                    <FaArrowLeft className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
                <Button variant="destructive" onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <Card className="sticky top-4">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal ({itemCount} items)</span>
                      <span>${cartCalculation.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{cartCalculation.shipping === 0 ? "Free" : `$${cartCalculation.shipping.toFixed(2)}`}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${cartCalculation.tax.toFixed(2)}</span>
                    </div>

                    {cartCalculation.discounts.map((discount) => (
                      <div key={discount.discountId} className="flex justify-between text-green-600">
                        <span>{discount.discountName}</span>
                        <span>-${discount.discountAmount.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="flex justify-between text-lg font-semibold">
                    <span>Total</span>
                    <span>${cartCalculation.finalTotal.toFixed(2)}</span>
                  </div>

                  {cartCalculation.subtotal < 50 && cartCalculation.shipping > 0 && (
                    <div className="text-sm text-muted-foreground bg-muted p-3 rounded-md">
                      Add ${(50 - cartCalculation.subtotal).toFixed(2)} more for free shipping!
                    </div>
                  )}

                  <PromoCodeInput
                    appliedDiscounts={cartCalculation.discounts}
                    onApplyDiscount={handleApplyDiscount}
                    onRemoveDiscount={handleRemoveDiscount}
                    cartItems={items}
                    subtotal={cartCalculation.subtotal}
                  />

                  <Button className="w-full" size="lg" onClick={handleCheckout}>
                    {isAuthenticated ? "Proceed to Checkout" : "Sign In to Checkout"}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">Secure checkout with SSL encryption</div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={handlePaymentModalClose}
        orderTotal={cartCalculation.finalTotal}
        appliedDiscounts={cartCalculation.discounts}
      />
    </div>
  )
}
