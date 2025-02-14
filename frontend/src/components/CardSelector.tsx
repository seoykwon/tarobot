"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import styles from "./CardSelector.module.css"

interface CardSelectorProps {
  onCardSelect: (cardId: string) => void // number → string
  onClose: () => void
}

const CardSelector: React.FC<CardSelectorProps> = ({ onCardSelect, onClose }) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [startIndex, setStartIndex] = useState(0)
  const [isSelecting, setIsSelecting] = useState(false)
  const [randomizedCards, setRandomizedCards] = useState<string[]>([]) // number → string
  const [isDragging, setIsDragging] = useState(false)
  const visibleCards = 8
  const touchStartXRef = useRef<number | null>(null)
  const dragStartXRef = useRef<number | null>(null)

  // ✅ 카드 목록을 "maj0", "cups1" 형식으로 변환
  useEffect(() => {
    const majorCards = Array.from({ length: 22 }, (_, i) => `maj${i}`)
    const minorCards: string[] = []
    const suits = ["cups", "pents", "swords", "wands"]

    suits.forEach((suit) => {
      for (let i = 1; i <= 14; i++) {
        minorCards.push(`${suit}${i}`)
      }
    })

    const allCards: string[] = [...majorCards, ...minorCards].sort(() => Math.random() - 0.5)
    setRandomizedCards(allCards);

    console.log("🃏 랜덤 카드 목록:", allCards); // 여기에 추가
  }, [])

  const handleCardSelect = (cardId: string) => {
    if (isSelecting) return
    setIsSelecting(true)
    setSelectedCard(cardId)

    setTimeout(() => {
      onCardSelect(cardId)
    }, 2000)
  }

  const handleScroll = useCallback(
    (direction: "left" | "right") => {
      if (isSelecting) return
      console.log(`📜 Scroll 방향: ${direction}`);
      setStartIndex((prevIndex) => {
        if (direction === "left") {
          return (prevIndex - 1 + randomizedCards.length) % randomizedCards.length
        } else {
          return (prevIndex + 1) % randomizedCards.length
        }
      })
    },
    [isSelecting, randomizedCards.length],
  )

  const getVisibleCards = () => {
    if (randomizedCards.length === 0) return []
    const cards = []
    for (let i = 0; i < visibleCards; i++) {
      const cardIndex = (startIndex + i) % randomizedCards.length
      cards.push(randomizedCards[cardIndex])
    }
    console.log("📌 현재 화면에 보이는 카드들:", cards);
    return cards
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartXRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartXRef.current - touchEndX

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleScroll("right")
      } else {
        handleScroll("left")
      }
    }
    touchStartXRef.current = null
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    dragStartXRef.current = e.clientX
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || dragStartXRef.current === null) return
    const diff = dragStartXRef.current - e.clientX

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleScroll("right")
      } else {
        handleScroll("left")
      }
      dragStartXRef.current = e.clientX
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    dragStartXRef.current = null
  }

  useEffect(() => {
    console.log("🔄 startIndex 변경됨:", startIndex);
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isSelecting) return
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
  }, [isSelecting, handleScroll])

  return (
    <div className={styles.overlay}>
      <div className={styles.overlayContent}>
        <button className={styles.closeButton} onClick={onClose} disabled={isSelecting}>
          ✕
        </button>
        <div
          className={styles.cardSemiCircle}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {randomizedCards.length > 0 &&
            getVisibleCards().map((cardId, i) => (
              <div
                key={`${cardId}-${i}`}
                className={`${styles.card} ${selectedCard === cardId ? styles.selected : ""}`}
                style={
                  {
                    "--index": i,
                    "--total": visibleCards,
                  } as React.CSSProperties
                }
                onClick={() => handleCardSelect(cardId)}
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
                    backgroundImage: `url('/basic/${cardId}.svg')`,
                  }}
                />
              </div>
            ))}
        </div>
        <button
          className={`${styles.scrollButton} ${styles.scrollLeft}`}
          onClick={() => handleScroll("left")}
          disabled={isSelecting}
        >
          &#8592;
        </button>
        <button
          className={`${styles.scrollButton} ${styles.scrollRight}`}
          onClick={() => handleScroll("right")}
          disabled={isSelecting}
        >
          &#8594;
        </button>
      </div>
    </div>
  )
}

export default CardSelector