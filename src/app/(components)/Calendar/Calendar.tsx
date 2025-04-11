"use client"

import { useState } from "react"
import { Calendar, Views, View, momentLocalizer, Event } from "react-big-calendar"
import moment from "moment"
// import { View } from "lucide-react"
// import { View } from "lucide-react"


// Setup the localizer
const localizer = momentLocalizer(moment)

interface Lesson extends Event {
    id: number;
    title: string;
    start: Date;
    end: Date;
}

const lessons: Lesson[] = [
    {
      id: 0,
      title: 'Eye Checkup - John Doe',
      start: new Date(2025, 3, 10, 10, 0),
      end: new Date(2025, 3, 10, 11, 0),
    },
    {
      id: 1,
      title: 'Surgery - Jane Smith',
      start: new Date(2025, 3, 10, 13, 0),
      end: new Date(2025, 3, 10, 14, 0),
    },
    {
      id: 2,
      title: 'Consultation - Sam Lee',
      start: new Date(2025, 3, 15, 9, 0),
      end: new Date(2025, 3, 15, 10, 0),
    },
  ];
  

export default function AdminCalendar (){
    const [view, setView] = useState<'month' | 'day'>(Views.MONTH);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const filteredLessons = lessons.filter((lesson)=>{
        const lessDate = moment(lesson.start);
        const select = moment(selectedDate)

        if(view === Views.DAY){
            return lessDate.isSame(selectedDate, 'day')
        }

        if(view === Views.MONTH){
            return lessDate.isSame(selectedDate, 'month')
        }

        return true
    })

    const handleNavigate = (date:Date) => {
        setSelectedDate(date);
    }

    const handleViewChange = (newView: View) => {
        
        if(newView === Views.MONTH || newView === Views.DAY){
            setView(newView)
        } else {
            console.log(`Unhandled view: ${newView}`)
        }

    }

    return (
        <div className = 'p-4 h-[100vh]'>
            <h2 className="text-xl font-bold mb-4">Lessons Calendar</h2>
            <Calendar
                localizer={localizer}
                events={filteredLessons}
                defaultView={Views.MONTH}
                view={view}
                onView={handleViewChange}
                onNavigate={handleNavigate}
                startAccessor='start'
                endAccessor='end'
                style = {{height : '100%'}}
                views = {[Views.MONTH, Views.DAY]}
            />
        </div>
    )
}
