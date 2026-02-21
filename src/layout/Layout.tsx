import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router";

const Layout = () => {
  const [openNav, setOpenNav] = useState(false);

  const handleNav = () => {
    setOpenNav(!openNav);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar handleNav={handleNav} />

      <div className="flex flex-1">
        {/* Sidebar Backdrop for Mobile */}
        {openNav && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
            onClick={handleNav}
            aria-hidden="true"
          />
        )}

        <Sidebar openNav={openNav} handleNav={handleNav} />

        <main className="flex-1 w-full lg:pl-64 transition-all duration-300">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
