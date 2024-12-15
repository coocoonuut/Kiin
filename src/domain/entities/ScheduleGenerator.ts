import { Course } from "./Course";
import { Session } from "./Session";


export class ScheduleGenerator {

    constructor() {

    }

    sessionCompatible(session1: Session, session2: Session): boolean {

        if (session1.day !== session2.day) {
            return true;
        }


        const noOverlap = session1.endHour <= session2.startHour || session1.startHour >= session2.endHour;
        return noOverlap;
    }
    courseCompatible(course1: Course, course2: Course) {
        for (const session1 of course1.sessions) {
            for (const session2 of course2.sessions) {
                if (!this.sessionCompatible(session1, session2)) {
                    return false;
                }
            }
        }
        return true;
    }

    generateSchedules(courses: Course[]) {
        const schedules: Course[][] = [];
    
        for (const course of courses) {
            const compatibleSchedules = schedules.filter((schedule) =>
                schedule.every(scheduledCourse => 
                    this.courseCompatible(course, scheduledCourse) && 
                    scheduledCourse.subject !== course.subject
                )
            );
    
            for (const compatibleSchedule of compatibleSchedules) {
                schedules.push([...compatibleSchedule, course]);
            }
    
            // Cada curso puede ser un horario por sí mismo
            schedules.push([course]);
        }
    
        return schedules;
    }
}