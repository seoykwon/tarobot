"use client"

import type React from "react"
import { useEffect, useState } from "react"
import styles from "./CherryBlossomBackground.module.css"

const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000
  return Number((x - Math.floor(x)).toFixed(8))
}

interface Petal {
  id: number
  style: React.CSSProperties
}

const createPetals = (count: number, seed: number): Petal[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    style: {
      right: `${(seededRandom(seed + i) * 100).toFixed(2)}%`,
      top: `${(seededRandom(seed + i + count) * 100).toFixed(2)}%`,
      animationDuration: `${10 + seededRandom(seed + i + count * 2) * 5}s`,
      animationDelay: `${seededRandom(seed + i + count * 3) * 5}s`,
    },
  }))
}

interface CherryBlossomBackgroundProps {
  petalCount?: number
  seed?: number
}

const CherryBlossomBackground: React.FC<CherryBlossomBackgroundProps> = ({ petalCount = 33, seed = Date.now() }) => {
  const [petals, setPetals] = useState<Petal[]>([])

  useEffect(() => {
    setPetals(createPetals(petalCount, seed))
  }, [petalCount, seed])

  useEffect(() => {
    petals.forEach((petal) => {
      const element = document.getElementById(`petal-${petal.id}`)
      if (element) {
        element.style.opacity = "1"
      }
    })
  }, [petals])

  return (
    <div className={styles.cherryBlossomBackground}>
      {petals.map((petal) => (
        <div key={petal.id} id={`petal-${petal.id}`} className={styles.petal} style={petal.style} />
      ))}
    </div>
  )
}

export default CherryBlossomBackground

