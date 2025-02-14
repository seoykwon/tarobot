"use client"

import { useState } from "react"
import CardSelector from "@/components/CardSelector"

export default function CardPage() {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)

  const handleCardSelect = (cardId: string) => {
    setSelectedCard(cardId)
    console.log("Selected card:", cardId)
  }

  const handleClose = () => {
    console.log("CardSelector closed")
  }

  return (
    <div>
      <CardSelector onCardSelect={handleCardSelect} onClose={handleClose} />
      {selectedCard && <p>Selected Card: {selectedCard}</p>}
    </div>
  )
}

