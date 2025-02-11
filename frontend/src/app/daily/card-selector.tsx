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
  const [isSelecting, setIsSelecting] = useState(false) // 고르는 중 추가 -> 고르는 중일때는 다른 카드 선택 불가
  const totalCards = 22
  const visibleCards = 8

  const handleCardSelect = (cardNumber: number) => {
    if (isSelecting) return
    setIsSelecting(true) // 선택 프로세스 시작
    setSelectedCard(cardNumber)
    setTimeout(() => {
      onCardSelect(cardNumber)
    }, 2000)  /* 몇초동안 카드 앞면 보여줄래 */
  }

  const handleScroll = (direction: "left" | "right") => {
    if (isSelecting) return //선택 중에는 스크롤 불가
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
      if (isSelecting) return //선택중에는 키보드 네비게이션 방지
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
  }, [isSelecting, handleScroll]) // isSelecting을 의존성 배열에 추가

  return (
    <div className={styles.overlay}>
      <div className={styles.overlayContent}>
        <button className={styles.closeButton} onClick={onClose} disabled={isSelecting}>
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

