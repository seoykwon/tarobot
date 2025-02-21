"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import styles from "./CardSelector.module.css"

interface CardSelectorProps {
  onCardSelect: (cardId: string) => void
  onClose: () => void
}

const CardSelector: React.FC<CardSelectorProps> = ({ onCardSelect, onClose }) => {
  const [selectedCard, setSelectedCard] = useState<string | null>(null)
  const [movingCard, setMovingCard] = useState<string | null>(null)
  const [startIndex, setStartIndex] = useState(0)
  const [isSelecting, setIsSelecting] = useState(false)
  const [randomizedCards, setRandomizedCards] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isInitial, setIsInitial] = useState(true) // 초기 애니메이션 상태 추가
  // const visibleCards = 24
  const [visibleCards, setVisibleCards] = useState<number>(24)
  const touchStartXRef = useRef<number | null>(null)
  const dragStartXRef = useRef<number | null>(null)
  
  // 화면 크기에 따라 visible cards 값을 동적으로 업데이트
  const updateVisibleCards = useCallback(() => { // ✅ 추가됨
    const width = window.innerWidth
    if (width >= 1024) {
      setVisibleCards(24) // 데스크탑
    } else if (width >= 768) {
      setVisibleCards(24) // 태블릿
    } else {
      setVisibleCards(12) // 모바일
    }
  }, [])

  useEffect(() => {
    updateVisibleCards() // 🔥 초기값 설정
    window.addEventListener("resize", updateVisibleCards) // 🔥 ✅ 리사이즈 이벤트 추가
    return () => {
      window.removeEventListener("resize", updateVisibleCards) // 🔥 ✅ 정리
    }
  }, [updateVisibleCards]) // 추가됨


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
    setRandomizedCards(allCards)

    console.log("🃏 랜덤 카드 목록:", allCards)

    // 1000ms (1초) 후 초기 애니메이션 종료
    setTimeout(() => {
      setIsInitial(false)
    }, 1000)
  }, [])

  const handleCardSelect = (cardId: string) => {
    if (isSelecting) return
    setIsSelecting(true)
    setMovingCard(cardId)

    setTimeout(() => {
      setSelectedCard(cardId)
      setTimeout(() => {
        onCardSelect(cardId)
      }, 1500) // 카드 뒤집기 애니메이션 시간(뒤집히면서 앞면보이는 시간)
    }, 600) // 카드 이동 애니메이션 시간
  }

  const handleScroll = useCallback(
    (direction: "left" | "right") => {
      if (isSelecting) return
      console.log(`📜 Scroll 방향: ${direction}`)
      setStartIndex((prevIndex) => {
        // if (direction === "left") {
        //   if (prevIndex === 0) return prevIndex
        //   return prevIndex - 1
        // } else {
        //   if (prevIndex >= randomizedCards.length - visibleCards) return prevIndex
        //   return prevIndex + 1
        // }
        if (direction === "left") {
          return Math.max(prevIndex - 1, 0) // 기존 로직 유지
        } else {
          return Math.min(prevIndex + 1, randomizedCards.length - visibleCards) // 🔥 visibleCards 적용
        }
      })
    },
    [isSelecting, randomizedCards.length, visibleCards], // visibleCards 추가
  )

  // const getVisibleCards = () => {
  //   if (randomizedCards.length === 0) return []
  //   const cards = []
  //   for (let i = 0; i < visibleCards; i++) {
  //     const cardIndex = startIndex + i
  //     if (cardIndex >= randomizedCards.length) break
  //     cards.push(randomizedCards[cardIndex])
  //   }
  //   console.log("📌 현재 화면에 보이는 카드들:", cards)
  //   return cards
  // }

  // [수정] getVisibleCards 함수에서 visibleCards 적용
  const getVisibleCards = () => {
    if (randomizedCards.length === 0) return []
    return randomizedCards.slice(startIndex, startIndex + visibleCards) // 수정됨
  } 

  // const isEdgePosition = () => {
  //   return startIndex === 0 || startIndex >= randomizedCards.length - visibleCards
  // }

  const getCardStyle = (index: number, cardId: string): React.CSSProperties => {
    const angle = -105 + (210 / (visibleCards - 1)) * index
    const isMobile = window.innerWidth < 768 // 모바일 확인

    return {
      position: "absolute",
      // width: selectedCard === cardId ? "120px" : "80px",
      // height: selectedCard === cardId ? "180px" : "120px",
      width: selectedCard === cardId ? (isMobile ? "90px" : "120px") : (isMobile ? "60px" : "80px"), // 모바일 크기 축소
      height: selectedCard === cardId ? (isMobile ? "135px" : "180px") : (isMobile ? "90px" : "120px"), // 모바일 크기 축소
      cursor: "pointer",
      transform: isInitial
        // ? `rotate(-90deg) translateY(500px)` // 초기에 아래에서 시작
        // : `rotate(${angle}deg) translateY(280px)`, // 원래 반원형 정렬
        ? `rotate(-90deg) translateY(${isMobile ? "400px" : "500px"})` // 모바일: translateY 값 축소
        : `rotate(${angle}deg) translateY(${isMobile ? "40px" : "280px"})`, // 더 촘촘히
      transformOrigin: "top center",
      transition: isInitial
        ? `transform 1s ease-out ${index * 80}ms` // 애니메이션 시간을 1초로, 간격을 80ms로 늘림
        : "all 0.6s cubic-bezier(0.23, 1, 0.32, 1)", // 기존 애니메이션 유지
      perspective: "1000px",
      transformStyle: "preserve-3d",
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isSelecting) return
    touchStartXRef.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isSelecting || touchStartXRef.current === null) return
    const touchEndX = e.changedTouches[0].clientX
    const diff = touchStartXRef.current - touchEndX

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleScroll("left")
      } else {
        handleScroll("right")
      }
    }
    touchStartXRef.current = null
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isSelecting) return
    setIsDragging(true)
    dragStartXRef.current = e.clientX
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isSelecting || !isDragging || dragStartXRef.current === null) return
    const diff = dragStartXRef.current - e.clientX

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        handleScroll("left")
      } else {
        handleScroll("right")
      }
      dragStartXRef.current = e.clientX
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
    dragStartXRef.current = null
  }

  useEffect(() => {
    console.log("🔄 startIndex 변경됨:", startIndex)
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
  }, [isSelecting, handleScroll, startIndex])

  return (
    <div
      className={styles.overlay}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className={styles.overlayContent}>
        <button className={styles.closeButton} onClick={onClose} disabled={isSelecting}>
          ✕
        </button>
        <div className={styles.cardSemiCircle}>
          {randomizedCards.length > 0 &&
            getVisibleCards().map((cardId, i) => (
              <div
                key={`${cardId}-${(startIndex + i) % randomizedCards.length}`}
                style={getCardStyle(i, cardId)}
                className={`${styles.card} 
                  ${movingCard === cardId ? styles.movingCard : ""} 
                  ${selectedCard === cardId ? styles.selectedCard : ""} 
                  ${isSelecting && movingCard !== cardId ? styles.nonSelectedCard : ""}`}
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

