"use client"

import type React from "react"
import { useEffect, useState } from "react"
import styles from "./WinterBackground.module.css"

const seededRandom = (seed: number) => {
  const x = Math.sin(seed++) * 10000
  return Number((x - Math.floor(x)).toFixed(8))
}

interface Snowflake {
  id: number
  style: React.CSSProperties
}

const createSnowflakes = (count: number, seed: number): Snowflake[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    style: {
      left: `${(seededRandom(seed + i) * 100).toFixed(2)}%`,
      top: `${(seededRandom(seed + i + count) * -20).toFixed(2)}%`,
      animationDuration: `${10 + seededRandom(seed + i + count * 2) * 20}s`,
      animationDelay: `${seededRandom(seed + i + count * 3) * 5}s`,
    },
  }))
}

interface WinterBackgroundProps {
  snowflakeCount?: number
  seed?: number
}

const WinterBackground: React.FC<WinterBackgroundProps> = ({ snowflakeCount = 50, seed = Date.now() }) => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([])

  useEffect(() => {
    setSnowflakes(createSnowflakes(snowflakeCount, seed))
  }, [snowflakeCount, seed])

  return (
    <div className={styles.winterBackground}>
      {snowflakes.map((snowflake) => (
        <div key={snowflake.id} className={`${styles.snowflake} ${styles.falling}`} style={snowflake.style} />
      ))}
    </div>
  )
}

export default WinterBackground

