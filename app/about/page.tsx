import { Header } from "@/components/layout/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Target, Users, Award, Truck, Shield, Heart, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function AboutPage() {
  const values = [
    {
      icon: Target,
      title: "Quality First",
      description: "We carefully curate every product to ensure the highest quality standards for our customers.",
    },
    {
      icon: Users,
      title: "Customer Focused",
      description: "Our customers are at the heart of everything we do. Your satisfaction is our top priority.",
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We strive for excellence in every aspect of our business, from products to customer service.",
    },
    {
      icon: Heart,
      title: "Sustainability",
      description: "We're committed to sustainable practices and supporting eco-friendly products.",
    },
  ]

  const features = [
    "Free shipping on orders over $50",
    "30-day hassle-free returns",
    "24/7 customer support",
    "Secure payment processing",
    "Fast and reliable delivery",
    "Quality guarantee on all products",
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            About <span className="text-primary">EazyBuy</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We're more than just an e-commerce platform. We're your trusted partner in discovering amazing products that
            enhance your lifestyle, backed by exceptional service and unbeatable value.
          </p>
        </div>

        {/* Mission Section */}
        <Card className="mb-16">
          <CardContent className="p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
                <p className="text-muted-foreground text-lg leading-relaxed mb-6">
                  To make online shopping easy, enjoyable, and accessible for everyone. We believe that great products
                  should be available to all, backed by outstanding customer service and competitive prices.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Since our founding, we've been committed to building lasting relationships with our customers by
                  consistently delivering on our promises of quality, value, and service.
                </p>
              </div>
              <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-8 text-center">
                <div className="text-4xl font-bold text-primary mb-2">10,000+</div>
                <p className="text-muted-foreground mb-4">Happy Customers</p>
                <div className="text-4xl font-bold text-primary mb-2">50,000+</div>
                <p className="text-muted-foreground mb-4">Orders Delivered</p>
                <div className="text-4xl font-bold text-primary mb-2">99.5%</div>
                <p className="text-muted-foreground">Customer Satisfaction</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="p-6">
                  <value.icon className="h-12 w-12 text-primary mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Features Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Why Choose EazyBuy?</h2>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Truck className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Fast Shipping</h3>
                <p className="text-muted-foreground text-sm">
                  Get your orders delivered quickly with our reliable shipping partners nationwide.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="font-semibold mb-2">Secure Shopping</h3>
                <p className="text-muted-foreground text-sm">
                  Shop with confidence knowing your data and payments are protected with industry-leading security.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Team Section */}
        <Card className="mb-16">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold mb-6">Our Team</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              We're a passionate team of e-commerce professionals, designers, and customer service experts dedicated to
              making your shopping experience exceptional.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Badge variant="secondary" className="text-sm">
                Customer Service
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Product Curation
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Technology
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Logistics
              </Badge>
              <Badge variant="secondary" className="text-sm">
                Marketing
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-muted-foreground text-lg mb-8">
            Join thousands of satisfied customers and discover your next favorite product today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link href="/products">Browse Products</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
