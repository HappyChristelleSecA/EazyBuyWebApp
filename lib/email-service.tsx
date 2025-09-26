// Email service configuration and sending functionality
export interface EmailConfig {
  provider: "nodemailer" | "resend" | "sendgrid" | "demo"
  apiKey?: string
  smtpHost?: string
  smtpPort?: number
  smtpUser?: string
  smtpPass?: string
  fromEmail: string
  fromName: string
}

export interface EmailTemplate {
  subject: string
  html: string
  text: string
}

// Default email configuration - uses demo mode if no real service is configured
const getEmailConfig = (): EmailConfig => {
  // Check for environment variables for real email service
  if (typeof window === "undefined") {
    // Server-side: check for real email service configuration
    const resendApiKey = process.env.RESEND_API_KEY
    const sendgridApiKey = process.env.SENDGRID_API_KEY
    const smtpHost = process.env.SMTP_HOST
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS

    if (resendApiKey) {
      return {
        provider: "resend",
        apiKey: resendApiKey,
        fromEmail: process.env.FROM_EMAIL || "noreply@eazybuy.com",
        fromName: process.env.FROM_NAME || "EazyBuy",
      }
    }

    if (sendgridApiKey) {
      return {
        provider: "sendgrid",
        apiKey: sendgridApiKey,
        fromEmail: process.env.FROM_EMAIL || "noreply@eazybuy.com",
        fromName: process.env.FROM_NAME || "EazyBuy",
      }
    }

    if (smtpHost && smtpUser && smtpPass) {
      return {
        provider: "nodemailer",
        smtpHost,
        smtpPort: Number.parseInt(process.env.SMTP_PORT || "587"),
        smtpUser,
        smtpPass,
        fromEmail: process.env.FROM_EMAIL || "noreply@eazybuy.com",
        fromName: process.env.FROM_NAME || "EazyBuy",
      }
    }
  }

  // Fallback to demo mode
  return {
    provider: "demo",
    fromEmail: "noreply@eazybuy.com",
    fromName: "EazyBuy",
  }
}

// Email templates
export const emailTemplates = {
  emailVerification: (verificationUrl: string, userName: string): EmailTemplate => ({
    subject: "Verify Your Email Address - EazyBuy",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to EazyBuy!</h1>
        </div>
        <div style="padding: 40px 20px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${userName},</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Thank you for signing up for EazyBuy! To complete your registration and start shopping, 
            please verify your email address by clicking the button below.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 5px; font-weight: bold; display: inline-block;">
              Verify Email Address
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${verificationUrl}" style="color: #667eea;">${verificationUrl}</a>
          </p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This verification link will expire in 24 hours for security reasons.
          </p>
        </div>
        <div style="background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px;">
          <p>© 2025 EazyBuy. All rights reserved.</p>
          <p>If you didn't create an account, please ignore this email.</p>
        </div>
      </div>
    `,
    text: `
      Welcome to EazyBuy!
      
      Hi ${userName},
      
      Thank you for signing up for EazyBuy! To complete your registration and start shopping, 
      please verify your email address by visiting this link:
      
      ${verificationUrl}
      
      This verification link will expire in 24 hours for security reasons.
      
      If you didn't create an account, please ignore this email.
      
      © 2025 EazyBuy. All rights reserved.
    `,
  }),

  passwordReset: (resetUrl: string, userName: string): EmailTemplate => ({
    subject: "Reset Your Password - EazyBuy",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset</h1>
        </div>
        <div style="padding: 40px 20px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${userName},</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            We received a request to reset your password for your EazyBuy account. 
            Click the button below to create a new password.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" 
               style="background: #dc3545; color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 5px; font-weight: bold; display: inline-block;">
              Reset Password
            </a>
          </div>
          <p style="color: #666; font-size: 14px;">
            If the button doesn't work, copy and paste this link into your browser:<br>
            <a href="${resetUrl}" style="color: #dc3545;">${resetUrl}</a>
          </p>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            This password reset link will expire in 1 hour for security reasons.
          </p>
          <p style="color: #666; font-size: 14px;">
            If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
          </p>
        </div>
        <div style="background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px;">
          <p>© 2025 EazyBuy. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
      Password Reset - EazyBuy
      
      Hi ${userName},
      
      We received a request to reset your password for your EazyBuy account. 
      Visit this link to create a new password:
      
      ${resetUrl}
      
      This password reset link will expire in 1 hour for security reasons.
      
      If you didn't request a password reset, please ignore this email. Your password will remain unchanged.
      
      © 2025 EazyBuy. All rights reserved.
    `,
  }),
}

// Email sending function
export const sendEmail = async (
  to: string,
  template: EmailTemplate,
  config?: EmailConfig,
): Promise<{ success: boolean; error?: string; messageId?: string }> => {
  const emailConfig = config || getEmailConfig()

  try {
    if (emailConfig.provider === "demo") {
      // Demo mode - log email instead of sending
      console.log("[v0] EMAIL DEMO MODE - Email would be sent:")
      console.log("[v0] To:", to)
      console.log("[v0] Subject:", template.subject)
      console.log("[v0] Content:", template.text)
      console.log("[v0] HTML Length:", template.html.length, "characters")

      // Simulate email sending delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      return {
        success: true,
        messageId: `demo-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      }
    }

    // Real email sending would go here
    if (emailConfig.provider === "resend") {
      // Example Resend implementation (requires Resend package)
      console.log("[v0] Would send email via Resend API")
      return { success: false, error: "Resend integration not implemented yet" }
    }

    if (emailConfig.provider === "sendgrid") {
      // Example SendGrid implementation (requires SendGrid package)
      console.log("[v0] Would send email via SendGrid API")
      return { success: false, error: "SendGrid integration not implemented yet" }
    }

    if (emailConfig.provider === "nodemailer") {
      // Example Nodemailer implementation (requires Nodemailer package)
      console.log("[v0] Would send email via SMTP")
      return { success: false, error: "Nodemailer integration not implemented yet" }
    }

    return { success: false, error: "Unknown email provider" }
  } catch (error) {
    console.error("[v0] Email sending error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to send email",
    }
  }
}

// Helper functions for common email types
export const sendVerificationEmail = async (
  email: string,
  userName: string,
  verificationToken: string,
): Promise<{ success: boolean; error?: string }> => {
  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`
  const template = emailTemplates.emailVerification(verificationUrl, userName)

  return await sendEmail(email, template)
}

export const sendPasswordResetEmail = async (
  email: string,
  userName: string,
  resetToken: string,
): Promise<{ success: boolean; error?: string }> => {
  const baseUrl =
    typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

  const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`
  const template = emailTemplates.passwordReset(resetUrl, userName)

  return await sendEmail(email, template)
}
