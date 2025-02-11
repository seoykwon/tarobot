"use client"

import React, { useEffect, useState } from "react"
import styles from "./StarryBackground.module.css"

// 시드 기반 난수 생성기
const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000
  return Number((x - Math.floor(x)).toFixed(8)) // 소수점 8자리로 고정
}

// 별 생성 함수
const createStars = (count: number, seed: number) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    style: {
      top: `${(seededRandom(seed + i) * 100).toFixed(2)}%`,
      left: `${(seededRandom(seed + i + count) * 100).toFixed(2)}%`,
    } as React.CSSProperties,
  }))
}

// 유성 생성 함수
const createShootingStar = (index: number, seed: number) => {
  const id = Date.now() + index
  const isFromTop = seededRandom(seed + id) > 0.5
  const position = seededRandom(seed + id + 1) * 100
  const delay = index * 0.5
  const width = seededRandom(seed + id + 2) * 100 + 100

  return {
    id,
    style: {
      top: isFromTop ? "0" : `${position}%`,
      right: isFromTop ? `${position}%` : "0",
      width: `${width}px`,
      animationDelay: `${delay}s`,
    } as React.CSSProperties,
  }
}

interface StarryBackgroundProps {
  starCount?: number
  seed?: number
}

const StarryBackground: React.FC<StarryBackgroundProps> = ({ starCount = 50, seed = Date.now() }) => {
  const [shootingStars, setShootingStars] = useState<React.ReactNode[]>([])
  const stars = React.useMemo(() => createStars(starCount, seed), [starCount, seed])

  useEffect(() => {
    // 클라이언트 사이드에서만 애니메이션 딜레이 적용
    stars.forEach((star, index) => {
      const element = document.getElementById(`star-${star.id}`)
      if (element) {
        element.style.animationDelay = `${(seededRandom(seed + index + starCount * 2) * 5).toFixed(2)}s`
      }
    })

    const createShootingStarSequence = () => {
      const newShootingStars = [0, 1, 2].map((index) => {
        const star = createShootingStar(index, seed + Date.now())
        return <div key={star.id} className={styles.shootingStar} style={star.style} />
      })
      setShootingStars(newShootingStars)
    }

    createShootingStarSequence()
    const interval = setInterval(createShootingStarSequence, 5000)
    return () => clearInterval(interval)
  }, [stars, seed, starCount])

  return (
    <div className={styles.starryBackground}>
      {stars.map((star) => (
        <div key={star.id} id={`star-${star.id}`} className={styles.star} style={star.style} />
      ))}
      {shootingStars}
    </div>
  )
}

export default StarryBackground

