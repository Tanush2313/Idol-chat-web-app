"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useState } from "react"
import { Logo } from "@/components/ui/logo"
import { Button } from "@/components/ui/button"
import { Home, MessageCircle, PlusCircle, User, Crown, Menu, X, LogOut } from "lucide-react"
import { cn } from "@/lib/utils"
import { useApp } from "@/lib/store"

const navItems = [
  { href: "/discover", label: "Discover", icon: Home },
  { href: "/chats", label: "Chats", icon: MessageCircle },
  { href: "/create", label: "Create", icon: PlusCircle },
  { href: "/profile", label: "Profile", icon: User },
]

export function MainNav() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, logout } = useApp()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isPremium = user?.subscriptionStatus === "premium"

  const handleLogout = () => {
    logout()
    setMobileMenuOpen(false)

    // Hard redirect so state is clean and user sees login page
    if (typeof window !== "undefined") {
      window.location.href = "/login"
    } else {
      router.push("/login")
    }
  }

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 h-screen bg-sidebar border-r border-sidebar-border fixed left-0 top-0 z-40">
        <div className="p-4 border-b border-sidebar-border">
          <Link href={isAuthenticated ? "/discover" : "/"}>
            <Logo size="md" />
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-3">
          {isPremium ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-primary/20 to-accent/20 border border-primary/30">
              <Crown className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium gradient-text">IdolChat+</span>
            </div>
          ) : (
            <Link href="/pricing">
              <Button className="w-full bg-linear-to-r from-primary to-accent hover:opacity-90">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Plus
              </Button>
            </Link>
          )}

          {isAuthenticated && (
            <Button
              type="button"
              variant="outline"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-transparent border-border/50 text-muted-foreground hover:text-destructive hover:border-destructive/60"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </Button>
          )}
        </div>
      </aside>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="flex items-center justify-between px-4 h-14">
          <Link href={isAuthenticated ? "/discover" : "/"}>
            <Logo size="sm" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-muted"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-background pt-14">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <div
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl transition-all",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </div>
                </Link>
              )
            })}

            <div className="pt-4 border-t border-border mt-4 space-y-3">
              {isPremium ? (
                <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-linear-to-r from-primary/20 to-accent/20 border border-primary/30">
                  <Crown className="w-5 h-5 text-primary" />
                  <span className="font-medium gradient-text">IdolChat+ Active</span>
                </div>
              ) : (
                <Link href="/pricing" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full bg-linear-to-r from-primary to-accent">
                    <Crown className="w-4 h-4 mr-2" />
                    Upgrade to Plus
                  </Button>
                </Link>
              )}

              {isAuthenticated && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 bg-transparent border-border/50 text-muted-foreground hover:text-destructive hover:border-destructive/60"
                >
                  <LogOut className="w-4 h-4" />
                  Log out
                </Button>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-t border-border">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
                    isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="text-xs">{item.label}</span>
                </div>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
