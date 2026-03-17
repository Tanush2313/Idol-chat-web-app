"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/navigation/app-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import {
  User,
  Settings,
  Crown,
  Heart,
  Sparkles,
  Bell,
  Shield,
  Palette,
  Moon,
  Monitor,
  Check,
  ExternalLink,
  ImageIcon,
  LogOut, // 👈 NEW
} from "lucide-react"
import { useApp } from "@/lib/store"
import { CharacterCard } from "@/components/character-card"
import type { Character, ThemeMode } from "@/lib/types"
import { getCharacters } from "@/lib/mock-api"

const THEMES: { id: ThemeMode; name: string; icon: React.ReactNode }[] = [
  { id: "pure-dark", name: "Pure Dark", icon: <Moon className="w-4 h-4" /> },
  { id: "midnight-gradient", name: "Midnight Gradient", icon: <Sparkles className="w-4 h-4" /> },
  { id: "system", name: "System", icon: <Monitor className="w-4 h-4" /> },
]

export function ProfilePage() {
  const router = useRouter()
  const { user, isAuthenticated, settings, setTheme, updateSettings, logout } = useApp() // 👈 logout added
  const [createdCharacters, setCreatedCharacters] = useState<Character[]>([])
  const [favoriteCharacters, setFavoriteCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const loadCharacters = async () => {
      const chars = await getCharacters()
      if (user) {
        setCreatedCharacters(chars.filter((c) => user.createdCharacterIds.includes(c.id)))
        setFavoriteCharacters(chars.filter((c) => user.favoriteCharacterIds.includes(c.id)))
      }
      setLoading(false)
    }
    loadCharacters()
  }, [isAuthenticated, user, router])

  if (!isAuthenticated || !user) {
    return null
  }

  const isPremium = user.subscriptionStatus === "premium"

  const handleLogoutClick = () => {
    logout()
    router.push("/login")
  }

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <Tabs defaultValue="profile" className="space-y-8">
            <TabsList className="bg-secondary/50 border border-border/50">
              <TabsTrigger value="profile" className="data-[state=active]:bg-primary/20">
                <User className="w-4 h-4 mr-2" />
                Profile
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-primary/20">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile" className="space-y-8">
              {/* User Info Card */}
              <Card className="p-6 bg-card/50 border-border/50">
                <div className="flex flex-col sm:flex-row gap-6">
                  <div className="w-24 h-24 rounded-2xl bg-linear-to-br from-primary/30 to-accent/30 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.username}
                        className="w-full h-full object-cover rounded-2xl"
                      />
                    ) : (
                      <ImageIcon className="w-10 h-10 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 text-center sm:text-left">
                    <div className="flex items-center gap-2 justify-center sm:justify-start mb-1">
                      <h1 className="text-2xl font-bold">{user.username || "New user"}</h1>
                      {isPremium && (
                        <Badge className="bg-linear-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30">
                          <Crown className="w-3 h-3 mr-1" />
                          IdolChat+
                        </Badge>
                      )}
                    </div>
                    <p className="text-muted-foreground mb-4">{user.bio || "No bio yet"}</p>

                    <div className="flex gap-4 text-sm text-muted-foreground justify-center sm:justify-start">
                      <span>{user.createdCharacterIds.length} characters created</span>
                      <span>{user.favoriteCharacterIds.length} favorites</span>
                    </div>
                  </div>

                  <div className="flex sm:flex-col gap-2 justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-border/50 bg-transparent"
                      onClick={() => router.push("/profile-setup")}
                    >
                      Edit Profile
                    </Button>
                    {!isPremium && (
                      <Button
                        size="sm"
                        className="bg-linear-to-r from-amber-500 to-orange-500 hover:opacity-90"
                        onClick={() => router.push("/pricing")}
                      >
                        <Crown className="w-4 h-4 mr-1" />
                        Upgrade
                      </Button>
                    )}
                  </div>
                </div>
              </Card>

              {/* Created Characters */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    My Characters
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-border/50 bg-transparent"
                    onClick={() => router.push("/create")}
                  >
                    Create New
                  </Button>
                </div>

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-40 rounded-2xl bg-secondary/30 animate-pulse" />
                    ))}
                  </div>
                ) : createdCharacters.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {createdCharacters.map((character) => (
                      <CharacterCard key={character.id} character={character} />
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 bg-card/30 border-border/30 text-center">
                    <Sparkles className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground mb-4">
                      You haven&apos;t created any characters yet
                    </p>
                    <Button onClick={() => router.push("/create")}>
                      Create Your First Character
                    </Button>
                  </Card>
                )}
              </div>

              {/* Favorites */}
              <div>
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-pink-500" />
                  Favorites
                </h2>

                {loading ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-40 rounded-2xl bg-secondary/30 animate-pulse" />
                    ))}
                  </div>
                ) : favoriteCharacters.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {favoriteCharacters.map((character) => (
                      <CharacterCard key={character.id} character={character} />
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 bg-card/30 border-border/30 text-center">
                    <Heart className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground mb-4">No favorites yet</p>
                    <Button variant="outline" onClick={() => router.push("/discover")}>
                      Discover Characters
                    </Button>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              {/* Appearance */}
              <Card className="p-6 bg-card/50 border-border/50">
                <div className="flex items-center gap-2 mb-6">
                  <Palette className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">Appearance</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => setTheme(theme.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                        settings.theme === theme.id
                          ? "bg-primary/10 border-primary/50"
                          : "bg-secondary/30 border-border/30 hover:border-border/50"
                      }`}
                    >
                      {theme.icon}
                      <span className="font-medium">{theme.name}</span>
                      {settings.theme === theme.id && (
                        <Check className="w-4 h-4 text-primary ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </Card>

              {/* Content Filters */}
              <Card className="p-6 bg-card/50 border-border/50">
                <div className="flex items-center gap-2 mb-6">
                  <Shield className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">Content & Safety</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                    <div>
                      <p className="font-medium">Content Filter</p>
                      <p className="text-sm text-muted-foreground">
                        Filter potentially inappropriate content
                      </p>
                    </div>
                    <Switch
                      checked={settings.contentFilter}
                      onCheckedChange={(checked) =>
                        updateSettings({ contentFilter: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                    <div>
                      <p className="font-medium">Mature Content (18+)</p>
                      <p className="text-sm text-muted-foreground">
                        Allow mature themes in conversations
                      </p>
                    </div>
                    <Switch
                      checked={settings.matureContent}
                      onCheckedChange={(checked) =>
                        updateSettings({ matureContent: checked })
                      }
                    />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground mt-4">
                  Content policies are enforced server-side. These settings control your
                  preferences.
                </p>
              </Card>

              {/* Notifications */}
              <Card className="p-6 bg-card/50 border-border/50">
                <div className="flex items-center gap-2 mb-6">
                  <Bell className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold">Notifications</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Receive updates via email
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.email}
                      onCheckedChange={(checked) =>
                        updateSettings({
                          notifications: { ...settings.notifications, email: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-muted-foreground">
                        Browser push notifications
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.push}
                      onCheckedChange={(checked) =>
                        updateSettings({
                          notifications: { ...settings.notifications, push: checked },
                        })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30">
                    <div>
                      <p className="font-medium">New Features</p>
                      <p className="text-sm text-muted-foreground">
                        Get notified about new features
                      </p>
                    </div>
                    <Switch
                      checked={settings.notifications.newFeatures}
                      onCheckedChange={(checked) =>
                        updateSettings({
                          notifications: { ...settings.notifications, newFeatures: checked },
                        })
                      }
                    />
                  </div>
                </div>
              </Card>

              {/* Subscription */}
              <Card className="p-6 bg-card/50 border-border/50">
                <div className="flex items-center gap-2 mb-6">
                  <Crown className="w-5 h-5 text-amber-500" />
                  <h2 className="text-lg font-semibold">Subscription</h2>
                </div>

                <div className="p-4 rounded-xl bg-secondary/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {isPremium ? (
                      <div className="w-10 h-10 rounded-full bg-linear-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center">
                        <Crown className="w-5 h-5 text-amber-400" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                        <User className="w-5 h-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{isPremium ? "IdolChat+" : "Free Plan"}</p>
                      <p className="text-sm text-muted-foreground">
                        {isPremium ? "Premium features unlocked" : "50 messages per day"}
                      </p>
                    </div>
                  </div>

                  <Button
                    variant={isPremium ? "outline" : "default"}
                    className={
                      isPremium
                        ? "border-border/50"
                        : "bg-linear-to-r from-amber-500 to-orange-500 hover:opacity-90"
                    }
                    onClick={() => router.push("/pricing")}
                  >
                    {isPremium ? "Manage" : "Upgrade"}
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </Card>

              {/* Account / Logout */}
              <Card className="p-6 bg-card/50 border-border/50">
                <div className="flex items-center gap-2 mb-4">
                  <LogOut className="w-5 h-5 text-destructive" />
                  <h2 className="text-lg font-semibold">Account</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Log out of your account on this device. You can log in again anytime.
                </p>
                <Button
                  variant="outline"
                  className="w-full border-destructive/60 text-destructive hover:bg-destructive/10"
                  onClick={handleLogoutClick}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Log out
                </Button>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  )
}
