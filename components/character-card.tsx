"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Heart, MessageCircle, Star, Shield } from "lucide-react"
import type { Character } from "@/lib/types"
import { cn } from "@/lib/utils"

interface CharacterCardProps {
  character: Character
  onFavorite?: (id: string) => void
  isFavorite?: boolean
}

export function CharacterCard({ character, onFavorite, isFavorite }: CharacterCardProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  const handleClick = () => {
    router.push(`/chat/${character.id}`)
  }

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    onFavorite?.(character.id)
  }

  return (
    <Card
      className={cn(
        "group relative overflow-hidden cursor-pointer transition-all duration-300",
        "bg-card hover:bg-card/80 border-border/50",
        "hover:shadow-xl hover:shadow-primary/10 hover:scale-[1.02]",
        "hover:border-primary/30",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleClick}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div
              className={cn(
                "w-16 h-16 rounded-2xl overflow-hidden ring-2 transition-all duration-300",
                isHovered ? "ring-primary/50" : "ring-border/30",
              )}
            >
              <Image
                src={character.avatarUrl || "/placeholder.svg?height=64&width=64&query=anime character avatar"}
                alt={character.name}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </div>
            {character.isOfficial && (
              <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                <Shield className="w-3 h-3 text-primary-foreground" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-semibold text-foreground truncate">{character.name}</h3>
                <p className="text-sm text-muted-foreground truncate">{character.tagline}</p>
              </div>
              <button
                onClick={handleFavorite}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  isFavorite
                    ? "text-red-500 bg-red-500/10"
                    : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10",
                )}
              >
                <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
              </button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mt-2">
              {character.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs px-2 py-0 bg-secondary/50 text-secondary-foreground"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/30">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>{(character.stats.chatsCount / 1000).toFixed(1)}K</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Heart className="w-3.5 h-3.5" />
            <span>{(character.stats.likes / 1000).toFixed(1)}K</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Star className="w-3.5 h-3.5 text-yellow-500" />
            <span>{character.stats.rating.toFixed(1)}</span>
          </div>
          <div className="ml-auto">
            <Badge
              variant={character.isOfficial ? "default" : "outline"}
              className={cn(
                "text-xs",
                character.isOfficial ? "bg-primary/20 text-primary border-primary/30" : "border-border/50",
              )}
            >
              {character.isOfficial ? "Official" : "Community"}
            </Badge>
          </div>
        </div>

        {/* Hover preview */}
        <div
          className={cn(
            "absolute inset-x-0 bottom-0 p-4 pt-8",
            "bg-linear-to-t from-card via-card/95 to-transparent",
            "transform transition-all duration-300",
            isHovered ? "translate-y-0 opacity-100" : "translate-y-full opacity-0",
          )}
        >
          <p className="text-sm text-muted-foreground line-clamp-2">{character.bio}</p>
        </div>
      </div>
    </Card>
  )
}
