"use client";

import { useEffect, useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, Views, View, momentLocalizer } from "react-big-calendar";
import moment from "moment";
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
      // console.log("Formatted lessons:", formatted);
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
    <div className="p-4 calendar-container bg-white rounded-xl shadow-sm">
      {/* Encabezado del calendario con título y filtros */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 title-calendar">
        <h2 className="text-2xl font-bold text-gray-800">Lessons Calendar</h2>
        
        {/* Controles de filtro y vista */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
          {/* Selector de vista */}
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg shadow-sm">
            <span className="text-sm font-medium text-gray-600">View:</span>
            <div className="flex rounded-md overflow-hidden border border-gray-200">
              <button 
                onClick={() => handleViewChange(Views.MONTH)}
                className={`px-3 py-1 text-sm ${view === 'month' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                Month
              </button>
              <button 
                onClick={() => handleViewChange(Views.DAY)}
                className={`px-3 py-1 text-sm ${view === 'day' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
              >
                Day
              </button>
            </div>
          </div>
          
          {/* Filtro de instructor */}
          <div className="flex items-center gap-2 bg-gray-50 p-2 rounded-lg shadow-sm">
            <label htmlFor="instructor-select" className="text-sm font-medium text-gray-600">
              Instructor:
            </label>
            <select
              id="instructor-select"
              value={selectedInstructorId || ""}
              onChange={(e) => setSelectedInstructorId(e.target.value || null)}
              className="border rounded-md px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
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
      </div>
      
      {/* Contenedor del calendario con altura responsiva */}
      <div className="calendar-wrapper rounded-lg overflow-hidden border border-gray-200 shadow-inner">
        <Calendar
          localizer={localizer}
          events={filteredLessons}
          defaultView={Views.MONTH}
          view={view}
          date={selectedDate}
          onView={handleViewChange}
          onNavigate={handleNavigate}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '600px' }}
          views={[Views.MONTH, Views.DAY]}
          selectable
          formats={{
            dateFormat: 'D',
            dayFormat: 'ddd DD',
            monthHeaderFormat: 'MMMM YYYY',
            dayHeaderFormat: 'dddd MMM D',
            dayRangeHeaderFormat: ({ start, end }) => `${moment(start).format('MMM D')} - ${moment(end).format('MMM D, YYYY')}`
          }}
          eventPropGetter={(event) => {
            const className = `event-instructor-${event.instructorId}`;
            return { className };
          }}
          components={{
            event: CustomEvent,
            toolbar: (toolbarProps) => (
              <div className="rbc-toolbar">
                <span className="rbc-btn-group">
                  <button type="button" onClick={() => toolbarProps.onNavigate('PREV')}>←</button>
                  <button type="button" onClick={() => toolbarProps.onNavigate('TODAY')}>Today</button>
                  <button type="button" onClick={() => toolbarProps.onNavigate('NEXT')}>→</button>
                </span>
                <span className="rbc-toolbar-label">{toolbarProps.label}</span>
                <span className="rbc-btn-group hidden">
                  <button type="button" onClick={() => toolbarProps.onView('month')}>Month</button>
                  <button type="button" onClick={() => toolbarProps.onView('day')}>Day</button>
                </span>
              </div>
            ),
            month: {
              dateHeader: ({ date, label }) => {
                return <span className="rbc-date-cell-text">{label}</span>;
              }
            }
          }}
          onSelectEvent={(event) => {
            if (view === Views.DAY) {
              handleEventClick(event);
            } else {
              setSelectedDate(event.start);
              setView(Views.DAY);
            }
          }}
          messages={{
            showMore: (total) => `+${total} more`,
          }}
        />
      </div>
      
      {/* Modal de evento */}
      {isModalOpen && (
        <ModalEvent
          lessonId={selectedLesson?.id || null}
          getInstructorName={getInstructorName}
          onClose={() => setIsModalOpen(false)}
        />
      )}
      
      {/* Resumen de lecciones */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Total de lecciones */}
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Summary</h3>
          <p className="text-md">
            Total Lessons: <span className="font-bold text-blue-700">{totalLessonsAll}</span>
          </p>
        </div>
        
        {/* Lecciones por instructor */}
        <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-4 shadow-sm">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">Lessons by Instructor</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(lessonsByInstructor).map(([instructorId, count]) => (
              <div key={instructorId} className="flex justify-between items-center bg-white/50 rounded p-2">
                <span className="text-sm font-medium">{getInstructorName(instructorId)}</span>
                <span className="font-bold text-purple-700">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
