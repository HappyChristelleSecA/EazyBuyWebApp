"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FaCreditCard, FaPlus, FaEdit, FaTrash, FaStar } from "react-icons/fa"
import { useToast } from "@/hooks/use-toast"

interface PaymentMethod {
  id: string
  type: "card" | "paypal"
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
  cardholderName?: string
}

const STORAGE_KEY = "eazybuy_payment_methods"

export default function PaymentPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(() => {
    console.log("[v0] Initializing payment methods state...")
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(STORAGE_KEY)
      console.log("[v0] localStorage raw value:", stored)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          console.log("[v0] Successfully loaded payment methods from localStorage:", parsed)
          return parsed
        } catch (e) {
          console.error("[v0] Failed to parse stored payment methods:", e)
        }
      } else {
        console.log("[v0] No payment methods found in localStorage, using defaults")
      }
    } else {
      console.log("[v0] Window is undefined, cannot access localStorage")
    }
    const defaultMethods = [
      {
        id: "1",
        type: "card" as const,
        last4: "4242",
        brand: "Visa",
        expiryMonth: 12,
        expiryYear: 2025,
        isDefault: true,
        cardholderName: "John Doe",
      },
    ]
    console.log("[v0] Returning default payment methods:", defaultMethods)
    return defaultMethods
  })

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState({
    cardholderName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    brand: "Visa",
  })

  const validateAddForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.cardholderName.trim()) {
      errors.cardholderName = "Cardholder name is required"
    } else if (formData.cardholderName.trim().length < 2) {
      errors.cardholderName = "Cardholder name must be at least 2 characters"
    }

    if (!formData.cardNumber.trim()) {
      errors.cardNumber = "Card number is required"
    } else if (formData.cardNumber.replace(/\s/g, "").length < 13) {
      errors.cardNumber = "Card number must be at least 13 digits"
    }

    if (!formData.expiryMonth) {
      errors.expiryMonth = "Expiry month is required"
    }

    if (!formData.expiryYear) {
      errors.expiryYear = "Expiry year is required"
    } else {
      const currentYear = new Date().getFullYear()
      const currentMonth = new Date().getMonth() + 1
      const selectedYear = Number.parseInt(formData.expiryYear)
      const selectedMonth = Number.parseInt(formData.expiryMonth)

      if (selectedYear < currentYear || (selectedYear === currentYear && selectedMonth < currentMonth)) {
        errors.expiryYear = "Card has expired"
      }
    }

    if (!formData.cvv.trim()) {
      errors.cvv = "CVV is required"
    } else if (formData.cvv.length < 3 || formData.cvv.length > 4) {
      errors.cvv = "CVV must be 3 or 4 digits"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const validateEditForm = () => {
    const errors: Record<string, string> = {}

    if (!formData.cardholderName.trim()) {
      errors.cardholderName = "Cardholder name is required"
    } else if (formData.cardholderName.trim().length < 2) {
      errors.cardholderName = "Cardholder name must be at least 2 characters"
    }

    if (!formData.expiryMonth) {
      errors.expiryMonth = "Expiry month is required"
    }

    if (!formData.expiryYear) {
      errors.expiryYear = "Expiry year is required"
    } else {
      const currentYear = new Date().getFullYear()
      const currentMonth = new Date().getMonth() + 1
      const selectedYear = Number.parseInt(formData.expiryYear)
      const selectedMonth = Number.parseInt(formData.expiryMonth)

      if (selectedYear < currentYear || (selectedYear === currentYear && selectedMonth < currentMonth)) {
        errors.expiryYear = "Card has expired"
      }
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
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

  const detectCardBrand = (cardNumber: string) => {
    const number = cardNumber.replace(/\s/g, "")
    if (number.startsWith("4")) return "Visa"
    if (number.startsWith("5") || number.startsWith("2")) return "Mastercard"
    if (number.startsWith("3")) return "American Express"
    return "Visa"
  }

  const handleEditPayment = (id: string) => {
    console.log("[v0] Edit payment method:", id)
    const method = paymentMethods.find((m) => m.id === id)
    if (method) {
      setSelectedPaymentMethod(method)
      setFormData({
        cardholderName: method.cardholderName || "",
        cardNumber: `****${method.last4}`,
        expiryMonth: method.expiryMonth?.toString().padStart(2, "0") || "",
        expiryYear: method.expiryYear?.toString() || "",
        cvv: "",
        brand: method.brand || "Visa",
      })
      setFormErrors({})
      setIsEditModalOpen(true)
    }
  }

  const handleDeletePayment = (id: string) => {
    console.log("[v0] Delete payment method:", id)
    const method = paymentMethods.find((m) => m.id === id)
    if (method) {
      setSelectedPaymentMethod(method)
      setIsDeleteModalOpen(true)
    }
  }

  const handleSetDefault = (id: string) => {
    console.log("[v0] Set as default:", id)
    setPaymentMethods((prev) =>
      prev.map((method) => ({
        ...method,
        isDefault: method.id === id,
      })),
    )
    toast({
      title: "Default payment method updated",
      description: "Your default payment method has been changed successfully.",
    })
  }

  const handleAddPayment = () => {
    setFormData({
      cardholderName: "",
      cardNumber: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      brand: "Visa",
    })
    setFormErrors({})
    setIsAddModalOpen(true)
  }

  const handleSavePayment = () => {
    console.log("[v0] Save payment method clicked, selectedPaymentMethod:", selectedPaymentMethod)

    const isValid = selectedPaymentMethod ? validateEditForm() : validateAddForm()

    if (!isValid) {
      console.log("[v0] Validation failed, errors:", formErrors)
      toast({
        title: "Please fix the errors",
        description: "Please correct the highlighted fields before saving.",
        variant: "destructive",
      })
      return
    }

    console.log("[v0] Validation passed, proceeding with save")

    if (selectedPaymentMethod) {
      console.log("[v0] Updating existing payment method")
      setPaymentMethods((prev) =>
        prev.map((method) =>
          method.id === selectedPaymentMethod.id
            ? {
                ...method,
                cardholderName: formData.cardholderName.trim(),
                brand: formData.brand,
                expiryMonth: Number.parseInt(formData.expiryMonth),
                expiryYear: Number.parseInt(formData.expiryYear),
              }
            : method,
        ),
      )
      setIsEditModalOpen(false)
      toast({
        title: "Payment method updated",
        description: "Your payment method has been updated successfully.",
      })
    } else {
      console.log("[v0] Adding new payment method")
      const newMethod: PaymentMethod = {
        id: Date.now().toString(),
        type: "card",
        last4: formData.cardNumber.replace(/\s/g, "").slice(-4),
        brand: detectCardBrand(formData.cardNumber),
        expiryMonth: Number.parseInt(formData.expiryMonth),
        expiryYear: Number.parseInt(formData.expiryYear),
        isDefault: paymentMethods.length === 0,
        cardholderName: formData.cardholderName.trim(),
      }
      console.log("[v0] New payment method created:", newMethod)
      setPaymentMethods((prev) => [...prev, newMethod])
      setIsAddModalOpen(false)
      toast({
        title: "Payment method added",
        description: "Your new payment method has been added successfully.",
      })
    }
    setSelectedPaymentMethod(null)
    console.log("[v0] Payment method save completed")
  }

  const handleConfirmDelete = () => {
    if (selectedPaymentMethod) {
      setPaymentMethods((prev) => prev.filter((method) => method.id !== selectedPaymentMethod.id))
      setIsDeleteModalOpen(false)
      setSelectedPaymentMethod(null)
      toast({
        title: "Payment method deleted",
        description: "Your payment method has been removed successfully.",
      })
    }
  }

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value)
    const brand = detectCardBrand(formatted)
    setFormData((prev) => ({ ...prev, cardNumber: formatted, brand }))
    if (formErrors.cardNumber) {
      setFormErrors((prev) => ({ ...prev, cardNumber: "" }))
    }
  }

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "")
    setFormData((prev) => ({ ...prev, cvv: value }))
    if (formErrors.cvv) {
      setFormErrors((prev) => ({ ...prev, cvv: "" }))
    }
  }

  const handleCardholderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, cardholderName: e.target.value }))
    if (formErrors.cardholderName) {
      setFormErrors((prev) => ({ ...prev, cardholderName: "" }))
    }
  }

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push("/auth")
    }
  }, [isAuthenticated, user, isLoading, router])

  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("[v0] Saving payment methods to localStorage, count:", paymentMethods.length)
      console.log("[v0] Payment methods data:", JSON.stringify(paymentMethods))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(paymentMethods))
      console.log("[v0] Payment methods saved successfully")
      // Verify the save
      const verification = localStorage.getItem(STORAGE_KEY)
      console.log("[v0] Verification - localStorage now contains:", verification)
    }
  }, [paymentMethods])

  if (isLoading) {
    return (
      <DashboardLayout title="Payment Methods" description="Manage your payment methods and billing information">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading payment methods...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!isAuthenticated || !user) {
    return null
  }

  return (
    <DashboardLayout title="Payment Methods" description="Manage your payment methods and billing information">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">Securely store your payment methods for faster checkout</p>
          <Button onClick={handleAddPayment}>
            <FaPlus className="h-4 w-4 mr-2" />
            Add Payment Method
          </Button>
        </div>

        {paymentMethods.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {paymentMethods.map((method) => (
              <Card key={method.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center space-x-2">
                    <FaCreditCard className="h-4 w-4" />
                    <CardTitle className="text-lg">
                      {method.brand} •••• {method.last4}
                    </CardTitle>
                    {method.isDefault && <Badge variant="secondary">Default</Badge>}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditPayment(method.id)}
                      title="Edit Payment Method"
                    >
                      <FaEdit className="h-4 w-4" />
                    </Button>
                    {!method.isDefault && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleSetDefault(method.id)}
                        title="Set as Default"
                      >
                        <FaStar className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => handleDeletePayment(method.id)}
                      title="Delete Payment Method"
                    >
                      <FaTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <p>
                      Expires {method.expiryMonth?.toString().padStart(2, "0") || "00"}/{method.expiryYear || "0000"}
                    </p>
                    {method.cardholderName && <p className="mt-1">{method.cardholderName}</p>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FaCreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No payment methods saved</h3>
              <p className="text-muted-foreground mb-6">Add a payment method for faster and secure checkout.</p>
              <Button onClick={handleAddPayment}>
                <FaPlus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>Add a new payment method to your account for faster checkout.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cardholderName">Cardholder Name *</Label>
              <Input
                id="cardholderName"
                value={formData.cardholderName}
                onChange={handleCardholderNameChange}
                placeholder="John Doe"
                className={formErrors.cardholderName ? "border-destructive" : ""}
              />
              {formErrors.cardholderName && <p className="text-sm text-destructive">{formErrors.cardholderName}</p>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="cardNumber">Card Number *</Label>
              <Input
                id="cardNumber"
                value={formData.cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className={formErrors.cardNumber ? "border-destructive" : ""}
              />
              {formErrors.cardNumber && <p className="text-sm text-destructive">{formErrors.cardNumber}</p>}
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="expiryMonth">Month *</Label>
                <Select
                  value={formData.expiryMonth}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, expiryMonth: value }))
                    if (formErrors.expiryMonth) {
                      setFormErrors((prev) => ({ ...prev, expiryMonth: "" }))
                    }
                  }}
                >
                  <SelectTrigger className={formErrors.expiryMonth ? "border-destructive" : ""}>
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                        {(i + 1).toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.expiryMonth && <p className="text-xs text-destructive">{formErrors.expiryMonth}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="expiryYear">Year *</Label>
                <Select
                  value={formData.expiryYear}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, expiryYear: value }))
                    if (formErrors.expiryYear) {
                      setFormErrors((prev) => ({ ...prev, expiryYear: "" }))
                    }
                  }}
                >
                  <SelectTrigger className={formErrors.expiryYear ? "border-destructive" : ""}>
                    <SelectValue placeholder="YYYY" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => (
                      <SelectItem key={2024 + i} value={(2024 + i).toString()}>
                        {2024 + i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.expiryYear && <p className="text-xs text-destructive">{formErrors.expiryYear}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="cvv">CVV *</Label>
                <Input
                  id="cvv"
                  value={formData.cvv}
                  onChange={handleCvvChange}
                  placeholder="123"
                  maxLength={4}
                  className={formErrors.cvv ? "border-destructive" : ""}
                />
                {formErrors.cvv && <p className="text-xs text-destructive">{formErrors.cvv}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePayment}>Add Payment Method</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Payment Method</DialogTitle>
            <DialogDescription>Update your payment method information.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="editCardholderName">Cardholder Name *</Label>
              <Input
                id="editCardholderName"
                value={formData.cardholderName}
                onChange={handleCardholderNameChange}
                placeholder="John Doe"
                className={formErrors.cardholderName ? "border-destructive" : ""}
              />
              {formErrors.cardholderName && <p className="text-sm text-destructive">{formErrors.cardholderName}</p>}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="editExpiryMonth">Expiry Month *</Label>
                <Select
                  value={formData.expiryMonth}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, expiryMonth: value }))
                    if (formErrors.expiryMonth) {
                      setFormErrors((prev) => ({ ...prev, expiryMonth: "" }))
                    }
                  }}
                >
                  <SelectTrigger className={formErrors.expiryMonth ? "border-destructive" : ""}>
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 12 }, (_, i) => (
                      <SelectItem key={i + 1} value={(i + 1).toString().padStart(2, "0")}>
                        {(i + 1).toString().padStart(2, "0")}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.expiryMonth && <p className="text-xs text-destructive">{formErrors.expiryMonth}</p>}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="editExpiryYear">Expiry Year *</Label>
                <Select
                  value={formData.expiryYear}
                  onValueChange={(value) => {
                    setFormData((prev) => ({ ...prev, expiryYear: value }))
                    if (formErrors.expiryYear) {
                      setFormErrors((prev) => ({ ...prev, expiryYear: "" }))
                    }
                  }}
                >
                  <SelectTrigger className={formErrors.expiryYear ? "border-destructive" : ""}>
                    <SelectValue placeholder="YYYY" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 10 }, (_, i) => (
                      <SelectItem key={2024 + i} value={(2024 + i).toString()}>
                        {2024 + i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formErrors.expiryYear && <p className="text-xs text-destructive">{formErrors.expiryYear}</p>}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSavePayment}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Payment Method</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this payment method? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedPaymentMethod && (
            <div className="py-4">
              <div className="flex items-center space-x-2 p-3 border rounded-lg">
                <FaCreditCard className="h-4 w-4" />
                <span className="font-medium">
                  {selectedPaymentMethod.brand} •••• {selectedPaymentMethod.last4}
                </span>
                {selectedPaymentMethod.isDefault && <Badge variant="secondary">Default</Badge>}
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete Payment Method
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
