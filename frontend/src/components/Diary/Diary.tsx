import { useState } from "react";
import Calendar from "./Calendar";
import RecordList from "./RecordList";

export default function Diary({ onClose }: { onClose: () => void }) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-lg shadow-lg w-full max-w-[80vw] max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 닫기 버튼 */}
        <button
          className="absolute top-4 right-4 text-gray-700 hover:text-gray-900 z-10"
          onClick={onClose}
        >
          ✖
        </button>
  
        {/* 왼쪽: Calendar */}
        <div className="w-full md:w-2/3 lg:w-2/3 p-6 flex-none overflow-hidden">
          <Calendar selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
        </div>
  
        {/* 오른쪽: RecordList */}
        <div className="w-full md:w-1/3 lg:w-1/3 flex-1 overflow-y-auto bg-gray-100 mt-4 md:mt-0 md:ml-4 p-2 md:p-4 shadow-md rounded-lg">
          {/* RecordList */}
          <div className="pt-12"> {/* 상단 패딩 추가 */}
            <RecordList selectedDate={selectedDate} />
          </div>
        </div>
      </div>
    </div>
  );
  
}
