import Cookies from "js-cookie";
import Link from "next/link";
import { useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    Cookies.remove("userId");
    window.location.href = "/login";
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-gray-900 p-4 shadow-md w-full z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Brand */}
        <div className="text-white text-2xl font-bold">
          <Link href="/movie">
            <span className="cursor-pointer hover:text-yellow-400 transition duration-300">
              🎬 Movieliely
            </span>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex space-x-6 text-white">
          <Link href="/movie">
            <span className="hover:text-yellow-400 transition-colors duration-300 cursor-pointer">
              Movies
            </span>
          </Link>

          <Link href="/watchlist">
            <span className="hover:text-yellow-400 transition-colors duration-300 cursor-pointer">
              Watchlist
            </span>
          </Link>

          <Link href="/profile">
            <span className="hover:text-yellow-400 transition-colors duration-300 cursor-pointer">
              Profile
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden text-white text-2xl">
          <button onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-0 left-0 w-full h-screen bg-gray-900 text-white flex flex-col items-center justify-center space-y-6 z-40">
            <Link href="/movie">
              <span
                className="hover:text-yellow-400 text-xl transition-colors duration-300 cursor-pointer"
                onClick={toggleMobileMenu}
              >
                Movies
              </span>
            </Link>

            <Link href="/watchlist">
              <span
                className="hover:text-yellow-400 text-xl transition-colors duration-300 cursor-pointer"
                onClick={toggleMobileMenu}
              >
                Watchlist
              </span>
            </Link>

            <Link href="/profile">
              <span
                className="hover:text-yellow-400 text-xl transition-colors duration-300 cursor-pointer"
                onClick={toggleMobileMenu}
              >
                Profile
              </span>
            </Link>

            <button
              onClick={() => {
                handleLogout();
                toggleMobileMenu();
              }}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
