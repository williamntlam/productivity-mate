import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // Month View
import timeGridPlugin from "@fullcalendar/timegrid"; // Week and Day Views
import interactionPlugin from "@fullcalendar/interaction"; // Drag and Drop
import DateTimePicker from "react-datetime-picker";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import "react-datetime-picker/dist/DateTimePicker.css";

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
  const [allCalendars, setAllCalendars] = useState<GoogleCalendar[]>([]);
  const [selectedCalendars, setSelectedCalendars] = useState<string[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(new Date());
  const [endTime, setEndTime] = useState<Date | null>(new Date());

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

  const handleDateClick = async () => {
    if (selectedCalendars.length === 0) {
      alert("Please select at least one calendar to add events.");
      return;
    }

    const eventTitle = prompt("Enter event title:");
    if (!eventTitle) return;

    const eventDescription = prompt("Enter event description (optional):");

    if (!startTime || !endTime) {
      alert("Start and end times must be selected.");
      return;
    }

    const newEvent: CalendarEvent = {
      title: eventTitle,
      start: startTime.toISOString(),
      end: endTime.toISOString(),
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
              start: {
                dateTime: startTime.toISOString(),
                timeZone: "America/Toronto",
              },
              end: {
                dateTime: endTime.toISOString(),
                timeZone: "America/Toronto",
              },
            }),
          }
        );

        if (!response.ok) {
          const errorDetail = await response.json();
          throw new Error(
            `Failed to add event to calendar: ${calendarId}. ${
              errorDetail.error?.message || "No additional details provided."
            }`
          );
        }
      }

      setCalendarEvents((prevEvents) => [...prevEvents, newEvent]);
      alert("Event added successfully!");
    } catch (err: any) {
      console.error("Failed to add event:", err);
      setError(err.message);
      alert(`Failed to add event: ${err.message}`);
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col max-w-7xl mx-auto px-4 py-8 h-screen w-screen">
        <h1 className="text-3xl font-bold mb-6">My Calendar</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Event
        </button>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white rounded-lg p-6 shadow-lg">
              <h2 className="text-lg font-semibold mb-4">Select Event Times</h2>
              <div className="mb-4">
                <label className="block mb-2 font-medium">Start Time:</label>
                <DateTimePicker
                  onChange={setStartTime}
                  value={startTime}
                  format="y-MM-dd h:mm a"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 font-medium">End Time:</label>
                <DateTimePicker
                  onChange={setEndTime}
                  value={endTime}
                  format="y-MM-dd h:mm a"
                />
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDateClick}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        <div className="flex-1 bg-gray-800 rounded-md overflow-hidden mt-4">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={calendarEvents}
            editable={true}
            selectable={true}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
