import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useState, useEffect } from "react";

export default function PomodoroPage() {
  const [timeLeft, setTimeLeft] = useState(25 * 60); // Default 25 minutes in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isFocusMode, setIsFocusMode] = useState(true); // Focus or break mode
  const [focusDuration, setFocusDuration] = useState(25); // Focus duration in minutes
  const [breakDuration, setBreakDuration] = useState(5); // Break duration in minutes
  const [completedSessions, setCompletedSessions] = useState<string[]>([]); // List of completed sessions
  const [message, setMessage] = useState<string | null>(null); // Feedback message

  // Format time as MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  // Start/Pause Timer
  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  // Reset Timer
  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(isFocusMode ? focusDuration * 60 : breakDuration * 60); // Reset to updated focus or break duration
  };

  // Handle Timer Countdown
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer); // Cleanup timer on component unmount
    } else if (timeLeft === 0) {
      setIsRunning(false);
      setIsFocusMode((prevMode) => !prevMode); // Switch modes when time is up
      const sessionType = isFocusMode ? "Focus Session" : "Break Session";
      setCompletedSessions((prevSessions) => [
        ...prevSessions,
        `${sessionType} completed at ${new Date().toLocaleTimeString()}`,
      ]);
      setTimeLeft(isFocusMode ? breakDuration * 60 : focusDuration * 60); // Switch to break or focus duration
    }
  }, [isRunning, timeLeft, isFocusMode, focusDuration, breakDuration]);

  // Update Timer when Duration Changes
  useEffect(() => {
    if (!isRunning) {
      setTimeLeft(isFocusMode ? focusDuration * 60 : breakDuration * 60);
    }
  }, [focusDuration, breakDuration, isFocusMode, isRunning]);

  // Save Durations to Backend (Mock Implementation)
  const saveSettings = async () => {
    try {
      // Simulate saving to backend
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          focusDuration,
          breakDuration,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      setMessage("Settings saved successfully!");
    } catch (error) {
      console.error("Error saving settings:", error);
      setMessage("Failed to save settings. Please try again.");
    } finally {
      // Clear message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col h-screen">
      <Navbar />
      <main className="flex-1 flex max-w-full px-4 py-8 gap-8">
        {/* Timer Section */}
        <section className="flex flex-col bg-gray-800 p-6 rounded-md flex-1 h-full items-center justify-center">
          <h2 className="text-2xl font-bold mb-6">
            {isFocusMode ? "Focus Mode" : "Break Time"}
          </h2>
          <div className="text-6xl font-bold mb-6">{formatTime(timeLeft)}</div>
          <div className="flex gap-4">
            <button
              onClick={toggleTimer}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-medium"
            >
              {isRunning ? "Pause" : "Start"}
            </button>
            <button
              onClick={resetTimer}
              className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-md font-medium"
            >
              Reset
            </button>
          </div>
        </section>

        {/* Settings and History Section */}
        <section className="flex flex-col bg-gray-800 p-6 rounded-md flex-1 h-full">
          <h2 className="text-2xl font-bold mb-6">Settings & History</h2>

          {/* Feedback Message */}
          {message && <div className="mb-4 text-yellow-400">{message}</div>}

          {/* Change Durations */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">
              Change Timer Durations
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="focusDuration"
                  className="block text-sm font-medium mb-2"
                >
                  Focus Duration (minutes)
                </label>
                <input
                  id="focusDuration"
                  type="number"
                  value={focusDuration}
                  onChange={(e) => setFocusDuration(parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={1}
                />
              </div>
              <div>
                <label
                  htmlFor="breakDuration"
                  className="block text-sm font-medium mb-2"
                >
                  Break Duration (minutes)
                </label>
                <input
                  id="breakDuration"
                  type="number"
                  value={breakDuration}
                  onChange={(e) => setBreakDuration(parseInt(e.target.value))}
                  className="w-full px-4 py-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min={1}
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex gap-4">
            <button
              onClick={saveSettings}
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-md font-medium"
            >
              Save Settings
            </button>
          </div>

          {/* Completed Sessions */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Completed Sessions</h3>
            <ul className="space-y-4 overflow-y-auto max-h-64">
              {completedSessions.map((session, index) => (
                <li
                  key={index}
                  className="bg-gray-700 p-4 rounded-md text-sm text-gray-300"
                >
                  {session}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
