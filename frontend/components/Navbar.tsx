import Link from "next/link";
import { useEffect, useState } from "react";

type UserInfo = {
  avatar: string;
  firstName: string;
  lastName: string;
  email: string;
};

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const fetchUserInfo = async () => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        setIsLoggedIn(false);
        setUserInfo(null);
        return;
      }

      const response = await fetch(
        `http://${process.env.NEXT_PUBLIC_BACKEND_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}/api/users/info`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setIsLoggedIn(true);
        setUserInfo({
          avatar: data.picture || "https://via.placeholder.com/40", // Use default if no picture
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
        });
      } else {
        console.error("Failed to fetch user info:", response.statusText);
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
      setIsLoggedIn(false);
      setUserInfo(null);
    }
  };

  useEffect(() => {
    fetchUserInfo();

    // Optionally, listen for login/logout events to re-fetch user info
    const handleStorageChange = () => fetchUserInfo();
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    setIsLoggedIn(false);
    setUserInfo(null);
    window.location.href = "/";
  };

  return (
    <nav className="bg-gray-800 text-white px-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto py-4">
        {/* Title */}
        <h1 className="text-xl font-bold">
          <Link href="/">ProductivityMate</Link>
        </h1>

        {/* Navigation */}
        <ul className="flex space-x-8">
          <li>
            <Link href="/calendar">Calendar</Link>
          </li>
          <li>
            <Link href="/tasks">Tasks</Link>
          </li>
          <li>
            <Link href="/reminders">Reminders</Link>
          </li>
          <li>
            <Link href="/pomodoro-timer">Pomodoro Timer</Link>
          </li>
        </ul>

        {/* Profile/Login */}
        {isLoggedIn ? (
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p>
                {userInfo?.firstName} {userInfo?.lastName}
              </p>
              <p className="text-sm text-gray-400">{userInfo?.email}</p>
            </div>
            <Link href="/profile">
              <img
                src={userInfo?.avatar}
                alt="Profile"
                className="w-12 h-12 rounded-full"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/40"; // Fallback image
                  console.error(
                    "Failed to load profile image:",
                    userInfo?.avatar
                  );
                }}
              />
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => (window.location.href = "/login")}
            className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
