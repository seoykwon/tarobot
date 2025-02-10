"use client"

import type React from "react"
import { useState, useEffect } from "react"
import styles from "./CardSelector.module.css"

interface CardSelectorProps {
  onCardSelect: (cardNumber: number) => void
  onClose: () => void
}

const CardSelector: React.FC<CardSelectorProps> = ({ onCardSelect, onClose }) => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const [startIndex, setStartIndex] = useState(0)
  const totalCards = 22
  const visibleCards = 8

  const handleCardSelect = (cardNumber: number) => {
    setSelectedCard(cardNumber)
    setTimeout(() => {
      onCardSelect(cardNumber)
    }, 500)
  }

  const handleScroll = (direction: "left" | "right") => {
    setStartIndex((prevIndex) => {
      if (direction === "left") {
        return (prevIndex - 1 + totalCards) % totalCards
      } else {
        return (prevIndex + 1) % totalCards
      }
    })
  }

  const getVisibleCards = () => {
    const cards = []
    for (let i = 0; i < visibleCards; i++) {
      const cardIndex = (startIndex + i) % totalCards
      cards.push(cardIndex)
    }
    return cards
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "ArrowLeft") {
        handleScroll("left")
      } else if (event.key === "ArrowRight") {
        handleScroll("right")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleScroll]) // Added handleScroll to dependencies

  return (
    <div className={styles.overlay}>
      <div className={styles.overlayContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <div className={styles.cardSemiCircle}>
          {getVisibleCards().map((cardIndex, i) => (
            <div
              key={cardIndex}
              className={`${styles.card} ${selectedCard === cardIndex ? styles.selected : ""}`}
              style={
                {
                  "--index": i,
                  "--total": visibleCards,
                } as React.CSSProperties
              }
              onClick={() => handleCardSelect(cardIndex)}
            >
              <div
                className={styles.cardBack}
                style={{
                  backgroundImage: `url('/card-back-celestial.svg')`,
                }}
              />
              <div
                className={styles.cardFront}
                style={{
                  backgroundImage: `url('/basic/maj${cardIndex}.svg')`,
                }}
              />
            </div>
          ))}
        </div>
        <button className={`${styles.scrollButton} ${styles.scrollLeft}`} onClick={() => handleScroll("left")}>
          &#8592;
        </button>
        <button className={`${styles.scrollButton} ${styles.scrollRight}`} onClick={() => handleScroll("right")}>
          &#8594;
        </button>
      </div>
    </div>
  )
}

export default CardSelector

