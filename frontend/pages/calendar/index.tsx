import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import Navbar from "@/components/Navbar";
import { useState } from "react";

const locales = {
  "en-US": require("date-fns/locale/en-US"),
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// Define event type
type CalendarEvent = {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
};

const events: CalendarEvent[] = [
  {
    title: "Team Meeting",
    start: new Date(2024, 11, 10, 10, 0),
    end: new Date(2024, 11, 10, 12, 0),
    allDay: false,
  },
  {
    title: "Client Call",
    start: new Date(2024, 11, 11, 14, 0),
    end: new Date(2024, 11, 11, 15, 30),
    allDay: false,
  },
];

export default function CalendarPage() {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(events);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-7xl mx-auto px-4 py-8 h-screen w-screen">
        <h1 className="text-3xl font-bold mb-6">My Calendar</h1>
        <div className="flex-1 bg-gray-800 rounded-md overflow-hidden">
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            className="react-calendar"
          />
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
