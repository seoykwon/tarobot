"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import styles from "./CardSelector.module.css"

interface CardSelectorProps {
  onCardSelect: (cardNumber: number) => void
  onClose: () => void
}

const CardSelector: React.FC<CardSelectorProps> = ({ onCardSelect, onClose }) => {
  const [selectedCard, setSelectedCard] = useState<number | null>(null)
  const [startIndex, setStartIndex] = useState(0)
  const [isSelecting, setIsSelecting] = useState(false) // 고르는 중 추가 -> 고르는 중일때는 다른 카드 선택 불가
  const [randomizedCards, setRandomizedCards] = useState<number[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const totalCards = 22
  const visibleCards = 8
  const touchStartXRef = useRef<number | null>(null)
  const dragStartXRef = useRef<number | null>(null)
  
  useEffect(() => {   // 카드 순서 랜덤화
    const shuffled = [...Array(totalCards)].map((_, i) => i).sort(() =>Math.random() - 0.5)
    setRandomizedCards(shuffled)
  }, [])

  const handleCardSelect = (cardNumber: number) => {
    if (isSelecting) return
    setIsSelecting(true) // 선택 프로세스 시작
    setSelectedCard(cardNumber)
    setTimeout(() => {
      onCardSelect(cardNumber)
    }, 2000)  /* 몇초동안 카드 앞면 보여줄래 */
  }

  const handleScroll = useCallback(
    (direction: "left" | "right") => {
      if (isSelecting) return
      setStartIndex((prevIndex) => {
        if (direction === "left") {
          return (prevIndex - 1 + totalCards) % totalCards
        } else {
          return (prevIndex + 1) % totalCards
        }
      })
    },
    [isSelecting],
  )

  const getVisibleCards = () => {
    const cards = []
    for (let i = 0; i < visibleCards; i++) {
      const cardIndex = (startIndex + i) % totalCards
      cards.push(randomizedCards[cardIndex])
    }
    return cards
  }
  const handleTouchStart = (e: React.TouchEvent)=>{
    touchStartXRef.current = e.touches[0].clientX
  }
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartXRef.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartXRef.current - touchEndX

    if (Math.abs(diff) > 50) {
      // 50px 이상 스와이프 햇을 때만 동작
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