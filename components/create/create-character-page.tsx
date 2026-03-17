"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { AppLayout } from "@/components/navigation/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { User, Sparkles, MessageSquare, Tags, Eye, Save, Play, Plus, X, ImageIcon } from "lucide-react"
import { useApp } from "@/lib/store"
import type { Character } from "@/lib/types"

const AVAILABLE_TAGS = [
  "Anime",
  "K-pop",
  "Celebrity",
  "Historical",
  "Fantasy",
  "Sci-Fi",
  "Romance",
  "Comedy",
  "Study Buddy",
  "Comfort",
  "Mentor",
  "Villain",
  "Hero",
  "Mystery",
  "Adventure",
]

const FANDOMS = [
  "Original Character",
  "Anime & Manga",
  "K-pop",
  "Movies & TV",
  "Video Games",
  "Books & Literature",
  "History",
  "Music",
  "Sports",
]

const LANGUAGES = ["English", "Korean", "Japanese", "Spanish", "Chinese", "French", "German"]

export function CreateCharacterPage() {
  const router = useRouter()
  const { user, addCharacter } = useApp()

  const [name, setName] = useState("")
  const [tagline, setTagline] = useState("")
  const [bio, setBio] = useState("")
  const [personalityPrompt, setPersonalityPrompt] = useState("")
  const [greetingMessage, setGreetingMessage] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [fandom, setFandom] = useState("Original Character")
  const [language, setLanguage] = useState("English")
  const [isPublic, setIsPublic] = useState(true)
  const [exampleDialogues, setExampleDialogues] = useState<{ user: string; character: string }[]>([
    { user: "", character: "" },
  ])

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag))
    } else if (selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const addDialogue = () => {
    setExampleDialogues([...exampleDialogues, { user: "", character: "" }])
  }

  const removeDialogue = (index: number) => {
    setExampleDialogues(exampleDialogues.filter((_, i) => i !== index))
  }

  const updateDialogue = (index: number, field: "user" | "character", value: string) => {
    const updated = [...exampleDialogues]
    updated[index][field] = value
    setExampleDialogues(updated)
  }

  const handleSave = () => {
    if (!name || !tagline || !greetingMessage) return

    const newCharacter: Character = {
      id: `char-${Date.now()}`,
      name,
      tagline,
      bio,
      personalityPrompt,
      greetingMessage,
      exampleDialogues: exampleDialogues.filter((d) => d.user && d.character),
      tags: selectedTags,
      fandom,
      language,
      creator: { id: user?.id || "user-1", username: user?.username || "You" },
      stats: { chatsCount: 0, likes: 0, rating: 0 },
      visibility: isPublic ? "public" : "private",
      isOfficial: false,
      avatarUrl: `/placeholder.svg?height=200&width=200&query=${encodeURIComponent(name + " avatar character")}`,
    }

    addCharacter(newCharacter)
    router.push(`/chat/${newCharacter.id}`)
  }

  const handleTestChat = () => {
    handleSave()
  }

  const isValid = name && tagline && greetingMessage

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Character</h1>
            <p className="text-muted-foreground">
              Bring your character to life with a unique personality and backstory
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2 space-y-8">
              {/* Basic Info */}
              <Card className="p-6 bg-card/50 border-border/50">
                <div className="flex items-center gap-2 mb-6">
                  <User className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Basic Info</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-2xl bg-secondary/50 border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors">
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <Label htmlFor="name">Character Name *</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g., Luna Starweaver"
                          className="mt-1.5 bg-secondary/50 border-border/50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="tagline">Tagline *</Label>
                        <Input
                          id="tagline"
                          value={tagline}
                          onChange={(e) => setTagline(e.target.value)}
                          placeholder="A short, catchy description"
                          className="mt-1.5 bg-secondary/50 border-border/50"
                          maxLength={100}
                        />
                        <p className="text-xs text-muted-foreground mt-1">{tagline.length}/100</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="bio">Bio / Backstory</Label>
                    <Textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      placeholder="Tell the world about your character..."
                      className="mt-1.5 bg-secondary/50 border-border/50 min-h-[100px]"
                    />
                  </div>
                </div>
              </Card>

              {/* Personality */}
              <Card className="p-6 bg-card/50 border-border/50">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Personality</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="personality">Personality / System Prompt</Label>
                    <Textarea
                      id="personality"
                      value={personalityPrompt}
                      onChange={(e) => setPersonalityPrompt(e.target.value)}
                      placeholder="Describe how the character should behave, speak, and respond. Include personality traits, speech patterns, quirks, and any specific knowledge they should have..."
                      className="mt-1.5 bg-secondary/50 border-border/50 min-h-[150px]"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      This guides how the AI roleplays as your character
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="greeting">Greeting Message *</Label>
                    <Textarea
                      id="greeting"
                      value={greetingMessage}
                      onChange={(e) => setGreetingMessage(e.target.value)}
                      placeholder="The first message your character sends when starting a chat..."
                      className="mt-1.5 bg-secondary/50 border-border/50 min-h-20"
                    />
                  </div>
                </div>
              </Card>

              {/* Example Dialogues */}
              <Card className="p-6 bg-card/50 border-border/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-semibold">Example Dialogues</h2>
                  </div>
                  <Button variant="outline" size="sm" onClick={addDialogue} className="border-border/50 bg-transparent">
                    <Plus className="w-4 h-4 mr-1" />
                    Add Example
                  </Button>
                </div>

                <div className="space-y-4">
                  {exampleDialogues.map((dialogue, index) => (
                    <div key={index} className="relative p-4 rounded-xl bg-secondary/30 border border-border/30">
                      {exampleDialogues.length > 1 && (
                        <button
                          onClick={() => removeDialogue(index)}
                          className="absolute top-2 right-2 p-1 rounded-full hover:bg-secondary/50 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                      <div className="space-y-3">
                        <div>
                          <Label className="text-xs text-muted-foreground">User says:</Label>
                          <Input
                            value={dialogue.user}
                            onChange={(e) => updateDialogue(index, "user", e.target.value)}
                            placeholder="Example user message..."
                            className="mt-1 bg-background/50 border-border/30"
                          />
                        </div>
                        <div>
                          <Label className="text-xs text-muted-foreground">Character responds:</Label>
                          <Textarea
                            value={dialogue.character}
                            onChange={(e) => updateDialogue(index, "character", e.target.value)}
                            placeholder="Example character response..."
                            className="mt-1 bg-background/50 border-border/30 min-h-[60px]"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Metadata */}
              <Card className="p-6 bg-card/50 border-border/50">
                <div className="flex items-center gap-2 mb-6">
                  <Tags className="w-5 h-5 text-primary" />
                  <h2 className="text-xl font-semibold">Metadata</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label>Tags (select up to 5)</Label>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {AVAILABLE_TAGS.map((tag) => (
                        <Badge
                          key={tag}
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className={`cursor-pointer transition-all ${
                            selectedTags.includes(tag)
                              ? "bg-primary/20 text-primary border-primary/30"
                              : "hover:bg-secondary/50"
                          }`}
                          onClick={() => toggleTag(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fandom">Fandom / Category</Label>
                      <select
                        id="fandom"
                        value={fandom}
                        onChange={(e) => setFandom(e.target.value)}
                        className="mt-1.5 w-full h-10 px-3 rounded-lg bg-secondary/50 border border-border/50 text-foreground"
                      >
                        {FANDOMS.map((f) => (
                          <option key={f} value={f}>
                            {f}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="language">Language</Label>
                      <select
                        id="language"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="mt-1.5 w-full h-10 px-3 rounded-lg bg-secondary/50 border border-border/50 text-foreground"
                      >
                        {LANGUAGES.map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-border/30">
                    <div className="flex items-center gap-3">
                      <Eye className="w-5 h-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Public Character</p>
                        <p className="text-sm text-muted-foreground">
                          Allow others to discover and chat with your character
                        </p>
                      </div>
                    </div>
                    <Switch checked={isPublic} onCheckedChange={setIsPublic} />
                  </div>
                </div>
              </Card>
            </div>

            {/* Preview Section */}
            <div className="lg:col-span-1">
              <div className="sticky top-4 space-y-6">
                {/* Card Preview */}
                <Card className="p-6 bg-card/50 border-border/50">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Card Preview</h3>
                  <div className="p-4 rounded-xl bg-secondary/30 border border-border/30">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary/30 to-accent/30 flex items-center justify-center text-lg font-bold">
                        {name.charAt(0) || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold truncate">{name || "Character Name"}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {tagline || "Your character's tagline"}
                        </p>
                      </div>
                    </div>
                    {selectedTags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {selectedTags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>

                {/* Greeting Preview */}
                <Card className="p-6 bg-card/50 border-border/50">
                  <h3 className="text-sm font-medium text-muted-foreground mb-4">Greeting Preview</h3>
                  <div className="p-4 rounded-2xl bg-linear-to-br from-primary/10 to-accent/10 border border-primary/20">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full bg-linear-to-br from-primary/30 to-accent/30 flex items-center justify-center text-sm font-bold shrink-0">
                        {name.charAt(0) || "?"}
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-1">{name || "Character"}</p>
                        <p className="text-sm text-muted-foreground">
                          {greetingMessage || "Your character's greeting message will appear here..."}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Actions */}
                <div className="space-y-3">
                  <Button
                    className="w-full bg-linear-to-r from-primary to-accent hover:opacity-90"
                    disabled={!isValid}
                    onClick={handleSave}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save Character
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-border/50 bg-transparent"
                    disabled={!isValid}
                    onClick={handleTestChat}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Test Chat
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
