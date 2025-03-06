// components/ChatWindow.tsx
export default function ChatWindow() {
  return (
    <div className="flex-1 p-6 bg-purple-50 flex flex-col justify-end">
      <div className="h-[80vh] overflow-y-auto flex flex-col justify-end">
        <div className="flex justify-end">
          <div className="bg-gray-800 text-white px-4 py-2 rounded-lg max-w-xs">
            안녕하세요! 좋은 하루에요.
          </div>
        </div>
        <div className="flex justify-start mt-4">
          <div className="bg-gray-300 px-4 py-2 rounded-lg max-w-xs">
            안녕하세요! 좋은 하루입니다.
          </div>
        </div>
        <div className="flex justify-center items-center h-full">
          <div className="text-center text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-pink-500 to-red-500">
            안녕하세요! 이런식으로 페이지가 렌더링 됩니다. 메인 페이지를 다시 디자인 해주세요.
          </div>
        </div>
      </div>
      <div className="mt-4">
        <input
          type="text"
          placeholder="타로 마스터와 대화를 나눠보세요."
          className="w-full p-2 border rounded-lg"
        />
      </div>
    </div>

  );
}
