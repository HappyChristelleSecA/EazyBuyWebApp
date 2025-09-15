"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  CheckCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

interface ContactForm {
  name: string
  email: string
  subject: string
  category: string
  message: string
}

interface FAQ {
  question: string
  answer: string
  isOpen: boolean
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: "",
    email: "",
    subject: "",
    category: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      question: "What are your shipping options and delivery times?",
      answer:
        "We offer standard shipping (5-7 business days) and express shipping (2-3 business days). Free shipping is available on orders over $50. Express shipping rates vary by location.",
      isOpen: false,
    },
    {
      question: "What is your return and exchange policy?",
      answer:
        "We accept returns within 30 days of purchase. Items must be in original condition with tags attached. Exchanges are free, and we provide prepaid return labels for your convenience.",
      isOpen: false,
    },
    {
      question: "How can I track my order?",
      answer:
        "Once your order ships, you'll receive a tracking number via email. You can also track your order by logging into your account and visiting the 'Orders' section.",
      isOpen: false,
    },
    {
      question: "Do you offer international shipping?",
      answer:
        "Currently, we only ship within the United States. We're working on expanding our shipping options to include international destinations in the near future.",
      isOpen: false,
    },
    {
      question: "How do I cancel or modify my order?",
      answer:
        "Orders can be cancelled or modified within 1 hour of placement. After that, please contact our customer service team, and we'll do our best to accommodate your request.",
      isOpen: false,
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay. All transactions are secured with SSL encryption.",
      isOpen: false,
    },
  ])

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setIsSubmitting(false)
    setIsSubmitted(true)

    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false)
      setFormData({
        name: "",
        email: "",
        subject: "",
        category: "",
        message: "",
      })
    }, 3000)
  }

  const toggleFAQ = (index: number) => {
    setFaqs((prev) => prev.map((faq, i) => (i === index ? { ...faq, isOpen: !faq.isOpen } : faq)))
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            We're here to help! Get in touch with our customer support team for any questions or concerns.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="h-5 w-5 mr-2" />
                  Send us a Message
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Message Sent Successfully!</h3>
                    <p className="text-muted-foreground">
                      Thank you for contacting us. We'll get back to you within 24 hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleInputChange("category", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="general">General Inquiry</SelectItem>
                            <SelectItem value="order">Order Support</SelectItem>
                            <SelectItem value="shipping">Shipping & Delivery</SelectItem>
                            <SelectItem value="returns">Returns & Exchanges</SelectItem>
                            <SelectItem value="technical">Technical Support</SelectItem>
                            <SelectItem value="billing">Billing & Payments</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) => handleInputChange("subject", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        rows={6}
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        placeholder="Please describe your inquiry in detail..."
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Get in Touch</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">
                      123 Commerce Street
                      <br />
                      New York, NY 10001
                      <br />
                      United States
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">support@eazybuy.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Business Hours</p>
                    <div className="text-sm text-muted-foreground">
                      <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                      <p>Saturday: 10:00 AM - 4:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Response Times</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Support</span>
                  <Badge variant="secondary">24 hours</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Phone Support</span>
                  <Badge variant="default">Immediate</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Live Chat</span>
                  <Badge variant="default">Immediate</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <HelpCircle className="h-5 w-5 mr-2" />
              Frequently Asked Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border rounded-lg">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-medium">{faq.question}</span>
                    {faq.isOpen ? (
                      <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    )}
                  </button>
                  {faq.isOpen && (
                    <div className="px-4 pb-4">
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Additional Support Options */}
        <div className="grid md:grid-cols-3 gap-6 mt-12">
          <Card className="text-center">
            <CardContent className="p-6">
              <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Call Us</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Speak directly with our support team for immediate assistance.
              </p>
              <Button variant="outline" className="w-full bg-transparent">
                (555) 123-4567
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <MessageCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Live Chat</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Chat with our support team in real-time during business hours.
              </p>
              <Button variant="outline" className="w-full bg-transparent">
                Start Chat
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardContent className="p-6">
              <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Help Center</h3>
              <p className="text-sm text-muted-foreground mb-4">Browse our comprehensive help articles and guides.</p>
              <Button variant="outline" className="w-full bg-transparent">
                Visit Help Center
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
