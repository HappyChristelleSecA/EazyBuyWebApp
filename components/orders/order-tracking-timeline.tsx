"use client"

import type { OrderTrackingEvent } from "@/lib/orders"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FaCheckCircle, FaClock, FaCog, FaTruck, FaTimesCircle, FaMapMarkerAlt } from "react-icons/fa"

interface OrderTrackingTimelineProps {
  events: OrderTrackingEvent[]
  currentStatus: string
}

export function OrderTrackingTimeline({ events, currentStatus }: OrderTrackingTimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <FaClock className="h-4 w-4" />
      case "processing":
        return <FaCog className="h-4 w-4" />
      case "shipped":
        return <FaTruck className="h-4 w-4" />
      case "delivered":
        return <FaCheckCircle className="h-4 w-4" />
      case "cancelled":
        return <FaTimesCircle className="h-4 w-4" />
      default:
        return <FaClock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string, isCurrent: boolean) => {
    if (isCurrent) {
      switch (status) {
        case "pending":
          return "bg-yellow-500 text-white"
        case "processing":
          return "bg-blue-500 text-white"
        case "shipped":
          return "bg-purple-500 text-white"
        case "delivered":
          return "bg-green-500 text-white"
        case "cancelled":
          return "bg-red-500 text-white"
        default:
          return "bg-gray-500 text-white"
      }
    }
    return "bg-gray-200 text-gray-600"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FaTruck className="h-5 w-5" />
          Order Tracking Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event, index) => {
            const isLatest = index === events.length - 1
            const isCompleted = event.status === currentStatus || index < events.length - 1

            return (
              <div key={event.id} className="flex items-start space-x-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${
                      isCompleted ? getStatusColor(event.status, isLatest) : "bg-gray-200 text-gray-400"
                    }`}
                  >
                    {getStatusIcon(event.status)}
                  </div>
                  {index < events.length - 1 && (
                    <div className={`w-0.5 h-8 mt-2 ${isCompleted ? "bg-gray-300" : "bg-gray-200"}`} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-sm">
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </p>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                      {event.location && (
                        <div className="flex items-center gap-1 mt-1">
                          <FaMapMarkerAlt className="h-3 w-3 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">{event.location}</span>
                        </div>
                      )}
                      {event.carrier && (
                        <Badge variant="outline" className="mt-1 text-xs">
                          {event.carrier}
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground">{event.timestamp.toLocaleDateString()}</p>
                      <p className="text-xs text-muted-foreground">{event.timestamp.toLocaleTimeString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
