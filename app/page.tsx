"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/store"

/**
 * This page is now only responsible for deciding:
 * - if user is NOT logged in  -> go to /login
 * - if user IS logged in      -> go to /discover  (or /chats, your choice)
 */
export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useApp()

  useEffect(() => {
    if (isAuthenticated) {
      // 🔁 main screen for logged-in users (choose what you like here)
      router.replace("/discover")   // or "/chats"
    } else {
      // 🔐 first screen for new users
      router.replace("/login")
    }
  }, [isAuthenticated, router])

  // We don't render anything here because we immediately redirect
  return null
}

