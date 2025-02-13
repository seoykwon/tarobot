import { useState, useEffect } from "react";
import { API_URLS } from "@/config/api";
import Calendar from "./Calendar";
import RecordList from "./RecordList";

export default function DiaryModal({ onClose }: { onClose: () => void }) {
  const getSeoulDate = () => new Date(new Date().getTime() + 9 * 60 * 60 * 1000);
  const [selectedDate, setSelectedDate] = useState<Date>(getSeoulDate());
  const [tarotData, setTarotData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const formatDateLocal = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    fetchTarotData(getSeoulDate());
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    fetchTarotData(selectedDate);
  }, [selectedDate]);

  const fetchTarotData = async (date: Date) => {
    setIsLoading(true);
    try {
      const formattedDate = formatDateLocal(date);
      const res = await fetch(API_URLS.CALENDAR.SUMMARY(formattedDate), {
        method: "GET",
        credentials: "include",
      });
      setTarotData(res.ok ? await res.json() : []);
    } catch {
      setTarotData([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-lg shadow-lg w-full max-w-[80vw] max-h-[90vh] md:max-h-[85vh] lg:max-h-[80vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모바일에서는 캘린더가 세로로 배치 */}
        <div className="w-full md:w-1/3 lg:w-1/4 flex-none overflow-hidden max-h-[none]">
          <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>

        {/* 상담 기록 영역은 남은 공간을 채우며 스크롤 */}
        <div className="w-full md:w-2/3 lg:w-3/4 flex-1 max-h-[60vh] overflow-y-auto">
          <RecordList selectedDate={selectedDate} tarotData={tarotData} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
