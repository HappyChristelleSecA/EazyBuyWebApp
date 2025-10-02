"use client"

import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PaymentModal } from "@/components/payment/payment-modal"
import { DiscountBanner } from "@/components/discounts/discount-banner"
import { PromoCodeInput } from "@/components/discounts/promo-code-input"
import { BackButton } from "@/components/ui/back-button"
import { FaShoppingCart, FaPlus, FaMinus, FaTrash, FaArrowLeft, FaExclamationTriangle } from "react-icons/fa"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { calculateCartWithDiscounts, incrementDiscountUsage } from "@/lib/discounts"
import { ShippingMethodSelector } from "@/components/cart/shipping-method-selector"
import { getDefaultShippingMethod, calculateShippingCost } from "@/lib/shipping"

export default function CartPage() {
  const { items, itemCount, updateQuantity, removeFromCart, clearCart, validateStock } = useCart()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [appliedDiscountCodes, setAppliedDiscountCodes] = useState<string[]>([])
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentInProgress, setPaymentInProgress] = useState(false)
  const [selectedShippingMethod, setSelectedShippingMethod] = useState(getDefaultShippingMethod().id)
  const [stockValidationResult, setStockValidationResult] = useState<{
    removedItems: any[]
    updatedItems: any[]
  } | null>(null)

  useEffect(() => {
    if (items.length > 0) {
      const result = validateStock()
      if (result.removedItems.length > 0 || result.updatedItems.length > 0) {
        setStockValidationResult(result)
      } else {
        setStockValidationResult(null)
      }
    }
  }, [items, validateStock])

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shippingCost = calculateShippingCost(selectedShippingMethod, subtotal)

  const cartCalculation = calculateCartWithDiscounts(items, appliedDiscountCodes, shippingCost, 0.08)

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

    const stockResult = validateStock()
    if (stockResult.removedItems.length > 0 || stockResult.updatedItems.length > 0) {
      setStockValidationResult(stockResult)
      return
    }

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

  const handleShippingMethodChange = (methodId: string) => {
    setSelectedShippingMethod(methodId)
  }

  const dismissStockAlert = () => {
    setStockValidationResult(null)
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
            <BackButton fallbackUrl="/products" size="lg">
              <FaArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </BackButton>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <BackButton fallbackUrl="/products" className="mb-4">
            Back to Shopping
          </BackButton>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground">{itemCount} items in your cart</p>
        </div>

        <div className="mb-6">
          <DiscountBanner />
        </div>

        {stockValidationResult &&
          (stockValidationResult.removedItems.length > 0 || stockValidationResult.updatedItems.length > 0) && (
            <Alert className="mb-6 border-yellow-200 bg-yellow-50">
              <FaExclamationTriangle className="h-4 w-4 text-yellow-600" />
              <AlertDescription>
                <div className="space-y-2">
                  <p className="font-medium text-yellow-800">Cart Updated Due to Stock Changes</p>
                  {stockValidationResult.removedItems.length > 0 && (
                    <div>
                      <p className="text-sm text-yellow-700">
                        The following items were removed because they're no longer available:
                      </p>
                      <ul className="text-sm text-yellow-700 ml-4 list-disc">
                        {stockValidationResult.removedItems.map((item) => (
                          <li key={item.id}>{item.product.name}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {stockValidationResult.updatedItems.length > 0 && (
                    <div>
                      <p className="text-sm text-yellow-700">
                        The following items had their quantities reduced due to limited stock:
                      </p>
                      <ul className="text-sm text-yellow-700 ml-4 list-disc">
                        {stockValidationResult.updatedItems.map((item) => (
                          <li key={item.id}>
                            {item.product.name} (reduced to {item.quantity})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <Button variant="outline" size="sm" onClick={dismissStockAlert} className="mt-2 bg-transparent">
                    Dismiss
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

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
                            {item.product.outOfOrder && (
                              <Badge variant="destructive" className="mt-2">
                                Out of Order
                              </Badge>
                            )}
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
                <BackButton fallbackUrl="/products" variant="outline">
                  <FaArrowLeft className="mr-2 h-4 w-4" />
                  Continue Shopping
                </BackButton>
                <Button variant="destructive" onClick={clearCart}>
                  Clear Cart
                </Button>
              </div>

              <ShippingMethodSelector
                selectedMethodId={selectedShippingMethod}
                onMethodChange={setSelectedShippingMethod}
                subtotal={subtotal}
              />
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
                    subtotal={subtotal}
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
        selectedShippingMethodId={selectedShippingMethod}
        onShippingMethodChange={handleShippingMethodChange}
      />
    </div>
  )
}
