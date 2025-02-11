"use client"

import React from "react"
import styles from "./WinterBackground.module.css"

const WinterBackground: React.FC = () => {
  const snowflakes = React.useMemo(() => {
    return [...Array(50)].map((_, i) => ({
      key: i,
      style: {
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * -20}%`, // 화면 상단 바깥에서 시작
        animationDuration: `${10 + Math.random() * 20}s`,
        animationDelay: `${Math.random() * 5}s`,
      } as React.CSSProperties,
    }))
  }, [])

  return (
    <div className={styles.winterBackground}>
      {snowflakes.map((snowflake) => (
        <div key={snowflake.key} className={`${styles.snowflake} ${styles.falling}`} style={snowflake.style} />
      ))}
    </div>
  )
}

export default WinterBackground

