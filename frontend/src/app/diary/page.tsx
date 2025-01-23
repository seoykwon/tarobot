"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar } from "lucide-react";

interface TarotSummary {
  title: string;
  summary: string;
  tarot_card_image: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [tarotData, setTarotData] = useState<TarotSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Get current month's days
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();

  // Get first day of month (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  // Adjust for Monday start (0 = Monday, 6 = Sunday)
  const firstDayAdjusted = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  // Create array of days
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  // Create array for empty cells before first day
  const emptyCells = Array.from({ length: firstDayAdjusted }, () => null);

  // Combine empty cells and days
  const allCells = [...emptyCells, ...days];

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Fetch tarot data for the selected date
  const fetchTarotData = async (date: Date) => {
    setIsLoading(true);
    try {
      const formattedDate = date.toISOString().split("T")[0]; // Format date as YYYY-MM-DD
      const response = await fetch(`/api/tarot?date=${formattedDate}`);
      if (!response.ok) {
        throw new Error("Failed to fetch tarot data");
      }
      const data: TarotSummary | null = await response.json();
      setTarotData(data); // Update tarot data
    } catch (error) {
      console.error("Error fetching tarot data:", error);
      setTarotData(null); // No data available
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch today's tarot data on initial render
  useEffect(() => {
    fetchTarotData(selectedDate);
  }, [selectedDate]);

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
                  variant={day === selectedDate.getDate() ? "default" : "ghost"}
                  className={`h-10 p-0 ${
                    day === selectedDate.getDate()
                      ? "bg-blue-500 text-white" // 선택된 날짜 스타일
                      : "hover:bg-accent"
                  }`}
                  onClick={() => {
                    if (day) {
                      const newSelectedDate = new Date(
                        currentDate.getFullYear(),
                        currentDate.getMonth(),
                        day
                      );
                      setSelectedDate(newSelectedDate);
                    }
                  }}
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
              <CardTitle className="text-lg">
                {isLoading ? "Loading..." : tarotData?.title || "오늘의 타로 결과를 확인하세요"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tarotData ? (
                <>
                  <p className="text-muted-foreground mb-4">{tarotData.summary}</p>
                  <img
                    src={tarotData.tarot_card_image}
                    alt={tarotData.title}
                    className="w-full h-auto rounded-md"
                  />
                </>
              ) : (
                !isLoading && (
                  <p className="text-muted-foreground">
                    선택한 날짜에 대한 데이터가 없습니다. 오늘의 타로 결과를 확인하세요.
                  </p>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
