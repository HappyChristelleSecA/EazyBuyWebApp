"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FaChartBar, FaBox, FaShoppingCart, FaUsers, FaCog, FaHome, FaWarehouse } from "react-icons/fa"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  {
    title: "Overview",
    href: "/admin",
    icon: FaChartBar,
  },
  {
    title: "Products",
    href: "/admin/products",
    icon: FaBox,
  },
  {
    title: "Inventory",
    href: "/admin/inventory",
    icon: FaWarehouse,
  },
  {
    title: "Orders",
    href: "/admin/orders",
    icon: FaShoppingCart,
  },
  {
    title: "Users",
    href: "/admin/users",
    icon: FaUsers,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: FaCog,
  },
]

export function AdminNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-2">
      <Button variant="ghost" className="w-full justify-start mb-4" asChild>
        <Link href="/">
          <FaHome className="mr-2 h-4 w-4" />
          Back to Store
        </Link>
      </Button>
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
