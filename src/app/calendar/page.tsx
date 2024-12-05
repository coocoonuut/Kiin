'use client'
import React from "react";
import FilterSelector from "../components/FilterSelector";
import SideBar from '../components/SideBar'
import Calendar from "../components/Calendar";
import TemporaryForm, { FormData } from "../components/TemporaryForm";
import { ScheduleGenerator } from '@/domain/entities/ScheduleGenerator';
import { CoursesCsvDatasource } from '@/infrastructure/datasource/CoursesCsvDatasource';
import { FilterImpl } from '@/infrastructure/datasource/FilterImpl';
import { useEffect, useState } from "react";
import FilterModel from "@/infrastructure/models/FilterModel";
import Category from "@/domain/entities/Category";
import { Course } from "@/domain/entities/Course";
import { Subject } from "@/domain/entities/Subject";
import Pagination from "../components/Pagination";


const CalendarPage = () => {
    const [events, setEvents] = useState<{ color: string; title: string; start: string; end: string; }[]>([]);
    const [currentFilters, setCurrentFilters] = useState<FilterModel>(new FilterModel([], [], [], []));
    const [categories, setCategories] = React.useState<Category[]>([]);
    const [schedule, setSchedule] = React.useState<Course[][]>([]);
    const [page, setPage] = useState(0);

    const mapCategories = async () => {
        const data = new CoursesCsvDatasource();
        const courses = await data.getAll();
        var professorsFullName: string[] = []
        var degress: string[] = []
        var subjects: string[] = []
        var semesters: number[] = []
        courses.forEach(course => {
            professorsFullName.push(course.professor.fullName())
            if (!degress.includes(course.subject.degree)) {
                degress.push(course.subject.degree)
            }

            if (!subjects.includes(course.subject.name)) {
                subjects.push(course.subject.name)
            }

            if (!semesters.includes(course.subject.semestre) && course.subject.semestre > 0) {
                semesters.push(course.subject.semestre)
            }

        })
        setCategories([
            new Category('Carrera', degress),
            new Category('Semestre', semesters.sort((a, b) => a - b).map((val) => val.toString())),
            new Category('Profesor', professorsFullName),
            new Category('Materia', subjects),
        ])

    }

    const filterCourses = async (filters: FilterModel) => {
        const data = new CoursesCsvDatasource();

        const filter = new FilterImpl(filters);
        const courses = await data.getCoursesByFilter(filter)
        if (courses.length === 0) {
            setEvents([]);
            return;
        }
        const generator = new ScheduleGenerator();
        const schedule = generator.generateSchedules(courses);
        setSchedule(schedule);
        const eventsData = getEvents(schedule, 0);
        setEvents(eventsData);
    }

    const getEvents = (schedule: Course[][], index: number) => {
        return schedule[index].flatMap((course) => {
            const days = {
                "Lunes": "02",
                "Martes": "03",
                "Miercoles": "04",
                "Jueves": "05",
                "Viernes": "06",
            }
            const color = '#' + Math.floor(Math.random() * 16777215).toString(16)

            return course.sessions.map((session) => ({
                borderColor: 'black',
                color: color,
                title: course.subject.name,
                start: '2024-12-' + days[session.day as keyof typeof days] + 'T' + session.startHour.format('HH:mm:ss'),
                end: '2024-12-' + days[session.day as keyof typeof days] + 'T' + session.endHour.format('HH:mm:ss'),
            }))
        }
        );
    }

    const onChangeSchedulePage = (page: number) => {
        const eventsData = getEvents(schedule, page);
        setEvents(eventsData);
    }

    const handleClickFilter = (category: Category, value: string) => {
        const index = categories.findIndex(c => c.title === category.title)

        if (index === -1) { return }

        const newFilter = getNewFilter(category, value);
        setCurrentFilters(newFilter);
        console.log(newFilter)
    }

    const getNewFilter = (category: Category, value: string) => {
        var professors = currentFilters.professors;
        var degress = currentFilters.degrees
        var semesters = currentFilters.semesters;
        var subjects = currentFilters.subjects;

        switch (category.title) {
            case 'Profesor':
                professors = professors.includes(value)
                    ? professors.filter(professor => professor !== value)
                    : [...professors, value]
                break;
            case 'Carrera':
                degress = degress.includes(value)
                    ? degress.filter(degree => degree !== value)
                    : [...degress, value]
                break;
            case 'Semestre':
                semesters = semesters.includes(parseInt(value))
                    ? semesters.filter(semester => semester !== parseInt(value))
                    : [...semesters, parseInt(value)]
                break;
            case 'Materia':
                subjects = subjects.includes(value)
                    ? subjects.filter(subject => subject !== value)
                    : [...subjects, value]
                break;
        }

        return new FilterModel(degress, semesters, professors, subjects)

    }

    useEffect(() => {
        mapCategories();
    }, []);

    return (
        <div
            className="bg-white text-black h-full flex flex-row"
        >
            <SideBar>
                <FilterSelector categories={categories} onClick={handleClickFilter} onSubmit={() => filterCourses(currentFilters)} />
            </SideBar>
            <div className="w-5/6 flex flex-col p-5 h-full">
                <div className="flex justify-end p-2">
                    <Pagination
                        onNext={() => onChangeSchedulePage(page + 1)}
                        onPrevious={() => onChangeSchedulePage(page - 1)}
                        isNextDisabled={page >= schedule.length - 1}
                        isPreviousDisabled={page >= 0}
                    />
                </div>

                <Calendar events={events} />

            </div>
        </div>
    );
};

export default CalendarPage;
