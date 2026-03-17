"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MainNav } from "@/components/navigation/main-nav"
import { CharacterInfoDrawer } from "./character-info-drawer"
import { getCharacter, startChat, getChats } from "@/lib/mock-api"
import { useApp } from "@/lib/store"
import type { Character, Chat, Message, MessageTone } from "@/lib/types"
import {
  Send,
  ArrowLeft,
  MoreVertical,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Info,
  Copy,
  Trash2,
  Flag,
  Ban,
  ChevronRight,
  Loader2,
  AlertCircle,
  Crown,
} from "lucide-react"
import { cn } from "@/lib/utils"

// --- Personality helpers ---

function getCharacterStyleInstructions(character: Character): string {
  const tags = character.tags.map((t) => t.toLowerCase())
  const fandom = (character.fandom || "").toLowerCase()
  const tagline = (character.tagline || "").toLowerCase()

  if (tags.includes("mental health") || tags.includes("therapy") || tagline.includes("therapist")) {
    return `Use a calm, gentle, non-judgmental tone.
Avoid slang and emojis except very simple ones.
Ask open questions, reflect feelings, and never give medical diagnosis.
Encourage seeking real professional help or crisis lines for serious issues.`
  }

  if (tags.includes("k-pop") || tags.includes("idol")) {
    return `Sound like a friendly idol chatting with a fan.
Be warm, encouraging and playful. You can use cute emojis sometimes (✨💖😄) but not in every sentence.
Talk naturally about practice, music, performances and daily life.`
  }

  if (tags.includes("anime") || tags.includes("school life")) {
    return `Talk like a cheerful anime classmate.
Be energetic, friendly and a bit fangirl/fanboy about anime and manga.
Use casual chat style, some emojis, and small reactions like "lol", "omg", "ehh?".`
  }

  if (tags.includes("study buddy") || tags.includes("education") || fandom === "education") {
    return `Explain things clearly and step-by-step.
Use simple examples and check if the user is following.
You can use short lists or bullet-style structure only when explaining concepts.`
  }

  if (tags.includes("vampire") || tags.includes("gothic") || tags.includes("fantasy")) {
    return `Speak dramatically and poetically, but still understandable.
You can use a slightly old-fashioned tone and playful dark humor.
Keep reply lengths moderate (1–4 sentences) instead of long monologues.`
  }

  if (tags.includes("cricket") || fandom === "cricket" || tagline.includes("cricket")) {
    return `Sound like a humble, experienced cricketer talking to a fan.
Use simple, clear language, sometimes referring to real match situations.
Focus on discipline, practice and mindset. Avoid trash talk or controversy.`
  }

  return `Speak in a natural, human chat style, like WhatsApp or Instagram DMs.
Use first-person ("I", "me") and short messages (1–3 sentences, sometimes 4–5 if topic needs).
Avoid sounding like an essay or formal article. No numbered lists unless the user asks for steps or tips.`
}

function buildSystemPrompt(character: Character, toneText: string): string {
  const styleInstructions = getCharacterStyleInstructions(character)

  return `You are role-playing as ${character.name} in a chat app.
You are an AI simulation, but you MUST NOT say things like "As an AI" or "As a language model".
Only mention that you are an AI character if the user directly asks if you are real.
If they ask, briefly say you are an AI character inspired by them, then continue in character.

Personality & background:
${character.bio || character.tagline || ""}

Extra persona details:
${character.personalityPrompt || ""}

Style guidelines:
${styleInstructions}

Current tone guideline:
${toneText}
`
}

const toneOptions: { value: MessageTone; label: string }[] = [
  { value: "casual", label: "Casual" },
  { value: "supportive", label: "Supportive" },
  { value: "flirty", label: "Flirty" },
  { value: "serious", label: "Serious" },
]

