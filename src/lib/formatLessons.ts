import moment from 'moment';

interface Lesson {
    id: string;
    date: string;
    startTime: string;
    endTime: string;
    instructorId: string; // Agregamos el ID del instructor
    student: {
        name: string;
    };
}

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    instructorId: string; // Agregamos el ID del instructor para los estilos
}

export function formatLessons(lessons: Lesson[]): CalendarEvent[] {
    return lessons.map((lesson) => {
        const start = moment(`${lesson.date} ${lesson.startTime}`, "YYYY-MM-DD HH:mm").toDate();
        const end = moment(`${lesson.date} ${lesson.endTime}`, "YYYY-MM-DD HH:mm").toDate();

        return {
            id: lesson.id,
            title: `${lesson.student.name}`, // Título del evento
            start,
            end,
            instructorId: lesson.instructorId, // Incluimos el ID del instructor
        };
    });
}