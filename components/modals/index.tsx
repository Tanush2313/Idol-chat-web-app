"use client"

import { LoginModal } from "./login-modal"
import { ProfileModal } from "./profile-modal"
import { SettingsModal } from "./settings-modal"

export function GlobalModals() {
  return (
    <>
      <LoginModal />
      <ProfileModal />
      <SettingsModal />
    </>
  )
}
