"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { Character } from "@/lib/types"
import { MessageCircle, Heart, Star, Shield, Copy, ExternalLink, X } from "lucide-react"

interface CharacterInfoDrawerProps {
  character: Character
  onClose: () => void
}

export function CharacterInfoDrawer({ character, onClose }: CharacterInfoDrawerProps) {
  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden ring-2 ring-primary/20">
            <Image
              src={character.avatarUrl || "/placeholder.svg?height=64&width=64"}
              alt={character.name}
              width={64}
              height={64}
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg">{character.name}</h2>
              {character.isOfficial && <Shield className="w-4 h-4 text-primary" />}
            </div>
            <p className="text-sm text-muted-foreground">{character.tagline}</p>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="xl:hidden" onClick={onClose}>
          <X className="w-5 h-5" />
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-3 rounded-xl bg-muted/50">
          <MessageCircle className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
          <p className="font-semibold">{(character.stats.chatsCount / 1000).toFixed(1)}K</p>
          <p className="text-xs text-muted-foreground">Chats</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-muted/50">
          <Heart className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
          <p className="font-semibold">{(character.stats.likes / 1000).toFixed(1)}K</p>
          <p className="text-xs text-muted-foreground">Likes</p>
        </div>
        <div className="text-center p-3 rounded-xl bg-muted/50">
          <Star className="w-5 h-5 mx-auto mb-1 text-yellow-500" />
          <p className="font-semibold">{character.stats.rating.toFixed(1)}</p>
          <p className="text-xs text-muted-foreground">Rating</p>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Bio */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">About</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{character.bio}</p>
      </div>

      {/* Tags */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {character.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="bg-secondary/50">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Creator */}
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Created by</h3>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="w-6 h-6 rounded-full bg-muted" />
          <span>{character.creator.username}</span>
          {character.isOfficial && (
            <Badge variant="outline" className="text-xs border-primary/30 text-primary">
              Official
            </Badge>
          )}
        </div>
      </div>

      {character.fandom && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Fandom</h3>
          <p className="text-sm text-muted-foreground">{character.fandom}</p>
        </div>
      )}

      <Separator className="my-4" />

      {/* Actions */}
      <div className="space-y-3">
        <Link href={`/character/${character.id}`}>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <ExternalLink className="w-4 h-4 mr-2" />
            View full character card
          </Button>
        </Link>
        <Link href={`/create?clone=${character.id}`}>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Copy className="w-4 h-4 mr-2" />
            Clone character
          </Button>
        </Link>
      </div>
    </div>
  )
}
