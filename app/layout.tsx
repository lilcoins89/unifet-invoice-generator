import type { Metadata, Viewport } from "next"
import type { ReactNode } from "react"
import "./globals.css"

export const metadata: Metadata = {
  title: "UNIFET Shipping | Invoice Generator",
  description: "Create polished shipping invoices for UNIFET Shipping Company.",
}

export const viewport: Viewport = {
  themeColor: "#f5f7fa",
  width: "device-width",
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="bg-background">
      <body>{children}</body>
    </html>
  )
}
