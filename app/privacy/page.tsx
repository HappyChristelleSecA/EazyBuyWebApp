import { Header } from "@/components/layout/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We collect information you provide directly to us, such as when you create an account, make a
                  purchase, or contact us for support.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Personal information (name, email, phone number)</li>
                  <li>Payment information (processed securely through our payment partners)</li>
                  <li>Shipping and billing addresses</li>
                  <li>Purchase history and preferences</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  We use the information we collect to provide, maintain, and improve our services.
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Process and fulfill your orders</li>
                  <li>Send you order confirmations and updates</li>
                  <li>Provide customer support</li>
                  <li>Improve our products and services</li>
                  <li>Send promotional emails (with your consent)</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Data Security</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We implement appropriate security measures to protect your personal information against unauthorized
                  access, alteration, disclosure, or destruction. All payment information is encrypted and processed
                  through secure payment gateways.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Us</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy, please contact us at privacy@eazybuy.com or call
                  us at +1 (555) 123-4567.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
