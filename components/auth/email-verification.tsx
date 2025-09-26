"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Mail, RefreshCw } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EmailVerificationProps {
  email: string
  onResendEmail: () => Promise<void>
  onBackToLogin: () => void
}

export function EmailVerification({ email, onResendEmail, onBackToLogin }: EmailVerificationProps) {
  const [isResending, setIsResending] = useState(false)
  const [resendSuccess, setResendSuccess] = useState(false)

  const handleResend = async () => {
    setIsResending(true)
    setResendSuccess(false)

    try {
      await onResendEmail()
      setResendSuccess(true)
    } catch (error) {
      console.error("Failed to resend verification email:", error)
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <Mail className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl font-bold">Verify Your Email</CardTitle>
        <CardDescription>
          We've sent a verification link to <strong>{email}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground text-center space-y-2">
          <p>Please check your email and click the verification link to activate your account.</p>
          <p>Don't forget to check your spam folder!</p>
        </div>

        {resendSuccess && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">Verification email sent successfully!</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <Button onClick={handleResend} variant="outline" className="w-full bg-transparent" disabled={isResending}>
            {isResending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Mail className="mr-2 h-4 w-4" />
                Resend Verification Email
              </>
            )}
          </Button>

          <Button onClick={onBackToLogin} variant="ghost" className="w-full">
            Back to Sign In
          </Button>
        </div>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm">
          <p className="font-medium mb-1 text-blue-800">Current Status: Demo Mode</p>
          <p className="text-blue-700">
            Emails are currently simulated and logged to console. To receive real emails, configure an email service
            (Resend, SendGrid, or SMTP) in your environment variables.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
