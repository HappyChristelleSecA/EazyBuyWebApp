# Email Configuration Guide

Your EazyBuy application currently runs in **demo mode** where emails are simulated and logged to the console instead of being sent. To enable real email functionality, you need to configure one of the supported email services.

## Supported Email Services

### 1. Resend (Recommended)
Resend is a modern email API that's easy to set up and reliable.

**Environment Variables:**
\`\`\`env
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=EazyBuy
NEXT_PUBLIC_APP_URL=https://yourdomain.com
\`\`\`

**Setup Steps:**
1. Sign up at [resend.com](https://resend.com)
2. Get your API key from the dashboard
3. Add the environment variables to your Vercel project
4. Verify your domain (for production)

### 2. SendGrid
SendGrid is a popular email service with good deliverability.

**Environment Variables:**
\`\`\`env
SENDGRID_API_KEY=your_sendgrid_api_key_here
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=EazyBuy
NEXT_PUBLIC_APP_URL=https://yourdomain.com
\`\`\`

### 3. SMTP (Custom Email Server)
Use any SMTP server including Gmail, Outlook, or custom servers.

**Environment Variables:**
\`\`\`env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password
FROM_EMAIL=your_email@gmail.com
FROM_NAME=EazyBuy
NEXT_PUBLIC_APP_URL=https://yourdomain.com
\`\`\`

## How It Works

1. **Demo Mode (Current)**: Emails are logged to console, no real emails sent
2. **Production Mode**: Real emails sent via configured service

The system automatically detects which email service to use based on available environment variables:
- If `RESEND_API_KEY` is found → Uses Resend
- If `SENDGRID_API_KEY` is found → Uses SendGrid  
- If SMTP variables are found → Uses SMTP
- Otherwise → Falls back to demo mode

## Email Types Supported

- **Email Verification**: Sent when users register
- **Password Reset**: Sent when users request password reset
- **Order Confirmations**: Sent when orders are placed
- **Shipping Updates**: Sent when orders ship

## Testing Email Setup

1. Configure your chosen email service
2. Deploy your changes
3. Try registering a new account
4. Check your email inbox for the verification email

## Troubleshooting

- **Not receiving emails**: Check spam folder, verify environment variables
- **Demo mode still active**: Ensure environment variables are set correctly
- **Email bouncing**: Verify your domain and sender reputation
- **SMTP errors**: Check credentials and server settings

For production use, we recommend Resend for its simplicity and reliability.
