import Navbar from "@/components/Navbar";

export default function Dashboard() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Header */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto px-4 py-8">
        {/* Calendar Widget */}
        <div className="bg-gray-800 p-6 rounded-md">
          <img
            src="https://media.giphy.com/media/vzO0Vc8b2VBLi/giphy.gif"
            alt="Calendar GIF"
            className="w-full h-32 object-cover rounded-md mb-4"
          />
          <h2 className="text-2xl font-semibold mb-4">Calendar</h2>
          <p className="text-gray-400">
            Plan your events and stay on track with your schedule.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md mt-4">
            Open Calendar
          </button>
        </div>

        {/* Tasks Widget */}
        <div className="bg-gray-800 p-6 rounded-md">
          <img
            src="https://media.giphy.com/media/xT9IgG50Fb7Mi0prBC/giphy.gif"
            alt="Tasks GIF"
            className="w-full h-32 object-cover rounded-md mb-4"
          />
          <h2 className="text-2xl font-semibold mb-4">Tasks</h2>
          <p className="text-gray-400">
            Organize and prioritize your daily tasks.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md mt-4">
            View Tasks
          </button>
        </div>

        {/* Reminders Widget */}
        <div className="bg-gray-800 p-6 rounded-md">
          <img
            src="https://media.giphy.com/media/l4FGuhL4U2WyjdkaY/giphy.gif"
            alt="Reminders GIF"
            className="w-full h-32 object-cover rounded-md mb-4"
          />
          <h2 className="text-2xl font-semibold mb-4">Reminders</h2>
          <p className="text-gray-400">
            Get notified about important events and tasks.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md mt-4">
            Set Reminders
          </button>
        </div>

        {/* Pomodoro Timer Widget */}
        <div className="bg-gray-800 p-6 rounded-md">
          <img
            src="https://media.giphy.com/media/26AHONQ79FdWZhAI0/giphy.gif"
            alt="Pomodoro Timer GIF"
            className="w-full h-32 object-cover rounded-md mb-4"
          />
          <h2 className="text-2xl font-semibold mb-4">Pomodoro Timer</h2>
          <p className="text-gray-400">
            Boost your productivity with focused work sessions.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md mt-4">
            Start Timer
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-center py-4">
        <p className="text-gray-400">
          &copy; {new Date().getFullYear()} ProductivityMate. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}
