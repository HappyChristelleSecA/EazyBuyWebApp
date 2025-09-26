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
import { Alert, AlertDescription } from "@/components/ui/alert"

interface RegisterFormProps {
  onToggleMode?: () => void
}

export function RegisterForm({ onToggleMode }: RegisterFormProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [showAccountExistsPopup, setShowAccountExistsPopup] = useState(false)
  const { register, isLoading } = useAuth()
  const router = useRouter()
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setShowAccountExistsPopup(false)

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    const result = await register(email, password, name)
    if (result.success) {
      setRegisteredEmail(email)
      setShowSuccessMessage(true)
      // Redirect to login after 2 seconds
      setTimeout(() => {
        onToggleMode?.()
      }, 2000)
    } else {
      if (result.error?.includes("already exists") || result.error?.includes("User already exists")) {
        setShowAccountExistsPopup(true)
        setError("")
      } else {
        setError(result.error || "Registration failed")
      }
    }
  }

  const handleAccountExistsAction = () => {
    onToggleMode?.()
  }

  if (showSuccessMessage) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <CardTitle className="text-2xl font-bold">Account Created Successfully!</CardTitle>
          <CardDescription>Welcome to EazyBuy! Your account has been created for {registeredEmail}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">Redirecting you to sign in...</p>
            <Button onClick={() => onToggleMode?.()} className="w-full">
              Continue to Sign In
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
        <CardDescription>Join EazyBuy today</CardDescription>
      </CardHeader>
      <CardContent>
        {showAccountExistsPopup && (
          <Alert className="mb-4 border-orange-200 bg-orange-50">
            <AlertDescription className="text-orange-800">
              <div className="space-y-3">
                <p className="font-medium">This account already exists!</p>
                <p className="text-sm">
                  An account with this email address is already registered. Please sign in instead.
                </p>
                <div className="flex gap-2">
                  <Button
                    onClick={handleAccountExistsAction}
                    size="sm"
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Go to Sign In
                  </Button>
                  <Button onClick={() => setShowAccountExistsPopup(false)} variant="outline" size="sm">
                    Try Different Email
                  </Button>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
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
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create Account"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          <span className="text-muted-foreground">Already have an account? </span>
          <button type="button" onClick={onToggleMode} className="text-primary hover:underline font-medium">
            Sign in
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
