"use client"

import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { AdminLayout } from "@/components/admin/admin-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Store, Mail, Shield } from "lucide-react"
import { redirect } from "next/navigation"

export default function AdminSettingsPage() {
  const { user, isAuthenticated } = useAuth()
  const [storeSettings, setStoreSettings] = useState({
    storeName: "EazyBuy",
    storeDescription: "Your trusted online shopping destination",
    storeEmail: "support@eazybuy.com",
    storePhone: "(555) 123-4567",
    currency: "USD",
    taxRate: "8",
  })
  const [emailSettings, setEmailSettings] = useState({
    orderConfirmation: true,
    shippingUpdates: true,
    promotionalEmails: false,
    lowStockAlerts: true,
  })

  if (!isAuthenticated || !user || user.role !== "admin") {
    redirect("/")
  }

  return (
    <AdminLayout title="Admin Settings" description="Configure your store settings and preferences">
      <div className="space-y-6">
        {/* Store Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Store className="h-5 w-5" />
              <CardTitle>Store Information</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  value={storeSettings.storeName}
                  onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storeEmail">Store Email</Label>
                <Input
                  id="storeEmail"
                  type="email"
                  value={storeSettings.storeEmail}
                  onChange={(e) => setStoreSettings({ ...storeSettings, storeEmail: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="storePhone">Store Phone</Label>
                <Input
                  id="storePhone"
                  value={storeSettings.storePhone}
                  onChange={(e) => setStoreSettings({ ...storeSettings, storePhone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={storeSettings.currency}
                  onChange={(e) => setStoreSettings({ ...storeSettings, currency: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="storeDescription">Store Description</Label>
              <Textarea
                id="storeDescription"
                value={storeSettings.storeDescription}
                onChange={(e) => setStoreSettings({ ...storeSettings, storeDescription: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="taxRate">Tax Rate (%)</Label>
              <Input
                id="taxRate"
                type="number"
                value={storeSettings.taxRate}
                onChange={(e) => setStoreSettings({ ...storeSettings, taxRate: e.target.value })}
                className="max-w-32"
              />
            </div>
            <Button>Save Store Settings</Button>
          </CardContent>
        </Card>

        {/* Email Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5" />
              <CardTitle>Email Notifications</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Order Confirmation Emails</p>
                <p className="text-sm text-muted-foreground">Send confirmation emails to customers</p>
              </div>
              <Switch
                checked={emailSettings.orderConfirmation}
                onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, orderConfirmation: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Shipping Updates</p>
                <p className="text-sm text-muted-foreground">Notify customers about shipping status</p>
              </div>
              <Switch
                checked={emailSettings.shippingUpdates}
                onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, shippingUpdates: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Promotional Emails</p>
                <p className="text-sm text-muted-foreground">Send marketing emails to subscribers</p>
              </div>
              <Switch
                checked={emailSettings.promotionalEmails}
                onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, promotionalEmails: checked })}
              />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Low Stock Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified when products are low in stock</p>
              </div>
              <Switch
                checked={emailSettings.lowStockAlerts}
                onCheckedChange={(checked) => setEmailSettings({ ...emailSettings, lowStockAlerts: checked })}
              />
            </div>
            <Button>Save Email Settings</Button>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <CardTitle>Security & Backup</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Database Backup</p>
                <p className="text-sm text-muted-foreground">Last backup: 2 hours ago</p>
              </div>
              <Button variant="outline">Create Backup</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Security Logs</p>
                <p className="text-sm text-muted-foreground">View system security logs</p>
              </div>
              <Button variant="outline">View Logs</Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">API Keys</p>
                <p className="text-sm text-muted-foreground">Manage third-party integrations</p>
              </div>
              <Button variant="outline">Manage Keys</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
