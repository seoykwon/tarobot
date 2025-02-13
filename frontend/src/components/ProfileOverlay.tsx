import { FaCog, FaGem, FaSignOutAlt } from "react-icons/fa"; // Font Awesome 아이콘

export default function ProfileOverlay({
  isActive,
  toggle,
}: {
  isActive: boolean;
  toggle: () => void;
}) {
  return (
    <div className="relative">
      {/* 프로필 버튼 */}
      <button
        onClick={toggle}
        className="bg-gray-200 px-4 py-1 rounded-lg"
      >
        👤 Profile
      </button>

      {/* 오버레이 메뉴 */}
      {isActive && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
          <ul className="flex flex-col">
            {/* 설정 */}
            <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <FaCog className="mr-2 text-gray-600" />
              <span>설정</span>
            </li>
            {/* 플랜 업그레이드 */}
            <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer">
              <FaGem className="mr-2 text-blue-500" />
              <span>플랜 업그레이드</span>
            </li>
            {/* 로그아웃 */}
            <li className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer text-red-500">
              <FaSignOutAlt className="mr-2" />
              <span>로그아웃</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
