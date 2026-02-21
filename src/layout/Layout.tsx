import { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router";
import Navbar from "./Navbar";

const Layout = () => {
  const [openNav, setOpenNav] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const handleNav = () => {
    setOpenNav(!openNav);
  };

  // Check if we're on mobile device
  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => {
      window.removeEventListener("resize", checkIsMobile);
    };
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar handleNav={handleNav} />
      <Sidebar openNav={openNav} handleNav={handleNav} />
      <div
        className={`w-full ${isMobile ? "lg:pl-64" : "pl-64"} transition-all duration-300`}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
