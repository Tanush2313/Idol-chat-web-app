"use client"

import type React from "react"
import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Logo } from "@/components/ui/logo"
import { useApp } from "@/lib/store"
import { APP_NAME } from "@/lib/types"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"         // ⬅️ NEW

interface AuthFormProps {
  mode: "login" | "signup"
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const { login, signup } = useApp()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  const [ageConfirmed, setAgeConfirmed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")

  // ---- Signup multi-step + OTP ----
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1)
  const [generatedOtp, setGeneratedOtp] = useState("")
  const [otp, setOtp] = useState("")

  // ---- Bitmoji typing state ----
  const [isTypingEmail, setIsTypingEmail] = useState(false)
  const [isTypingPassword, setIsTypingPassword] = useState(false)

  const emailTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const passwordTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleTyping = (
    setter: React.Dispatch<React.SetStateAction<boolean>>,
    timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>,
  ) => {
    setter(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setter(false)
    }, 1200)
  }

  useEffect(() => {
    setSignupStep(1)
    setGeneratedOtp("")
    setOtp("")
    setError("")
    setInfo("")
  }, [mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setInfo("")

    // -------- LOGIN --------
    if (mode === "login") {
      if (!email || !password) {
        setError("Please enter email and password")
        return
      }

      if (password.length < 6) {
        setError("Password must be at least 6 characters")
        return
      }

      setIsLoading(true)
      try {
        await login(email, password)
        router.push("/discover")
      } catch {
        setError("Something went wrong. Try again.")
      } finally {
        setIsLoading(false)
      }
      return
    }

    // -------- SIGNUP (3 steps) --------
    if (mode === "signup") {
      if (signupStep === 1) {
        if (!email) {
          setError("Please enter your email")
          return
        }

        const code = String(Math.floor(100000 + Math.random() * 900000))
        setGeneratedOtp(code)
        setSignupStep(2)
        setInfo(`Demo OTP for testing: ${code}`)
        return
      }

      if (signupStep === 2) {
        if (!otp) {
          setError("Please enter the code we sent")
          return
        }
        if (otp !== generatedOtp) {
          setError("Incorrect code. Try again.")
          return
        }

        setSignupStep(3)
        setError("")
        setInfo("Email verified. Now create your password.")
        return
      }

      if (signupStep === 3) {
        if (!ageConfirmed) {
          setError("You must confirm you're 18+")
          return
        }

        if (!password || !confirmPassword) {
          setError("Please enter and confirm your password")
          return
        }

        if (password.length < 6) {
          setError("Password must be at least 6 characters")
          return
        }

        if (password !== confirmPassword) {
          setError("Passwords do not match")
          return
        }

        setIsLoading(true)
        try {
          await signup(email, password)
          router.push("/profile-setup")
        } catch {
          setError("Something went wrong. Try again.")
        } finally {
          setIsLoading(false)
        }
      }
    }
  }

  const handleGoogleAuth = () => {
    setIsLoading(true)
    setError("")
    setInfo("Signing in with Google (demo)…")

    setTimeout(() => {
      login("google@example.com", "google")
      router.push("/profile-setup")
    }, 500)
  }

  // ⬅️ NEW: whether email should be locked (but still styled like normal)
  const emailLocked = mode === "signup" && signupStep !== 1

  return (
    <div className="min-h-screen bg-background flex">
      {/* LEFT SIDE */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center mb-8">
            <Logo size="lg" />
          </div>

          <h2 className="text-center text-2xl font-bold">
            {mode === "login" ? "Welcome back" : "Create your account"}
          </h2>

          <p className="mt-2 text-center text-sm text-muted-foreground">
            {mode === "login" ? (
              <>
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-primary font-medium">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-medium">
                  Log in
                </Link>
              </>
            )}
          </p>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-card px-6 py-8 shadow-xl rounded-2xl border border-border/50">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* EMAIL */}
              <div>
                <Label htmlFor="email">Email</Label>
                <div className="relative mt-2">
                  <Image
                    src={
                      isTypingEmail
                        ? "/Goku Attack Sticker by Alissandra.gif"
                        : "/Goku Ultra Instinct Sticker by Alissandra.gif"
                    }
                    alt="avatar"
                    width={30}
                    height={30}
                    className="absolute left-3 top-1/2 -translate-y-1/2 transition-all"
                  />

                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value)
                      handleTyping(setIsTypingEmail, emailTimeoutRef)
                    }}
                    onFocus={() => setIsTypingEmail(true)}
                    onBlur={() => setIsTypingEmail(false)}
                    placeholder="you@example.com"
                    // ⬇️ style like normal input even when locked
                    className={cn(
                      "pl-14",
                      emailLocked &&
                        "bg-card/80 text-muted-foreground cursor-default focus-visible:ring-0"
                    )}
                    readOnly={emailLocked}   // ⬅️ instead of disabled
                  />
                </div>
              </div>

              {/* PASSWORD (login OR signup step 3) */}
              {(mode === "login" || (mode === "signup" && signupStep === 3)) && (
                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative mt-2">
                    <Image
                      src={
                        isTypingPassword
                          ? "/Goku Attack Sticker by Alissandra.gif"
                          : "/Goku Ultra Instinct Sticker by Alissandra.gif"
                      }
                      alt="avatar"
                      width={30}
                      height={30}
                      className="absolute left-3 top-1/2 -translate-y-1/2 transition-all"
                    />

                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value)
                        handleTyping(setIsTypingPassword, passwordTimeoutRef)
                      }}
                      onFocus={() => setIsTypingPassword(true)}
                      onBlur={() => setIsTypingPassword(false)}
                      placeholder="••••••••"
                      className="pl-14 pr-10"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              )}

              {/* SIGNUP STEP 2 – OTP */}
              {mode === "signup" && signupStep === 2 && (
                <div>
                  <Label htmlFor="otp">Verification code</Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="mt-2 tracking-[0.3em]"
                    placeholder="Enter 6-digit code"
                  />
                </div>
              )}

              {/* SIGNUP STEP 3 – confirm password + age */}
              {mode === "signup" && signupStep === 3 && (
                <>
                  <div>
                    <Label htmlFor="confirmPassword">Confirm password</Label>
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="mt-2"
                      placeholder="••••••••"
                    />
                  </div>

                  <div className="flex items-start gap-3">
                    <Checkbox
                      id="age"
                      checked={ageConfirmed}
                      onCheckedChange={(checked) => setAgeConfirmed(checked as boolean)}
                      className="mt-0.5"
                    />
                    <Label htmlFor="age" className="text-sm font-normal text-muted-foreground">
                      I confirm that I am 16+ years of age or older
                    </Label>
                  </div>
                </>
              )}

              {/* Error / info */}
              {error && (
                <div className="text-sm text-red-400 bg-red-400/10 p-2 rounded-lg">
                  {error}
                </div>
              )}
              {info && !error && (
                <div className="text-xs text-primary bg-primary/5 px-4 py-2 rounded-lg">
                  {info}
                </div>
              )}

              {/* SUBMIT BUTTON */}
              <Button
                type="submit"
                className="w-full from-primary to-accent bg-linear-to-r"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : mode === "login" ? (
                  "Log in"
                ) : signupStep === 1 ? (
                  "Send code"
                ) : signupStep === 2 ? (
                  "Verify code"
                ) : (
                  "Create account"
                )}
              </Button>
            </form>

            {/* Google section */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="bg-card px-4 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full mt-4 bg-transparent"
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
            </div>

            {mode === "login" && (
              <p className="mt-6 text-center text-sm text-muted-foreground">
                <Link href="#" className="font-medium text-primary hover:text-primary/80">
                  Forgot your password?
                </Link>
              </p>
            )}
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            By continuing, you agree to {APP_NAME}&apos;s{" "}
            <Link href="#" className="underline hover:text-foreground">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline hover:text-foreground">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
