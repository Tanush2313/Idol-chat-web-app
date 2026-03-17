"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useApp } from "@/lib/store"
import { APP_NAME } from "@/lib/types"
import { Eye, EyeOff, Loader2, Sparkles, X } from "lucide-react"

export function LoginModal() {
  const { showLoginModal, setShowLoginModal, login, signup } = useApp()
  const [mode, setMode] = useState<"login" | "signup">("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!showLoginModal) {
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setError("")
      setAgeConfirmed(false)
    }
  }, [showLoginModal])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (mode === "signup" && !ageConfirmed) {
      setError("You must confirm you are 18+ to sign up")
      return
    }

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)
    try {
      if (mode === "login") {
        await login(email, password)
      } else {
        await signup(email, password)
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = () => {
    setIsLoading(true)
    setTimeout(() => {
      login("google@example.com", "google")
    }, 500)
  }

  return (
    <Dialog open={showLoginModal} onOpenChange={setShowLoginModal}>
      <DialogContent className="sm:max-w-md p-0 gap-0 overflow-hidden bg-card/95 backdrop-blur-xl border-border/50 animate-blur-fade-in">
        {/* Decorative header */}
        <div className="relative h-32 bg-linear-to-br from-primary/30 via-accent/20 to-primary/10 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,80,255,0.3),transparent_60%)]" />
          <div className="absolute top-4 left-4 w-20 h-20 bg-primary/20 rounded-full blur-2xl animate-float" />
          <div
            className="absolute bottom-4 right-4 w-16 h-16 bg-accent/20 rounded-full blur-2xl animate-float"
            style={{ animationDelay: "1s" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center animate-fade-slide-down">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 mb-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium gradient-text">{APP_NAME}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowLoginModal(false)}
            className="absolute top-3 right-3 p-2 rounded-full bg-background/50 backdrop-blur-sm hover:bg-background/70 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 animate-fade-slide-up">
          <DialogHeader className="text-center mb-6">
            <DialogTitle className="text-2xl font-bold">
              {mode === "login" ? "Welcome back" : "Create account"}
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "login" ? "Sign in to continue your conversations" : "Join thousands of users chatting with AI"}
            </p>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="h-11 bg-secondary/50 border-border/50 focus:border-primary/50 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="h-11 pr-10 bg-secondary/50 border-border/50 focus:border-primary/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="h-11 bg-secondary/50 border-border/50 focus:border-primary/50 transition-colors"
                  />
                </div>

                <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 border border-border/30">
                  <Checkbox
                    id="age"
                    checked={ageConfirmed}
                    onCheckedChange={(checked) => setAgeConfirmed(checked as boolean)}
                    className="mt-0.5"
                  />
                  <Label htmlFor="age" className="text-sm font-normal text-muted-foreground leading-relaxed">
                    I confirm that I am 18 years of age or older
                  </Label>
                </div>
              </>
            )}

            {error && (
              <div className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg border border-destructive/20 animate-scale-fade-in">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-linear-to-r from-primary to-accent hover:opacity-90 btn-press font-medium"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : mode === "login" ? (
                "Sign in"
              ) : (
                "Create account"
              )}
            </Button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border/50" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-card px-3 text-muted-foreground">or continue with</span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full h-11 bg-secondary/30 border-border/50 hover:bg-secondary/50 btn-press"
            onClick={handleGoogleAuth}
            disabled={isLoading}
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("signup")}
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => setMode("login")}
                  className="font-medium text-primary hover:text-primary/80 transition-colors"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
