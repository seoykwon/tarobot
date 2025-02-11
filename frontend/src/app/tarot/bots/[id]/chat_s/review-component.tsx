"use client"

import React, { useState } from "react"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { toast } from "sonner"

interface ReviewComponentProps {
  onSubmit: (data: { rating: number; content: string }) => Promise<void>
}

export default function ReviewComponent({ onSubmit }: ReviewComponentProps) {
  const [rating, setRating] = useState(0)
  const [content, setcontent] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0 || !content.trim()) {
      toast.error("별점과 리뷰를 모두 작성해주세요.")
      return
    }
    await onSubmit({ rating, content })
    setRating(0)
    setcontent("")
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center space-y-4">
        <label>별점을 선택해주세요</label>
        <div className="flex justify-center space-x-2">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              onClick={() => setRating(index + 1)}
              className={`cursor-pointer ${index + 1 <= rating ? "text-yellow-400" : "text-gray-500"}`}
            />
          ))}
        </div>
      </div>

      <Textarea 
        value={content} 
        onChange={(e) => setcontent(e.target.value)} 
        placeholder="리뷰를 작성해주세요..." 
      />

      <Button type="submit" className="w-full">제출하기</Button>
    </form>
  )
}
