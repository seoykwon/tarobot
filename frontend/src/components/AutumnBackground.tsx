"use client"

import React from "react"
import styles from "./AutumnBackground.module.css"

const AutumnBackground: React.FC = () => {
  const leaves = React.useMemo(() => {
    return [...Array(50)].map((_, i) => {
      const size = Math.random() * 20 + 10 // 10px to 30px
      const leafType = `leaf${Math.floor(Math.random() * 3) + 1}` // leaf1, leaf2, or leaf3
      return {
        key: i,
        style: {
          left: `${Math.random() * 100}%`,
          top: `-${size}px`,
          width: `${size}px`,
          height: `${size}px`,
          animationDuration: `${15 + Math.random() * 30}s`,
          animationDelay: `${Math.random() * -15}s`,
          transform: `rotate(${Math.random() * 360}deg)`,
        } as React.CSSProperties,
        leafType,
      }
    })
  }, [])

  return (
    <div className={styles.autumnBackground}>
      {leaves.map((leaf) => (
        <div key={leaf.key} className={`${styles.leaf} ${styles[leaf.leafType]}`} style={leaf.style} />
      ))}
    </div>
  )
}

export default AutumnBackground

