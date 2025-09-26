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
import { FaMapMarkerAlt, FaPlus, FaEdit, FaTrash } from "react-icons/fa"

interface Address {
  id: string
  name: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  isDefault: boolean
}

export default function AddressesPage() {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [pageLoading, setPageLoading] = useState(true)
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: "1",
      name: "Home",
      street: "123 Main St",
      city: "Toronto",
      state: "ON",
      zipCode: "M5V 3A8",
      country: "Canada",
      isDefault: true,
    },
  ])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingAddress, setEditingAddress] = useState<Address | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "Canada",
  })

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated || !user) {
        router.push("/auth")
        return
      }
      setPageLoading(false)
    }
  }, [isAuthenticated, user, router, isLoading])

  const handleAddAddress = () => {
    const newAddress: Address = {
      id: Date.now().toString(),
      ...formData,
      isDefault: addresses.length === 0,
    }
    setAddresses([...addresses, newAddress])
    setFormData({ name: "", street: "", city: "", state: "", zipCode: "", country: "Canada" })
    setIsAddDialogOpen(false)
  }

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address)
    setFormData({
      name: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdateAddress = () => {
    if (!editingAddress) return
    setAddresses(addresses.map((addr) => (addr.id === editingAddress.id ? { ...addr, ...formData } : addr)))
    setEditingAddress(null)
    setFormData({ name: "", street: "", city: "", state: "", zipCode: "", country: "Canada" })
    setIsEditDialogOpen(false)
  }

  const handleDeleteAddress = (id: string) => {
    const addressToDelete = addresses.find((addr) => addr.id === id)
    const updatedAddresses = addresses.filter((addr) => addr.id !== id)

    if (addressToDelete?.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true
    }

    setAddresses(updatedAddresses)
  }

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      })),
    )
  }

  if (isLoading || pageLoading) {
    return (
      <DashboardLayout title="Addresses" description="Manage your shipping and billing addresses">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading addresses...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  const AddressForm = ({ onSubmit, submitText }: { onSubmit: () => void; submitText: string }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Address Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Home, Work, etc."
        />
      </div>
      <div>
        <Label htmlFor="street">Street Address</Label>
        <Input
          id="street"
          value={formData.street}
          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
          placeholder="123 Main Street"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            placeholder="Toronto"
          />
        </div>
        <div>
          <Label htmlFor="state">Province/State</Label>
          <Input
            id="state"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            placeholder="ON"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="zipCode">Postal/Zip Code</Label>
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
            placeholder="M5V 3A8"
          />
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Select value={formData.country} onValueChange={(value) => setFormData({ ...formData, country: value })}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Canada">Canada</SelectItem>
              <SelectItem value="USA">United States</SelectItem>
              <SelectItem value="UK">United Kingdom</SelectItem>
              <SelectItem value="Australia">Australia</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button onClick={onSubmit} className="w-full">
        {submitText}
      </Button>
    </div>
  )

  return (
    <DashboardLayout title="Addresses" description="Manage your shipping and billing addresses">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">Manage your saved addresses for faster checkout</p>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <FaPlus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Address</DialogTitle>
              </DialogHeader>
              <AddressForm onSubmit={handleAddAddress} submitText="Add Address" />
            </DialogContent>
          </Dialog>
        </div>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Address</DialogTitle>
            </DialogHeader>
            <AddressForm onSubmit={handleUpdateAddress} submitText="Update Address" />
          </DialogContent>
        </Dialog>

        {addresses.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {addresses.map((address) => (
              <Card key={address.id}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center space-x-2">
                    <FaMapMarkerAlt className="h-4 w-4" />
                    <CardTitle className="text-lg">{address.name}</CardTitle>
                    {address.isDefault && <Badge variant="secondary">Default</Badge>}
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditAddress(address)}>
                      <FaEdit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive"
                      onClick={() => handleDeleteAddress(address.id)}
                      disabled={addresses.length === 1}
                    >
                      <FaTrash className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    <p>{address.street}</p>
                    <p>
                      {address.city}, {address.state} {address.zipCode}
                    </p>
                    <p>{address.country}</p>
                  </div>
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4 bg-transparent"
                      onClick={() => handleSetDefault(address.id)}
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
              <FaMapMarkerAlt className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No addresses saved</h3>
              <p className="text-muted-foreground mb-6">Add your first address for faster checkout.</p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <FaPlus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
