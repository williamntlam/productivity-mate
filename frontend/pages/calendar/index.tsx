import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // Month View
import timeGridPlugin from "@fullcalendar/timegrid"; // Week and Day Views
import interactionPlugin from "@fullcalendar/interaction"; // Drag and Drop

// Define calendar type
type GoogleCalendar = {
  id: string;
  summary: string;
};

type CalendarEvent = {
  title: string;
  start: string;
  end: string;
  allDay: boolean;
  description?: string;
};

export default function CalendarPage() {
  const [allCalendars, setAllCalendars] = useState<GoogleCalendar[]>([]); // List of all calendars
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]); // Selected calendar IDs
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]); // Events from selected calendars
  const [error, setError] = useState<string | null>(null);

  // Fetch all calendars
  useEffect(() => {
    const fetchGoogleCalendars = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("User is not authenticated. Access token missing.");
        }

        const response = await fetch(
          "https://www.googleapis.com/calendar/v3/users/me/calendarList",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch Google Calendars");
        }

        const data = await response.json();
        setAllCalendars(data.items); // Set all calendars
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchGoogleCalendars();
  }, []);

  // Fetch events from selected calendars
  useEffect(() => {
    const fetchEventsForSelectedCalendars = async () => {
      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("User is not authenticated. Access token missing.");
        }

        const allEvents: CalendarEvent[] = [];

        for (const calendarId of selectedCalendars) {
          const response = await fetch(
            `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (!response.ok) {
            throw new Error(
              `Failed to fetch events for calendar: ${calendarId}`
            );
          }

          const data = await response.json();

          // Transform events into FullCalendar's format
          const transformedEvents = data.items.map((event: any) => ({
            title: event.summary || "No Title",
            start: event.start.dateTime || event.start.date, // ISO string
            end: event.end.dateTime || event.end.date, // ISO string
            allDay: !event.start.dateTime, // All-day if no time is specified
            description: event.description || "",
          }));

          allEvents.push(...transformedEvents);
        }

        setCalendarEvents(allEvents); // Update events
      } catch (err: any) {
        setError(err.message);
      }
    };

    if (selectedCalendars.length > 0) {
      fetchEventsForSelectedCalendars();
    } else {
      setCalendarEvents([]); // Clear events if no calendars are selected
    }
  }, [selectedCalendars]);

  const handleCalendarSelection = (calendarId: string) => {
    setSelectedCalendars(
      (prevSelected) =>
        prevSelected.includes(calendarId)
          ? prevSelected.filter((id) => id !== calendarId) // Deselect calendar
          : [...prevSelected, calendarId] // Select calendar
    );
  };

  const handleDateClick = async (info: any) => {
    if (selectedCalendars.length === 0) {
      alert("Please select at least one calendar to add events.");
      return;
    }

    const eventTitle = prompt("Enter event title:");
    if (!eventTitle) return;

    const eventDescription = prompt("Enter event description (optional):");

    const startTime = prompt(
      "Enter start time (HH:MM, 24-hour format):",
      "00:00"
    );
    const endTime = prompt("Enter end time (HH:MM, 24-hour format):", "23:59");

    const startDateTime = `${info.dateStr}T${startTime || "00:00"}`;
    const endDateTime = `${info.dateStr}T${endTime || "23:59"}`;

    const newEvent: CalendarEvent = {
      title: eventTitle,
      start: startDateTime,
      end: endDateTime,
      allDay: false,
      description: eventDescription || "",
    };

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("User is not authenticated. Access token missing.");
      }

      for (const calendarId of selectedCalendars) {
        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              summary: eventTitle,
              description: eventDescription,
              start: { dateTime: startDateTime },
              end: { dateTime: endDateTime },
            }),
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to add event to calendar: ${calendarId}`);
        }
      }

      // Add the event locally for immediate feedback
      setCalendarEvents((prevEvents) => [...prevEvents, newEvent]);
    } catch (err: any) {
      setError(err.message);
    }
  };

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

        {/* Calendar List */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-4">Select Calendars</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {allCalendars.map((calendar) => (
              <div
                key={calendar.id}
                onClick={() => handleCalendarSelection(calendar.id)}
                className={`cursor-pointer border-2 rounded-lg px-4 py-2 flex items-center justify-center text-center transition duration-200 ${
                  selectedCalendars.includes(calendar.id)
                    ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                    : "bg-gray-700 text-gray-200 border-gray-600 hover:bg-gray-600"
                }`}
              >
                {calendar.summary}
              </div>
            ))}
          </div>
        </div>

        {/* Calendar Display */}
        <div className="flex-1 bg-gray-800 rounded-md overflow-hidden">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={calendarEvents} // Use events from state
            editable={true} // Enable drag and drop
            selectable={true} // Enable date selection
            dateClick={handleDateClick} // Add this line
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
