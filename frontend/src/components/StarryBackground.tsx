"use client"

import type React from "react"
import { useEffect, useState, useRef } from "react"
import styles from "./StarryBackground.module.css"
import { zodiacData, getZodiacSign } from "@/libs/zodiac"

interface StarryBackgroundProps {
  isLoggedIn: boolean
}

const StarryBackground: React.FC<StarryBackgroundProps> = ({ isLoggedIn }) => {
  const [shootingStars, setShootingStars] = useState<JSX.Element[]>([])
  const [zodiacSign, setZodiacSign] = useState<keyof typeof zodiacData | null>(null)
  const [showZodiac, setShowZodiac] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (isLoggedIn) {
      const fetchUserData = async () => {
        try {
          const response = await fetch("http://localhost:8080/api/v1/user-profiles", {
            credentials: "include", // 쿠키 포함
          })
          if (!response.ok) {
            throw new Error("Failed to fetch user data")
          }
          const userData = await response.json()
          if (userData.birthDate) {
            const sign = getZodiacSign(userData.birthDate)
            setZodiacSign(sign)
          }
        } catch (error) {
          console.error("Error fetching user data:", error)
        }
      }
      fetchUserData()
    }
  }, [isLoggedIn])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars: { x: number; y: number; radius: number; opacity: number }[] = []

    // 랜덤 별 생성
    for (let i = 0; i < 100; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        opacity: Math.random(),
      })
    }

    let animationFrameId: number

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // 랜덤 별 그리기
      stars.forEach((star) => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.fill()

        // 별 반짝임 애니메이션
        star.opacity = Math.sin(Date.now() * 0.001 + star.x + star.y) * 0.5 + 0.5
      })

      // 별자리 그리기
      if (showZodiac && zodiacSign) {
        const constellation = zodiacData[zodiacSign]
        ctx.beginPath()
        ctx.strokeStyle = "rgba(255, 255, 255, 0.8)"
        ctx.lineWidth = 2

        constellation.points.forEach((point, index) => {
          const [x, y] = point
          const canvasX = (x / 100) * canvas.width
          const canvasY = (y / 100) * canvas.height

          if (index === 0) {
            ctx.moveTo(canvasX, canvasY)
          } else {
            ctx.lineTo(canvasX, canvasY)
          }

          // 별자리의 별 그리기
          ctx.fillStyle = "rgba(255, 255, 255, 1)"
          ctx.beginPath()
          ctx.arc(canvasX, canvasY, 3, 0, Math.PI * 2)
          ctx.fill()
        })

        ctx.stroke()
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    // 30초마다 별자리 표시 토글
    const intervalId = setInterval(() => {
      setShowZodiac((prev) => !prev)
    }, 30000)

    return () => {
      cancelAnimationFrame(animationFrameId)
      clearInterval(intervalId)
    }
  }, [zodiacSign, showZodiac])

  useEffect(() => {
    const createShootingStar = (index: number) => {
      const id = Date.now() + index
      const isFromTop = Math.random() > 0.5
      const position = Math.random() * 100
      const delay = index * 0.5
      const width = Math.random() * 100 + 100

      return (
        <div
          key={id}
          className={styles.shootingStar}
          style={{
            top: isFromTop ? "0" : `${position}%`,
            right: isFromTop ? `${position}%` : "0",
            width: `${width}px`,
            animationDelay: `${delay}s`,
          }}
        />
      )
    }

    const createShootingStarSequence = () => {
      const newShootingStars = [0, 1, 2].map(createShootingStar)
      setShootingStars(newShootingStars)
    }

    createShootingStarSequence()

    const shootingStarInterval = setInterval(createShootingStarSequence, 5000)

    return () => clearInterval(shootingStarInterval)
  }, [])

  return (
    <div className={styles.starryBackground}>
      <canvas ref={canvasRef} className={styles.starCanvas} />
      {shootingStars}
    </div>
  )
}

export default StarryBackground

