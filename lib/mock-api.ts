import type { Character, Chat, Room, Message, MessageTone, User } from "./types"
import { mockCharacters, mockChats, mockRooms, mockCurrentUser } from "./mock-data"

// Simulated delay for realistic API feel
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Character responses based on personality
const generateMockResponse = (character: Character, userMessage: string, tone?: MessageTone): string => {
  const responses: Record<string, string[]> = {
    "char-1": [
      "That's so cool! 💫 Tell me more!",
      "Aww, I totally get that! You know what helps me? Taking a break and listening to music!",
      "You're doing amazing! I believe in you! 🌟",
    ],
    "char-2": [
      "An interesting perspective. Have you considered looking at it from another angle?",
      "The nature of your question reveals much about your search for meaning.",
      "Philosophy teaches us that questions often matter more than answers.",
    ],
    "char-3": [
      "OMG really?! That's so kawaii! 🌸",
      "Sugoi! Have you seen the latest episode of...wait, no spoilers! 😅",
      "Hehe, that reminds me of this one anime scene...",
    ],
    "char-4": [
      "Acknowledged. Helm, adjust course bearing 247 mark 3.",
      "The crew is counting on us. We won't let them down.",
      "In my years among the stars, I've learned that courage isn't the absence of fear.",
    ],
    "char-5": [
      "I hear you. It's completely valid to feel that way.",
      "Let's explore that feeling together. When did you first notice it?",
      "Thank you for sharing that with me. What support do you need right now?",
    ],
    "char-6": [
      "Great question! Let me break that down for you.",
      "Think of it this way - it's like building blocks, one concept at a time.",
      "You're making excellent progress! Ready for the next step?",
    ],
    "char-7": [
      "*arches an elegant eyebrow* How delightfully mortal of you.",
      "Centuries of existence, and humans still manage to surprise me.",
      "The shadows whisper many secrets. Shall I share one with you?",
    ],
  }

  const toneModifiers: Record<MessageTone, string> = {
    casual: " 😊",
    supportive: " You've got this! 💪",
    flirty: " 😉✨",
    serious: "",
  }

  const charResponses = responses[character.id] || ["That's interesting! Tell me more about that."]
  let response = charResponses[Math.floor(Math.random() * charResponses.length)]

  if (tone) {
    response += toneModifiers[tone]
  }

  return response
}

// API Functions
export async function getCharacters(filters?: { tag?: string; search?: string }): Promise<Character[]> {
  await delay(500)

  let filtered = [...mockCharacters].filter((c) => c.visibility === "public" || c.creator.id === mockCurrentUser.id)

  if (filters?.tag && filters.tag !== "Trending" && filters.tag !== "New") {
    filtered = filtered.filter((c) => c.tags.some((t) => t.toLowerCase().includes(filters.tag!.toLowerCase())))
  }

  if (filters?.search) {
    const search = filters.search.toLowerCase()
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.tagline.toLowerCase().includes(search) ||
        c.tags.some((t) => t.toLowerCase().includes(search)),
    )
  }

  return filtered
}

export async function getCharacter(id: string): Promise<Character | null> {
  await delay(300)
  return mockCharacters.find((c) => c.id === id) || null
}

export async function getUserProfile(): Promise<User> {
  await delay(300)
  return mockCurrentUser
}

export async function getSubscriptionStatus(): Promise<"free" | "premium"> {
  await delay(200)
  return mockCurrentUser.subscriptionStatus
}

export async function getChats(): Promise<Chat[]> {
  await delay(400)
  return mockChats.filter((c) => c.userId === mockCurrentUser.id)
}

export async function getChat(id: string): Promise<Chat | null> {
  await delay(300)
  return mockChats.find((c) => c.id === id) || null
}

