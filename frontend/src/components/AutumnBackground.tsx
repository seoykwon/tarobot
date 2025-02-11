"use client"

import type React from "react"
import { useEffect, useState } from "react"
import styles from "./AutumnBackground.module.css"

const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000
  return Number((x - Math.floor(x)).toFixed(8))
}

interface Leaf {
  id: number
  style: React.CSSProperties
  leafType: string
}

const createLeaves = (count: number, seed: number): Leaf[] => {
  return Array.from({ length: count }, (_, i) => {
    const size = seededRandom(seed + i) * 20 + 10 // 10px to 30px
    const leafType = `leaf${Math.floor(seededRandom(seed + i + count) * 3) + 1}`
    return {
      id: i,
      style: {
        left: `${(seededRandom(seed + i + count * 2) * 100).toFixed(2)}%`,
        top: `-${size}px`,
        width: `${size}px`,
        height: `${size}px`,
        animationDuration: `${15 + seededRandom(seed + i + count * 3) * 30}s`,
        animationDelay: `${seededRandom(seed + i + count * 4) * -15}s`,
        transform: `rotate(${seededRandom(seed + i + count * 5) * 360}deg)`,
      },
      leafType,
    }
  })
}

interface AutumnBackgroundProps {
  leafCount?: number
  seed?: number
}

const AutumnBackground: React.FC<AutumnBackgroundProps> = ({ leafCount = 50, seed = Date.now() }) => {
  const [leaves, setLeaves] = useState<Leaf[]>([])

  useEffect(() => {
    setLeaves(createLeaves(leafCount, seed))
  }, [leafCount, seed])

  return (
    <div className={styles.autumnBackground}>
      {leaves.map((leaf) => (
        <div key={leaf.id} className={`${styles.leaf} ${styles[leaf.leafType]}`} style={leaf.style} />
      ))}
    </div>
  )
}

export default AutumnBackground

