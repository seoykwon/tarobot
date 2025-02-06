"use client"

import type React from "react"
import { useEffect, useState } from "react"
import styles from "./StarryBackground.module.css"

const StarryBackground: React.FC = () => {
  const [shootingStars, setShootingStars] = useState<JSX.Element[]>([])

  useEffect(() => {
    const createShootingStar = (index: number) => {
      const id = Date.now() + index
      const isFromTop = Math.random() > 0.5 // 50% chance to start from top or right edge
      const position = Math.random() * 100
      const delay = index * 0.5 // 0.5 second delay between each star
      const width = Math.random() * 100 + 100 // Random width between 100-200px

      return (
        <div
          key={id}
          className={styles.shootingStar}
          style={{
            top: isFromTop ? "0" : `${position}%`,
            right: isFromTop ? `${position}%` : "0",
            width: `${width}px`,
            animationDelay: `${delay}s`,
          }}
        />
      )
    }

    const createShootingStarSequence = () => {
      const newShootingStars = [0, 1, 2].map(createShootingStar)
      setShootingStars(newShootingStars)
    }

    // 즉시 첫 번째 시퀀스의 별똥별 생성
    createShootingStarSequence()

    const shootingStarInterval = setInterval(createShootingStarSequence, 5000) // Every 5 seconds

    return () => clearInterval(shootingStarInterval)
  }, [])

  return (
    <div className={styles.starryBackground}>
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className={styles.star}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
      {shootingStars}
    </div>
  )
}

export default StarryBackground

