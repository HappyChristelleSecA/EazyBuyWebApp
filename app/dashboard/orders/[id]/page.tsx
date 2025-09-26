"use client"

import { useAuth } from "@/hooks/use-auth"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  getOrderById,
  getOrderStatusColor,
  getOrderStatusText,
  getOrderTracking,
  canCancelOrder,
  canReturnOrder,
  cancelOrder,
  requestReturn,
} from "@/lib/orders"
import { OrderTrackingCard } from "@/components/orders/order-tracking-card"
import { OrderTrackingTimeline } from "@/components/orders/order-tracking-timeline"
import { FaArrowLeft, FaDownload, FaPrint, FaTimes, FaUndo } from "react-icons/fa"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface OrderDetailPageProps {
  params: {
    id: string
  }
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { user, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const order = getOrderById(params.id)
  const tracking = order ? getOrderTracking(order.id) : null

  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [returnDialogOpen, setReturnDialogOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState("")
  const [returnReason, setReturnReason] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    console.log("[v0] Order Detail Page loaded")
    console.log("[v0] Order ID:", params.id)
    console.log("[v0] Order found:", order)

    if (order) {
      console.log("[v0] Order status:", order.status)
      console.log("[v0] Order date:", order.orderDate)
      console.log("[v0] Hours since order:", (Date.now() - order.orderDate.getTime()) / (1000 * 60 * 60))

      const canCancel = canCancelOrder(order)
      const canReturn = canReturnOrder(order)

      console.log("[v0] Can cancel order:", canCancel)
      console.log("[v0] Can return order:", canReturn)

      if (canCancel) {
        console.log("[v0] ✅ CANCEL BUTTON SHOULD BE VISIBLE")
      } else {
        console.log("[v0] ❌ Cancel button hidden - order too old or wrong status")
      }

      if (canReturn) {
        console.log("[v0] ✅ RETURN BUTTON SHOULD BE VISIBLE")
      } else {
        console.log("[v0] ❌ Return button hidden - not delivered or too old")
      }
    }
  }, [params.id, order])

  useEffect(() => {
    if (!isLoading && (!isAuthenticated || !user)) {
      router.push("/auth")
    }
  }, [isAuthenticated, user, isLoading, router])

  if (isLoading) {
    return (
      <DashboardLayout title="Order Details" description="View detailed order information">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading order details...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!isAuthenticated || !user || !order) {
    return (
      <DashboardLayout title="Order Details" description="View detailed order information">
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-muted-foreground">Order not found or you don't have permission to view it.</p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard/orders">Back to Orders</Link>
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    )
  }

  const handleCancelOrder = async () => {
    if (!order) return

    console.log("[v0] Cancel order clicked for:", order.id)
    setIsProcessing(true)
    const success = cancelOrder(order.id, cancelReason)
    console.log("[v0] Cancel order result:", success)

    if (success) {
      console.log("[v0] Order cancelled successfully, refreshing data")
      setCancelDialogOpen(false)
      setCancelReason("")
      router.refresh()
    }
    setIsProcessing(false)
  }

  const handleRequestReturn = async () => {
    if (!order) return

    console.log("[v0] Return order clicked for:", order.id)
    setIsProcessing(true)
    const success = requestReturn(order.id, returnReason)
    console.log("[v0] Return order result:", success)

    if (success) {
      console.log("[v0] Return requested successfully, refreshing data")
      setReturnDialogOpen(false)
      setReturnReason("")
      router.refresh()
    }
    setIsProcessing(false)
  }

  return (
    <DashboardLayout title={`Order #${order.id}`} description="Detailed order information and tracking">
      <div className="space-y-6">
        {/* Back Button */}
        <Button variant="outline" asChild>
          <Link href="/dashboard/orders" className="flex items-center gap-2">
            <FaArrowLeft className="h-4 w-4" />
            Back to Orders
          </Link>
        </Button>

        {/* Order Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Order #{order.id}</CardTitle>
                <p className="text-muted-foreground">
                  Placed on {order.orderDate.toLocaleDateString()} at {order.orderDate.toLocaleTimeString()}
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Badge className={getOrderStatusColor(order.status)} className="text-sm px-3 py-1">
                  {getOrderStatusText(order.status)}
                </Badge>
                <div className="text-right">
                  <p className="text-2xl font-bold">${order.total.toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">{order.items.length} items</p>
                </div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Tracking Information */}
        {tracking && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <OrderTrackingCard order={order} tracking={tracking} />
            <OrderTrackingTimeline events={tracking.events} currentStatus={tracking.currentStatus} />
          </div>
        )}

        {/* Order Items */}
        <Card>
          <CardHeader>
            <CardTitle>Order Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden">
                    <Image
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-lg">{item.product.name}</h4>
                    <p className="text-muted-foreground">{item.product.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm">Quantity: {item.quantity}</span>
                      <span className="text-sm">Price: ${item.price}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Order Summary and Shipping */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p className="text-muted-foreground">
                  {order.shippingAddress.street}
                  <br />
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                  <br />
                  {order.shippingAddress.country}
                </p>
                {order.estimatedDelivery && (
                  <div className="mt-4">
                    <p className="font-medium">Estimated Delivery</p>
                    <p className="text-muted-foreground">
                      {order.estimatedDelivery.toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <Card>
          <CardContent className="flex gap-4 p-6">
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <FaDownload className="h-4 w-4" />
              Download Invoice
            </Button>
            <Button variant="outline" className="flex items-center gap-2 bg-transparent">
              <FaPrint className="h-4 w-4" />
              Print Order
            </Button>

            {order && canCancelOrder(order) && (
              <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 bg-transparent border-red-300"
                    onClick={() => {
                      console.log("[v0] Cancel button clicked!")
                      alert("Cancel Order button clicked! This order can be cancelled.")
                    }}
                  >
                    <FaTimes className="h-4 w-4" />
                    Cancel Order
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Cancel Order #{order.id}</DialogTitle>
                    <DialogDescription>
                      Are you sure you want to cancel this order? This action cannot be undone. You can cancel orders
                      within 24 hours of placement.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="cancel-reason">Reason for cancellation (optional)</Label>
                      <Textarea
                        id="cancel-reason"
                        placeholder="Please let us know why you're cancelling this order..."
                        value={cancelReason}
                        onChange={(e) => setCancelReason(e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setCancelDialogOpen(false)}>
                      Keep Order
                    </Button>
                    <Button variant="destructive" onClick={handleCancelOrder} disabled={isProcessing}>
                      {isProcessing ? "Cancelling..." : "Cancel Order"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {order && canReturnOrder(order) && (
              <Dialog open={returnDialogOpen} onOpenChange={setReturnDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="flex items-center gap-2 text-orange-600 hover:text-orange-700 hover:bg-orange-50 bg-transparent border-orange-300"
                    onClick={() => {
                      console.log("[v0] Return button clicked!")
                      alert("Return Order button clicked! This order can be returned.")
                    }}
                  >
                    <FaUndo className="h-4 w-4" />
                    Return Order
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Return Order #{order.id}</DialogTitle>
                    <DialogDescription>
                      Request a return for this order. Returns are accepted within 30 days of delivery. Our team will
                      review your request and provide return instructions.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="return-reason">Reason for return</Label>
                      <Textarea
                        id="return-reason"
                        placeholder="Please describe the reason for your return request..."
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        className="mt-2"
                        required
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setReturnDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleRequestReturn} disabled={isProcessing || !returnReason.trim()}>
                      {isProcessing ? "Requesting..." : "Request Return"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}

            {order && !canCancelOrder(order) && !canReturnOrder(order) && (
              <div className="text-sm text-muted-foreground bg-gray-50 p-3 rounded border">
                <p>
                  <strong>Debug Info:</strong>
                </p>
                <p>• Order Status: {order.status}</p>
                <p>• Order Date: {order.orderDate.toLocaleDateString()}</p>
                <p>• Hours since order: {Math.round((Date.now() - order.orderDate.getTime()) / (1000 * 60 * 60))}</p>
                <p>• Can Cancel: {canCancelOrder(order) ? "Yes" : "No (need pending/processing status within 24h)"}</p>
                <p>• Can Return: {canReturnOrder(order) ? "Yes" : "No (need delivered status within 30 days)"}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
