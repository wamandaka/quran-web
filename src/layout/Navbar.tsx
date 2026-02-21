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
      className="h-16 flex items-center justify-between px-4 bg-white shadow-sm w-full"
      aria-label="Top navigation"
    >
      <div className="flex items-center space-x-4">
        <a href="/" className="text-xl font-bold text-gray-900">
          Quran App
        </a>
        {/* <a
          href="/favorites"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Favorites
        </a> */}
        {lastRead && (
          <NavLink
            to={`/surah/${lastRead.surahNomor}`}
            className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 px-3 py-1 rounded-full transition-colors"
            title={`Lanjutkan Surah ${lastRead.surahName}`}
          >
            <svg
              className="w-4 h-4"
              fill="currentColor"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
            <span className="hidden xs:inline">Lanjutkan</span>
          </NavLink>
        )}
      </div>
      <button
        onClick={handleNav}
        className="grid h-10 w-10 place-content-center rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
    </nav>
  );
};

export default Navbar;
