import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

const Layout = () => {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#f3efe6]/80 to-[#e8e1d2]/80">
      
      {!hideNavbar && <Navbar />}

      {/* All pages container */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
