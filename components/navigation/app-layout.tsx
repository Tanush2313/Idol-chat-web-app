"use client"

import type React from "react"

import { MainNav } from "./main-nav"
import { useApp } from "@/lib/store"
import { AppOnboarding } from "@/components/onboarding/app-onboarding"  // 👈 new import

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const { isAuthenticated } = useApp()

  // If not logged in, just render the page normally (login / signup / landing)
  if (!isAuthenticated) {
    return <>{children}</>
  }

  // Logged-in area: show nav, main app, and the one-time onboarding overlay
  return (
    <div className="min-h-screen bg-background">
      <MainNav />
      <main className="lg:ml-64 pt-14 lg:pt-0 pb-16 lg:pb-0">
        {children}
      </main>

      {/* 🔥 One-time “app tour” overlay (only first time, uses localStorage) */}
      <AppOnboarding />
    </div>
  )
}

