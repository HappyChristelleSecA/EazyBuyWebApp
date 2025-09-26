"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FaCreditCard, FaLock, FaCheckCircle, FaTag, FaExclamationTriangle } from "react-icons/fa"
import { useCart } from "@/hooks/use-cart"
import { useAuth } from "@/hooks/use-auth"
import { createOrder } from "@/lib/orders"
import { getShippingMethodById } from "@/lib/shipping"
import type { DiscountApplication } from "@/lib/discounts"
import { Badge } from "@/components/ui/badge"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  orderTotal: number
  appliedDiscounts?: DiscountApplication[]
  selectedShippingMethodId?: string
}

export function PaymentModal({
  isOpen,
  onClose,
  orderTotal,
  appliedDiscounts = [],
  selectedShippingMethodId = "standard",
}: PaymentModalProps) {
  const { items, clearCart, validateStock } = useCart()
  const { user } = useAuth()
  const [step, setStep] = useState<"payment" | "success">("payment")
  const [isProcessing, setIsProcessing] = useState(false)
  const [receiptNumber, setReceiptNumber] = useState("")
  const [purchasedItems, setPurchasedItems] = useState<typeof items>([])
  const [stockValidationError, setStockValidationError] = useState<{ removedItems: any[]; updatedItems: any[] } | null>(
    null,
  )

  const [paymentData, setPaymentData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: "",
    city: "",
    zipCode: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setPaymentData((prev) => ({ ...prev, [field]: value }))
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  const generateReceiptNumber = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const numbers = "0123456789"
    let result = ""

    // Generate 3 letters
    for (let i = 0; i < 3; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length))
    }

    // Add separator
    result += "-"

    // Generate 4 numbers
    for (let i = 0; i < 4; i++) {
      result += numbers.charAt(Math.floor(Math.random() * numbers.length))
    }

    // Add separator
    result += "-"

    // Generate 2 letters
    for (let i = 0; i < 2; i++) {
      result += letters.charAt(Math.floor(Math.random() * letters.length))
    }

    return result
  }

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.13
  }

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const totalDiscountAmount = appliedDiscounts.reduce((sum, discount) => sum + discount.discountAmount, 0)
  const tax = calculateTax(subtotal - totalDiscountAmount)
  const total = orderTotal

  const isCartEmpty = items.length === 0 || subtotal === 0

  const processPayment = async () => {
    if (isCartEmpty || !user) {
      return
    }

    const stockResult = validateStock()
    if (stockResult.removedItems.length > 0 || stockResult.updatedItems.length > 0) {
      setStockValidationError(stockResult)
      return
    }

    setIsProcessing(true)

    console.log("[v0] Items before storing:", items)
    setPurchasedItems([...items])
    console.log("[v0] Purchased items set:", [...items])

    await new Promise((resolve) => setTimeout(resolve, 2000))

    const receipt = generateReceiptNumber()
    setReceiptNumber(receipt)

    try {
      const orderItems = items.map((item) => ({
        id: item.id,
        product: item.product,
        quantity: item.quantity,
        price: item.product.price,
      }))

      const shippingMethod = getShippingMethodById(selectedShippingMethodId)

      const newOrder = createOrder({
        userId: user.id,
        items: orderItems,
        subtotal: subtotal - totalDiscountAmount,
        tax: tax,
        total: total,
        shippingAddress: {
          name: paymentData.cardholderName || user.name || "Customer",
          street: paymentData.billingAddress || "123 Main St",
          city: paymentData.city || "New York",
          state: "NY",
          zipCode: paymentData.zipCode || "10001",
          country: "USA",
        },
        appliedDiscounts: appliedDiscounts.map((d) => ({ code: d.discountCode, amount: d.discountAmount })),
        shippingMethod: shippingMethod
          ? {
              id: shippingMethod.id,
              name: shippingMethod.name,
              cost: shippingMethod.price,
              estimatedDays: shippingMethod.estimatedDays,
            }
          : undefined,
      })

      console.log("[v0] Order created:", newOrder.id)
    } catch (error) {
      console.error("[v0] Error creating order:", error)
    }

    setStep("success")

    console.log("[v0] Clearing cart after success step")
    clearCart()
    setIsProcessing(false)
  }

  const downloadReceipt = () => {
    const itemsForReceipt = purchasedItems.length > 0 ? purchasedItems : items
    const receiptSubtotal = itemsForReceipt.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const receiptTax = calculateTax(receiptSubtotal - totalDiscountAmount)
    const receiptTotal = total

    const receiptData = {
      receiptNumber,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      subtotal: receiptSubtotal.toFixed(2),
      discounts: totalDiscountAmount.toFixed(2),
      tax: receiptTax.toFixed(2),
      total: receiptTotal.toFixed(2),
      paymentMethod: `**** **** **** ${paymentData.cardNumber.slice(-4)}`,
      status: "PAID",
    }

    let receiptText = `
EAZYBUY RECEIPT
================
Receipt #: ${receiptData.receiptNumber}
Date: ${receiptData.date}
Time: ${receiptData.time}

ITEMS PURCHASED:
----------------
`

    itemsForReceipt.forEach((item) => {
      receiptText += `${item.product.name} x${item.quantity} - $${(item.product.price * item.quantity).toFixed(2)}\n`
    })

    receiptText += `
----------------
Subtotal: $${receiptData.subtotal}
`

    if (appliedDiscounts.length > 0) {
      receiptText += `Discounts Applied:\n`
      appliedDiscounts.forEach((discount) => {
        receiptText += `  ${discount.discountCode}: -$${discount.discountAmount.toFixed(2)}\n`
      })
      receiptText += `Total Discounts: -$${receiptData.discounts}\n`
    }

    receiptText += `Tax (13%): $${receiptData.tax}
Total: $${receiptData.total}

Payment Method: ${receiptData.paymentMethod}
Status: ${receiptData.status}

Thank you for shopping with EazyBuy!
================
    `

    const blob = new Blob([receiptText], { type: "text/plain" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `EazyBuy-Receipt-${receiptNumber}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  const printReceipt = () => {
    const itemsForReceipt = purchasedItems.length > 0 ? purchasedItems : items
    const receiptSubtotal = itemsForReceipt.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const receiptTax = calculateTax(receiptSubtotal - totalDiscountAmount)
    const receiptTotal = total

    const printWindow = window.open("", "_blank")
    if (!printWindow) return

    const discountSection =
      appliedDiscounts.length > 0
        ? `
      <div class="discounts">
        <h4>Discounts Applied:</h4>
        ${appliedDiscounts
          .map(
            (discount) => `
          <div class="item">
            <span>${discount.discountCode}</span>
            <span>-$${discount.discountAmount.toFixed(2)}</span>
          </div>
        `,
          )
          .join("")}
      </div>
    `
        : ""

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>EazyBuy Receipt - ${receiptNumber}</title>
          <style>
            body { font-family: monospace; max-width: 400px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 20px; }
            .item { display: flex; justify-content: space-between; margin: 5px 0; }
            .discounts { margin: 10px 0; padding: 10px; background: #f0f0f0; }
            .total-section { border-top: 1px solid #000; padding-top: 10px; margin-top: 10px; }
            .total { font-weight: bold; font-size: 1.1em; }
            .footer { text-align: center; margin-top: 20px; border-top: 2px solid #000; padding-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>EAZYBUY RECEIPT</h2>
            <p>Receipt #: ${receiptNumber}</p>
            <p>${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
          </div>
          
          <div class="items">
            <h3>ITEMS PURCHASED:</h3>
            ${itemsForReceipt
              .map(
                (item) => `
              <div class="item">
                <span>${item.product.name} x${item.quantity}</span>
                <span>$${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            `,
              )
              .join("")}
          </div>
          
          ${discountSection}
          
          <div class="total-section">
            <div class="item">
              <span>Subtotal:</span>
              <span>$${receiptSubtotal.toFixed(2)}</span>
            </div>
            ${
              appliedDiscounts.length > 0
                ? `
              <div class="item">
                <span>Total Discounts:</span>
                <span>-$${totalDiscountAmount.toFixed(2)}</span>
              </div>
            `
                : ""
            }
            <div class="item">
              <span>Tax (13%):</span>
              <span>$${receiptTax.toFixed(2)}</span>
            </div>
            <div class="item total">
              <span>Total:</span>
              <span>$${receiptTotal.toFixed(2)}</span>
            </div>
          </div>
          
          <div class="footer">
            <p>Payment Method: **** **** **** ${paymentData.cardNumber.slice(-4)}</p>
            <p>Status: PAID</p>
            <p>Thank you for shopping with EazyBuy!</p>
          </div>
        </body>
      </html>
    `

    printWindow.document.write(receiptHTML)
    printWindow.document.close()
    printWindow.print()
  }

  const handleClose = () => {
    setStep("payment")
    setPurchasedItems([])
    setStockValidationError(null)
    setPaymentData({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
      billingAddress: "",
      city: "",
      zipCode: "",
    })
    setReceiptNumber("")
    onClose()
  }

  const displayItems = purchasedItems.length > 0 ? purchasedItems : items
  console.log("[v0] Display items:", displayItems)
  console.log("[v0] Current step:", step)
  console.log("[v0] Purchased items length:", purchasedItems.length)

  const displaySubtotal = displayItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
  const shippingMethod = getShippingMethodById(selectedShippingMethodId)
  const shippingCost = shippingMethod
    ? selectedShippingMethodId === "standard" && displaySubtotal >= 50
      ? 0
      : shippingMethod.price
    : 0
  const displayTax = calculateTax(displaySubtotal - totalDiscountAmount)
  const displayTotal = displaySubtotal - totalDiscountAmount + displayTax + shippingCost

  console.log("[v0] Display calculations:", { displaySubtotal, displayTax, displayTotal, shippingCost })

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        {step === "payment" ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FaCreditCard className="h-5 w-5" />
                Payment Details
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {stockValidationError && (
                <Alert className="border-red-200 bg-red-50">
                  <FaExclamationTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription>
                    <div className="space-y-2">
                      <p className="font-medium text-red-800">Cannot Process Payment - Stock Issues</p>
                      {stockValidationError.removedItems.length > 0 && (
                        <div>
                          <p className="text-sm text-red-700">These items are no longer available:</p>
                          <ul className="text-sm text-red-700 ml-4 list-disc">
                            {stockValidationError.removedItems.map((item) => (
                              <li key={item.id}>{item.product.name}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {stockValidationError.updatedItems.length > 0 && (
                        <div>
                          <p className="text-sm text-red-700">These items have limited stock:</p>
                          <ul className="text-sm text-red-700 ml-4 list-disc">
                            {stockValidationError.updatedItems.map((item) => (
                              <li key={item.id}>
                                {item.product.name} (only {item.quantity} available)
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      <p className="text-sm text-red-700">Please return to your cart to review the changes.</p>
                      <Button variant="outline" size="sm" onClick={handleClose} className="mt-2 bg-transparent">
                        Return to Cart
                      </Button>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {isCartEmpty ? (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-muted-foreground mb-4">
                      Your cart is empty. Please add items before proceeding to payment.
                    </p>
                    <Button onClick={handleClose} className="w-full">
                      Continue Shopping
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <>
                  <Card>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">Subtotal</span>
                          <span>${subtotal.toFixed(2)}</span>
                        </div>

                        {(() => {
                          const shippingMethod = getShippingMethodById(selectedShippingMethodId)
                          const shippingCost = shippingMethod
                            ? selectedShippingMethodId === "standard" && subtotal >= 50
                              ? 0
                              : shippingMethod.price
                            : 0

                          return (
                            <div className="flex justify-between items-center">
                              <div className="flex flex-col">
                                <span className="font-medium">Shipping</span>
                                <span className="text-xs text-muted-foreground">
                                  {shippingMethod?.name} ({shippingMethod?.estimatedDays})
                                </span>
                              </div>
                              <span>
                                {shippingCost === 0 && shippingMethod?.price > 0 ? (
                                  <div className="text-right">
                                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                                      FREE
                                    </Badge>
                                    <div className="text-xs text-muted-foreground line-through">
                                      ${shippingMethod.price.toFixed(2)}
                                    </div>
                                  </div>
                                ) : (
                                  `$${shippingCost.toFixed(2)}`
                                )}
                              </span>
                            </div>
                          )
                        })()}

                        {/* Display applied discounts in payment modal */}
                        {appliedDiscounts.map((discount) => (
                          <div key={discount.discountId} className="flex justify-between items-center text-green-600">
                            <div className="flex items-center space-x-1">
                              <FaTag className="h-3 w-3" />
                              <span className="text-sm">{discount.discountCode}</span>
                            </div>
                            <span>-${discount.discountAmount.toFixed(2)}</span>
                          </div>
                        ))}

                        <div className="flex justify-between items-center">
                          <span className="font-medium">Tax (13%)</span>
                          <span>${tax.toFixed(2)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="font-bold">Total Amount</span>
                          <span className="text-xl font-bold text-primary">${total.toFixed(2)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        value={paymentData.cardNumber}
                        onChange={(e) => handleInputChange("cardNumber", formatCardNumber(e.target.value))}
                        maxLength={19}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          placeholder="MM/YY"
                          value={paymentData.expiryDate}
                          onChange={(e) => handleInputChange("expiryDate", formatExpiryDate(e.target.value))}
                          maxLength={5}
                        />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          placeholder="123"
                          value={paymentData.cvv}
                          onChange={(e) => handleInputChange("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))}
                          maxLength={4}
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="cardholderName">Cardholder Name</Label>
                      <Input
                        id="cardholderName"
                        placeholder="John Doe"
                        value={paymentData.cardholderName}
                        onChange={(e) => handleInputChange("cardholderName", e.target.value)}
                      />
                    </div>

                    <Separator />

                    <div>
                      <Label htmlFor="billingAddress">Billing Address</Label>
                      <Input
                        id="billingAddress"
                        placeholder="123 Main Street"
                        value={paymentData.billingAddress}
                        onChange={(e) => handleInputChange("billingAddress", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          placeholder="New York"
                          value={paymentData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          placeholder="10001"
                          value={paymentData.zipCode}
                          onChange={(e) => handleInputChange("zipCode", e.target.value.replace(/\D/g, "").slice(0, 5))}
                          maxLength={5}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FaLock className="h-4 w-4" />
                    Your payment information is secure and encrypted
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent">
                      Cancel
                    </Button>
                    <Button
                      onClick={processPayment}
                      disabled={
                        isProcessing ||
                        !paymentData.cardNumber ||
                        !paymentData.cardholderName ||
                        isCartEmpty ||
                        stockValidationError !== null
                      }
                      className="flex-1"
                    >
                      {isProcessing ? "Processing..." : "Pay Now"}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-green-600">
                <FaCheckCircle className="h-5 w-5" />
                Payment Successful!
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="text-center">
                <p className="text-muted-foreground">Your payment has been processed successfully.</p>
              </div>

              <Card>
                <CardContent className="p-4">
                  <h3 className="font-semibold mb-3">Order Details</h3>
                  <div className="space-y-2">
                    {displayItems.map((item) => (
                      <div key={item.product.id} className="flex justify-between items-center text-sm">
                        <span>
                          {item.product.name} x{item.quantity}
                        </span>
                        <span>${(item.product.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span>Subtotal:</span>
                      <span>${displaySubtotal.toFixed(2)}</span>
                    </div>

                    {appliedDiscounts.map((discount) => (
                      <div key={discount.discountId} className="flex justify-between items-center text-green-600">
                        <div className="flex items-center space-x-1">
                          <FaTag className="h-3 w-3" />
                          <span className="text-sm">{discount.discountCode}</span>
                        </div>
                        <span>-${discount.discountAmount.toFixed(2)}</span>
                      </div>
                    ))}

                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span>Shipping:</span>
                        <span className="text-xs text-muted-foreground">
                          {shippingMethod?.name} ({shippingMethod?.estimatedDays})
                        </span>
                      </div>
                      <span>
                        {shippingCost === 0 && shippingMethod?.price > 0 ? (
                          <div className="text-right">
                            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                              FREE
                            </Badge>
                            <div className="text-xs text-muted-foreground line-through">
                              ${shippingMethod.price.toFixed(2)}
                            </div>
                          </div>
                        ) : (
                          `$${shippingCost.toFixed(2)}`
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span>Tax (13%):</span>
                      <span>${displayTax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center font-bold">
                      <span>Total:</span>
                      <span>${displayTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Receipt Number:</span>
                      <span className="font-mono">{receiptNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Date:</span>
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Time:</span>
                      <span>{new Date().toLocaleTimeString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-2">
                <Button variant="outline" onClick={printReceipt} className="flex-1 bg-transparent">
                  Print Receipt
                </Button>
                <Button variant="outline" onClick={downloadReceipt} className="flex-1 bg-transparent">
                  Download Receipt
                </Button>
              </div>

              <Button onClick={handleClose} className="w-full">
                Continue Shopping
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
