"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { CharacterCard } from "@/components/character-card"
import { AppLayout } from "@/components/navigation/app-layout"
import { getCharacters } from "@/lib/mock-api"
import { characterTags } from "@/lib/mock-data"
import { useApp } from "@/lib/store"
import type { Character } from "@/lib/types"
import { Search, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function DiscoverPage() {
  const { user, toggleFavorite } = useApp()
  const [characters, setCharacters] = useState<Character[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTag, setActiveTag] = useState("Trending")

  useEffect(() => {
    loadCharacters()
  }, [activeTag])

  const loadCharacters = async () => {
    setIsLoading(true)
    try {
      const data = await getCharacters({ tag: activeTag })
      setCharacters(data)
    } catch (error) {
      console.error("Failed to load characters:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const data = await getCharacters({ search: searchQuery })
      setCharacters(data)
    } catch (error) {
      console.error("Failed to search characters:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Discover Characters</h1>
            <p className="text-muted-foreground">
              Find your perfect AI companion from thousands of unique personalities
            </p>
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="mb-6">
            <div className="relative max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search characters by name, fandom, or vibe..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-card border-border/50 rounded-xl"
              />
            </div>
          </form>

          {/* Filter Tags */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
            {characterTags.map((tag) => (
              <Button
                key={tag}
                variant={activeTag === tag ? "default" : "outline"}
                size="sm"
                className={cn(
                  "shrink-0 rounded-full",
                  activeTag === tag ? "bg-primary text-primary-foreground" : "bg-card border-border/50 hover:bg-muted",
                )}
                onClick={() => {
                  setActiveTag(tag)
                  setSearchQuery("")
                }}
              >
                {tag}
              </Button>
            ))}
          </div>

          {/* Characters Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : characters.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground">No characters found. Try a different search or filter.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {characters.map((character) => (
                <CharacterCard
                  key={character.id}
                  character={character}
                  isFavorite={user?.favoriteCharacterIds.includes(character.id)}
                  onFavorite={toggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
