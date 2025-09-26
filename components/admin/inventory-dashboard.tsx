"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { FaExclamationTriangle, FaBox, FaDollarSign, FaEdit, FaPlus, FaDownload, FaBan, FaUndo } from "react-icons/fa"

const mockInventoryData = {
  totalProducts: 8,
  lowStockItems: 2,
  outOfStockItems: 1,
  outOfOrderItems: 1,
  totalValue: 15420.5,
}

const mockProducts = [
  {
    id: "1",
    name: "Wireless Bluetooth Headphones",
    category: "Electronics",
    availableQuantity: 25,
    lowStockThreshold: 10,
    outOfOrder: false,
    price: 79.99,
  },
  {
    id: "2",
    name: "Smart Fitness Tracker",
    category: "Electronics",
    availableQuantity: 8,
    lowStockThreshold: 15,
    outOfOrder: false,
    price: 149.99,
  },
  {
    id: "3",
    name: "Organic Cotton T-Shirt",
    category: "Clothing",
    availableQuantity: 0,
    lowStockThreshold: 20,
    outOfOrder: true,
    outOfOrderReason: "Quality control issues",
    price: 29.99,
  },
  {
    id: "4",
    name: "Ceramic Coffee Mug",
    category: "Home & Kitchen",
    availableQuantity: 12,
    lowStockThreshold: 8,
    outOfOrder: false,
    price: 19.99,
  },
]

const mockAlerts = [
  {
    id: "alert-1",
    productName: "Organic Cotton T-Shirt",
    type: "out_of_order",
    severity: "high",
    outOfOrderReason: "Quality control issues",
  },
  {
    id: "alert-2",
    productName: "Smart Fitness Tracker",
    type: "low_stock",
    currentQuantity: 8,
    threshold: 15,
    severity: "medium",
  },
]

