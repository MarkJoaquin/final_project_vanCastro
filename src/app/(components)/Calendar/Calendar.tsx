"use client";

import { useEffect, useState } from "react";
import { Calendar, Views, View, momentLocalizer, Event } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useSession } from "next-auth/react";

import {getInstructorLessonsByEmail} from "@/app/api/lessons/confirmed/route"

const localizer = momentLocalizer(moment);

// interface Lesson extends Event {
//   id: string;
//   title: string;
//   start: Date;
//   end: Date;
// }



export default function AdminCalendar() {
  const { data: session } = useSession();
  const instructorEmail = session?.user?.email as string

  console.log('INSTRUCTOR EMAIL ===> ', instructorEmail)

  if(instructorEmail) {
    const lessons = getInstructorLessonsByEmail(instructorEmail)
    console.log('LESSONS ====> ', lessons)

  } else {
    console.error('Email is null or undefined')
  }
 

  const [view, setView] = useState<'month' | 'day'>(Views.MONTH);
  const [selectedDate, setSelectedDate] = useState(new Date());
  // const [lessons, setLessons] = useState<Lesson[]>([]);

  // useEffect(() => {
  //   const fetchLessons = async () => {
  //     if (!instructorId) return;
  //     const res = await fetch(`/api/lessons?instructorId=${instructorId}`);
  //     const data = await res.json();

  //     const formattedLessons: Lesson[] = data.map((lesson: any) => ({
  //       id: lesson.id,
  //       title: `${lesson.plan} - ${lesson.student?.name ?? "Student"}`,
  //       start: new Date(`${lesson.date}T${lesson.startTime}`),
  //       end: new Date(`${lesson.date}T${lesson.endTime}`),
  //     }));

  //     setLessons(formattedLessons);
  //   };

  //   fetchLessons();
  // }, [instructorId]);

  // console.log('LESSONS ====> ', lessons)

  // const filteredLessons = lessons.filter((lesson) => {
  //   const lessonDate = moment(lesson.start);
  //   const selected = moment(selectedDate);

  //   if (view === Views.DAY) return lessonDate.isSame(selected, 'day');
  //   if (view === Views.MONTH) return lessonDate.isSame(selected, 'month');
  //   return true;
  // });

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
      {/* <Calendar
        localizer={localizer}
        events={filteredLessons}
        defaultView={Views.MONTH}
        view={view}
        onView={handleViewChange}
        onNavigate={handleNavigate}
        startAccessor='start'
        endAccessor='end'
        style={{ height: '100%' }}
        views={[Views.MONTH, Views.DAY]}
      /> */}
    </div>
  );
}
