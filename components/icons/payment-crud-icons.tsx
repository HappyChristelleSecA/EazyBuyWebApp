import type React from "react"

interface IconProps {
  className?: string
  size?: number
}

export const AddPaymentIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
  </svg>
)

export const ViewPaymentIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
  </svg>
)

export const EditPaymentIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
  </svg>
)

export const DeletePaymentIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
  </svg>
)

export const SetDefaultPaymentIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
  </svg>
)

export const CreditCardIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm0 14H4v-6h16v6zm0-10H4V6h16v2z" />
  </svg>
)

export const PayPalIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M7.076 21c.167-1 .76-4.27.76-4.27s.596-3.583 1.44-6.73h2.665c2.042 0 3.74-.673 4.295-2.157.554-1.484-.015-3.843-2.736-3.843H8.5L7.076 21z" />
    <path d="M12.5 4h-1.25c-.69 0-1.25.56-1.25 1.25v.5c0 .69.56 1.25 1.25 1.25H12.5c1.38 0 2.5-1.12 2.5-2.5S13.88 4 12.5 4z" />
  </svg>
)

export const BankIcon: React.FC<IconProps> = ({ className = "", size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M11.5 1L2 6v2h20V6l-9.5-5zM4 8v11h3v-7h2v7h2v-7h2v7h2v-7h3v7h3V8H4z" />
  </svg>
)
