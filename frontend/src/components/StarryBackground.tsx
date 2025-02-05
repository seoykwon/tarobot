import type React from "react"
import styles from "./StarryBackground.module.css"

const StarryBackground: React.FC = () => {
  return (
    <div className={styles.starryBackground}>
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className={styles.star}
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  )
}

export default StarryBackground

