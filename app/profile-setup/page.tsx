// app/profile-setup/page.tsx
"use client"

import { useEffect, useState, FormEvent } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useApp } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Logo } from "@/components/ui/logo"

// You can swap these with your own avatar URLs
const PRESET_AVATARS = [
  "/avatars/anime-girl-1.png",
  "/avatars/anime-girl-2.png",
  "/avatars/anime-boy-1.png",
  "/avatars/anime-boy-2.png",
]

export default function ProfileSetupPage() {
  const router = useRouter()
  const { user, updateProfile } = useApp()

  // ✅ only protect route if NO user
  useEffect(() => {
    if (!user) {
      router.replace("/login")
    }
  }, [user, router])

  if (!user) return null

  const [username, setUsername] = useState(user.username || "")
  const [bio, setBio] = useState(user.bio || "")
  const [avatarUrl, setAvatarUrl] = useState(
    user.avatarUrl || PRESET_AVATARS[0],
  )
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")

    if (!username.trim()) {
      setError("Please choose a username")
      return
    }

    setIsSaving(true)
    try {
      updateProfile({
        username: username.trim(),
        bio: bio.trim(),
        avatarUrl,
      })

      // After saving profile, always go to Discover
      router.push("/discover")
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md bg-card/90 border border-border/60 rounded-3xl shadow-2xl p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <Logo size="md" />
          <h1 className="mt-2 text-xl font-semibold">
            {user.hasCompletedProfile ? "Edit your profile" : "Set up your profile"}
          </h1>
          <p className="text-xs text-muted-foreground text-center">
            This helps characters address you properly and personalize your chats.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar picker */}
          <div className="space-y-3">
            <Label className="text-sm">Avatar</Label>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded-2xl overflow-hidden border border-border/60 bg-secondary flex items-center justify-center">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt="avatar"
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                ) : null}
              </div>

              <div className="flex-1 space-y-2">
                <p className="text-xs text-muted-foreground">
                  Pick one of these for now (you can change later).
                </p>
                <div className="flex gap-2">
                  {PRESET_AVATARS.map((url) => (
                    <button
                      key={url}
                      type="button"
                      onClick={() => setAvatarUrl(url)}
                      className={`h-10 w-10 rounded-xl overflow-hidden border transition ${
                        avatarUrl === url
                          ? "border-primary ring-2 ring-primary/40"
                          : "border-border hover:border-primary/60"
                      }`}
                    >
                      <Image
                        src={url}
                        alt="avatar option"
                        width={40}
                        height={40}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Username */}
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ghostedboy7"
              maxLength={24}
            />
            <p className="text-[11px] text-muted-foreground">
              This is what characters will call you.
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio (optional)</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Love chatting with AI characters, K-pop and anime addict..."
              rows={3}
            />
          </div>

          {error && (
            <p className="text-xs text-red-400 bg-red-400/10 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <Button
            type="submit"
            className="w-full bg-linear-to-r from-primary to-accent"
            disabled={isSaving}
          >
            {isSaving
              ? "Saving..."
              : user.hasCompletedProfile
              ? "Save changes"
              : "Finish setup"}
          </Button>
        </form>

        <p className="text-[11px] text-center text-muted-foreground">
          You can always edit this later from your profile page.
        </p>
      </div>
    </div>
  )
}
