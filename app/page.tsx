"use client"

import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ProductCard } from "@/components/products/product-card"
import { getFeaturedProducts } from "@/lib/products"
import Link from "next/link"

import { FaShoppingBag, FaShieldAlt, FaTruck, FaStar, FaArrowRight } from "react-icons/fa"

export default function HomePage() {
  const featuredProducts = getFeaturedProducts()

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-accent/5 py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Welcome to <span className="text-primary">EazyBuy</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your trusted online shopping destination. Discover amazing products with unbeatable prices and exceptional
            service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-primary text-white hover:bg-primary/90">
              <Link href="/products" className="text-white no-underline">
                <FaShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground text-lg">Check out our most popular items</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/products">
                View All Products
                <FaArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose EazyBuy?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="p-6 text-center">
                <FaShieldAlt className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Secure Shopping</h3>
                <p className="text-muted-foreground">
                  Your data and payments are protected with industry-leading security measures.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <FaTruck className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                <p className="text-muted-foreground">
                  Get your orders delivered quickly with our reliable shipping partners.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <FaStar className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Quality Products</h3>
                <p className="text-muted-foreground">Carefully curated products from trusted brands and sellers.</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers and discover your next favorite product.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/auth">Get Started Today</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
