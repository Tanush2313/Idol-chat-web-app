"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/navigation/app-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { MessageSquare, Heart, Star, Users, Copy, Flag, Ban, Share2, ArrowLeft } from "lucide-react"
import { useApp } from "@/lib/store"
import type { Character } from "@/lib/types"
import { getCharacters } from "@/lib/mock-api"

export function CharacterDetailPage({ characterId }: { characterId: string }) {
  const router = useRouter()
  const { user, toggleFavorite } = useApp()
  const [character, setCharacter] = useState<Character | null>(null)
  const [loading, setLoading] = useState(true)

  const isFavorite = user?.favoriteCharacterIds.includes(characterId)

  useEffect(() => {
    const loadCharacter = async () => {
      const chars = await getCharacters()
      const found = chars.find((c) => c.id === characterId)
      setCharacter(found || null)
      setLoading(false)
    }
    loadCharacter()
  }, [characterId])

  if (loading) {
    return (
      <AppLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </AppLayout>
    )
  }

  if (!character) {
    return (
      <AppLayout>
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <p className="text-muted-foreground">Character not found</p>
          <Button variant="outline" onClick={() => router.push("/discover")}>
            Back to Discover
          </Button>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Header */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-2xl bg-linear-to-br from-primary/30 to-accent/30 flex items-center justify-center text-5xl font-bold shrink-0 mx-auto md:mx-0">
              {character.avatarUrl ? (
                <img
                  src={character.avatarUrl || "/placeholder.svg"}
                  alt={character.name}
                  className="w-full h-full object-cover rounded-2xl"
                />
              ) : (
                character.name.charAt(0)
              )}
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <h1 className="text-3xl font-bold">{character.name}</h1>
                {character.isOfficial && (
                  <Badge className="bg-primary/20 text-primary border-primary/30">Official</Badge>
                )}
              </div>

              <p className="text-lg text-muted-foreground mb-4">{character.tagline}</p>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                {character.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-secondary/50">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center gap-6 text-sm text-muted-foreground justify-center md:justify-start">
                <div className="flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4" />
                  <span>{character.stats.chatsCount.toLocaleString()} chats</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-4 h-4" />
                  <span>{character.stats.likes.toLocaleString()} likes</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4" />
                  <span>{character.stats.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mb-8">
            <Button
              size="lg"
              className="flex-1 sm:flex-none bg-linear-to-r from-primary to-accent hover:opacity-90"
              onClick={() => router.push(`/chat/${character.id}`)}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Start Chatting
            </Button>
            <Button
              size="lg"
              variant="outline"
              className={`border-border/50 ${isFavorite ? "text-pink-500 border-pink-500/30" : ""}`}
              onClick={() => toggleFavorite(character.id)}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorite ? "fill-current" : ""}`} />
              {isFavorite ? "Saved" : "Save"}
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-border/50 bg-transparent"
              onClick={() => router.push(`/create?clone=${character.id}`)}
            >
              <Copy className="w-4 h-4 mr-2" />
              Clone
            </Button>
            <Button size="lg" variant="outline" className="border-border/50 bg-transparent">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          {/* Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Bio */}
              <Card className="p-6 bg-card/50 border-border/50">
                <h2 className="text-lg font-semibold mb-4">About</h2>
                <p className="text-muted-foreground whitespace-pre-wrap">{character.bio || "No bio provided."}</p>
              </Card>

              {/* Greeting */}
              <Card className="p-6 bg-card/50 border-border/50">
                <h2 className="text-lg font-semibold mb-4">Greeting</h2>
                <div className="p-4 rounded-2xl bg-linear-to-br from-primary/10 to-accent/10 border border-primary/20">
                  <p className="text-muted-foreground">{character.greetingMessage}</p>
                </div>
              </Card>

              {/* Example Dialogues */}
              {character.exampleDialogues.length > 0 && (
                <Card className="p-6 bg-card/50 border-border/50">
                  <h2 className="text-lg font-semibold mb-4">Example Conversations</h2>
                  <div className="space-y-4">
                    {character.exampleDialogues.map((dialogue, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0">
                            <Users className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <div className="flex-1 p-3 rounded-2xl bg-secondary/50">
                            <p className="text-sm">{dialogue.user}</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary/30 to-accent/30 flex items-center justify-center shrink-0 text-sm font-bold">
                            {character.name.charAt(0)}
                          </div>
                          <div className="flex-1 p-3 rounded-2xl bg-linear-to-br from-primary/10 to-accent/10 border border-primary/20">
                            <p className="text-sm">{dialogue.character}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Info */}
              <Card className="p-6 bg-card/50 border-border/50">
                <h2 className="text-lg font-semibold mb-4">Details</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Created by</span>
                    <span className="font-medium">@{character.creator.username}</span>
                  </div>
                  {character.fandom && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fandom</span>
                      <span className="font-medium">{character.fandom}</span>
                    </div>
                  )}
                  {character.language && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Language</span>
                      <span className="font-medium">{character.language}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Visibility</span>
                    <span className="font-medium capitalize">{character.visibility}</span>
                  </div>
                </div>
              </Card>

              {/* Report/Block */}
              <Card className="p-4 bg-card/50 border-border/50">
                <div className="space-y-2">
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary/50 transition-colors">
                    <Flag className="w-4 h-4" />
                    Report Character
                  </button>
                  <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-secondary/50 transition-colors">
                    <Ban className="w-4 h-4" />
                    Block Character
                  </button>
                </div>
              </Card>

              {/* Disclaimer */}
              <p className="text-xs text-muted-foreground text-center">
                This AI character is fictional or simulated and may not represent real people accurately.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
