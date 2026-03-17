// app/layout.tsx (Next.js app router)
import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { AppProvider } from "@/lib/store"
import { Analytics } from "@vercel/analytics/react";
import { APP_NAME, APP_TAGLINE } from "@/lib/types"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: `${APP_NAME} - ${APP_TAGLINE}`,
  description:
    "Chat with AI idols, characters & friends. Experience realistic personalities, long-term memory, and multi-character rooms.",
  generator: "idolchat",
  keywords: ["AI chat", "character AI", "virtual idol", "roleplay", "AI companion"],
}

export const viewport: Viewport = {
  themeColor: "#0a0a12",
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
 return (
  <html lang="en" className="dark">
    <body className={`${geist.className} font-sans antialiased`}>
      <div className="page-root">
        <AppProvider>{children}</AppProvider>
      </div>

      <Analytics />
      
    </body>
  </html>
);
}
