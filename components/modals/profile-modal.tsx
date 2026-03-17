"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useApp } from "@/lib/store"
import { getCharacters } from "@/lib/mock-api"
import type { Character } from "@/lib/types"
import { User, Crown, Heart, Sparkles, Settings, LogOut, ChevronRight, X, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

export function ProfileModal() {
  const router = useRouter()
  const { user, showProfileModal, setShowProfileModal, setShowSettingsModal, logout } = useApp()
  const [createdCharacters, setCreatedCharacters] = useState<Character[]>([])
  const [favoriteCharacters, setFavoriteCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (showProfileModal && user) {
      loadCharacters()
    }
  }, [showProfileModal, user])

  const loadCharacters = async () => {
    setLoading(true)
    const chars = await getCharacters()
    if (user) {
      setCreatedCharacters(chars.filter((c) => user.createdCharacterIds.includes(c.id)).slice(0, 3))
      setFavoriteCharacters(chars.filter((c) => user.favoriteCharacterIds.includes(c.id)).slice(0, 3))
    }
    setLoading(false)
  }

  const handleOpenSettings = () => {
    setShowProfileModal(false)
    setShowSettingsModal(true)
  }

  const handleNavigate = (path: string) => {
    setShowProfileModal(false)
    router.push(path)
  }

  const handleLogout = () => {
    logout()
    setShowProfileModal(false)
  }

  if (!user) return null

  const isPremium = user.subscriptionStatus === "premium"

  return (
    <Dialog open={showProfileModal} onOpenChange={setShowProfileModal}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden bg-card/95 backdrop-blur-xl border-border/50 animate-blur-fade-in max-h-[85vh] overflow-y-auto">
        {/* Header with avatar */}
        <div className="relative">
          <div className="h-24 bg-linear-to-br from-primary/30 via-accent/20 to-primary/10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_100%,rgba(120,80,255,0.2),transparent_50%)]" />
          </div>
          <button
            onClick={() => setShowProfileModal(false)}
            className="absolute top-3 right-3 p-2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Avatar */}
          <div className="absolute -bottom-10 left-6">
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-primary/30 to-accent/30 flex items-center justify-center ring-4 ring-card overflow-hidden">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl || "/placeholder.svg"}
                  alt={user.username}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
            {isPremium && (
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-linear-to-r from-amber-500 to-orange-500 ring-2 ring-card">
                <Crown className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>

        <div className="pt-14 px-6 pb-6 animate-fade-slide-up">
          {/* User info */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl font-bold">{user.username}</h2>
              {isPremium && (
                <Badge className="bg-linear-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30 text-xs">
                  <Crown className="w-3 h-3 mr-1" />
                  Plus
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">{user.bio || "No bio yet"}</p>
            <div className="flex gap-4 mt-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-primary" />
                {user.createdCharacterIds.length} created
              </span>
              <span className="flex items-center gap-1">
                <Heart className="w-4 h-4 text-pink-500" />
                {user.favoriteCharacterIds.length} favorites
              </span>
            </div>
          </div>

          {/* Quick actions */}
          <div className="space-y-2 mb-6">
            <button
              onClick={() => handleNavigate("/profile")}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">View Full Profile</p>
                  <p className="text-xs text-muted-foreground">Edit profile, view all characters</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>

            <button
              onClick={handleOpenSettings}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <div className="text-left">
                  <p className="font-medium">Settings</p>
                  <p className="text-xs text-muted-foreground">Theme, notifications, safety</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>

            {!isPremium && (
              <button
                onClick={() => handleNavigate("/pricing")}
                className="w-full flex items-center justify-between p-3 rounded-xl bg-linear-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 hover:border-amber-500/40 transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-linear-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                    <Crown className="w-5 h-5 text-amber-400" />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-amber-400">Upgrade to Plus</p>
                    <p className="text-xs text-muted-foreground">Unlimited messages, priority access</p>
                  </div>
                </div>
                <ExternalLink className="w-5 h-5 text-amber-400" />
              </button>
            )}
          </div>

          {/* Recent characters */}
          {createdCharacters.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-muted-foreground">Your Characters</h3>
                <button onClick={() => handleNavigate("/profile")} className="text-xs text-primary hover:underline">
                  View all
                </button>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {loading
                  ? Array(3)
                      .fill(0)
                      .map((_, i) => <div key={i} className="w-16 h-16 rounded-xl skeleton shrink-0" />)
                  : createdCharacters.map((char, i) => (
                      <button
                        key={char.id}
                        onClick={() => handleNavigate(`/chat/${char.id}`)}
                        className={cn(
                          "w-16 h-16 rounded-xl overflow-hidden shrink-0 ring-2 ring-transparent hover:ring-primary/50 transition-all interactive",
                          `stagger-${i + 1}`,
                        )}
                      >
                        <img
                          src={char.avatarUrl || "/placeholder.svg"}
                          alt={char.name}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
              </div>
            </div>
          )}

          {/* Logout */}
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full bg-transparent border-border/50 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