export function InventoryDashboard() {
  const [report, setReport] = useState(mockInventoryData)
  const [alerts, setAlerts] = useState(mockAlerts)
  const [products, setProducts] = useState(mockProducts)
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [stockUpdateOpen, setStockUpdateOpen] = useState(false)
  const [bulkUpdateOpen, setBulkUpdateOpen] = useState(false)
  const [outOfOrderOpen, setOutOfOrderOpen] = useState(false)
  const [newQuantity, setNewQuantity] = useState("")
  const [updateReason, setUpdateReason] = useState("")
  const [outOfOrderReason, setOutOfOrderReason] = useState("")
  const [estimatedRestoreDate, setEstimatedRestoreDate] = useState("")

  const handleStockUpdate = () => {
    if (selectedProduct && newQuantity) {
      const updatedProducts = products.map((p) =>
        p.id === selectedProduct.id ? { ...p, availableQuantity: Number.parseInt(newQuantity) } : p,
      )
      setProducts(updatedProducts)
      setStockUpdateOpen(false)
      setNewQuantity("")
      setUpdateReason("")
    }
  }

  const handleMarkOutOfOrder = () => {
    if (selectedProduct && outOfOrderReason) {
      const updatedProducts = products.map((p) =>
        p.id === selectedProduct.id ? { ...p, outOfOrder: true, outOfOrderReason } : p,
      )
      setProducts(updatedProducts)
      setOutOfOrderOpen(false)
      setOutOfOrderReason("")
      setEstimatedRestoreDate("")
    }
  }

  const handleRestoreFromOutOfOrder = (productId: string) => {
    const updatedProducts = products.map((p) =>
      p.id === productId ? { ...p, outOfOrder: false, outOfOrderReason: undefined } : p,
    )
    setProducts(updatedProducts)
  }

  const getStockStatus = (product: any) => {
    if (product.outOfOrder) return { label: "Out of Order", variant: "destructive" as const, color: "text-purple-600" }
    if (product.availableQuantity === 0)
      return { label: "Out of Stock", variant: "destructive" as const, color: "text-red-600" }
    if (product.availableQuantity <= product.lowStockThreshold)
      return { label: "Low Stock", variant: "secondary" as const, color: "text-yellow-600" }
    return { label: "In Stock", variant: "default" as const, color: "text-green-600" }
  }

  const getAlertIcon = (severity: string) => {
    return (
      <FaExclamationTriangle
        className={`h-4 w-4 ${severity === "high" ? "text-red-500" : severity === "medium" ? "text-yellow-500" : "text-blue-500"}`}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <FaBox className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{report.totalProducts}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
            <FaExclamationTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{report.lowStockItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
            <FaExclamationTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{report.outOfStockItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Out of Order</CardTitle>
            <FaBan className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{report.outOfOrderItems}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Value</CardTitle>
            <FaDollarSign className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">${report.totalValue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Alerts */}
      {alerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FaExclamationTriangle className="h-5 w-5 mr-2 text-yellow-500" />
              Stock Alerts ({alerts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {alerts.slice(0, 5).map((alert) => (
                <Alert key={alert.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getAlertIcon(alert.severity)}
                      <div>
                        <p className="font-medium">{alert.productName}</p>
                        <p className="text-sm text-muted-foreground">
                          {alert.type === "out_of_order"
                            ? `Out of order: ${alert.outOfOrderReason}`
                            : alert.type === "out_of_stock"
                              ? "Out of stock"
                              : `Only ${(alert as any).currentQuantity} left (threshold: ${(alert as any).threshold})`}
                        </p>
                      </div>
                    </div>
                    <Badge variant={alert.severity === "high" ? "destructive" : "secondary"}>{alert.severity}</Badge>
                  </div>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Inventory Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Inventory Management</CardTitle>
          <div className="flex space-x-2">
            <Dialog open={bulkUpdateOpen} onOpenChange={setBulkUpdateOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <FaPlus className="h-4 w-4 mr-2" />
                  Bulk Update
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Bulk Stock Update</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Upload a CSV file or manually enter stock updates for multiple products.
                  </p>
                  <Button className="w-full bg-transparent" variant="outline">
                    <FaDownload className="h-4 w-4 mr-2" />
                    Download Template
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {products.map((product) => {
              const status = getStockStatus(product)
              const stockPercentage = product.lowStockThreshold
                ? Math.min(100, (product.availableQuantity / product.lowStockThreshold) * 100)
                : 100

              return (
                <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-medium">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                        {product.outOfOrder && product.outOfOrderReason && (
                          <p className="text-xs text-purple-600 mt-1">Reason: {product.outOfOrderReason}</p>
                        )}
                      </div>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Available: {product.availableQuantity}</span>
                        <span>Threshold: {product.lowStockThreshold || "Not set"}</span>
                      </div>
                      {!product.outOfOrder && <Progress value={stockPercentage} className="h-2" />}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    {product.outOfOrder ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestoreFromOutOfOrder(product.id)}
                        className="text-green-600 hover:text-green-700"
                      >
                        <FaUndo className="h-4 w-4 mr-2" />
                        Restore
                      </Button>
                    ) : (
                      <>
                        <Dialog
                          open={stockUpdateOpen && selectedProduct?.id === product.id}
                          onOpenChange={setStockUpdateOpen}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedProduct(product)}>
                              <FaEdit className="h-4 w-4 mr-2" />
                              Update Stock
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Update Stock - {product.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="quantity">New Quantity</Label>
                                <Input
                                  id="quantity"
                                  type="number"
                                  value={newQuantity}
                                  onChange={(e) => setNewQuantity(e.target.value)}
                                  placeholder={`Current: ${product.availableQuantity}`}
                                />
                              </div>
                              <div>
                                <Label htmlFor="reason">Reason (Optional)</Label>
                                <Textarea
                                  id="reason"
                                  value={updateReason}
                                  onChange={(e) => setUpdateReason(e.target.value)}
                                  placeholder="e.g., New shipment received, damaged items removed..."
                                />
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setStockUpdateOpen(false)}>
                                  Cancel
                                </Button>
                                <Button onClick={handleStockUpdate}>Update Stock</Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <Dialog
                          open={outOfOrderOpen && selectedProduct?.id === product.id}
                          onOpenChange={setOutOfOrderOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedProduct(product)}
                              className="text-purple-600 hover:text-purple-700"
                            >
                              <FaBan className="h-4 w-4 mr-2" />
                              Mark Out of Order
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Mark Out of Order - {product.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="outOfOrderReason">Reason *</Label>
                                <Textarea
                                  id="outOfOrderReason"
                                  value={outOfOrderReason}
                                  onChange={(e) => setOutOfOrderReason(e.target.value)}
                                  placeholder="e.g., Equipment maintenance, quality issues, supplier problems..."
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="estimatedRestoreDate">Estimated Restore Date (Optional)</Label>
                                <Input
                                  id="estimatedRestoreDate"
                                  type="date"
                                  value={estimatedRestoreDate}
                                  onChange={(e) => setEstimatedRestoreDate(e.target.value)}
                                />
                              </div>
                              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                                <p className="text-sm text-yellow-800">
                                  <strong>Note:</strong> Marking this item as out of order will prevent customers from
                                  adding it to their cart, even if stock is available.
                                </p>
                              </div>
                              <div className="flex justify-end space-x-2">
                                <Button variant="outline" onClick={() => setOutOfOrderOpen(false)}>
                                  Cancel
                                </Button>
                                <Button
                                  onClick={handleMarkOutOfOrder}
                                  className="bg-purple-600 hover:bg-purple-700"
                                  disabled={!outOfOrderReason.trim()}
                                >
                                  Mark Out of Order
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
