import { APP_NAME } from "@/lib/types"
import { Sparkles } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  showText?: boolean
  className?: string 
}

export function Logo({ size = "md", showText = true, className }: LogoProps) {
  const sizes = {
    sm: { icon: 20, text: "text-lg" },
    md: { icon: 24, text: "text-xl" },
    lg: { icon: 32, text: "text-2xl" },
  }

  return (
    <div className={`flex items-center gap-2 ${className ?? ""}`}>
      <div className="relative">
        <div className="absolute inset-0 bg-linear-to-br from-primary to-accent blur-lg opacity-50" />
        <div className="relative bg-linear-to-br from-primary to-accent p-2 rounded-xl">
          <Sparkles className="text-primary-foreground" size={sizes[size].icon} />
        </div>
      </div>
      {showText && <span className={`font-bold gradient-text ${sizes[size].text}`}>{APP_NAME}</span>}
    </div>
  )
}

