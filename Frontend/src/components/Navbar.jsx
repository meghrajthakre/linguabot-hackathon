import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  Bot,
  BarChart3,
  Sparkles,
  ChevronDown,
  Crown,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import toast from "react-hot-toast"; // <-- added

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ path, label, icon: Icon, mobile = false }) => {
    const active = isActive(path);

    const handleClick = (e) => {
      if (path === "/analytics") {
        e.preventDefault(); // stop navigation
        toast.custom(
          (t) => (
            <div
              className={`flex items-center gap-3 px-4 py-3 bg-gray-900 text-white rounded-xl border border-gray-700 shadow-xl transition-all ${
                t.visible ? "animate-enter" : "animate-leave"
              }`}
            >
              <div className="bg-yellow-500/20 p-2 rounded-lg">
                <Crown className="text-yellow-400" size={18} />
              </div>
              <div>
                <p className="font-semibold text-sm">Pro Feature</p>
                <p className="text-xs text-gray-400">
                  Analytics is coming soon...
                </p>
              </div>
            </div>
          ),
          { duration: 4000 }
        );
      }
      setMobileMenuOpen(false); // close mobile menu in any case
    };

    return (
      <Link
        to={path}
        onClick={handleClick}
        className={`
          relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium
          transition-all duration-200
          ${mobile ? "w-full" : ""}
          ${
            active
              ? "bg-yellow-400 text-white-500"
              : "text-gray-600 hover:text-yellow-600 hover:bg-yellow-50"
          }
        `}
      >
        <Icon size={18} />
        {label}
        {active && (
          <span className="absolute left-3 right-3 -bottom-1 h-[2px] bg-yellow-500 rounded-full" />
        )}
      </Link>
    );
  };

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-gradient-to-r from-[#f3efe6]/80 to-[#e8e1d2]/80 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-3">
              <div className="bg-yellow-400 p-2 rounded-xl shadow-sm">
                <Bot className="text-white w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-gray-900">LinguaBot</span>
                <span className="text-[10px] text-gray-500 tracking-wide flex items-center gap-1">
                  <Sparkles size={10} className="text-yellow-500" />
                  AI SUPPORT
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            {user && (
              <div className="hidden md:flex items-center gap-2 bg-gray-100 px-3 py-1.5 rounded-2xl">
                {navLinks.map((link) => (
                  <NavLink key={link.path} {...link} />
                ))}
              </div>
            )}

            {/* Right Side */}
            <div className="flex items-center gap-3">
              {/* If Logged In */}
              {user ? (
                <div className="relative hidden md:block">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                  >
                    <div className="w-8 h-8 bg-yellow-400 text-white rounded-lg flex items-center justify-center">
                      <User size={15} />
                    </div>
                    <span className="text-sm font-medium text-gray-800">
                      {user.name || user.email.split("@")[0]}
                    </span>
                    <ChevronDown size={14} />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-semibold text-gray-900">
                          {user.name || user.email}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut size={15} />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="hidden md:block px-4 py-2 text-sm font-medium text-gray-600 hover:text-yellow-600"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="hidden md:block px-5 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-xl text-sm font-semibold transition"
                  >
                    Get Started
                  </Link>
                </>
              )}

              {/* Mobile Toggle */}
              <button
                className="md:hidden p-2 rounded-lg bg-gray-100"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 space-y-3">
              {user && (
                <>
                  {navLinks.map((link) => (
                    <NavLink key={link.path} {...link} mobile />
                  ))}
                  <button
                    onClick={handleLogout}
                    className="w-full mt-2 px-4 py-3 bg-red-50 text-red-600 rounded-xl flex items-center justify-center gap-2"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </>
              )}
              {!user && (
                <>
                  <Link
                    to="/login"
                    className="block w-full px-4 py-3 border rounded-xl text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="block w-full px-4 py-3 bg-yellow-400 text-white rounded-xl text-center"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          )}
        </nav>
      </header>
    </>
  );
};

export default Navbar;