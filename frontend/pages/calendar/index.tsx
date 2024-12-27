import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useState, useEffect } from "react";

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

export default function CalendarPage() {
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]); // Initially empty
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGoogleCalendarEvents = async () => {
      try {
        // Fetch the access token from localStorage
        const accessToken = localStorage.getItem("accessToken");
        console.log(accessToken);

        if (!accessToken) {
          throw new Error("User is not authenticated. Access token missing.");
        }

        // Fetch events from the Google Calendar API
        const response = await fetch(
          "https://www.googleapis.com/calendar/v3/calendars/primary/events",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch Google Calendar events");
        }

        const data = await response.json();

        // Transform Google Calendar API events to CalendarEvent format
        const transformedEvents: CalendarEvent[] = data.items.map(
          (event: any) => ({
            title: event.summary || "No Title",
            start: new Date(event.start.dateTime || event.start.date), // Use dateTime if available, fallback to date
            end: new Date(event.end.dateTime || event.end.date), // Use dateTime if available, fallback to date
            allDay: !event.start.dateTime, // If dateTime is missing, it's an all-day event
          })
        );

        setCalendarEvents(transformedEvents); // Update state with events
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchGoogleCalendarEvents();
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-7xl mx-auto px-4 py-8 h-screen w-screen">
        <h1 className="text-3xl font-bold mb-6">My Calendar</h1>

        {error && (
          <p className="text-red-500 mb-4">
            Error: {error}. Please ensure you're authenticated and try again.
          </p>
        )}

        <div className="flex-1 bg-gray-800 rounded-md overflow-hidden">
          <Calendar
            localizer={localizer}
            events={calendarEvents} // Use events from state
            startAccessor="start"
            endAccessor="end"
            className="react-calendar"
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
