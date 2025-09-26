"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PasswordInput } from "@/components/ui/password-input"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { ForgotPasswordForm } from "./forgot-password-form"

interface LoginFormProps {
  onToggleMode?: () => void
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const { login, isLoading } = useAuth()
  const router = useRouter()

  const handleBackToLogin = () => {
    setShowForgotPassword(false)
    setError("")
  }

  if (showForgotPassword) {
    return <ForgotPasswordForm onBackToLogin={handleBackToLogin} />
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    console.log("[v0] Login attempt:", { email, password })

    const result = await login(email, password)
    console.log("[v0] Login result:", result)

    if (result.success) {
      const user = result.user || getCurrentUser()
      console.log("[v0] Redirecting user:", user)

      setTimeout(() => {
        if (user?.role === "admin") {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      }, 100)
    } else {
      setError(result.error || "Login failed")
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Welcome Back</CardTitle>
        <CardDescription>Sign in to your EazyBuy account</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </button>
            </div>
            <PasswordInput
              id="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">Don't have an account? </span>
          <button type="button" onClick={onToggleMode} className="text-primary hover:underline font-medium">
            Sign up
          </button>
        </div>
        <div className="mt-4 p-3 bg-muted rounded-md text-sm">
          <p className="font-medium mb-1">Demo Credentials:</p>
          <p>Admin: admin@eazybuy.com / password123</p>
          <p>User: user@example.com / password123</p>
        </div>
      </CardContent>
    </Card>
  )
}
