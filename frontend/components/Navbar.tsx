import Link from "next/link";
import { useEffect, useState } from "react";

type UserInfo = {
  avatar: string;
  name: string;
  email: string;
} | null;

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const accessToken = localStorage.getItem("accessToken");
    const avatar = localStorage.getItem("avatar");
    const name = localStorage.getItem("name");
    const email = localStorage.getItem("email");

    if (accessToken && avatar && name && email) {
      setIsLoggedIn(true);
      setUserInfo({ avatar, name, email }); // Set user info
    } else {
      setIsLoggedIn(false);
      setUserInfo(null);
    }
  }, []);

  const handleLogout = () => {
    // Clear all user-related localStorage items on logout
    localStorage.removeItem("accessToken");
    localStorage.removeItem("avatar");
    localStorage.removeItem("email");
    localStorage.removeItem("name");
    localStorage.removeItem("firstName");
    localStorage.removeItem("lastName");
    setIsLoggedIn(false);
    setUserInfo(null);
    window.location.href = "/"; // Redirect to home page or login page
  };

  return (
    <nav className="bg-gray-800 text-white px-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto py-4">
        {/* Title on the left */}
        <h1 className="text-xl font-bold">
          <Link href="/">ProductivityMate</Link>
        </h1>

        {/* Navigation items */}
        <ul className="flex space-x-8">
          <li className="hover:text-gray-400 cursor-pointer">
            <Link href="/calendar">Calendar</Link>
          </li>
          <li className="hover:text-gray-400 cursor-pointer">
            <Link href="/tasks">Tasks</Link>
          </li>
          <li className="hover:text-gray-400 cursor-pointer">
            <Link href="/reminders">Reminders</Link>
          </li>
          <li className="hover:text-gray-400 cursor-pointer">
            <Link href="/pomodoro-timer">Pomodoro Timer</Link>
          </li>
        </ul>

        {/* Profile/Login button on the right */}
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            {/* Profile picture */}
            <Link href="/profile">
              <button className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full hover:bg-gray-600">
                <img
                  src={userInfo?.avatar || "https://via.placeholder.com/40"} // Avatar from localStorage
                  alt="Profile"
                  className="w-full h-full rounded-full"
                />
              </button>
            </Link>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          // Login button when not logged in
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
