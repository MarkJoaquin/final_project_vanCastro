"use client";

import { useEffect, useState } from "react";
import { Calendar, Views, View, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSession } from "next-auth/react";
import { formatLessons } from "@/lib/formatLessons";
import "./Calendar.css"; // Importa tu CSS para el calendario
// import { format } from "path";

// import {getInstructorLessonsByEmail} from "@/app/api/lessons/confirmed/route"

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  instructorId: string; // Added instructorId property
}

export default function AdminCalendar() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<'month' | 'day'>(Views.MONTH);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    async function fetchLessons() {
      const res = await fetch("/api/lessons/confirmed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}), // No enviamos email para obtener todas las lecciones
      });

      const lessons = await res.json();
      const formatted = formatLessons(lessons);
      setEvents(formatted);
    }

    fetchLessons();
  }, []);

  console.log("LESSONS ====> ", events);

  const filteredLessons = events.filter((event) => {
    const eventDate = moment(event.start);
    const selected = moment(selectedDate);

    if (view === Views.DAY) {
      return eventDate.isSame(selected, "day");
    }
    if (view === Views.MONTH) {
      return eventDate.isSame(selected, "month");
    }
    return true;
  });

  const handleNavigate = (date: Date, viewType?: View) => {
    setSelectedDate(date);

    if (viewType === Views.DAY || viewType === Views.MONTH) {
      setView(viewType as "month" | "day");
    } else if (view === Views.DAY) {
      setSelectedDate(date);
    }
  };

  const handleViewChange = (newView: View) => {
    if (newView === Views.MONTH || newView === Views.DAY) {
      setView(newView as "month" | "day");
    }
  };

  // Componente personalizado para los eventos
  const CustomEvent = ({ event }: { event: CalendarEvent }) => {
    // Renderizar un punto para la vista de mes
    if (view === Views.MONTH) {
      return (
        <div
          className={`event-instructor-${event.instructorId}`}
          style={{
            width: "10px",
            height: "10px",
            borderRadius: "50%",
            backgroundColor: "currentColor", // El color se define en CSS
            margin: "0 auto",
          }}
        ></div>
      );
    }

    // Renderizar información completa para otras vistas (como la vista de día)
    return (
      <div className={`event-instructor-${event.instructorId}`}>
        <strong>{event.title}</strong>
        <p>{event.instructorId}</p>
      </div>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Lessons Calendar</h2>
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
            event: CustomEvent, // Usa el componente personalizado aquí
          }}
          onDrillDown={(date) => {
            setSelectedDate(date);
            setView(Views.DAY);
          }}
          onSelectEvent={(event) => {
            setSelectedDate(event.start);
            setView(Views.DAY);
          }}
        />
      </div>

      <div className="flex justify-end mt-4">
        <div>
          <p className="text-sm font-semibold total-lesson">
            Total: <span className="total-number">{events.length} Lessons</span>
          </p>
        </div>
      </div>
    </div>
  );
}
