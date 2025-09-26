"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { verifyEmail } from "@/lib/auth"

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token")

  useEffect(() => {
    const handleVerification = async () => {
      if (!token) {
        setStatus("error")
        setMessage("Invalid verification link. No token provided.")
        return
      }

      try {
        const result = await verifyEmail(token)
        if (result.success) {
          setStatus("success")
          setMessage("Your email has been successfully verified! You can now sign in to your account.")
        } else {
          setStatus("error")
          setMessage(result.error || "Verification failed. The link may be invalid or expired.")
        }
      } catch (error) {
        setStatus("error")
        setMessage("An error occurred during verification. Please try again.")
      }
    }

    handleVerification()
  }, [token])

  const handleContinue = () => {
    router.push("/auth")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            {status === "loading" && (
              <div className="bg-blue-100">
                <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
              </div>
            )}
            {status === "success" && (
              <div className="bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            )}
            {status === "error" && (
              <div className="bg-red-100">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {status === "loading" && "Verifying Email..."}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription>{message}</CardDescription>
        </CardHeader>
        <CardContent>
          {status !== "loading" && (
            <div className="space-y-4">
              <Button onClick={handleContinue} className="w-full">
                {status === "success" ? "Continue to Sign In" : "Back to Sign In"}
              </Button>
              {status === "error" && (
                <div className="text-sm text-muted-foreground text-center">
                  <p>Need help? Contact support or try registering again.</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
