"use client"

import type React from "react"
import { useEffect, useState } from "react"
import styles from "./SummerBackground.module.css"

const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000
  return Number((x - Math.floor(x)).toFixed(8))
}

interface Cloud {
  id: number
  style: React.CSSProperties
}

const createClouds = (count: number, seed: number): Cloud[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    style: {
      top: `${(seededRandom(seed + i) * 60).toFixed(2)}%`,
      animationDuration: `${30 + seededRandom(seed + i + count) * 20}s`,
      animationDelay: `${seededRandom(seed + i + count * 2) * 10}s`,
    },
  }))
}

interface SummerBackgroundProps {
  cloudCount?: number
  seed?: number
}

const SummerBackground: React.FC<SummerBackgroundProps> = ({ cloudCount = 5, seed = Date.now() }) => {
  const [clouds, setClouds] = useState<Cloud[]>([])

  useEffect(() => {
    setClouds(createClouds(cloudCount, seed))
  }, [cloudCount, seed])

  return (
    <div className={styles.summerBackground}>
      {clouds.map((cloud) => (
        <div key={cloud.id} className={styles.cloud} style={cloud.style} />
      ))}
    </div>
  )
}

export default SummerBackground

