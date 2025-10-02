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
    console.log("[v0] Checking environment variables for email service:")
    console.log("[v0] RESEND_API_KEY exists:", !!process.env.RESEND_API_KEY)
    console.log("[v0] FROM_EMAIL:", process.env.FROM_EMAIL)
    console.log("[v0] FROM_NAME:", process.env.FROM_NAME)
    console.log("[v0] NEXT_PUBLIC_APP_URL:", process.env.NEXT_PUBLIC_APP_URL)

    // Server-side: check for real email service configuration
    const resendApiKey = process.env.RESEND_API_KEY
    const sendgridApiKey = process.env.SENDGRID_API_KEY
    const smtpHost = process.env.SMTP_HOST
    const smtpUser = process.env.SMTP_USER
    const smtpPass = process.env.SMTP_PASS

    if (resendApiKey) {
      console.log("[v0] Using Resend email service")
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

  console.log("[v0] Falling back to demo mode - no email service configured")
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

  paymentConfirmation: (orderDetails: {
    orderId: string
    userName: string
    total: string
    items: Array<{ name: string; quantity: number; price: string }>
    shippingAddress: string
    trackingUrl?: string
  }): EmailTemplate => ({
    subject: `Order Confirmation #${orderDetails.orderId} - EazyBuy`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Order Confirmed!</h1>
        </div>
        <div style="padding: 40px 20px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${orderDetails.userName},</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            Thank you for your order! Your payment has been processed successfully.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Order #${orderDetails.orderId}</h3>
            <div style="border-top: 1px solid #e0e0e0; padding-top: 15px;">
              ${orderDetails.items
                .map(
                  (item) => `
                <div style="margin-bottom: 10px;">
                  <strong>${item.name}</strong><br>
                  <span style="color: #666;">Quantity: ${item.quantity} × ${item.price}</span>
                </div>
              `,
                )
                .join("")}
            </div>
            <div style="border-top: 2px solid #e0e0e0; padding-top: 15px; margin-top: 15px;">
              <strong style="font-size: 18px;">Total: ${orderDetails.total}</strong>
            </div>
          </div>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Shipping Address</h3>
            <p style="color: #666; margin: 0;">${orderDetails.shippingAddress}</p>
          </div>
          ${
            orderDetails.trackingUrl
              ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${orderDetails.trackingUrl}" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 5px; font-weight: bold; display: inline-block;">
              Track Your Order
            </a>
          </div>
          `
              : ""
          }
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            We'll send you another email when your order ships. If you have any questions, please contact our support team.
          </p>
        </div>
        <div style="background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px;">
          <p>© 2025 EazyBuy. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
      Order Confirmed! - EazyBuy
      
      Hi ${orderDetails.userName},
      
      Thank you for your order! Your payment has been processed successfully.
      
      Order #${orderDetails.orderId}
      
      Items:
      ${orderDetails.items.map((item) => `- ${item.name} (Qty: ${item.quantity}) - ${item.price}`).join("\n")}
      
      Total: ${orderDetails.total}
      
      Shipping Address:
      ${orderDetails.shippingAddress}
      
      ${orderDetails.trackingUrl ? `Track your order: ${orderDetails.trackingUrl}` : ""}
      
      We'll send you another email when your order ships. If you have any questions, please contact our support team.
      
      © 2025 EazyBuy. All rights reserved.
    `,
  }),

  returnRequest: (returnDetails: {
    orderId: string
    userName: string
    reason: string
    items: Array<{ name: string; quantity: number }>
    returnUrl?: string
  }): EmailTemplate => ({
    subject: `Return Request Received #${returnDetails.orderId} - EazyBuy`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Return Request Received</h1>
        </div>
        <div style="padding: 40px 20px; background: #f8f9fa;">
          <h2 style="color: #333; margin-bottom: 20px;">Hi ${returnDetails.userName},</h2>
          <p style="color: #666; font-size: 16px; line-height: 1.6;">
            We've received your return request for order #${returnDetails.orderId}. Our team will review your request and get back to you within 24-48 hours.
          </p>
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Return Details</h3>
            <p style="color: #666;"><strong>Order:</strong> #${returnDetails.orderId}</p>
            <p style="color: #666;"><strong>Reason:</strong> ${returnDetails.reason}</p>
            <div style="border-top: 1px solid #e0e0e0; padding-top: 15px; margin-top: 15px;">
              <strong>Items:</strong>
              ${returnDetails.items
                .map(
                  (item) => `
                <div style="margin-top: 10px;">
                  <span style="color: #666;">• ${item.name} (Qty: ${item.quantity})</span>
                </div>
              `,
                )
                .join("")}
            </div>
          </div>
          ${
            returnDetails.returnUrl
              ? `
          <div style="text-align: center; margin: 30px 0;">
            <a href="${returnDetails.returnUrl}" 
               style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; 
                      border-radius: 5px; font-weight: bold; display: inline-block;">
              View Return Status
            </a>
          </div>
          `
              : ""
          }
          <div style="background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0;">
            <p style="color: #856404; margin: 0; font-size: 14px;">
              <strong>Next Steps:</strong><br>
              1. Our team will review your request<br>
              2. You'll receive a return label via email<br>
              3. Pack the items securely<br>
              4. Ship using the provided label<br>
              5. Refund will be processed once we receive the items
            </p>
          </div>
          <p style="color: #666; font-size: 14px; margin-top: 30px;">
            If you have any questions about your return, please contact our support team.
          </p>
        </div>
        <div style="background: #333; color: #999; padding: 20px; text-align: center; font-size: 12px;">
          <p>© 2025 EazyBuy. All rights reserved.</p>
        </div>
      </div>
    `,
    text: `
      Return Request Received - EazyBuy
      
      Hi ${returnDetails.userName},
      
      We've received your return request for order #${returnDetails.orderId}. Our team will review your request and get back to you within 24-48 hours.
      
      Return Details:
      Order: #${returnDetails.orderId}
      Reason: ${returnDetails.reason}
      
      Items:
      ${returnDetails.items.map((item) => `- ${item.name} (Qty: ${item.quantity})`).join("\n")}
      
      ${returnDetails.returnUrl ? `View return status: ${returnDetails.returnUrl}` : ""}
      
      Next Steps:
      1. Our team will review your request
      2. You'll receive a return label via email
      3. Pack the items securely
      4. Ship using the provided label
      5. Refund will be processed once we receive the items
      
      If you have any questions about your return, please contact our support team.
      
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

    if (emailConfig.provider === "resend") {
      console.log("[v0] Sending email via Resend API to:", to)

      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${emailConfig.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: `${emailConfig.fromName} <${emailConfig.fromEmail}>`,
          to: [to],
          subject: template.subject,
          html: template.html,
          text: template.text,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("[v0] Resend API error:", response.status, errorData)
        return {
          success: false,
          error: `Resend API error: ${response.status} ${errorData.message || response.statusText}`,
        }
      }

      const result = await response.json()
      console.log("[v0] Email sent successfully via Resend:", result.id)

      return {
        success: true,
        messageId: result.id,
      }
    }

    if (emailConfig.provider === "sendgrid") {
      console.log("[v0] Sending email via SendGrid API to:", to)

      const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${emailConfig.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: emailConfig.fromEmail, name: emailConfig.fromName },
          subject: template.subject,
          content: [
            { type: "text/plain", value: template.text },
            { type: "text/html", value: template.html },
          ],
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("[v0] SendGrid API error:", response.status, errorData)
        return {
          success: false,
          error: `SendGrid API error: ${response.status} ${errorData.message || response.statusText}`,
        }
      }

      // SendGrid returns 202 with no body on success
      const messageId = response.headers.get("x-message-id") || `sendgrid-${Date.now()}`
      console.log("[v0] Email sent successfully via SendGrid")

      return {
        success: true,
        messageId,
      }
    }

    if (emailConfig.provider === "nodemailer") {
      // SMTP implementation would require nodemailer package
      console.log("[v0] SMTP email sending requires nodemailer package")
      return { success: false, error: "SMTP integration requires additional setup" }
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

export const sendPaymentConfirmationEmail = async (
  email: string,
  orderDetails: {
    orderId: string
    userName: string
    total: string
    items: Array<{ name: string; quantity: number; price: string }>
    shippingAddress: string
    trackingUrl?: string
  },
): Promise<{ success: boolean; error?: string }> => {
  const template = emailTemplates.paymentConfirmation(orderDetails)
  return await sendEmail(email, template)
}

export const sendReturnRequestEmail = async (
  email: string,
  returnDetails: {
    orderId: string
    userName: string
    reason: string
    items: Array<{ name: string; quantity: number }>
    returnUrl?: string
  },
): Promise<{ success: boolean; error?: string }> => {
  const template = emailTemplates.returnRequest(returnDetails)
  return await sendEmail(email, template)
}
