"use client"

import React from "react"
import styles from "./CherryBlossomBackground.module.css"

const CherryBlossomBackground: React.FC = () => {
  const petals = React.useMemo(() => {
    return [...Array(33)].map((_, i) => {
      const startFromRight = Math.random() > 0.7 // 30% chance to start from right
      return {
        key: i,
        style: {
          right: startFromRight ? `${Math.random() * 20}%` : `${Math.random() * 100}%`,
          top: startFromRight ? `${Math.random() * 100}%` : `${Math.random() * 20 - 10}%`,
          animationDuration: `${10 + Math.random() * 5}s`,
          animationDelay: `${Math.random() * 5}s`,
          opacity: 0,
        } as React.CSSProperties,
      }
    })
  }, [])

  return (
    <div className={styles.cherryBlossomBackground}>
      {petals.map((petal) => (
        <div key={petal.key} className={styles.petal} style={petal.style} />
      ))}
    </div>
  )
}

export default CherryBlossomBackground

