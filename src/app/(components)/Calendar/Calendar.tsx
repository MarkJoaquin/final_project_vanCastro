"use client";

import { useEffect, useState } from "react";
import { Calendar, Views, View, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { formatLessons } from "@/lib/formatLessons";
import "./Calendar.css"; // Importa tu CSS para el calendario

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  instructorId: string; // Added instructorId property
}

export default function AdminCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<'month' | 'day'>(Views.MONTH);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLessons() {
      const res = await fetch("/api/lessons/confirmed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const lessons = await res.json();
      const formatted = formatLessons(lessons);
      setEvents(formatted);
    }

    fetchLessons();
  }, []);

  const filteredLessons = events.filter((event) => {
    const eventDate = moment(event.start);
    const currentMonth = moment(selectedDate).month();
    const currentYear = moment(selectedDate).year();

    // Filtrar por mes y año visible
    const isInCurrentMonth = eventDate.month() === currentMonth && eventDate.year() === currentYear;

    // Filtrar por instructor seleccionado
    const isBySelectedInstructor = selectedInstructorId ? event.instructorId === selectedInstructorId : true;

    // Combinar ambos filtros
    return isInCurrentMonth && isBySelectedInstructor;
  });

  const handleNavigate = (date: Date, viewType?: View) => {
    setSelectedDate(date);
    if (viewType === Views.DAY || viewType === Views.MONTH) {
      setView(viewType as "month" | "day");
    }
  };

  const handleViewChange = (newView: View) => {
    if (newView === Views.MONTH || newView === Views.DAY) {
      setView(newView as "month" | "day");
    }
  };

  const CustomEvent = ({ event }: { event: CalendarEvent }) => {
    if (view === Views.MONTH) {
      return (
        <div className={`event-instructor-${event.instructorId}`}>
          <strong>{event.title}</strong>
        </div>
      );
    }

    return (
      <div className={`event-instructor-${event.instructorId}`}>
        <strong>{event.title}</strong>
        <p>{event.instructorId}</p>
      </div>
    );
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Lessons Calendar</h2>
        <div className="flex items-center gap-2">
          <label htmlFor="instructor-select" className="text-sm font-medium">
            Filter by Instructor
          </label>
          <select
            id="instructor-select"
            value={selectedInstructorId || ""}
            onChange={(e) => setSelectedInstructorId(e.target.value || null)}
            className="border rounded px-2 py-1"
          >
            <option value="">All Instructors</option>
            {Array.from(new Set(events.map((event) => event.instructorId))).map((id) => (
              <option key={id} value={id}>
                {id} {/* Puedes reemplazar esto con el nombre del instructor si está disponible */}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="h-[70vh] relative">
        <Calendar
          localizer={localizer}
          events={filteredLessons}
          defaultView={Views.MONTH}
          view={view}
          date={selectedDate}
          onView={handleViewChange}
          onNavigate={(date) => setSelectedDate(date)}
          startAccessor="start"
          endAccessor="end"
          style={{ height: "100%" }}
          views={[Views.MONTH, Views.DAY]}
          selectable
          eventPropGetter={(event) => {
            const className = `event-instructor-${event.instructorId}`;
            return { className };
          }}
          components={{
            event: CustomEvent,
          }}
          onSelectEvent={(event) => {
            setSelectedDate(event.start); // Cambia la fecha seleccionada al inicio del evento
            setView(Views.DAY); // Cambia la vista a "day"
          }}
        />
      </div>
    </div>
  );
}
