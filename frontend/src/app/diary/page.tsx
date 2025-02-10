"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar } from "lucide-react";
import { API_URLS } from "@/config/api";
import Image from "next/image"; // ✅ next/image 추가

interface DayInfo {
  day: number;
  fortune: string | null;
  tarotResult: string | null;
  luckyScore: number | null;
}

interface TarotSummary {
  tag: string;
  title: string;
  summary: string;
  cardImageUrl: string;
}

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date()); // 현재 날짜 (달력 기준)
  const [selectedDate, setSelectedDate] = useState(new Date()); // 선택된 날짜
  const [daysInfo, setDaysInfo] = useState<DayInfo[]>([]);
  const [tarotData, setTarotData] = useState<TarotSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch calendar data for the current month
  const fetchCalendarData = useCallback(async (year: number, month: number) => {
    try {
      setIsLoading(true);
      const response = await fetch(API_URLS.CALENDAR.MONTHLY(year, month + 1), {
        method: "GET",
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch calendar data");
      }
  
      const data = await response.json();
      setDaysInfo(data.days);
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  const fetchTarotData = useCallback(async (date: Date) => {
    try {
      setIsLoading(true);
      const localDate = new Date(date.getTime() + 9 * 60 * 60 * 1000);
      const formattedDate = localDate.toISOString().split("T")[0];
  
      const response = await fetch(API_URLS.CALENDAR.SUMMARY(formattedDate), {
        method: "GET",
        credentials: "include",
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch tarot data");
      }
  
      const data: TarotSummary | null = await response.json();
      setTarotData(Array.isArray(data) && data.length > 0 ? data[0] : null);
    } catch (error) {
      console.error("Error fetching tarot data:", error);
      setTarotData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);
  
  useEffect(() => {
    fetchCalendarData(currentDate.getFullYear(), currentDate.getMonth());
    fetchTarotData(selectedDate);
  }, [fetchCalendarData, fetchTarotData, currentDate, selectedDate]);  // ✅ 수정 완료

  // Get current month's days and adjust for Monday start
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  const firstDayAdjusted = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1; // Adjust for Monday start

  // Create array of days and empty cells for alignment
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyCells = Array.from({ length: firstDayAdjusted }, () => null);
  const allCells = [...emptyCells, ...days];

  const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  // Move to previous month
  const handlePreviousMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1);
    setCurrentDate(newDate);
    if (selectedDate.getMonth() === currentDate.getMonth()) {
      setSelectedDate(new Date(newDate));
    }
    fetchCalendarData(newDate.getFullYear(), newDate.getMonth());
  };

  // Move to next month (restrict to the current month or earlier)
  const handleNextMonth = () => {
    const today = new Date();
    if (
      currentDate.getFullYear() === today.getFullYear() &&
      currentDate.getMonth() >= today.getMonth()
    ) {
      return; // Do nothing if already in the current month or later
    }

    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1);
    setCurrentDate(newDate);
    fetchCalendarData(newDate.getFullYear(), newDate.getMonth());
  };

  return (
    <main className="min-h-screen bg-background pb-16">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-6 h-6" />
          <h1 className="font-page-title">Mystic Calendar</h1>
        </div>

        {/* Month Navigation */}
        <div className="flex justify-center items-center mb-4 gap-4">
          <Button variant="ghost" onClick={handlePreviousMonth}>
            ←
          </Button>
          <h2 className="font-calendar-title">
            {currentDate.toLocaleString("default", { year: "numeric" })}{" "}
            {currentDate.toLocaleString("default", { month: "long" })}
          </h2>
          <Button variant="ghost" onClick={handleNextMonth}>
            →
          </Button>
        </div>

        {/* Calendar Grid */}
        <Card className="mb-6">
          <CardContent className="p-4">
            {/* Week days */}
            <div className="grid grid-cols-7 mb-2">
              {weekDays.map((day) => (
                <div key={day} className="text-center font-article-author text-muted-foreground">
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
                      ? "bg-blue-500 text-white"
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
                      fetchTarotData(newSelectedDate); // Fetch tarot data for the selected date
                    }
                  }}
                >
                  {day && (
                    <>
                      <span>{day}</span>
                      {/* Show lucky score */}
                      {daysInfo.find((d) => d.day === day)?.luckyScore && (
                        <span className="block text-xs text-muted-foreground">
                          {daysInfo.find((d) => d.day === day)?.luckyScore}%
                        </span>
                      )}
                    </>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fortune Summary */}
        <div className="space-y-4">
          <h2 className="font-page-title">Your Fortune Summary</h2>
          {/* <Card>
            <CardHeader>
              <CardTitle className="font-tarobot-title">
                {isLoading ? "Loading..." : tarotData?.title || "오늘의 타로 결과를 확인하세요"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {tarotData ? (
                <>
                  <p className="font-tarobot-description text-muted-foreground mb-4">{tarotData.summary}</p>
                  <img
                    src={tarotData.cardImageUrl}
                    alt={tarotData.title}
                    // className="w-full h-auto rounded-md"
                    className="w-[150px] h-[225px] object-cover rounded-lg mx-auto"
                  />
                </>
              ) : (
                !isLoading && (
                  <p className="font-tarobot-description text-muted-foreground">
                    선택한 날짜에 대한 데이터가 없습니다. 오늘의 타로 결과를 확인하세요.
                  </p>
                )
              )}
            </CardContent>
          </Card> */}
          <Card className="p-1"> {/* Card의 패딩을 최소화 */}
            <CardHeader>
              <CardTitle className="font-tarobot-title">
                {isLoading ? "Loading..." : tarotData?.title || "오늘의 타로 결과를 확인하세요"}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-start gap-4"> {/* gap 조정 */}
            {tarotData ? (
                <>
                  {/* 좌측: 제목 + 내용 */}
                  <div className="flex-1 text-left">
                    <p className="font-tarobot-description text-muted-foreground">
                      {tarotData.summary}
                    </p>
                  </div>

                  {/* 우측: 카드 이미지 */}
                  <Image
                    src={tarotData.cardImageUrl}
                    alt={tarotData.title}
                    width={140}  // ✅ 반드시 명시해야 함
                    height={210} // ✅ 반드시 명시해야 함
                    className="object-cover rounded-lg shadow-md"
                  />
                </>
              ) : (
                !isLoading && (
                  <p className="font-tarobot-description text-muted-foreground">
                    선택한 날짜에 대한 데이터가 없습니다. 오늘의 타로 결과를 확인하세요.
                  </p>
                )
              )}
            </CardContent>
          </Card>
          {/* 여기까지 수정됨*/}
        </div>
      </div>
    </main>
  );
}
