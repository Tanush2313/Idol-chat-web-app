// components/onboarding/profile/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Logo } from "@/components/ui/logo"

export default function ProfileOnboarding() {
  const router = useRouter()
  const { user, isAuthenticated, updateProfile } = useApp()

  const [username, setUsername] = useState("")
  const [bio, setBio] = useState("")
  const [avatarUrl, setAvatarUrl] = useState("")
  const [error, setError] = useState("")

  // if not logged in, send to login
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login")
      return
    }
    if (user?.hasCompletedProfile) {
      router.replace("/discover")
    }
  }, [isAuthenticated, user, router])

  if (!user || user.hasCompletedProfile) {
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username.trim()) {
      setError("Please choose a username")
      return
    }

    updateProfile({
      username: username.trim(),
      bio: bio.trim(),
      avatarUrl: avatarUrl.trim() || undefined,
    })

    router.replace("/discover")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-3xl border border-border/60 bg-card/80 p-6 shadow-xl">
        <div className="flex justify-center mb-4">
          <Logo size="md" />
        </div>
        <h1 className="text-xl font-semibold text-center mb-2">Set up your profile</h1>
        <p className="text-sm text-muted-foreground text-center mb-6">
          Choose a username and short bio so your chats feel more personal.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Username</label>
            <Input
              className="mt-1"
              placeholder="ChatLover, AnimeFan, Roshan123…"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              className="mt-1"
              rows={3}
              placeholder="Tell a bit about yourself or how you like to chat."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm font-medium">Avatar URL (optional)</label>
            <Input
              className="mt-1"
              placeholder="https://example.com/avatar.png"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
          )}

          <Button type="submit" className="w-full bg-linear-to-r from-primary to-accent hover:opacity-90">
            Continue
          </Button>
        </form>
      </div>
    </div>
  )
}
