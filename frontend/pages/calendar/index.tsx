import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // React DatePicker styles

// Define types
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
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [clickedDate, setClickedDate] = useState<string>("");
  const [eventTitle, setEventTitle] = useState<string>("");
  const [eventDescription, setEventDescription] = useState<string>("");

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
        setAllCalendars(data.items);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchGoogleCalendars();
  }, []);

  // Fetch events from the selected calendar
  useEffect(() => {
    const fetchEventsForSelectedCalendar = async () => {
      if (!selectedCalendar) {
        setCalendarEvents([]);
        return;
      }

      try {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          throw new Error("User is not authenticated. Access token missing.");
        }

        const response = await fetch(
          `https://www.googleapis.com/calendar/v3/calendars/${selectedCalendar}/events`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(
            `Failed to fetch events for calendar: ${selectedCalendar}`
          );
        }

        const data = await response.json();
        const transformedEvents = data.items.map((event: any) => ({
          title: event.summary || "No Title",
          start: event.start.dateTime || event.start.date,
          end: event.end.dateTime || event.end.date,
          allDay: !event.start.dateTime,
          description: event.description || "",
        }));

        setCalendarEvents(transformedEvents);
      } catch (err: any) {
        setError(err.message);
      }
    };

    fetchEventsForSelectedCalendar();
  }, [selectedCalendar]);

  const handleDateClick = (info: any) => {
    const clickedDate = new Date(info.dateStr);
    clickedDate.setDate(clickedDate.getDate() + 1);
    setClickedDate(clickedDate.toISOString().split("T")[0]);
    setStartTime(clickedDate); // Initialize start time with local time
    setEndTime(new Date(clickedDate.getTime() + 60 * 60 * 1000)); // Add 1 hour for the end time
    setEventTitle(""); // Reset event title
    setEventDescription(""); // Reset event description
    setIsModalOpen(true); // Open modal
  };

  const handleAddEvent = async () => {
    if (!selectedCalendar) {
      alert("Please select a calendar to add events.");
      return;
    }

    if (!eventTitle) {
      alert("Event title is required.");
      return;
    }

    const newEvent: CalendarEvent = {
      title: eventTitle,
      start: startTime?.toISOString() || clickedDate,
      end: endTime?.toISOString() || clickedDate,
      allDay: false,
      description: eventDescription,
    };

    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("User is not authenticated. Access token missing.");
      }

      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${selectedCalendar}/events`,
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
              dateTime: startTime?.toISOString() || clickedDate,
              timeZone: "America/Toronto",
            },
            end: {
              dateTime: endTime?.toISOString() || clickedDate,
              timeZone: "America/Toronto",
            },
          }),
        }
      );

      if (!response.ok) {
        const errorDetail = await response.json();
        throw new Error(
          `Failed to add event: ${
            errorDetail.error?.message || "No details provided"
          }`
        );
      }

      setCalendarEvents((prevEvents) => [...prevEvents, newEvent]);
      alert("Event added successfully!");
    } catch (err: any) {
      setError(err.message);
      alert(`Failed to add event: ${err.message}`);
    }

    setIsModalOpen(false); // Close modal
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex flex-col max-w-7xl mx-auto px-4 py-8 h-screen w-screen">
        <h1 className="text-3xl font-bold mb-6">My Calendar</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <h2 className="text-xl font-semibold">Select a Calendar</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {allCalendars.map((calendar) => (
              <button
                key={calendar.id}
                onClick={() => setSelectedCalendar(calendar.id)}
                className={`px-4 py-2 rounded border-2 ${
                  selectedCalendar === calendar.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-700 text-gray-200"
                }`}
              >
                {calendar.summary}
              </button>
            ))}
          </div>
        </div>

        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="bg-gray-800 rounded-lg p-6 shadow-lg z-60"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-lg font-semibold mb-4">Add Event</h2>
              <div className="mb-4">
                <label className="block font-medium">Event Title:</label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full p-2 bg-gray-200 text-black rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">Description:</label>
                <textarea
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="w-full p-2 bg-gray-200 text-black rounded"
                  rows={3}
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block font-medium">Start Time:</label>
                <DatePicker
                  selected={startTime}
                  onChange={(date) => setStartTime(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className="w-full p-2 bg-gray-200 text-black rounded"
                  popperClassName="react-datepicker-popper"
                />
              </div>
              <div className="mb-4">
                <label className="block font-medium">End Time:</label>
                <DatePicker
                  selected={endTime}
                  onChange={(date) => setEndTime(date)}
                  showTimeSelect
                  showTimeSelectOnly
                  timeIntervals={15}
                  timeCaption="Time"
                  dateFormat="h:mm aa"
                  className="w-full p-2 bg-gray-200 text-black rounded"
                  popperClassName="react-datepicker-popper"
                />
              </div>
              <div className="flex justify-end">
                <button
                  className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                  onClick={handleAddEvent}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="bg-gray-800 rounded-md mt-4 overflow-hidden flex-1">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            events={calendarEvents}
            editable
            selectable
            dateClick={handleDateClick}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
