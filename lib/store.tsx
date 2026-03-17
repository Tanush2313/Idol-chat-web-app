// lib/store.tsx
"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { User, UserSettings, ThemeMode, Character } from "./types"
import { mockCurrentUser, mockCharacters } from "./mock-data"

interface AppState {
  user: User | null
  isAuthenticated: boolean
  settings: UserSettings
  messageCount: number
  dailyLimit: number
  characters: Character[]
  showLoginModal: boolean
  showProfileModal: boolean
  showSettingsModal: boolean
  setShowLoginModal: (show: boolean) => void
  setShowProfileModal: (show: boolean) => void
  setShowSettingsModal: (show: boolean) => void
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => void
  setTheme: (theme: ThemeMode) => void
  upgradeToPlus: () => void
  incrementMessageCount: () => void
  toggleFavorite: (characterId: string) => void
  addCharacter: (character: Character) => void
  updateSettings: (newSettings: Partial<UserSettings>) => void
  updateProfile: (data: { username: string; bio: string; avatarUrl?: string }) => void   // 👈 NEW
}

const defaultSettings: UserSettings = {
  theme: "pure-dark",
  contentFilter: true,
  matureContent: false,
  notifications: {
    email: true,
    push: true,
    newFeatures: true,
  },
}

const AppContext = createContext<AppState | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [settings, setSettings] = useState<UserSettings>(defaultSettings)
  const [messageCount, setMessageCount] = useState(0)
  const [characters, setCharacters] = useState<Character[]>(mockCharacters)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedChars = localStorage.getItem("idolchat-characters")
      if (storedChars) {
        setCharacters(JSON.parse(storedChars))
      }
    }
  }, [])

  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [showSettingsModal, setShowSettingsModal] = useState(false)

  const dailyLimit = user?.subscriptionStatus === "premium" ? 999999 : 50

  useEffect(() => {
    const storedUser = localStorage.getItem("idolchat-auth-user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    const storedCharacters = localStorage.getItem("idolchat-characters")
    if (storedCharacters) {
      setCharacters(JSON.parse(storedCharacters))
    }

    const storedSettings = localStorage.getItem("idolchat-settings")
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings))
    }
  }, [])

  // LOGIN (mock)
  const login = async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // You can improve this later to really check email; for now we just reuse mockCurrentUser
    const loggedInUser: User = {
      ...mockCurrentUser,
      email,
      hasCompletedProfile: mockCurrentUser.hasCompletedProfile ?? true, // treat mock user as already set up
    }

    setUser(loggedInUser)
    localStorage.setItem("idolchat-auth-user", JSON.stringify(loggedInUser))
    localStorage.setItem("idolchat-auth", "true")
    setShowLoginModal(false)
  }

  // SIGNUP (mock)
  const signup = async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    const newUser: User = {
      ...mockCurrentUser,
      email,
      username: "",                 // empty until profile setup
      bio: "",
      hasCompletedProfile: false,   // 👈 NEW user must complete profile
    }

    setUser(newUser)
    localStorage.setItem("idolchat-auth-user", JSON.stringify(newUser))
    localStorage.setItem("idolchat-auth", "true")
    setShowLoginModal(false)
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("idolchat-auth-user")
    localStorage.removeItem("idolchat-auth")
    setShowProfileModal(false)
  }

  const setTheme = (theme: ThemeMode) => {
    const newSettings = { ...settings, theme }
    setSettings(newSettings)
    localStorage.setItem("idolchat-settings", JSON.stringify(newSettings))
  }

  const upgradeToPlus = () => {
    if (!user) return
    const upgradedUser: User = { ...user, subscriptionStatus: "premium" }
    setUser(upgradedUser)
    localStorage.setItem("idolchat-auth-user", JSON.stringify(upgradedUser))
  }

  const incrementMessageCount = () => {
    setMessageCount((prev) => prev + 1)
  }

  const toggleFavorite = (characterId: string) => {
    if (!user) return

    const isFavorite = user.favoriteCharacterIds.includes(characterId)
    const newFavorites = isFavorite
      ? user.favoriteCharacterIds.filter((id) => id !== characterId)
      : [...user.favoriteCharacterIds, characterId]

    const updatedUser: User = { ...user, favoriteCharacterIds: newFavorites }
    setUser(updatedUser)
    localStorage.setItem("idolchat-auth-user", JSON.stringify(updatedUser))
  }

  const addCharacter = (character: Character) => {
    setCharacters((prev) => {
      const updated = [character, ...prev]
      if (typeof window !== "undefined") {
        localStorage.setItem("idolchat-characters", JSON.stringify(updated))
      }
      return updated
    })

    if (!mockCharacters.find((c) => c.id === character.id)) {
      mockCharacters.unshift(character)
    }

    if (user) {
      const updatedUser: User = {
        ...user,
        createdCharacterIds: [character.id, ...user.createdCharacterIds],
      }
      setUser(updatedUser)
      localStorage.setItem("idolchat-auth-user", JSON.stringify(updatedUser))
    }
  }

  const updateSettings = (newSettings: Partial<UserSettings>) => {
    const merged = { ...settings, ...newSettings }
    setSettings(merged)
    localStorage.setItem("idolchat-settings", JSON.stringify(merged))
  }

  // 👇 used by /profile-setup
  const updateProfile = (data: { username: string; bio: string; avatarUrl?: string }) => {
    if (!user) return
    const updated: User = {
      ...user,
      username: data.username,
      bio: data.bio,
      avatarUrl: data.avatarUrl ?? user.avatarUrl,
      hasCompletedProfile: true,
    }
    setUser(updated)
    localStorage.setItem("idolchat-auth-user", JSON.stringify(updated))
  }

  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        settings,
        messageCount,
        dailyLimit,
        characters,
        showLoginModal,
        showProfileModal,
        showSettingsModal,
        setShowLoginModal,
        setShowProfileModal,
        setShowSettingsModal,
        login,
        signup,
        logout,
        setTheme,
        upgradeToPlus,
        incrementMessageCount,
        toggleFavorite,
        addCharacter,
        updateSettings,
        updateProfile,   // 👈 make sure this is exposed
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error("useApp must be used within AppProvider")
  }
  return context
}

export function useCurrentUser() {
  const { user } = useApp()
  return user
}

export function useSubscriptionStatus() {
  const { user } = useApp()
  return user?.subscriptionStatus || "free"
}
