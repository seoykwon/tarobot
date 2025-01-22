"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Calendar } from "lucide-react"

export default function CalendarPage() {
  const [currentDate] = useState(new Date())

  // Get current month's days
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  // Adjust for Monday start (0 = Monday, 6 = Sunday)
  const firstDayAdjusted = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1

  // Create array of days
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  // Create array for empty cells before first day
  const emptyCells = Array.from({ length: firstDayAdjusted }, (_, i) => null)

  // Combine empty cells and days
  const allCells = [...emptyCells, ...days]

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <main className="min-h-screen bg-background pb-16">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Mystic Calendar</h1>
        </div>

        {/* Calendar Grid */}
        <Card className="mb-6">
          <CardContent className="p-4">
            {/* Week days */}
            <div className="grid grid-cols-7 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar days */}
            <div className="grid grid-cols-7 gap-1">
              {allCells.map((day, index) => (
                <Button
                  key={index}
                  variant={day === currentDate.getDate() ? "default" : "ghost"}
                  className="h-10 p-0 hover:bg-accent"
                >
                  {day}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fortune Summary */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Fortune Summary</h2>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">오늘의 운세</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                행운이 가득한 하루가 될 것 같아요. 긍정적인 에너지가 당신을 감싸고 있습니다.
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Lucky Score: 8/10</span>
                <Button variant="outline" size="sm">
                  자세히 보기
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

