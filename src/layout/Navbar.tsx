import React from "react";
import { NavLink } from "react-router";
import { useLastRead } from "../hooks/useLastRead";
interface NavbarProps {
  handleNav: () => void;
}
const Navbar: React.FC<NavbarProps> = ({ handleNav }) => {
  const { lastRead } = useLastRead();

  return (
    <nav
      className="sticky top-0 z-40 h-16 flex items-center justify-between px-4 lg:px-6 bg-white/80 backdrop-blur-md border-b border-gray-100 w-full"
      aria-label="Top navigation"
    >
      <div className="flex items-center gap-4">
        <button
          onClick={handleNav}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          aria-label="Toggle navigation menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        <NavLink to="/" className="text-xl font-bold text-gray-900 lg:hidden">
          Quran App
        </NavLink>
        {lastRead && (
          <NavLink
            to={`/surah/${lastRead.surahNomor}`}
            className="flex items-center gap-2 text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-all active:scale-95"
            title={`Lanjutkan Surah ${lastRead.surahName}`}
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            <span className="max-w-[100px] truncate hidden sm:inline">
              {lastRead.surahName}
            </span>
            <span className="hidden xs:inline bg-blue-600 text-white px-1.5 py-0.5 rounded text-[10px] font-bold">
              {lastRead.ayahNomor}
            </span>
          </NavLink>
        )}
      </div>

      <div className="flex items-center gap-3">
        <div className="hidden sm:flex flex-col items-end">
          <p className="text-xs font-medium text-gray-900">Guest User</p>
          <p className="text-[10px] text-gray-500">Online</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs">
          G
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
