"use client";

import { useEffect, useState } from "react";
import { Calendar, Views, View, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { formatLessons } from "@/lib/formatLessons";
import "./Calendar.css";
import ModalEvent from "./ModalEvent";

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  instructorId: string;
}

export default function AdminCalendar() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<'month' | 'day'>(Views.MONTH);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedInstructorId, setSelectedInstructorId] = useState<string | null>(null);
  const [instructors, setInstructors] = useState<{ id: string; name: string }[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchLessons() {
      const res = await fetch("/api/lessons/confirmed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const lessons = await res.json();
      const formatted = formatLessons(lessons);
      console.log("Formatted lessons:", formatted);
      setEvents(formatted);
    }

    async function fetchInstructors() {
      try {
        const res = await fetch("/api/instructors");
        const data = await res.json();
        setInstructors(data);
      } catch (error) {
        console.error("Error fetching instructors:", error);
      }
    }

    fetchLessons();
    fetchInstructors();
  }, []);

  const getInstructorName = (id: string) => {
    const instructor = instructors.find((instructor) => instructor.id === id);
    return instructor ? instructor.name : "Unknown Instructor";
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedLesson(event);
    setIsModalOpen(true);
  };

  const filteredLessons = events.filter((event) => {
    const eventDate = moment(event.start);
    const currentMonth = moment(selectedDate).month();
    const currentYear = moment(selectedDate).year();

    const isInCurrentMonth = eventDate.month() === currentMonth && eventDate.year() === currentYear;
    const isBySelectedInstructor = selectedInstructorId ? event.instructorId === selectedInstructorId : true;

    return isInCurrentMonth && isBySelectedInstructor;
  });

  const totalLessons = filteredLessons.length;
  const totalLessonsAll = events.length;

  const lessonsByInstructor = events.reduce((acc, event) => {
    acc[event.instructorId] = (acc[event.instructorId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
          {/* <p>{getInstructorName(event.instructorId)}</p> */}
        </div>
      );
    }

    return (
      <div className={`event-instructor-${event.instructorId}`}>
        <strong>{event.title}</strong>
        <p>{getInstructorName(event.instructorId)}</p>
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
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="">All Instructors</option>
            {instructors.map((instructor) => (
              <option key={instructor.id} value={instructor.id}>
                {instructor.name}
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
            if (view === Views.DAY) {
              handleEventClick(event);
            } else {
              setSelectedDate(event.start);
              setView(Views.DAY);
            }
          }}
        />
      </div>
      {isModalOpen && (
        <ModalEvent
          lessonId={selectedLesson?.id || null}
          getInstructorName={getInstructorName}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      <div className="flex flex-col items-start mt-4 p-4 bg-gray-100 rounded-md shadow-md w-[300px]">
        <p className="text-md">
          Total Lessons: <span className="font-bold">{totalLessonsAll}</span>
        </p>
        <div className="text-md mt-2 flex flex-col items-end">
          {Object.entries(lessonsByInstructor).map(([instructorId, count]) => (
            <p key={instructorId}>
              {getInstructorName(instructorId)}: <span className="font-bold">{count}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
