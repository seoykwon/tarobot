"use client"

import React from "react"
import styles from "./CherryBlossomBackground.module.css"

const CherryBlossomBackground: React.FC = () => {
  const petals = React.useMemo(() => {
    return [...Array(33)].map((_, i) => {
      const isFromTop = Math.random() > 0.3 // 70% chance to fall from top
      const angle = Math.random() * 30 + 15 // Random angle between 15 and 45 degrees
      return {
        key: i,
        style: {
          right: isFromTop ? `${Math.random() * 100}%` : "0px",
          top: isFromTop ? "0px" : `${Math.random() * 100}%`,
          animationDuration: `${10 + Math.random() * 5}s`,
          animationDelay: `${Math.random() * 5}s`,
          transform: `rotate(${Math.random() * 360}deg)`,
          "--falling-angle": `${angle}deg`,
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

