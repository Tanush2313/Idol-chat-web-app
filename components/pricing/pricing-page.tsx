"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Logo } from "@/components/ui/logo"
import {
  Crown,
  Check,
  Zap,
  Brain,
  MessageSquare,
  Users,
  Sparkles,
  Clock,
  ArrowLeft,
  Shield,
} from "lucide-react"
import { useApp } from "@/lib/store"

const FREE_FEATURES = [
  { icon: MessageSquare, text: "50 messages per day" },
  { icon: Clock, text: "Standard response speed" },
  { icon: Users, text: "3 active chat rooms" },
  { icon: Brain, text: "Basic memory window" },
]

const PREMIUM_FEATURES = [
  { icon: MessageSquare, text: "Unlimited messages", highlight: true },
  { icon: Zap, text: "Priority faster responses", highlight: true },
  { icon: Clock, text: "Skip the queue during peak times" },
  { icon: Brain, text: "Extended memory & context", highlight: true },
  { icon: Users, text: "Unlimited active rooms" },
  { icon: Sparkles, text: "Create unlimited public characters" },
  { icon: Shield, text: "Early access to new features" },
]

// helper to format rupees nicely
const formatINR = (amount: number) =>
  amount.toLocaleString("en-IN", { maximumFractionDigits: 0 })

export function PricingPage() {
  const router = useRouter()
  const { user, isAuthenticated, upgradeToPlus } = useApp()
  const [isAnnual, setIsAnnual] = useState(true)

  const isPremium = user?.subscriptionStatus === "premium"

  // ==== PRICING IN INR ====
  const monthlyPrice = 499        // ₹ per month
  const annualPrice = 4999       // ₹ per year
  const annualMonthly = annualPrice / 12
  const savings = Math.round(
    ((monthlyPrice * 12 - annualPrice) / (monthlyPrice * 12)) * 100
  )
  // =========================

  const handleUpgrade = () => {
    upgradeToPlus()
    router.push("/discover")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <span className="font-bold text-lg">IdolChat</span>
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <Button variant="outline" onClick={() => router.push("/discover")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to App
              </Button>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost">Log In</Button>
                </Link>
                <Link href="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-linear-to-r from-amber-500/20 to-orange-500/20 text-amber-400 border-amber-500/30">
            <Crown className="w-3 h-3 mr-1" />
            IdolChat+
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
            Unlock the Full Experience
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Get unlimited messages, faster responses, and deeper conversations with your favorite characters.
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <span className={`text-sm ${!isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
            Monthly
          </span>
          <Switch checked={isAnnual} onCheckedChange={setIsAnnual} />
          <span className={`text-sm ${isAnnual ? "text-foreground" : "text-muted-foreground"}`}>
            Annual
          </span>
          {isAnnual && (
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
              Save {savings}%
            </Badge>
          )}
        </div>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {/* Free Plan */}
          <Card className="p-8 bg-card/50 border-border/50 flex flex-col">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">Free</h2>
              <p className="text-muted-foreground">Perfect for trying out IdolChat</p>
            </div>

            <div className="mb-6">
              <span className="text-4xl font-bold">₹0</span>
              <span className="text-muted-foreground">/month</span>
            </div>

            {/* ...free features stay same... */}
            <ul className="space-y-4 mb-8 flex-1">
              {FREE_FEATURES.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center shrink-0">
                    <feature.icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <span className="text-muted-foreground">{feature.text}</span>
                </li>
              ))}
            </ul>

            <Button
              variant="outline"
              size="lg"
              className="w-full border-border/50 bg-transparent"
              onClick={() => router.push(isAuthenticated ? "/discover" : "/signup")}
            >
              {isAuthenticated ? "Current Plan" : "Get Started Free"}
            </Button>
          </Card>

          {/* Premium Plan */}
          <Card className="p-8 bg-linear-to-br from-amber-500/10 to-orange-500/10 border-amber-500/30 flex flex-col relative overflow-hidden">
            <div className="absolute top-4 right-4">
              <Badge className="bg-linear-to-r from-amber-500 to-orange-500 text-white border-0">
                Best Value
              </Badge>
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <Crown className="w-6 h-6 text-amber-400" />
                IdolChat+
              </h2>
              <p className="text-muted-foreground">For the ultimate chat experience</p>
            </div>

            <div className="mb-6">
              {isAnnual ? (
                <>
                  <span className="text-4xl font-bold">
                    ₹{formatINR(annualMonthly)}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                  <p className="text-sm text-muted-foreground mt-1">
                    Billed annually at ₹{formatINR(annualPrice)}/year
                  </p>
                </>
              ) : (
                <>
                  <span className="text-4xl font-bold">
                    ₹{formatINR(monthlyPrice)}
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </>
              )}
            </div>

            <ul className="space-y-4 mb-8 flex-1">
              {PREMIUM_FEATURES.map((feature, index) => (
                <li key={index} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      feature.highlight
                        ? "bg-linear-to-br from-amber-500/30 to-orange-500/30"
                        : "bg-secondary/50"
                    }`}
                  >
                    <feature.icon
                      className={`w-4 h-4 ${
                        feature.highlight ? "text-amber-400" : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <span className={feature.highlight ? "text-foreground font-medium" : ""}>
                    {feature.text}
                  </span>
                </li>
              ))}
            </ul>

            {isPremium ? (
              <Button
                size="lg"
                className="w-full bg-linear-to-r from-amber-500 to-orange-500 hover:opacity-90"
                disabled
              >
                <Check className="w-4 h-4 mr-2" />
                You&apos;re Subscribed
              </Button>
            ) : (
              <Button
                size="lg"
                className="w-full bg-linear-to-r from-amber-500 to-orange-500 hover:opacity-90"
                onClick={handleUpgrade}
              >
                Get IdolChat+ {isAnnual ? "Annual" : "Monthly"}
              </Button>
            )}
          </Card>
        </div>

        {/* FAQ + Footer stay the same */}
        {/* ... */}
      </main>
    </div>
  )
}
