"use client"

import { useState } from "react"
import TarotMasterList from "@/components/Sidebar/TarotMasterList"
import ClientSidebar from "@/components/Sidebar/ClientSidebar"
import SessionList from "@/components/Sidebar/SessionList"
import CharacterSelect from "@/components/CharacterSelect"

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

