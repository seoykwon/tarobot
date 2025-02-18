"use client"

import { useState } from "react"
import TarotMasterList from "./TarotMasterList"
import ClientSidebar from "./ClientSidebar"
import SessionList from "./SessionList"
import CharacterSelect from "./CharacterSelect"

export default function Sidebar({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (open: boolean) => void }) {
  const [isCharacterSelectOpen, setIsCharacterSelectOpen] = useState(false)

  return (
    <>
      <ClientSidebar isOpen={isOpen} setIsOpen={setIsOpen}>
        <TarotMasterList onOpenCharacterSelect={() => setIsCharacterSelectOpen(true)} />
        <SessionList />
      </ClientSidebar>
      <CharacterSelect isOpen={isCharacterSelectOpen} onClose={() => setIsCharacterSelectOpen(false)} />
    </>
  )
}

