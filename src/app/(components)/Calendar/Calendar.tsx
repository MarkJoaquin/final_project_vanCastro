"use client";

import { useEffect, useState } from "react";
import { Calendar, Views, View, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSession } from "next-auth/react";
import { formatLessons } from "@/lib/formatLessons";
// import { format } from "path";

// import {getInstructorLessonsByEmail} from "@/app/api/lessons/confirmed/route"

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end:Date;
}

export default function AdminCalendar() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<'month' | 'day'>(Views.MONTH);
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(()=>{
    async function fetchLessons(){
      if(session?.user?.email){
        const res = await fetch("/api/lessons/confirmed",{
          method:"POST",
          headers:{"Content-Type":"application/json"},
          body: JSON.stringify({email:session.user.email}),
        });

        const lessons = await res.json();
        const formatted = formatLessons(lessons)
        setEvents(formatted);
      }
    }

    fetchLessons();
  },[session?.user?.email])

  console.log("LESSONS ====> ", events)

  const filteredLessons = events.filter((event) => {
    const eventDate = moment(event.start);
    const selected = moment(selectedDate);

    if (view === Views.DAY) return eventDate.isSame(selected, 'day');
    if (view === Views.MONTH) return eventDate.isSame(selected, 'month');
    return true;
  });

  const handleNavigate = (date: Date) => {
    setSelectedDate(date);
  };

  const handleViewChange = (newView: View) => {
    if (newView === Views.MONTH || newView === Views.DAY) {
      setView(newView as 'month' | 'day');
    }
  };

  return (
    <div className='p-4 h-[100vh]'>
      <h2 className="text-xl font-bold mb-4">Lessons Calendar</h2>
      <Calendar
        localizer={localizer}
        events={filteredLessons}
        defaultView={Views.DAY}
        view={view}
        onView={handleViewChange}
        onNavigate={handleNavigate}
        startAccessor='start'
        endAccessor='end'
        style={{ height: '100%' }}
        views={[Views.MONTH, Views.DAY]}
      />

      
    </div>
  );
}
