import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-1 flex-col items-center justify-center text-center py-20 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to ProductivityMate
        </h1>
        <p className="text-lg md:text-xl max-w-2xl mb-10">
          Simplify your productivity with tools like Calendar, Tasks, Reminders,
          and a Pomodoro Timer—all in one place.
        </p>
        <button className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-md text-lg font-medium">
          <Link href="/tasks">Get Started</Link>
        </button>
      </section>

      {/* Features Section */}
      <section className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-4 py-16">
        <div className="bg-gray-800 p-6 rounded-md text-center">
          <h3 className="text-2xl font-semibold mb-4">Calendar</h3>
          <p className="text-gray-400">
            Plan your days effortlessly with an integrated calendar.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-md text-center">
          <h3 className="text-2xl font-semibold mb-4">Tasks</h3>
          <p className="text-gray-400">
            Organize your tasks and prioritize your workload.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-md text-center">
          <h3 className="text-2xl font-semibold mb-4">Reminders</h3>
          <p className="text-gray-400">
            Never forget important events or deadlines again.
          </p>
        </div>
        <div className="bg-gray-800 p-6 rounded-md text-center">
          <h3 className="text-2xl font-semibold mb-4">Pomodoro Timer</h3>
          <p className="text-gray-400">
            Stay focused and productive using the Pomodoro technique.
          </p>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
