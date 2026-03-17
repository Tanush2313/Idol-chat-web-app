"use client"

import type React from "react"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { useApp } from "@/lib/store"
import type { ThemeMode } from "@/lib/types"
import {
  Settings,
  Palette,
  Shield,
  Bell,
  Moon,
  Sparkles,
  Monitor,
  Check,
  X,
  ChevronLeft,
  LogOut,
} from "lucide-react"
import { cn } from "@/lib/utils"

const THEMES: { id: ThemeMode; name: string; icon: React.ReactNode; preview: string }[] = [
  { id: "pure-dark", name: "Pure Dark", icon: <Moon className="w-4 h-4" />, preview: "#050509" },
  {
    id: "midnight-gradient",
    name: "Midnight",
    icon: <Sparkles className="w-4 h-4" />,
    preview: "linear-gradient(135deg, #0a0a12, #1a1a2e)",
  },
  { id: "system", name: "System", icon: <Monitor className="w-4 h-4" />, preview: "#1a1a2e" },
]

export function SettingsModal() {
  const {
    showSettingsModal,
    setShowSettingsModal,
    setShowProfileModal,
    settings,
    setTheme,
    updateSettings,
    logout,
    isAuthenticated,
  } = useApp()

  const handleBack = () => {
    setShowSettingsModal(false)
    setShowProfileModal(true)
  }

  const handleLogout = () => {
    logout()
    setShowSettingsModal(false)

    // send user to login screen
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    }
  }

  return (
    <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
      <DialogContent className="sm:max-w-lg p-0 gap-0 overflow-hidden bg-card/95 backdrop-blur-xl border-border/50 animate-blur-fade-in max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-card/95 backdrop-blur-xl border-b border-border/50">
          <div className="flex items-center gap-3 p-4">
            <button onClick={handleBack} className="p-2 rounded-lg hover:bg-secondary/50 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              <DialogTitle className="text-lg font-semibold">Settings</DialogTitle>
            </div>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="ml-auto p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 animate-fade-slide-up">
          {/* Appearance */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Palette className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Appearance</h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {THEMES.map((theme, i) => (
                <button
                  key={theme.id}
                  onClick={() => setTheme(theme.id)}
                  className={cn(
                    "relative p-4 rounded-xl border transition-all interactive animate-stagger-fade",
                    settings.theme === theme.id
                      ? "bg-primary/10 border-primary/50 ring-2 ring-primary/20"
                      : "bg-secondary/30 border-border/30 hover:border-border/50",
                    `stagger-${i + 1}`,
                  )}
                >
                  <div className="w-full h-8 rounded-lg mb-3" style={{ background: theme.preview }} />
                  <div className="flex items-center gap-2 text-sm">
                    {theme.icon}
                    <span className="font-medium">{theme.name}</span>
                  </div>
                  {settings.theme === theme.id && (
                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-3 h-3 text-primary-foreground" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </section>

          {/* Content & Safety */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Content & Safety</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/30 animate-stagger-fade stagger-1">
                <div>
                  <p className="font-medium">Content Filter</p>
                  <p className="text-sm text-muted-foreground">Filter potentially inappropriate content</p>
                </div>
                <Switch
                  checked={settings.contentFilter}
                  onCheckedChange={(checked) => updateSettings({ contentFilter: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/30 animate-stagger-fade stagger-2">
                <div>
                  <p className="font-medium">Mature Content (18+)</p>
                  <p className="text-sm text-muted-foreground">Allow mature themes in conversations</p>
                </div>
                <Switch
                  checked={settings.matureContent}
                  onCheckedChange={(checked) => updateSettings({ matureContent: checked })}
                />
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-3 px-1">
              Content policies are enforced server-side. These settings control your preferences.
            </p>
          </section>

          {/* Notifications */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="font-semibold">Notifications</h3>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/30 animate-stagger-fade stagger-3">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch
                  checked={settings.notifications.email}
                  onCheckedChange={(checked) =>
                    updateSettings({ notifications: { ...settings.notifications, email: checked } })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/30 animate-stagger-fade stagger-4">
                <div>
                  <p className="font-medium">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Browser push notifications</p>
                </div>
                <Switch
                  checked={settings.notifications.push}
                  onCheckedChange={(checked) =>
                    updateSettings({ notifications: { ...settings.notifications, push: checked } })
                  }
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/30 animate-stagger-fade stagger-5">
                <div>
                  <p className="font-medium">New Features</p>
                  <p className="text-sm text-muted-foreground">Get notified about new features</p>
                </div>
                <Switch
                  checked={settings.notifications.newFeatures}
                  onCheckedChange={(checked) =>
                    updateSettings({ notifications: { ...settings.notifications, newFeatures: checked } })
                  }
                />
              </div>
            </div>
          </section>

          {/* Account / Logout */}
          {isAuthenticated && (
            <section className="border-t border-border/50 pt-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                Account
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={handleLogout}
                className="w-full justify-between bg-destructive/10 border-destructive/40 text-destructive hover:bg-destructive/20 hover:text-destructive"
              >
                <span>Log out</span>
                <LogOut className="w-4 h-4" />
              </Button>
            </section>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
