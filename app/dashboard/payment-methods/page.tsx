"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { FaCreditCard, FaPlus, FaEdit, FaTrash } from "react-icons/fa"

interface PaymentMethod {
  id: string
  type: "credit" | "debit" | "paypal"
  cardNumber: string
  expiryDate: string
  cardholderName: string
  isDefault: boolean
  brand: string
}

export default function PaymentMethodsPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState(true)
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingMethod, setEditingMethod] = useState<PaymentMethod | null>(null)
  const [formData, setFormData] = useState({
    type: "credit" as "credit" | "debit" | "paypal",
    cardNumber: "",
    expiryDate: "",
    cardholderName: "",
    cvv: "",
    brand: "Visa",
  })

  useEffect(() => {
    if (user?.id) {
      const storageKey = `paymentMethods_${user.id}`
      const savedMethods = localStorage.getItem(storageKey)

      if (savedMethods) {
        try {
          const parsedMethods = JSON.parse(savedMethods)
          setPaymentMethods(parsedMethods)
          console.log("[v0] Loaded payment methods from storage:", parsedMethods)
        } catch (error) {
          console.error("[v0] Error parsing saved payment methods:", error)
          // Set default payment method if parsing fails
          const defaultMethod: PaymentMethod = {
            id: "1",
            type: "credit",
            cardNumber: "**** **** **** 4242",
            expiryDate: "12/2025",
            cardholderName: user.name || "John Doe",
            isDefault: true,
            brand: "Visa",
          }
          setPaymentMethods([defaultMethod])
          savePaymentMethods([defaultMethod])
        }
      } else {
        // Set default payment method for new users
        const defaultMethod: PaymentMethod = {
          id: "1",
          type: "credit",
          cardNumber: "**** **** **** 4242",
          expiryDate: "12/2025",
          cardholderName: user.name || "John Doe",
          isDefault: true,
          brand: "Visa",
        }
        setPaymentMethods([defaultMethod])
        savePaymentMethods([defaultMethod])
      }
    }
  }, [user?.id, user?.name])

  const savePaymentMethods = (methods: PaymentMethod[]) => {
    if (user?.id) {
      const storageKey = `paymentMethods_${user.id}`
      localStorage.setItem(storageKey, JSON.stringify(methods))
      console.log("[v0] Saved payment methods to storage:", methods)
    }
  }

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        router.push("/auth")
        return
      }
      setPageLoading(false)
    }
  }, [isAuthenticated, user, router, isLoading])

  const maskCardNumber = (cardNumber: string) => {
    const cleaned = cardNumber.replace(/\D/g, "")
    if (cleaned.length <= 4) return cleaned
    return "**** **** **** " + cleaned.slice(-4)
  }

  const validateForm = () => {
    if (formData.type === "paypal") {
      return formData.cardholderName.trim() !== ""
    }
    return (
      formData.cardNumber.replace(/\D/g, "").length >= 13 &&
      formData.expiryDate.match(/^\d{2}\/\d{2}$/) &&
      formData.cardholderName.trim() !== "" &&
      formData.cvv.length >= 3
    )
  }

  const handleAddPaymentMethod = () => {
    if (!validateForm()) {
      alert("Please fill in all required fields correctly")
      return
    }

    const maskedCardNumber = formData.type === "paypal" ? "PayPal Account" : maskCardNumber(formData.cardNumber)
    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: formData.type,
      cardNumber: maskedCardNumber,
      expiryDate: formData.expiryDate,
      cardholderName: formData.cardholderName,
      brand: formData.brand,
      isDefault: paymentMethods.length === 0,
    }

    const updatedMethods = [...paymentMethods, newMethod]
    setPaymentMethods(updatedMethods)
    savePaymentMethods(updatedMethods)

    setFormData({ type: "credit", cardNumber: "", expiryDate: "", cardholderName: "", cvv: "", brand: "Visa" })
    setIsAddDialogOpen(false)
    console.log("[v0] Added new payment method:", newMethod)
  }

  const handleEditPaymentMethod = (method: PaymentMethod) => {
    setEditingMethod(method)
    const cardNumber = method.cardNumber.includes("PayPal")
      ? ""
      : method.cardNumber.replace(/\*/g, "").replace(/\s/g, "")
    setFormData({
      type: method.type,
      cardNumber: cardNumber,
      expiryDate: method.expiryDate,
      cardholderName: method.cardholderName,
      cvv: "",
      brand: method.brand,
    })
    setIsEditDialogOpen(true)
    console.log("[v0] Editing payment method:", method)
  }

  const handleUpdatePaymentMethod = () => {
    if (!editingMethod || !validateForm()) {
      alert("Please fill in all required fields correctly")
      return
    }

    const maskedCardNumber = formData.type === "paypal" ? "PayPal Account" : maskCardNumber(formData.cardNumber)

    const updatedMethods = paymentMethods.map((method) =>
      method.id === editingMethod.id
        ? {
            ...method,
            type: formData.type,
            cardNumber: maskedCardNumber,
            expiryDate: formData.expiryDate,
            cardholderName: formData.cardholderName,
            brand: formData.brand,
          }
        : method,
    )

    setPaymentMethods(updatedMethods)
    savePaymentMethods(updatedMethods)

    setEditingMethod(null)
    setIsEditDialogOpen(false)
    setFormData({ type: "credit", cardNumber: "", expiryDate: "", cardholderName: "", cvv: "", brand: "Visa" })
    console.log("[v0] Updated payment method:", editingMethod.id)
  }

  const handleDeletePaymentMethod = (id: string) => {
    if (!confirm("Are you sure you want to delete this payment method?")) {
      return
    }

    const methodToDelete = paymentMethods.find((method) => method.id === id)
    const updatedMethods = paymentMethods.filter((method) => method.id !== id)

    if (methodToDelete?.isDefault && updatedMethods.length > 0) {
      updatedMethods[0].isDefault = true
    }

    setPaymentMethods(updatedMethods)
    savePaymentMethods(updatedMethods)
    console.log("[v0] Deleted payment method:", id)
  }

  const handleSetDefault = (id: string) => {
    const updatedMethods = paymentMethods.map((method) => ({
      ...method,
      isDefault: method.id === id,
    }))

    setPaymentMethods(updatedMethods)
    savePaymentMethods(updatedMethods)
    console.log("[v0] Set default payment method:", id)
  }

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ")
    return formatted
  }

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, "")
    if (cleaned.length >= 2) {
      return cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4)
    }
    return cleaned
  }

  const PaymentMethodForm = ({ onSubmit, submitText }: { onSubmit: () => void; submitText: string }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="type">Payment Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value: "credit" | "debit" | "paypal") => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="credit">Credit Card</SelectItem>
            <SelectItem value="debit">Debit Card</SelectItem>
            <SelectItem value="paypal">PayPal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.type !== "paypal" && (
        <>
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              value={formData.cardNumber}
              onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input
                id="expiryDate"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: formatExpiryDate(e.target.value) })}
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                type="password"
                value={formData.cvv}
                onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, "") })}
                placeholder="123"
                maxLength={4}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              value={formData.cardholderName}
              onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
              placeholder="John Doe"
            />
          </div>
          <div>
            <Label htmlFor="brand">Card Brand</Label>
            <Select value={formData.brand} onValueChange={(value) => setFormData({ ...formData, brand: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Visa">Visa</SelectItem>
                <SelectItem value="Mastercard">Mastercard</SelectItem>
                <SelectItem value="American Express">American Express</SelectItem>
                <SelectItem value="Discover">Discover</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}

      {formData.type === "paypal" && (
        <div>
          <Label htmlFor="cardholderName">Account Name</Label>
          <Input
            id="cardholderName"
            value={formData.cardholderName}
            onChange={(e) => setFormData({ ...formData, cardholderName: e.target.value })}
            placeholder="Your PayPal account name"
          />
        </div>
      )}

      <Button onClick={onSubmit} className="w-full" disabled={!validateForm()}>
        {submitText}
      </Button>
    </div>
  )

  return (
    <DashboardLayout title="Payment Methods" description="Manage your payment methods and billing information">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">Manage your saved payment methods for faster checkout</p>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <FaPlus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Payment Method</DialogTitle>
              </DialogHeader>
              <PaymentMethodForm onSubmit={handleAddPaymentMethod} submitText="Add Payment Method" />
            </DialogContent>
          </Dialog>
        </div>

        {paymentMethods.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {paymentMethods.map((method) => (
              <Card key={method.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center space-x-2">
                    <FaCreditCard className="h-4 w-4" />
                    <CardTitle className="text-lg">
                      {method.brand} {method.type}
                    </CardTitle>
                    {method.isDefault && <Badge variant="secondary">Default</Badge>}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditPaymentMethod(method)}>
                      <FaEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDeletePaymentMethod(method.id)}
                      disabled={paymentMethods.length === 1}
                    >
                      <FaTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <p className="font-mono text-lg">{method.cardNumber}</p>
                    {method.type !== "paypal" && <p>Expires: {method.expiryDate}</p>}
                    <p>{method.cardholderName}</p>
                  </div>
                  {!method.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 bg-transparent"
                      onClick={() => handleSetDefault(method.id)}
                    >
                      Set as Default
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <FaCreditCard className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No payment methods saved</h3>
              <p className="text-muted-foreground mb-6">Add your first payment method for faster checkout.</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <FaPlus className="h-4 w-4 mr-2" />
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        )}

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Payment Method</DialogTitle>
            </DialogHeader>
            <PaymentMethodForm onSubmit={handleUpdatePaymentMethod} submitText="Update Payment Method" />
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  )
}
