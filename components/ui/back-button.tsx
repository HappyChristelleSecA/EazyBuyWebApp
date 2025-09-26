"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { FaArrowLeft } from "react-icons/fa"
import { useRouter } from "next/navigation"

interface BackButtonProps {
  fallbackUrl?: string
  className?: string
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary"
  size?: "default" | "sm" | "lg" | "icon"
  children?: React.ReactNode
}

export function BackButton({
  fallbackUrl = "/",
  className = "",
  variant = "ghost",
  size = "default",
  children,
}: BackButtonProps) {
  const router = useRouter()

  const handleBack = () => {
    // Check if there's browser history to go back to
    if (window.history.length > 1) {
      router.back()
    } else {
      // Fallback to specified URL if no history
      router.push(fallbackUrl)
    }
  }

  return (
    <Button onClick={handleBack} variant={variant} size={size} className={`flex items-center gap-2 ${className}`}>
      <FaArrowLeft className="h-4 w-4" />
      {children || "Back"}
    </Button>
  )
}
