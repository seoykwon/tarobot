"use client";

interface CalendarProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
}

export default function Calendar({ selectedDate, setSelectedDate }: CalendarProps) {
  return (
    <div className="w-full bg-gray-100 p-4 shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-gray-700 text-center mb-4">📅 다이어리</h2>

      <div className="flex justify-between items-center mb-4">
        <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1))} className="text-xl p-2">◀</button>
        <h2 className="text-xl font-bold text-gray-700">
          {selectedDate.toLocaleString("ko-KR", { month: "long", year: "numeric" })}
        </h2>
        <button onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1))} className="text-xl p-2">▶</button>
      </div>

      <div className="border border-gray-300 rounded-lg overflow-hidden">
        <div className="grid grid-cols-7 text-center font-bold bg-purple-200 border-b">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
            <div key={idx} className={`flex items-center justify-center h-12 border-r ${day === "Sun" ? "text-red-500" : day === "Sat" ? "text-blue-500" : "text-gray-700"}`}>
              {day[0]}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 text-center">
          {Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay() }).map(
            (_, idx) => <div key={`prev-${idx}`} className="p-4 text-gray-400 border-r border-b bg-gray-50" />
          )}

          {Array.from({ length: new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate() }).map(
            (_, day) => (
              <div
                key={day}
                className={`flex items-center justify-center h-12 border-r border-b cursor-pointer transition ${
                  selectedDate.getDate() === day + 1 ? "bg-blue-500 text-white font-bold" : "hover:bg-gray-200"
                }`}
                onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day + 1))}
              >
                {day + 1}
              </div>
            )
          )}

          {Array.from({
            length: (7 - (new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDay() + 1)) % 7,
          }).map((_, idx) => (
            <div key={`next-${idx}`} className="p-4 text-gray-400 border-r border-b bg-gray-50" />
          ))}
        </div>
      </div>
    </div>
  );
}
