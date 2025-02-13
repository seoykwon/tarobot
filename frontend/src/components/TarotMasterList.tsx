"use client"

import { useState, useEffect } from 'react'
import { getTarotMasters } from '@/libs/api'

export default function TarotMasterList() {
  const [tarotMasters, setTarotMasters] = useState([])

  useEffect(() => {
    const fetchTarotMasters = async () => {
      const masters = await getTarotMasters()
      setTarotMasters(masters)
    }

    fetchTarotMasters()
  }, [])
  
  return (
    <ul className="space-y-4">
      {tarotMasters.map(master => (
        <li key={master.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer">
          👤 <span>{master.name}</span>
        </li>
      ))}
      <li className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-700 cursor-pointer">
        🔍 <span>다른 타로 마스터 찾기</span>
      </li>
    </ul>
  )
}