// IdolChat - Core Types

export interface User {
  hasCompletedProfile: boolean
  id: string
  username: string
  email?: string   
  avatarUrl?: string
  bio?: string
  subscriptionStatus: "free" | "premium"
  createdCharacterIds: string[]
  favoriteCharacterIds: string[]
  createdAt: string
}

export interface Character {
  id: string
  name: string
  avatarUrl?: string
  tagline: string
  bio: string
  personalityPrompt: string
  greetingMessage: string
  exampleDialogues: ExampleDialogue[]
  tags: string[]
  fandom?: string
  language?: string
  creator: {
    id: string
    username: string
  }
  stats: {
    chatsCount: number
    likes: number
    rating: number
  }
  visibility: "public" | "private"
  isOfficial: boolean
}

export interface ExampleDialogue {
  user: string
  character: string
}

export interface Message {
  id: string
  senderType: "user" | "character"
  senderId: string
  text: string
  createdAt: string
  metadata?: {
    regeneratedFromId?: string
    rating?: "up" | "down"
    tone?: MessageTone
  }
}

export type MessageTone = "casual" | "supportive" | "flirty" | "serious"

export interface Chat {
  id: string
  characterId: string
  userId: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}

export interface Room {
  id: string
  name: string
  userId: string
  characterIds: string[]
  scenarioPrompt?: string
  messages: Message[]
  createdAt: string
  updatedAt: string
}

export interface Report {
  id: string
  type: "character" | "chat"
  targetId: string
  targetName: string
  reason: string
  reporterId: string
  reporterUsername: string
  snippet?: string
  status: "pending" | "reviewed" | "resolved"
  createdAt: string
}

export type ThemeMode = "sunset glow " | "midnight-gradient" | "system"

export interface UserSettings {
  theme: ThemeMode
  contentFilter: boolean
  matureContent: boolean
  notifications: {
    email: boolean
    push: boolean
    newFeatures: boolean
  }
}

// App name constant for easy renaming
export const APP_NAME = "TANUSH CHAT BOT"
export const APP_TAGLINE = "Chat with AI idols, characters & friends"
