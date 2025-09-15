"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FaUser, FaBox, FaCog, FaHeart, FaMapMarkerAlt, FaCreditCard } from "react-icons/fa"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: FaUser,
  },
  {
    title: "Orders",
    href: "/dashboard/orders",
    icon: FaBox,
  },
  {
    title: "Wishlist",
    href: "/dashboard/wishlist",
    icon: FaHeart,
  },
  {
    title: "Addresses",
    href: "/dashboard/addresses",
    icon: FaMapMarkerAlt,
  },
  {
    title: "Payment Methods",
    href: "/dashboard/payment",
    icon: FaCreditCard,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: FaCog,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-2">
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? "default" : "ghost"}
          className={cn("w-full justify-start", pathname === item.href && "bg-primary text-primary-foreground")}
          asChild
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  )
}
