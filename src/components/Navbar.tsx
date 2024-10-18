import Link from "next/link";
import Cookies from "js-cookie";
const Navbar = () => {
  const handleLogout = () => {
    Cookies.remove("userId");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link href="/movie" className="text-white font-bold">
            Movie App
          </Link>
        </div>
        <div className="flex space-x-4">
          <Link href="/movie" className="text-white">
            Movies
          </Link>
          <Link href="/profile" className="text-white">
            Profile
          </Link>
          <button onClick={handleLogout} className="text-white">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
