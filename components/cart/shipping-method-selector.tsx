"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { FaTruck, FaShippingFast, FaRocket, FaCheck } from "react-icons/fa"
import { shippingMethods, calculateShippingCost } from "@/lib/shipping"

interface ShippingMethodSelectorProps {
  selectedMethodId: string
  onMethodChange: (methodId: string) => void
  subtotal: number
}

const getShippingIcon = (iconName: string) => {
  switch (iconName) {
    case "FaTruck":
      return <FaTruck className="h-5 w-5" />
    case "FaShippingFast":
      return <FaShippingFast className="h-5 w-5" />
    case "FaRocket":
      return <FaRocket className="h-5 w-5" />
    default:
      return <FaTruck className="h-5 w-5" />
  }
}

export function ShippingMethodSelector({ selectedMethodId, onMethodChange, subtotal }: ShippingMethodSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Shipping Method</CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup value={selectedMethodId} onValueChange={onMethodChange} className="space-y-4">
          {shippingMethods.map((method) => {
            const cost = calculateShippingCost(method.id, subtotal)
            const isFree = cost === 0 && method.price > 0

            return (
              <div key={method.id} className="flex items-start space-x-3">
                <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                <Label htmlFor={method.id} className="flex-1 cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="text-primary">{getShippingIcon(method.icon)}</div>
                      <div>
                        <div className="font-medium">{method.name}</div>
                        <div className="text-sm text-muted-foreground">{method.description}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      {isFree ? (
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            FREE
                          </Badge>
                          <span className="text-sm text-muted-foreground line-through">${method.price.toFixed(2)}</span>
                        </div>
                      ) : (
                        <span className="font-medium">{cost === 0 ? "FREE" : `$${cost.toFixed(2)}`}</span>
                      )}
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground mb-2">Estimated delivery: {method.estimatedDays}</div>
                  <div className="flex flex-wrap gap-2">
                    {method.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-1 text-xs text-muted-foreground">
                        <FaCheck className="h-3 w-3 text-green-600" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </Label>
              </div>
            )
          })}
        </RadioGroup>
      </CardContent>
    </Card>
  )
}
