"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { AppLayout } from "@/components/navigation/app-layout"
import { getCharacters, createRoom } from "@/lib/mock-api"
import type { Character } from "@/lib/types"
import { Search, Check, X, Loader2, ArrowRight, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export function CreateRoomPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [characters, setCharacters] = useState<Character[]>([])
  const [selectedCharacters, setSelectedCharacters] = useState<Character[]>([])
  const [roomName, setRoomName] = useState("")
  const [scenarioPrompt, setScenarioPrompt] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)

  useEffect(() => {
    loadCharacters()
  }, [])

  const loadCharacters = async () => {
    setIsLoading(true)
    try {
      const data = await getCharacters()
      setCharacters(data)
    } catch (error) {
      console.error("Failed to load characters:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredCharacters = characters.filter(
    (char) =>
      char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const toggleCharacter = (character: Character) => {
    if (selectedCharacters.find((c) => c.id === character.id)) {
      setSelectedCharacters((prev) => prev.filter((c) => c.id !== character.id))
    } else if (selectedCharacters.length < 4) {
      setSelectedCharacters((prev) => [...prev, character])
    }
  }

  const handleCreate = async () => {
    if (selectedCharacters.length < 2 || !roomName.trim()) return

    setIsCreating(true)
    try {
      const room = await createRoom(
        roomName,
        selectedCharacters.map((c) => c.id),
        scenarioPrompt || undefined,
      )
      router.push(`/rooms/${room.id}`)
    } catch (error) {
      console.error("Failed to create room:", error)
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <AppLayout>
      <div className="min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create a Room</h1>
            <p className="text-muted-foreground">Chat with multiple characters at once</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    step >= s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                  )}
                >
                  {s}
                </div>
                <span
                  className={cn("text-sm hidden sm:block", step >= s ? "text-foreground" : "text-muted-foreground")}
                >
                  {s === 1 ? "Select Characters" : s === 2 ? "Name Room" : "Add Scenario"}
                </span>
                {s < 3 && <div className="w-8 h-px bg-border" />}
              </div>
            ))}
          </div>

          {/* Step 1: Select Characters */}
          {step === 1 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Select 2-4 characters ({selectedCharacters.length}/4 selected)
                </p>
                {selectedCharacters.length >= 2 && (
                  <Button onClick={() => setStep(2)}>
                    Continue
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>

              {/* Selected characters */}
              {selectedCharacters.length > 0 && (
                <div className="flex gap-2 mb-4 flex-wrap">
                  {selectedCharacters.map((char) => (
                    <div
                      key={char.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-primary/10 border border-primary/30"
                    >
                      <div className="w-6 h-6 rounded-lg overflow-hidden">
                        <Image
                          src={char.avatarUrl || "/placeholder.svg?height=24&width=24"}
                          alt={char.name}
                          width={24}
                          height={24}
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium">{char.name}</span>
                      <button
                        onClick={() => toggleCharacter(char)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search characters..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Character grid */}
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {filteredCharacters.map((character) => {
                    const isSelected = selectedCharacters.find((c) => c.id === character.id)
                    return (
                      <Card
                        key={character.id}
                        className={cn(
                          "p-3 cursor-pointer transition-all",
                          isSelected ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50",
                          selectedCharacters.length >= 4 && !isSelected && "opacity-50 cursor-not-allowed",
                        )}
                        onClick={() => toggleCharacter(character)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-xl overflow-hidden">
                              <Image
                                src={character.avatarUrl || "/placeholder.svg?height=48&width=48"}
                                alt={character.name}
                                width={48}
                                height={48}
                                className="object-cover"
                              />
                            </div>
                            {isSelected && (
                              <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                                <Check className="w-3 h-3 text-primary-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-medium text-sm truncate">{character.name}</h3>
                            <p className="text-xs text-muted-foreground truncate">{character.tagline}</p>
                          </div>
                        </div>
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Step 2: Name Room */}
          {step === 2 && (
            <div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="roomName">Room Name</Label>
                  <Input
                    id="roomName"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    placeholder="e.g., Study Group, Adventure Party..."
                    className="mt-2"
                  />
                </div>

                <div className="flex items-center gap-3 p-4 rounded-xl bg-muted/50">
                  <Users className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Characters in this room:</p>
                    <p className="text-sm text-muted-foreground">{selectedCharacters.map((c) => c.name).join(", ")}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Back
                </Button>
                <Button onClick={() => setStep(3)} disabled={!roomName.trim()} className="flex-1">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Scenario (Optional) */}
          {step === 3 && (
            <div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="scenario">Scenario Prompt (Optional)</Label>
                  <Textarea
                    id="scenario"
                    value={scenarioPrompt}
                    onChange={(e) => setScenarioPrompt(e.target.value)}
                    placeholder="e.g., You are my study group helping me prepare for exams..."
                    className="mt-2 min-h-[120px]"
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Set the scene for your conversation. This helps characters understand their role in the room.
                  </p>
                </div>

                {/* Preview */}
                <Card className="p-4">
                  <h3 className="font-medium mb-3">Room Preview</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex -space-x-2">
                      {selectedCharacters.map((char, i) => (
                        <div
                          key={char.id}
                          className="w-10 h-10 rounded-xl overflow-hidden border-2 border-card"
                          style={{ zIndex: 4 - i }}
                        >
                          <Image
                            src={char.avatarUrl || "/placeholder.svg?height=40&width=40"}
                            alt={char.name}
                            width={40}
                            height={40}
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="font-medium">{roomName}</p>
                      <p className="text-sm text-muted-foreground">{selectedCharacters.length} characters</p>
                    </div>
                  </div>
                  {scenarioPrompt && <p className="text-sm text-muted-foreground italic">"{scenarioPrompt}"</p>}
                </Card>
              </div>

              <div className="flex gap-3 mt-6">
                <Button variant="outline" onClick={() => setStep(2)}>
                  Back
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={isCreating}
                  className="flex-1 bg-linear-to-r from-primary to-accent hover:opacity-90"
                >
                  {isCreating ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Create Room
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  )
}
