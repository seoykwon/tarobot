"use client"

import type React from "react"
import styles from "./CardSelector.module.css"

interface CardSelectorProps {
  onCardSelect: (cardNumber: number) => void
  onClose: () => void
}

const CardSelector: React.FC<CardSelectorProps> = ({ onCardSelect, onClose }) => {
  const handleCardSelect = () => {
    const randomNumber = Math.floor(Math.random() * 22)
    onCardSelect(randomNumber)
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.overlayContent}>
        <button className={styles.closeButton} onClick={onClose}>
          ✕
        </button>
        <div className={styles.cardGrid}>
          {Array.from({ length: 18 }, (_, index) => (
            <div key={index} className={styles.card} onClick={() => handleCardSelect()}>
              <div
                className={styles.cardBack}
                style={{
                  backgroundImage: `url('/card-back-celestial.svg')`,
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CardSelector