const toneInstructions: Record<MessageTone, string> = {
  casual: "Use a relaxed, friendly, everyday chatting style. Use simple language and emojis occasionally.",
  supportive: "Be warm, encouraging, and empathetic. Focus on emotional support and reassurance.",
  flirty:
    "Be playful and lightly flirty, but always respectful and safe for all ages. Avoid explicit or NSFW content.",
  serious: "Be straightforward, focused, and precise. Avoid jokes and keep the conversation on-topic.",
}

interface ChatPageProps {
  characterId: string
}

export function ChatPage({ characterId }: ChatPageProps) {
  const router = useRouter()
  const { user, messageCount, dailyLimit, incrementMessageCount } = useApp()

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [character, setCharacter] = useState<Character | null>(null)
  const [chat, setChat] = useState<Chat | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [selectedTone, setSelectedTone] = useState<MessageTone | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [showInfoDrawer, setShowInfoDrawer] = useState(false)

  const isPremium = user?.subscriptionStatus === "premium"
  const isNearLimit = !isPremium && messageCount >= dailyLimit - 10

  useEffect(() => {
    loadCharacterAndChat()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [characterId])

  const loadCharacterAndChat = async () => {
    setIsLoading(true)
    try {
      const charData = await getCharacter(characterId)
      if (!charData) {
        router.push("/discover")
        return
      }
      setCharacter(charData)

      const existingChats = await getChats()
      const existingChat = existingChats.find((c) => c.characterId === characterId)

      if (existingChat) {
        setChat(existingChat)
        setMessages(existingChat.messages)
      } else {
        const newChat = await startChat(characterId)
        setChat(newChat)
        setMessages(newChat.messages)
      }

      // scroll to bottom once after loading the chat
      setTimeout(() => {
        scrollToBottom("auto")
      }, 0)
    } catch (error) {
      console.error("Failed to load chat:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToBottom = (behavior: ScrollBehavior = "smooth") => {
    if (!messagesEndRef.current) return

    messagesEndRef.current.scrollIntoView({
      behavior,
      block: "end",
    })
  }

  // Smooth “typing” animation for AI replies
  const typeOutMessage = async (messageId: string, fullText: string) => {
    const typingDelay = 12 // ms per character

    // For very long replies, just drop the whole text
    if (fullText.length > 1200) {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, text: fullText } : m)),
      )
      return
    }

    for (let i = 1; i <= fullText.length; i++) {
      const partial = fullText.slice(0, i)

      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, text: partial } : m)),
      )

      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, typingDelay))
    }
  }

  const handleSend = async () => {
    if (!inputValue.trim() || !chat || isSending) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      senderType: "user",
      senderId: user?.id || "user-1",
      text: inputValue.trim(),
      createdAt: new Date().toISOString(),
      metadata: selectedTone ? { tone: selectedTone } : undefined,
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    scrollToBottom("smooth")
    setInputValue("")
    setIsSending(true)
    incrementMessageCount()

    try {
      const toneText = selectedTone
        ? toneInstructions[selectedTone]
        : "Use a natural, neutral tone appropriate to the conversation."

      if (!character) {
        console.error("No character loaded")
        return
      }

      const systemPrompt = buildSystemPrompt(character, toneText)

      const apiMessages = [
        { role: "system", content: systemPrompt },
        ...newMessages.map((m) => ({
          role: m.senderType === "user" ? "user" : "assistant",
          content: m.text,
        })),
      ]

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error("Chat API HTTP error:", res.status, errorText)
        setMessages((prev) => [
          ...prev,
          {
            id: `msg-${Date.now()}-error`,
            senderType: "character",
            senderId: character.id,
            text: "Sorry, I couldn’t reply because of a server error. Please try again in a moment.",
            createdAt: new Date().toISOString(),
          },
        ])
        return
      }

      const data = (await res.json()) as { reply: string }
      const fullText = data.reply

      const aiId = `msg-${Date.now()}-ai`
      const baseAiMessage: Message = {
        id: aiId,
        senderType: "character",
        senderId: character.id,
        text: "",
        createdAt: new Date().toISOString(),
        metadata: selectedTone ? { tone: selectedTone } : undefined,
      }

      // stop the 3-dot loader once we start typing
      setIsSending(false)

      setMessages((prev) => [...prev, baseAiMessage])

      // scroll once when AI reply bubble appears
      setTimeout(() => {
        scrollToBottom("smooth")
      }, 0)

      // then type without forcing scroll, so user can scroll manually
      await typeOutMessage(aiId, fullText)
    } catch (error) {
      console.error("Failed to send message:", error)
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}-error`,
          senderType: "character",
          senderId: character?.id || "character-1",
          text: "Sorry, I had trouble replying. Please try again.",
          createdAt: new Date().toISOString(),
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleRegenerate = async (messageId: string) => {
    if (!chat || !character || isSending) return

    setIsSending(true)

    try {
      const lastUserMessage = messages.filter((m) => m.senderType === "user").pop()
      if (!lastUserMessage) {
        setIsSending(false)
        return
      }

      const toneText = selectedTone
        ? toneInstructions[selectedTone]
        : "Use a natural, neutral tone appropriate to the conversation."

      const systemPrompt =
        buildSystemPrompt(character, toneText) +
        "\nYou are regenerating your last reply. Answer again to the same user message while following this tone."

      const historyBeforeAi = messages.filter((m) => m.id !== messageId)

      const apiMessages = [
        { role: "system", content: systemPrompt },
        ...historyBeforeAi.map((m) => ({
          role: m.senderType === "user" ? "user" : "assistant",
          content: m.text,
        })),
        {
          role: "user",
          content: lastUserMessage.text,
        },
      ]

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        console.error("Chat API HTTP error (regen):", res.status, errorText)
        setIsSending(false)
        return
      }

      const data = (await res.json()) as { reply: string }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? {
                ...m,
                text: data.reply,
                createdAt: new Date().toISOString(),
              }
            : m,
        ),
      )
    } catch (error) {
      console.error("Failed to regenerate:", error)
    } finally {
      setIsSending(false)
    }
  }

  const handleRate = (messageId: string, rating: "up" | "down") => {
    setMessages((prev) =>
      prev.map((m) => (m.id === messageId ? { ...m, metadata: { ...m.metadata, rating } } : m)),
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Character not found</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <MainNav />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Mobile Header */}
        <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-4 h-14">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-3" onClick={() => setShowInfoDrawer(true)}>
              <div className="w-8 h-8 rounded-lg overflow-hidden">
                <Image
                  src={character.avatarUrl || "/placeholder.svg?height=32&width=32"}
                  alt={character.name}
                  width={32}
                  height={32}
                  className="object-cover"
                />
              </div>
              <span className="font-semibold">{character.name}</span>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear chat
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Ban className="w-4 h-4 mr-2" />
                  Block
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Desktop Header */}
        <header className="hidden lg:flex items-center justify-between px-6 h-16 border-b border-border bg-background/50 backdrop-blur-sm">
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setShowInfoDrawer(true)}>
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-primary/20">
              <Image
                src={character.avatarUrl || "/placeholder.svg?height=40&width=40"}
                alt={character.name}
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-semibold">{character.name}</h1>
                {character.isOfficial && (
                  <Badge variant="secondary" className="text-xs bg-primary/20 text-primary">
                    Official
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{character.tagline}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setShowInfoDrawer(true)}>
              <Info className="w-5 h-5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear chat
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Flag className="w-4 h-4 mr-2" />
                  Report
                </DropdownMenuItem>
                <DropdownMenuItem className="text-destructive">
                  <Ban className="w-4 h-4 mr-2" />
                  Block
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 pt-20 lg:pt-6 pb-40 lg:pb-32">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message, index) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3 animate-message-in",
                  message.senderType === "user" ? "justify-end" : "justify-start",
                )}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {message.senderType === "character" && (
                  <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 ring-1 ring-primary/20">
                    <Image
                      src={character.avatarUrl || "/placeholder.svg?height=32&width=32"}
                      alt={character.name}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                )}

                <div className={cn("max-w-[80%] group", message.senderType === "user" ? "order-first" : "")}>
                  <div
                    className={cn(
                      "px-4 py-3 rounded-2xl",
                      message.senderType === "user"
                        ? "bg-primary text-primary-foreground rounded-tr-sm"
                        : "bg-card border border-border/50 rounded-tl-sm",
                    )}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  </div>

                  {message.senderType === "character" && (
                    <div className="flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => handleRegenerate(message.id)}
                        disabled={isSending}
                      >
                        <RefreshCw className={cn("w-3.5 h-3.5", isSending && "animate-spin")} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-7 w-7", message.metadata?.rating === "up" && "text-green-500")}
                        onClick={() => handleRate(message.id, "up")}
                      >
                        <ThumbsUp className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn("h-7 w-7", message.metadata?.rating === "down" && "text-red-500")}
                        onClick={() => handleRate(message.id, "down")}
                      >
                        <ThumbsDown className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => navigator.clipboard.writeText(message.text)}
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isSending && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={character.avatarUrl || "/placeholder.svg?height=32&width=32"}
                    alt={character.name}
                    width={32}
                    height={32}
                    className="object-cover"
                  />
                </div>
                <div className="bg-card border border-border/50 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full typing-dot" />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full typing-dot" />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full typing-dot" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Limit Warning Banner */}
        {isNearLimit && (
          <div className="fixed bottom-32 lg:bottom-28 left-0 right-0 lg:left-64 px-4">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-linear-to-r from-primary/20 to-accent/20 border border-primary/30">
                <AlertCircle className="w-5 h-5 text-primary shrink-0" />
                <p className="text-sm flex-1">
                  You're close to today's free limit. Unlock IdolChat+ for faster replies, longer memory & more
                  messages.
                </p>
                <Link href="/pricing">
                  <Button size="sm" className="shrink-0 bg-linear-to-r from-primary to-accent">
                    <Crown className="w-4 h-4 mr-1" />
                    Upgrade
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-background/80 backdrop-blur-lg border-t border-border p-4">
          <div className="max-w-3xl mx-auto">
            <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
              {toneOptions.map((tone) => (
                <Button
                  key={tone.value}
                  variant={selectedTone === tone.value ? "default" : "outline"}
                  size="sm"
                  className={cn(
                    "shrink-0 rounded-full text-xs",
                    selectedTone === tone.value ? "bg-primary/80 text-primary-foreground" : "bg-card border-border/50",
                  )}
                  onClick={() => setSelectedTone(selectedTone === tone.value ? null : tone.value)}
                >
                  {tone.label}
                </Button>
              ))}
            </div>

            <div className="flex gap-3">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setTimeout(() => scrollToBottom("smooth"), 50)}
                placeholder="Type a message..."
                className="min-h-12 max-h-32 resize-none bg-card border-border/50 rounded-xl"
                rows={1}
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isSending}
                size="icon"
                className="shrink-0 h-12 w-12 rounded-xl bg-linear-to-r from-primary to-accent hover:opacity-90"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* Character Info Sheet/Drawer */}
        <Sheet open={showInfoDrawer} onOpenChange={setShowInfoDrawer}>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <CharacterInfoDrawer character={character} onClose={() => setShowInfoDrawer(false)} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Info Drawer */}
      <div
        className={cn(
          "hidden xl:block w-80 border-l border-border bg-card/50 overflow-y-auto transition-all",
          showInfoDrawer ? "translate-x-0" : "translate-x-full w-0 border-0",
        )}
      >
        <CharacterInfoDrawer character={character} onClose={() => setShowInfoDrawer(false)} />
      </div>
    </div>
  )
}
