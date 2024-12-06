export default function Navbar() {
  return (
    <nav className="bg-gray-800 text-white px-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto py-4">
        {/* Title on the left */}
        <h1 className="text-xl font-bold">ProductivityMate</h1>

        {/* Navigation items */}
        <ul className="flex space-x-8">
          <li className="hover:text-gray-400 cursor-pointer">Calendar</li>
          <li className="hover:text-gray-400 cursor-pointer">Tasks</li>
          <li className="hover:text-gray-400 cursor-pointer">Reminders</li>
          <li className="hover:text-gray-400 cursor-pointer">Pomodoro Timer</li>
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
