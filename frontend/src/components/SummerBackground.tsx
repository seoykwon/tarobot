"use client"

import React from "react"
import styles from "./SummerBackground.module.css"

const SummerBackground: React.FC = () => {
  const clouds = React.useMemo(() => {
    return [...Array(5)].map((_, i) => ({
      key: i,
      style: {
        top: `${Math.random() * 60}%`,
        animationDuration: `${30 + Math.random() * 20}s`,
        animationDelay: `${Math.random() * 10}s`,
      } as React.CSSProperties,
    }))
  }, [])

  return (
    <div className={styles.summerBackground}>
      {clouds.map((cloud) => (
        <div key={cloud.key} className={styles.cloud} style={cloud.style} />
      ))}
    </div>
  )
}

export default SummerBackground

