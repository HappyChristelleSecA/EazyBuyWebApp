import type React from "react"
import type { Metadata } from "next"
import { Space_Grotesk, DM_Sans } from "next/font/google"
import { CartProvider } from "@/hooks/use-cart"
import { WishlistProvider } from "@/hooks/use-wishlist"
import { Footer } from "@/components/layout/footer"
import { ErrorBoundary } from "@/components/error-boundary"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-space-grotesk",
})

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
})

export const metadata: Metadata = {
  title: "EazyBuy - Modern E-Commerce",
  description: "Your trusted online shopping destination",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${dmSans.variable} antialiased`}>
      <body className="font-sans">
        <ErrorBoundary>
          <CartProvider>
            <WishlistProvider>
              <div className="min-h-screen flex flex-col">
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </WishlistProvider>
          </CartProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
