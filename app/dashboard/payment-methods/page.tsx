"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

const MenuIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
    />
  </svg>
)

const PlusIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
)

const StarIcon = () => (
  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
)

const CreditCardIcon = () => (
  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
    />
  </svg>
)

const LockIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
)

const EditIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
    />
  </svg>
)

const TrashIcon = () => (
  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

interface PaymentMethod {
  id: string
  brand: string
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
  billingAddress?: string
  city?: string
  zipCode?: string
  type: string
  isDefault: boolean
}

const initialPaymentMethods: PaymentMethod[] = [
  {
    id: "1",
    brand: "Visa",
    cardNumber: "************1234",
    expiryDate: "12/24",
    cvv: "***",
    cardholderName: "John Doe",
    billingAddress: "123 Main St",
    city: "Anytown",
    zipCode: "12345",
    type: "credit",
    isDefault: true,
  },
  {
    id: "2",
    brand: "Mastercard",
    cardNumber: "************5678",
    expiryDate: "01/25",
    cvv: "***",
    cardholderName: "Jane Smith",
    billingAddress: "456 Oak Ave",
    city: "Springfield",
    zipCode: "67890",
    type: "credit",
    isDefault: false,
  },
]

const PaymentMethodsPage = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(initialPaymentMethods)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"add" | "edit" | "delete">("add")
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null)
  const [formData, setFormData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
    billingAddress: "",
    city: "",
    zipCode: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = () => {
    if (modalMode === "add") {
      const newMethod: PaymentMethod = {
        id: String(Date.now()), // Simple ID generation
        brand: "Unknown", // You might want to implement brand detection
        cardNumber: formData.cardNumber,
        expiryDate: formData.expiryDate,
        cvv: formData.cvv,
        cardholderName: formData.cardholderName,
        billingAddress: formData.billingAddress,
        city: formData.city,
        zipCode: formData.zipCode,
        type: "credit", // Default type
        isDefault: false,
      }
      setPaymentMethods([...paymentMethods, newMethod])
    } else if (modalMode === "edit" && selectedMethod) {
      const updatedMethods = paymentMethods.map((method) =>
        method.id === selectedMethod.id
          ? {
              ...method,
              cardNumber: formData.cardNumber,
              expiryDate: formData.expiryDate,
              cardholderName: formData.cardholderName,
              billingAddress: formData.billingAddress,
              city: formData.city,
              zipCode: formData.zipCode,
            }
          : method,
      )
      setPaymentMethods(updatedMethods)
    }

    setIsModalOpen(false)
    setSelectedMethod(null)
    setFormData({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
      billingAddress: "",
      city: "",
      zipCode: "",
    })
  }

  const handleDelete = () => {
    if (selectedMethod) {
      const updatedMethods = paymentMethods.filter((method) => method.id !== selectedMethod.id)
      setPaymentMethods(updatedMethods)
      setIsModalOpen(false)
      setSelectedMethod(null)
    }
  }

  const handleSetDefault = (id: string) => {
    const updatedMethods = paymentMethods.map((method) => ({
      ...method,
      isDefault: method.id === id,
    }))
    setPaymentMethods(updatedMethods)
  }

  const openAddModal = () => {
    console.log("[v0] Opening add modal") // Added debug logging
    setModalMode("add")
    setIsModalOpen(true)
    setFormData({
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      cardholderName: "",
      billingAddress: "",
      city: "",
      zipCode: "",
    })
  }

  const openEditModal = (method: PaymentMethod) => {
    console.log("[v0] Opening edit modal for method:", method.id) // Added debug logging
    setModalMode("edit")
    setIsModalOpen(true)
    setSelectedMethod(method)
    setFormData({
      cardNumber: method.cardNumber.replace(/\*/g, "").replace(/\s/g, ""), // Remove masking for editing
      expiryDate: method.expiryDate,
      cvv: "",
      cardholderName: method.cardholderName,
      billingAddress: method.billingAddress || "",
      city: method.city || "",
      zipCode: method.zipCode || "",
    })
  }

  const openDeleteModal = (method: PaymentMethod) => {
    console.log("[v0] Opening delete modal for method:", method.id) // Added debug logging
    setModalMode("delete")
    setIsModalOpen(true)
    setSelectedMethod(method)
  }

  return (
    <div className="container py-12">
      <h1 className="text-3xl font-semibold mb-6">Payment Methods</h1>

      <Alert>
        <AlertDescription>
          <strong className="font-medium">Important!</strong> For security reasons, we only display the last 4 digits of
          your card number.
        </AlertDescription>
      </Alert>

      <div className="mt-8">
        <div className="flex justify-between items-center mb-8">
          <p className="text-gray-600">Securely store your payment methods for faster checkout</p>
          <Button onClick={openAddModal} className="flex items-center gap-2">
            <PlusIcon />
            Add Payment Method
          </Button>
        </div>

        {paymentMethods.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CreditCardIcon />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No Payment Methods</h3>
              <p className="text-gray-600 mb-6">Add a payment method to get started with faster checkout</p>
              <Button onClick={openAddModal} className="flex items-center gap-2 mx-auto">
                <PlusIcon />
                Add Your First Payment Method
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {paymentMethods.map((method) => (
              <Card key={method.id} className="relative">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-3">
                      <CreditCardIcon />
                      <div>
                        <h3 className="text-lg font-semibold">
                          {method.brand} {method.cardNumber}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          {method.isDefault && (
                            <Badge variant="default" className="bg-blue-100 text-blue-800">
                              <StarIcon />
                              Default
                            </Badge>
                          )}
                          <Badge variant="outline">{method.type.toUpperCase()}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => openEditModal(method)}
                        title="Edit Payment Method"
                      >
                        <EditIcon />
                      </Button>
                      {!method.isDefault && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleSetDefault(method.id)}
                          title="Set as Default"
                        >
                          <StarIcon />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600 hover:text-red-600"
                        onClick={() => openDeleteModal(method)}
                        title="Delete Payment Method"
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  </div>

                  <p className="text-sm text-gray-500">Expires: {method.expiryDate}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CreditCardIcon />
              {modalMode === "add"
                ? "Add Payment Method"
                : modalMode === "edit"
                  ? "Edit Payment Method"
                  : "Delete Payment Method"}
            </DialogTitle>
          </DialogHeader>

          {modalMode === "delete" ? (
            <div className="grid gap-4 py-4">
              <p>Are you sure you want to delete this payment method?</p>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-4 py-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    type="text"
                    id="cardNumber"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input type="text" id="cvv" name="cvv" value={formData.cvv} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="cardholderName">Cardholder Name</Label>
                  <Input
                    type="text"
                    id="cardholderName"
                    name="cardholderName"
                    value={formData.cardholderName}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="billingAddress">Billing Address</Label>
                  <Input
                    type="text"
                    id="billingAddress"
                    name="billingAddress"
                    value={formData.billingAddress}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <Label htmlFor="city">City</Label>
                  <Input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} />
                </div>
                <div>
                  <Label htmlFor="zipCode">Zip Code</Label>
                  <Input
                    type="text"
                    id="zipCode"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <LockIcon />
                Your payment information is secure and encrypted
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="button" onClick={handleSubmit}>
                  {modalMode === "add" ? "Add Payment Method" : "Save Changes"}
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default PaymentMethodsPage
