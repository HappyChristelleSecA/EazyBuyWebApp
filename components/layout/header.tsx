"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { CartDrawer } from "@/components/cart/cart-drawer"
import { SearchAutocomplete } from "@/components/products/search-autocomplete"
import { FaUser, FaSignOutAlt, FaBars } from "react-icons/fa"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export function Header() {
  const { user, isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (pathname === "/products") {
      setShowSearch(true)
    }
  }, [pathname])

  const handleProductsClick = () => {
    setShowSearch(true)
  }

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query)}`)
    } else {
      router.push("/products")
    }
  }

  const NavLinks = () => (
    <>
      <Link
        href="/products"
        className="text-foreground hover:text-primary transition-colors"
        onClick={handleProductsClick}
      >
        Products
      </Link>
      <Link href="/about" className="text-foreground hover:text-primary transition-colors">
        About
      </Link>
      <Link href="/contact" className="text-foreground hover:text-primary transition-colors">
        Contact
      </Link>
    </>
  )

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-primary">
          EazyBuy
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <NavLinks />
        </nav>

        <div className="flex items-center space-x-4">
          {showSearch && (
            <div className="hidden md:block w-64 animate-in fade-in-0 slide-in-from-right-4 duration-300">
              <SearchAutocomplete
                value={searchQuery}
                onChange={setSearchQuery}
                onSearch={handleSearch}
                placeholder="Search products..."
              />
            </div>
          )}

          <CartDrawer />

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <FaBars className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-8">
                <NavLinks />
                {showSearch && (
                  <div className="pt-4 border-t animate-in fade-in-0 slide-in-from-top-4 duration-300">
                    <SearchAutocomplete
                      value={searchQuery}
                      onChange={setSearchQuery}
                      onSearch={handleSearch}
                      placeholder="Search products..."
                    />
                  </div>
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {isAuthenticated && user ? (
            <>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <FaUser className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <div className="flex flex-col space-y-6 mt-8">
                    {/* User Info */}
                    <div className="border-b pb-4">
                      <div className="text-lg font-semibold">{user.name}</div>
                      <div className="text-sm text-muted-foreground">{user.email}</div>
                    </div>

                    {/* Menu Items */}
                    <div className="flex flex-col space-y-2">
                      <Button asChild variant="ghost" className="justify-start">
                        <Link href="/dashboard">Dashboard</Link>
                      </Button>
                      {user.role === "admin" && (
                        <Button asChild variant="ghost" className="justify-start">
                          <Link href="/admin">Admin Panel</Link>
                        </Button>
                      )}
                    </div>

                    {/* Sign Out */}
                    <div className="border-t pt-4">
                      <Button onClick={logout} variant="ghost" className="justify-start w-full">
                        <FaSignOutAlt className="mr-2 h-4 w-4" />
                        Sign out
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </>
          ) : (
            <Button asChild className="hidden sm:flex">
              <Link href="/auth">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
