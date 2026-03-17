"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MainNav } from "@/components/navigation/main-nav"
import { getRoom, sendMessageToRoom } from "@/lib/mock-api"
import { mockCharacters } from "@/lib/mock-data"
import { useApp } from "@/lib/store"
import type { Room, Message, Character } from "@/lib/types"
import { Send, ArrowLeft, MoreVertical, Loader2, Users } from "lucide-react"
import { cn } from "@/lib/utils"

interface RoomChatPageProps {
  roomId: string
}

export function RoomChatPage({ roomId }: RoomChatPageProps) {
  const router = useRouter()
  const { user } = useApp()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [room, setRoom] = useState<Room | null>(null)
  const [characters, setCharacters] = useState<Character[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    loadRoom()
  }, [roomId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadRoom = async () => {
    setIsLoading(true)
    try {
      const roomData = await getRoom(roomId)
      if (!roomData) {
        router.push("/chats")
        return
      }
      setRoom(roomData)
      setMessages(roomData.messages)

      // Get characters in room
      const roomCharacters = roomData.characterIds
        .map((id) => mockCharacters.find((c) => c.id === id))
        .filter(Boolean) as Character[]
      setCharacters(roomCharacters)
    } catch (error) {
      console.error("Failed to load room:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const getCharacterById = (id: string) => {
    return characters.find((c) => c.id === id)
  }

  const handleSend = async () => {
    if (!inputValue.trim() || !room || isSending) return

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      senderType: "user",
      senderId: user?.id || "user-1",
      text: inputValue.trim(),
      createdAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsSending(true)

    try {
      const responses = await sendMessageToRoom(room.id, userMessage.text)
      setMessages((prev) => [...prev, ...responses])
    } catch (error) {
      console.error("Failed to send message:", error)
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Room not found</p>
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
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 lg:left-64 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
          <div className="flex items-center justify-between px-4 h-14 lg:h-16">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => router.back()}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex -space-x-2">
                {characters.slice(0, 3).map((char, i) => (
                  <div
                    key={char.id}
                    className="w-8 h-8 rounded-lg overflow-hidden border-2 border-background"
                    style={{ zIndex: 3 - i }}
                  >
                    <Image
                      src={char.avatarUrl || "/placeholder.svg?height=32&width=32"}
                      alt={char.name}
                      width={32}
                      height={32}
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <div>
                <h1 className="font-semibold">{room.name}</h1>
                <p className="text-xs text-muted-foreground">{characters.length} characters</p>
              </div>
            </div>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </header>

        {/* Scenario prompt */}
        {room.scenarioPrompt && (
          <div className="mt-14 lg:mt-16 p-4 bg-primary/5 border-b border-primary/10">
            <p className="text-sm text-muted-foreground text-center">
              <span className="font-medium text-foreground">Scenario:</span> {room.scenarioPrompt}
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-6 pt-20 lg:pt-6 pb-32">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((message, index) => {
              const character = message.senderType === "character" ? getCharacterById(message.senderId) : null

              return (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 animate-message-in",
                    message.senderType === "user" ? "justify-end" : "justify-start",
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {message.senderType === "character" && character && (
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

                  <div className={cn("max-w-[80%]", message.senderType === "user" ? "order-first" : "")}>
                    {message.senderType === "character" && character && (
                      <p className="text-xs text-muted-foreground mb-1 ml-1">{character.name}</p>
                    )}
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
                  </div>
                </div>
              )
            })}

            {/* Typing indicator */}
            {isSending && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 bg-muted flex items-center justify-center">
                  <Users className="w-4 h-4 text-muted-foreground" />
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

        {/* Input Area */}
        <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-background/80 backdrop-blur-lg border-t border-border p-4">
          <div className="max-w-3xl mx-auto flex gap-3">
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message to the room..."
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
    </div>
  )
}
