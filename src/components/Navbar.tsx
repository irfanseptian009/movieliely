import Cookies from "js-cookie";
import Link from "next/link";

const Navbar = () => {
  const handleLogout = () => {
    Cookies.remove("userId"); // Hapus userId dari cookie saat logout
    window.location.href = "/login"; // Redirect ke halaman login
  };

  return (
    <nav className="bg-gray-900 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo / Brand */}
        <div className="text-white text-2xl font-bold">
          <Link href="/movie">
            <span className="cursor-pointer hover:text-yellow-400 transition duration-300">
              🎬 Movieliely
            </span>
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="flex space-x-6 text-white">
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

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors duration-300"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
