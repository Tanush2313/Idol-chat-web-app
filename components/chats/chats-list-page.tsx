"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { AppLayout } from "@/components/navigation/app-layout"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getChats, getRooms } from "@/lib/mock-api"
import { mockCharacters } from "@/lib/mock-data"
import type { Chat, Room } from "@/lib/types"
import { MessageCircle, Users, Plus, Loader2, ChevronRight } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

export function ChatsListPage() {
  const [chats, setChats] = useState<Chat[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setIsLoading(true)
    try {
      const [chatsData, roomsData] = await Promise.all([getChats(), getRooms()])
      setChats(chatsData)
      setRooms(roomsData)
    } catch (error) {
      console.error("Failed to load chats:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCharacterForChat = (characterId: string) => {
    return mockCharacters.find((c) => c.id === characterId)
  }

  const getLastMessage = (messages: { text: string }[]) => {
    return messages[messages.length - 1]?.text || "No messages yet"
  }

  return (
    <AppLayout>
      <div className="min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Your Chats</h1>
              <p className="text-muted-foreground">Continue your conversations</p>
            </div>
            <Link href="/rooms/create">
              <Button className="bg-linear-to-r from-primary to-accent hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                New Room
              </Button>
            </Link>
          </div>

          <Tabs defaultValue="chats" className="w-full">
            <TabsList className="w-full mb-6 bg-card border border-border/50">
              <TabsTrigger value="chats" className="flex-1 gap-2">
                <MessageCircle className="w-4 h-4" />
                Chats
              </TabsTrigger>
              <TabsTrigger value="rooms" className="flex-1 gap-2">
                <Users className="w-4 h-4" />
                Rooms
              </TabsTrigger>
            </TabsList>

            <TabsContent value="chats">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : chats.length === 0 ? (
                <div className="text-center py-20">
                  <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No chats yet</p>
                  <Link href="/discover">
                    <Button>Discover Characters</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {chats.map((chat) => {
                    const character = getCharacterForChat(chat.characterId)
                    if (!character) return null

                    return (
                      <Link key={chat.id} href={`/chat/${character.id}`}>
                        <Card className="p-4 hover:bg-card/80 transition-colors cursor-pointer border-border/50">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted shrink-0">
                              <Image
                                src={character.avatarUrl || "/placeholder.svg?height=48&width=48"}
                                alt={character.name}
                                width={48}
                                height={48}
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold truncate">{character.name}</h3>
                                <span className="text-xs text-muted-foreground shrink-0">
                                  {formatDistanceToNow(new Date(chat.updatedAt), { addSuffix: true })}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">{getLastMessage(chat.messages)}</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                          </div>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="rooms">
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : rooms.length === 0 ? (
                <div className="text-center py-20">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No rooms yet</p>
                  <Link href="/rooms/create">
                    <Button>Create a Room</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {rooms.map((room) => {
                    const roomCharacters = room.characterIds
                      .map((id) => mockCharacters.find((c) => c.id === id))
                      .filter(Boolean)

                    return (
                      <Link key={room.id} href={`/rooms/${room.id}`}>
                        <Card className="p-4 hover:bg-card/80 transition-colors cursor-pointer border-border/50">
                          <div className="flex items-center gap-4">
                            <div className="flex -space-x-2 shrink-0">
                              {roomCharacters.slice(0, 3).map((char, i) => (
                                <div
                                  key={char!.id}
                                  className="w-10 h-10 rounded-xl overflow-hidden bg-muted border-2 border-card"
                                  style={{ zIndex: 3 - i }}
                                >
                                  <Image
                                    src={char!.avatarUrl || "/placeholder.svg?height=40&width=40"}
                                    alt={char!.name}
                                    width={40}
                                    height={40}
                                    className="object-cover w-full h-full"
                                  />
                                </div>
                              ))}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h3 className="font-semibold truncate">{room.name}</h3>
                                <span className="text-xs text-muted-foreground shrink-0">
                                  {formatDistanceToNow(new Date(room.updatedAt), { addSuffix: true })}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground truncate">
                                {roomCharacters.map((c) => c!.name).join(", ")}
                              </p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-muted-foreground shrink-0" />
                          </div>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  )
}
