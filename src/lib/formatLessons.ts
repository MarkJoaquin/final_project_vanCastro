import moment from 'moment';

interface Lesson {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    student: {
        name: string
    }
}

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end:Date;
}

export function formatLessons(lessons:Lesson[]):CalendarEvent[] {

    return lessons.map((lesson) => {
        const start = moment(`${lesson.date} ${lesson.startTime}`, "YYYY-MM-DD HH:mm").toDate();
        const end = moment(`${lesson.date} ${lesson.endTime}`, "YYYY-MM-DD HH:mm").toDate();

        return {
            id: lesson.id,
            title: `${lesson.student.name}`,
            start,
            end
        }
    })

}