"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import styles from "./CardSelector.module.css"

interface CardSelectorProps {
  onCardSelect: (cardId: string) => void
  onClose: () => void
}

const CardSelector: React.FC<CardSelectorProps> = ({ onCardSelect, onClose }) => {
  const cardGridRef = useRef<HTMLDivElement>(null)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  // 메이저 카드: "maj0" ~ "maj21"
  const majorCards: string[] = Array.from({ length: 22 }, (_, i) => `maj${i}`)

  // 마이너 카드: cups, pents, swords, wands 각 1~14
  const minorCards: string[] = []
  const suits = ["cups", "pents", "swords", "wands"]
  suits.forEach((suit) => {
    for (let i = 1; i <= 14; i++) {
      minorCards.push(`${suit}${i}`)
    }
  })

  // 전체 카드 배열 (총 78장)
  const allCards: string[] = [...majorCards, ...minorCards]

  // 사용자가 카드 그리드를 클릭하면 전체 78장 중 랜덤으로 하나 선택
  const handleRandomCardSelect = () => {
    const randomIndex = Math.floor(Math.random() * allCards.length)
    const selectedCard = allCards[randomIndex]
    onCardSelect(selectedCard)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!cardGridRef.current) return
    setStartX(e.touches[0].clientX - cardGridRef.current.offsetLeft)
    setScrollLeft(cardGridRef.current.scrollLeft)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!cardGridRef.current) return
    const x = e.touches[0].clientX - cardGridRef.current.offsetLeft
    const walk = (x - startX) * 2 // 스크롤 속도 조절
    cardGridRef.current.scrollLeft = scrollLeft - walk
  }

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (cardGridRef.current) {
        e.preventDefault()
        cardGridRef.current.scrollLeft += e.deltaY
      }
    }

    const currentCardGrid = cardGridRef.current
    if (currentCardGrid) {
      currentCardGrid.addEventListener("wheel", handleWheel, { passive: false })
    }

    return () => {
      if (currentCardGrid) {
        currentCardGrid.removeEventListener("wheel", handleWheel)
      }
    }
  }, [])

  return (
    <div className={styles.overlay}>
      <button className={styles.closeButton} onClick={onClose}>
        ✕
      </button>
      <div className={styles.overlayContent}>
        <div className={styles.cardGridContainer}>
          <div
            className={styles.cardGrid}
            ref={cardGridRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
          >
            {allCards.map((cardId) => (
              <div key={cardId} className={styles.card} onClick={handleRandomCardSelect}>
                <div
                  className={styles.cardBack}
                  style={{
                    backgroundImage: "url('/card-back-celestial.svg')",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardSelector

