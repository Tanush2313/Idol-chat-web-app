// components/onboarding/app-onboarding.tsx
"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const ONBOARDING_KEY = "idolchat-onboarding-v1"

const steps = [
  {
    id: 1,
    title: "Choose a character",
    text: "Browse idols, anime characters and custom AIs on the Discover screen. Tap one to open a chat.",
    badge: "Step 1",
  },
  {
    id: 2,
    title: "Chat & change vibes",
    text: "Use the tone chips at the bottom (Casual, Supportive, Flirty, Serious) to change how they talk to you.",
    badge: "Step 2",
  },
  {
    id: 3,
    title: "Create your own",
    text: "Make your own AI character with a custom avatar, bio and personality in the Create tab.",
    badge: "Step 3",
  },
]

export function AppOnboarding() {
  const [loaded, setLoaded] = useState(false)
  const [show, setShow] = useState(false)
  const [stepIndex, setStepIndex] = useState(0)

  // Check localStorage: has user already seen the tour?
  useEffect(() => {
    if (typeof window === "undefined") return

    const seen = window.localStorage.getItem(ONBOARDING_KEY)
    if (!seen) {
      setShow(true)
    }
    setLoaded(true)
  }, [])

  const handleSkipOrFinish = () => {
    setShow(false)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(ONBOARDING_KEY, "seen")
    }
  }

  const handleNext = () => {
    if (stepIndex === steps.length - 1) {
      handleSkipOrFinish()
    } else {
      setStepIndex((i) => i + 1)
    }
  }

  // If we haven't checked localStorage yet, or onboarding is off, render nothing
  if (!loaded || !show) return null

  const step = steps[stepIndex]

  return (
    <div className="pointer-events-none fixed inset-0 z-60 flex items-end justify-center bg-black/60 backdrop-blur-sm">
      {/* Click-through blocker so user can’t click behind */}
      <div className="pointer-events-auto mb-6 w-full max-w-xl px-4">
        {/* Close button in top-right of card */}
        <div className="flex justify-end mb-2">
          <button
            onClick={handleSkipOrFinish}
            className="rounded-full bg-black/60 p-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Main bubble */}
        <div className="rounded-3xl border border-white/10 bg-linear-to-br from-[#111827] via-[#020617] to-[#020617] p-5 shadow-2xl">
          <div className="mb-1 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-[11px] uppercase tracking-wide text-sky-300">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
            {step.badge}
          </div>

          <h3 className="mt-1 text-lg font-semibold text-white">{step.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{step.text}</p>

          {/* Progress dots + button */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex gap-1.5">
              {steps.map((s, idx) => (
                <span
                  key={s.id}
                  className={cn(
                    "h-2 w-2 rounded-full bg-white/10",
                    idx === stepIndex && "w-4 bg-sky-400",
                  )}
                />
              ))}
            </div>

            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground"
                onClick={handleSkipOrFinish}
              >
                Skip
              </Button>
              <Button
                size="sm"
                className="rounded-full bg-linear-to-r from-sky-500 to-violet-500 text-xs"
                onClick={handleNext}
              >
                {stepIndex === steps.length - 1 ? "Got it" : "Next"}
              </Button>
            </div>
          </div>
        </div>

        {/* Little helper text under the card */}
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          This tour only appears the first time you use the app.
        </p>
      </div>
    </div>
  )
}
