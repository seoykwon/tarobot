export default function Header({
  isSidebarOpen,
  isMobile,
  toggleSidebar,
}: {
  isSidebarOpen: boolean
  isMobile: boolean
  toggleSidebar: () => void
}) {
  return (
    <div
      className={`fixed top-0 right-0 h-14 bg-[#f0f4f9] shadow-md flex items-center justify-between px-6 z-50 transition-all duration-300 ${
        isMobile ? "w-full ml-0" : isSidebarOpen ? "w-[calc(100%-16rem)] ml-64" : "w-[calc(100%-4rem)] ml-16"
      }`}
    >
      <div className="flex items-center gap-4">
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="text-2xl focus:outline-none hover:bg-[#ece6f0] rounded-lg p-2 transition"
          >
            ☰
          </button>
        )}
        <h1 className="text-xl font-bold text-[#1d1b20]">미루</h1>
      </div>
      <div className="flex gap-4">
        <button className="bg-[#ece6f0] text-[#49454f] px-4 py-1 rounded-lg">🔔 알림</button>
        <button className="bg-[#ece6f0] text-[#49454f] px-4 py-1 rounded-lg">👤 Profile</button>
      </div>
    </div>
  )
}

