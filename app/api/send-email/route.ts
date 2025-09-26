import { type NextRequest, NextResponse } from "next/server"
import { sendPasswordResetEmail, sendVerificationEmail } from "@/lib/email-service"

export async function POST(request: NextRequest) {
  try {
    const { type, email, userName, token } = await request.json()

    console.log("[v0] Email API called with:", { type, email, userName })

    let result
    if (type === "password-reset") {
      result = await sendPasswordResetEmail(email, userName, token)
    } else if (type === "verification") {
      result = await sendVerificationEmail(email, userName, token)
    } else {
      return NextResponse.json({ success: false, error: "Invalid email type" }, { status: 400 })
    }

    console.log("[v0] Email sending result:", result)

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Email API error:", error)
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 })
  }
}
