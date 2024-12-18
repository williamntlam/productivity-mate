import Link from "next/link";

export default function Navbar() {
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
            {" "}
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

        {/* Profile button on the right */}
        <button className="flex items-center justify-center w-12 h-12 bg-gray-700 rounded-full hover:bg-gray-600">
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="w-full h-full rounded-full"
          />
        </button>
      </div>
    </nav>
  );
}
