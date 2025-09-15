"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { FaExclamationTriangle, FaBox, FaDollarSign, FaEdit, FaPlus, FaDownload } from "react-icons/fa"
import { getInventoryReport, getStockAlerts, updateStock, type StockAlert } from "@/lib/inventory"
import { getProductsWithInventory } from "@/lib/products"

export function InventoryDashboard() {
  const [report, setReport] = useState<any>(null)
  const [alerts, setAlerts] = useState<StockAlert[]>([])
  const [products, setProducts] = useState<any[]>([])
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [stockUpdateOpen, setStockUpdateOpen] = useState(false)
  const [bulkUpdateOpen, setBulkUpdateOpen] = useState(false)
  const [newQuantity, setNewQuantity] = useState("")
  const [updateReason, setUpdateReason] = useState("")

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    setReport(getInventoryReport())
    setAlerts(getStockAlerts())
    setProducts(getProductsWithInventory())
  }

  const handleStockUpdate = () => {
    if (selectedProduct && newQuantity) {
      updateStock(selectedProduct.id, Number.parseInt(newQuantity), updateReason, "admin")
      setStockUpdateOpen(false)
      setNewQuantity("")
      setUpdateReason("")
      loadData()
    }
  }

  const getStockStatus = (product: any) => {
    if (product.availableQuantity === 0) return { label: "Out of Stock", variant: "destructive" as const }
    if (product.isLowStock) return { label: "Low Stock", variant: "secondary" as const }
    return { label: "In Stock", variant: "default" as const }
  }

  const getAlertIcon = (severity: string) => {
    return (
      <FaExclamationTriangle
        className={`h-4 w-4 ${severity === "high" ? "text-red-500" : severity === "medium" ? "text-yellow-500" : "text-blue-500"}`}
      />
    )
  }

  if (!report) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                          {alert.type === "out_of_stock"
                            ? "Out of stock"
                            : `Only ${alert.currentQuantity} left (threshold: ${alert.threshold})`}
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
                      </div>
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Available: {product.availableQuantity}</span>
                        <span>Threshold: {product.lowStockThreshold || "Not set"}</span>
                      </div>
                      <Progress value={stockPercentage} className="h-2" />
                    </div>
                  </div>
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
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
