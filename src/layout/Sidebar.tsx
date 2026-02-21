import { NavLink } from "react-router";

interface SidebarProps {
  openNav: boolean;
  handleNav: () => void;
}
const Sidebar: React.FC<SidebarProps> = ({ openNav, handleNav }) => {
  const menuItems = [
    {
      name: "Home",
      path: "/",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
      ),
    },
    {
      name: "Favorites",
      path: "/favorites", // Note: Ensuring path matches app routes
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <aside
      className={`fixed top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-100 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        openNav ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between px-6 h-16 border-b border-gray-50 bg-white sticky top-0">
        <NavLink
          to="/"
          className="flex items-center gap-2"
          onClick={() => openNav && handleNav()}
        >
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
            Q
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">
            Quran App
          </span>
        </NavLink>
        <button
          onClick={handleNav}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
          aria-label="Close menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-2">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => openNav && handleNav()}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
              ${
                isActive
                  ? "bg-blue-50 text-blue-600 font-semibold"
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
              }
            `}
          >
            <span
              className={`transition-colors duration-200 group-hover:scale-110`}
            >
              {item.icon}
            </span>
            <span className="text-sm">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-50 bg-gray-50/50">
        <div className="flex items-center gap-3 p-2 bg-white rounded-xl border border-gray-100">
          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
            G
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              Guest User
            </p>
            <p className="text-xs text-gray-500 truncate">Not logged in</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
