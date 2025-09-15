import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Terms of Service</h1>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  By accessing and using EazyBuy, you accept and agree to be bound by the terms and provision of this
                  agreement. If you do not agree to abide by the above, please do not use this service.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Use License</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  Permission is granted to temporarily download one copy of the materials on EazyBuy's website for
                  personal, non-commercial transitory viewing only.
                </p>
                <p className="text-muted-foreground">
                  This license shall automatically terminate if you violate any of these restrictions.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We strive to provide accurate product information, but we do not warrant that product descriptions or
                  other content is accurate, complete, reliable, current, or error-free. Prices and availability are
                  subject to change without notice.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Orders and Payment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>All orders are subject to acceptance and availability</li>
                  <li>We reserve the right to refuse or cancel any order</li>
                  <li>Payment must be received before order processing</li>
                  <li>All prices are in USD unless otherwise specified</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Shipping and Returns</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Shipping times and costs vary by location and product. Returns are accepted within 30 days of purchase
                  in original condition. Customer is responsible for return shipping costs unless the item was defective
                  or incorrectly shipped.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Questions about the Terms of Service should be sent to us at legal@eazybuy.com or +1 (555) 123-4567.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