export async function startChat(characterId: string): Promise<Chat> {
  await delay(400)

  const character = mockCharacters.find((c) => c.id === characterId)
  if (!character) throw new Error("Character not found")

  const newChat: Chat = {
    id: `chat-${Date.now()}`,
    characterId,
    userId: mockCurrentUser.id,
    messages: [
      {
        id: `msg-${Date.now()}`,
        senderType: "character",
        senderId: characterId,
        text: character.greetingMessage,
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  mockChats.push(newChat)
  return newChat
}

export async function sendMessageToCharacter(
  chatId: string,
  message: string,
  options?: { tone?: MessageTone },
): Promise<Message> {
  await delay(800 + Math.random() * 1000)

  const chat = mockChats.find((c) => c.id === chatId)
  if (!chat) throw new Error("Chat not found")

  const character = mockCharacters.find((c) => c.id === chat.characterId)
  if (!character) throw new Error("Character not found")

  // Add user message
  const userMessage: Message = {
    id: `msg-${Date.now()}`,
    senderType: "user",
    senderId: mockCurrentUser.id,
    text: message,
    createdAt: new Date().toISOString(),
    metadata: { tone: options?.tone },
  }
  chat.messages.push(userMessage)

  // Generate character response
  const responseText = generateMockResponse(character, message, options?.tone)
  const characterMessage: Message = {
    id: `msg-${Date.now() + 1}`,
    senderType: "character",
    senderId: character.id,
    text: responseText,
    createdAt: new Date().toISOString(),
  }
  chat.messages.push(characterMessage)
  chat.updatedAt = new Date().toISOString()

  return characterMessage
}

export async function getRooms(): Promise<Room[]> {
  await delay(400)
  return mockRooms.filter((r) => r.userId === mockCurrentUser.id)
}

export async function getRoom(id: string): Promise<Room | null> {
  await delay(300)
  return mockRooms.find((r) => r.id === id) || null
}

export async function createRoom(name: string, characterIds: string[], scenarioPrompt?: string): Promise<Room> {
  await delay(500)

  const characters = characterIds.map((id) => mockCharacters.find((c) => c.id === id)).filter(Boolean) as Character[]

  const newRoom: Room = {
    id: `room-${Date.now()}`,
    name,
    userId: mockCurrentUser.id,
    characterIds,
    scenarioPrompt,
    messages: characters.map((char, i) => ({
      id: `room-msg-${Date.now() + i}`,
      senderType: "character" as const,
      senderId: char.id,
      text: char.greetingMessage,
      createdAt: new Date(Date.now() + i * 1000).toISOString(),
    })),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  mockRooms.push(newRoom)
  return newRoom
}

export async function sendMessageToRoom(roomId: string, message: string): Promise<Message[]> {
  await delay(1200 + Math.random() * 800)

  const room = mockRooms.find((r) => r.id === roomId)
  if (!room) throw new Error("Room not found")

  // Add user message
  const userMessage: Message = {
    id: `msg-${Date.now()}`,
    senderType: "user",
    senderId: mockCurrentUser.id,
    text: message,
    createdAt: new Date().toISOString(),
  }
  room.messages.push(userMessage)

  // Generate responses from 1-3 random characters
  const characters = room.characterIds
    .map((id) => mockCharacters.find((c) => c.id === id))
    .filter(Boolean) as Character[]

  const respondingChars = characters
    .sort(() => Math.random() - 0.5)
    .slice(0, Math.min(characters.length, Math.floor(Math.random() * 2) + 1))

  const responses: Message[] = []
  for (const char of respondingChars) {
    const response: Message = {
      id: `msg-${Date.now() + responses.length + 1}`,
      senderType: "character",
      senderId: char.id,
      text: generateMockResponse(char, message),
      createdAt: new Date(Date.now() + (responses.length + 1) * 500).toISOString(),
    }
    room.messages.push(response)
    responses.push(response)
  }

  room.updatedAt = new Date().toISOString()
  return responses
}

export async function createCharacter(characterData: Partial<Character>): Promise<Character> {
  await delay(600)

  const newCharacter: Character = {
    id: `char-${Date.now()}`,
    name: characterData.name || "New Character",
    avatarUrl: characterData.avatarUrl,
    tagline: characterData.tagline || "",
    bio: characterData.bio || "",
    personalityPrompt: characterData.personalityPrompt || "",
    greetingMessage: characterData.greetingMessage || "Hello!",
    exampleDialogues: characterData.exampleDialogues || [],
    tags: characterData.tags || [],
    fandom: characterData.fandom,
    language: characterData.language || "English",
    creator: { id: mockCurrentUser.id, username: mockCurrentUser.username },
    stats: { chatsCount: 0, likes: 0, rating: 0 },
    visibility: characterData.visibility || "private",
    isOfficial: false,
  }

  mockCharacters.push(newCharacter)
  mockCurrentUser.createdCharacterIds.push(newCharacter.id)

  return newCharacter
}

export async function updateCharacter(id: string, updates: Partial<Character>): Promise<Character> {
  await delay(500)

  const index = mockCharacters.findIndex((c) => c.id === id)
  if (index === -1) throw new Error("Character not found")

  mockCharacters[index] = { ...mockCharacters[index], ...updates }
  return mockCharacters[index]
}
