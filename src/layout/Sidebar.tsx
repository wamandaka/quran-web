interface SidebarProps {
  openNav: boolean;
  handleNav: () => void;
}
const Sidebar: React.FC<SidebarProps> = ({ openNav, handleNav }) => {
  return (
    <div
      className={`flex h-screen flex-col justify-between border-e border-gray-100 bg-white w-full lg:w-64 fixed -translate-x-full lg:translate-x-0 transition-transform ${
        openNav ? "translate-x-0" : " "
      }`}
    >
      <div className="px-4 py-6">
        <div className="flex justify-between items-center">
          <span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
            Logo
          </span>
          <button
            onClick={handleNav}
            className="grid h-10 w-10 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600"
          >
            X
          </button>
        </div>

        <ul className="mt-6 space-y-1">
          <li>
            <a
              href="/"
              className="block rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700"
            >
              Home
            </a>
          </li>

          <li>
            <a
              href="/favorites"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700"
            >
              Favorites
            </a>
          </li>
        </ul>
      </div>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3">
          <img
            src="https://placehold.co/40"
            alt="User"
            className="h-10 w-10 rounded-full object-cover"
          />
          <div>
            <p className="text-sm font-medium text-gray-700">Guest User</p>
            <p className="text-xs text-gray-500">Not logged in</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
