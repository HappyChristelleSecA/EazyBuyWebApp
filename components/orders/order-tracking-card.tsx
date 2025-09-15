"use client"

import type { Order, OrderTracking } from "@/lib/orders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { FaBox, FaTruck, FaMapMarkerAlt, FaCopy, FaExternalLinkAlt } from "react-icons/fa"
import { useState } from "react"

interface OrderTrackingCardProps {
  order: Order
  tracking: OrderTracking
}

export function OrderTrackingCard({ order, tracking }: OrderTrackingCardProps) {
  const [copied, setCopied] = useState(false)

  const copyTrackingNumber = async () => {
    if (tracking.trackingNumber && tracking.trackingNumber !== "N/A") {
      await navigator.clipboard.writeText(tracking.trackingNumber)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "shipped":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case "pending":
        return 25
      case "processing":
        return 50
      case "shipped":
        return 75
      case "delivered":
        return 100
      case "cancelled":
        return 0
      default:
        return 0
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FaBox className="h-5 w-5" />
            Order #{order.id}
          </div>
          <Badge className={getStatusColor(tracking.currentStatus)}>
            {tracking.currentStatus.charAt(0).toUpperCase() + tracking.currentStatus.slice(1)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Order Progress</span>
            <span>{getProgressPercentage(tracking.currentStatus)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${getProgressPercentage(tracking.currentStatus)}%` }}
            />
          </div>
        </div>

        <Separator />

        {/* Tracking Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FaTruck className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Tracking Number</span>
            </div>
            {tracking.trackingNumber && tracking.trackingNumber !== "N/A" ? (
              <div className="flex items-center gap-2">
                <code className="bg-muted px-2 py-1 rounded text-sm">{tracking.trackingNumber}</code>
                <Button variant="ghost" size="sm" onClick={copyTrackingNumber} className="h-8 w-8 p-0">
                  <FaCopy className="h-3 w-3" />
                </Button>
                {copied && <span className="text-xs text-green-600">Copied!</span>}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Not available yet</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FaTruck className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Carrier</span>
            </div>
            <p className="text-sm">{tracking.carrier}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <FaMapMarkerAlt className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Delivery Address</span>
          </div>
          <p className="text-sm text-muted-foreground">{tracking.deliveryAddress}</p>
        </div>

        <div className="space-y-2">
          <span className="font-medium">Estimated Delivery</span>
          <p className="text-sm">
            {tracking.estimatedDelivery.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {/* Action Buttons */}
        {tracking.trackingNumber && tracking.trackingNumber !== "N/A" && (
          <div className="flex gap-2 pt-2">
            <Button variant="outline" className="flex-1 bg-transparent" asChild>
              <a
                href={`https://www.fedex.com/fedextrack/?trknbr=${tracking.trackingNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                <FaExternalLinkAlt className="h-3 w-3" />
                Track on {tracking.carrier}
              </a>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
