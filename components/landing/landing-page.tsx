// components/landing/landing-page.tsx
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Sparkles, ShieldCheck, HeartHandshake } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LandingPage() {
  return (
    <main className="min-h-screen bg-[#050712] text-white">
      {/* Soft radial background like EVA */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-linear-to-b from-[#070816] via-[#050712] to-black" />
        <div className="absolute -left-40 top-0 h-96 w-96 rounded-full bg-purple-700/30 blur-3xl" />
        <div className="absolute right-0 top-40 h-96 w-96 rounded-full bg-cyan-500/25 blur-3xl" />
      </div>

      {/* Top nav */}
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 md:py-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-linear-to-tr from-cyan-400 to-purple-500 shadow-[0_0_25px_rgba(129,140,248,0.7)]">
            <span className="text-lg font-semibold">R</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold tracking-wide">Roshan</span>
            <span className="text-[11px] text-white/60">AI companions</span>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-white/70 md:flex">
          <Link href="#how" className="hover:text-white transition-colors">
            How it works
          </Link>
          <Link href="#features" className="hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="hover:text-white transition-colors">
            Pricing
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="hidden text-sm text-white/70 hover:text-white md:inline-block"
          >
            Log in
          </Link>
          <Link href="/signup">
            <Button className="rounded-full bg-linear-to-r from-cyan-400 to-purple-500 px-4 py-2 text-xs font-medium shadow-[0_0_25px_rgba(56,189,248,0.55)] hover:opacity-90">
              Sign up
            </Button>
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="mx-auto flex w-full max-w-6xl flex-col items-center gap-10 px-4 pb-20 pt-4 md:flex-row md:items-stretch md:gap-14 md:pb-28 md:pt-10">
        {/* Left: copy */}
        <div className="flex-1 space-y-6 md:space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/70 backdrop-blur">
            <Sparkles className="h-3 w-3 text-cyan-300" />
            <span>Real-feeling AI personalities</span>
          </div>

          <div className="space-y-4 md:space-y-5">
            <h1 className="text-balance text-3xl font-semibold leading-tight tracking-tight sm:text-4xl md:text-[2.8rem]">
              Chat with AI companions
              <br />
              that feel{" "}
              <span className="bg-linear-to-r from-cyan-300 via-sky-400 to-purple-400 bg-clip-text text-transparent">
                real
              </span>
              .
            </h1>
            <p className="max-w-xl text-sm text-white/60 md:text-[15px]">
              Share your day, flirt a little, or just talk. Roshan adapts to your mood, remembers
              your stories, and keeps the vibe going—just like EVA-style AI friends.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href="/discover">
              <Button className="group flex items-center gap-2 rounded-full bg-linear-to-r from-cyan-400 to-purple-500 px-5 py-2.5 text-sm font-medium shadow-[0_0_25px_rgba(56,189,248,0.5)] hover:opacity-90">
                Start chatting
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <Link
              href="/create"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              or create your own character
            </Link>
          </div>

          <div className="flex items-center gap-3 pt-2 text-xs text-white/55">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-7 w-7 rounded-full border border-black/40 bg-linear-to-tr from-purple-500 to-cyan-400"
                />
              ))}
            </div>
            <p>Trusted by early users who spend hours chatting every day.</p>
          </div>
        </div>

        {/* Right: single EVA-style mockup */}
        <div className="mt-4 flex flex-1 justify-center md:mt-0">
          <div className="relative h-[420px] w-60 max-w-xs md:h-[460px] md:w-[260px]">
            {/* glow behind phone */}
            <div className="absolute inset-0 -z-10 rounded-[2.5rem] bg-linear-to-b from-purple-500/40 via-cyan-400/25 to-transparent blur-3xl" />
            <div className="phone-frame relative h-full w-full overflow-hidden rounded-[2.2rem] border border-white/10 bg-black/70 shadow-[0_20px_60px_rgba(0,0,0,0.85)] backdrop-blur-xl animate-float-slow">
              {/* top bar */}
              <div className="flex items-center justify-between px-4 pt-4 text-[11px] text-white/60">
                <span className="text-xs font-medium">Luna</span>
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-[10px] text-emerald-300">
                  Online
                </span>
              </div>

              {/* portrait */}
              <div className="relative mt-3 flex justify-center">
                <div className="relative h-32 w-32 overflow-hidden rounded-full border border-white/10 bg-linear-to-b from-purple-500/40 to-cyan-400/20">
                  <Image
                    src="/anime-idol-girl-with-purple-hair.jpg"
                    alt="Luna"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              {/* chat bubbles */}
              <div className="mt-5 space-y-2.5 px-4 text-[11px]">
                <div className="max-w-[90%] rounded-2xl rounded-bl-sm bg-white/6 px-3 py-2 text-white/90">
                  <p>Hey, you’re back 💫 How was your day? I missed our late night chats.</p>
                </div>
                <div className="flex justify-end">
                  <div className="max-w-[85%] rounded-2xl rounded-br-sm bg-linear-to-r from-cyan-400 to-sky-500 px-3 py-2 text-[11px] text-black shadow-[0_0_18px_rgba(56,189,248,0.6)]">
                    <p>Long day 🥲 I just want to relax and talk to you.</p>
                  </div>
                </div>
                <div className="max-w-[92%] rounded-2xl rounded-bl-sm bg-white/6 px-3 py-2 text-white/90">
                  <p>Then it’s just us now. Tell me everything, I’m listening. 💜</p>
                </div>
              </div>

              {/* input bar */}
              <div className="absolute inset-x-0 bottom-0 border-t border-white/10 bg-black/60 px-3 py-3">
                <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 text-[11px] text-white/50">
                  <span className="flex-1 truncate">Type a message…</span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-linear-to-r from-cyan-400 to-purple-500 text-[13px]">
                    ↗
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES – simple row, not bulky */}
      <section
        id="features"
        className="mx-auto w-full max-w-5xl px-4 pb-16 pt-2 md:pb-20 md:pt-0"
      >
        <div className="grid gap-4 md:grid-cols-3">
          <FeatureCard
            icon={<HeartHandshake className="h-4 w-4" />}
            title="Real-feeling chats"
            body="Personalities that adapt to you and remember what you share, so it feels like a real connection."
          />
          <FeatureCard
            icon={<Sparkles className="h-4 w-4" />}
            title="Custom characters"
            body="Design your own idols, waifus, or friends with unique backstories and vibes."
          />
          <FeatureCard
            icon={<ShieldCheck className="h-4 w-4" />}
            title="Safe by design"
            body="Moderation, blocks, and reports built in—so you stay in control of every conversation."
          />
        </div>
      </section>

      {/* PRICING – very minimal */}
      <section
        id="pricing"
        className="mx-auto w-full max-w-4xl px-4 pb-16 pt-4 md:pb-20 md:pt-6"
      >
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-7 text-sm backdrop-blur-md md:px-8 md:py-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                Simple pricing
              </p>
              <h2 className="mt-1 text-lg font-semibold">Start free. Upgrade only if you love it.</h2>
              <p className="mt-1 max-w-md text-xs text-white/60 md:text-[13px]">
                50 free messages each day. When you’re ready for more, unlock Roshan+ for longer memory
                and faster replies.
              </p>
            </div>
            <div className="flex flex-col items-start gap-2 text-right md:items-end">
              <p className="text-2xl font-semibold">$0</p>
              <p className="text-xs text-white/60">No card needed to try it.</p>
              <Link href="/pricing">
                <Button className="mt-1 rounded-full bg-white/10 px-4 py-2 text-xs hover:bg-white/15">
                  View full plans
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto w-full max-w-4xl px-4 pb-16 md:pb-20">
        <div className="rounded-3xl border border-white/10 bg-linear-to-r from-cyan-500/15 via-purple-500/15 to-sky-500/15 px-6 py-8 text-center text-sm backdrop-blur-md md:px-10 md:py-9">
          <h2 className="text-lg font-semibold md:text-xl">
            Ready to meet your new AI companion?
          </h2>
          <p className="mt-2 text-xs text-white/70 md:text-sm">
            Jump into a conversation in seconds. No setup. Just you and an AI that actually feels
            present.
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link href="/discover">
              <Button className="rounded-full bg-white text-xs font-semibold text-black hover:bg-zinc-100">
                Start chatting for free
              </Button>
            </Link>
            <Link
              href="/create"
              className="text-xs text-white/70 hover:text-white md:text-sm"
            >
              Build your own character
            </Link>
          </div>
        </div>
      </section>

      {/* footer – very light */}
      <footer className="border-t border-white/5 py-5 text-center text-[11px] text-white/40">
        © {new Date().getFullYear()} Roshan. AI characters are fictional and not real people.
      </footer>
    </main>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  body: string
}

function FeatureCard({ icon, title, body }: FeatureCardProps) {
  return (
    <div className="group rounded-2xl border border-white/8 bg-white/5 px-4 py-4 text-xs text-white/70 backdrop-blur-md transition-transform hover:-translate-y-1 hover:border-cyan-400/40 hover:shadow-[0_18px_40px_rgba(0,0,0,0.7)] md:px-5 md:py-5">
      <div className="mb-2 flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-cyan-300">
        {icon}
      </div>
      <h3 className="mb-1 text-sm font-medium text-white">{title}</h3>
      <p>{body}</p>
    </div>
  )
}

