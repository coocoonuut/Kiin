"use client";
import React from "react";
import FilterSelector from "../components/FilterSelector";
import SideBar from "../components/SideBar";
import Calendar from "../components/Calendar";
import { ScheduleGenerator } from "@/domain/entities/ScheduleGenerator";
import { CoursesCsvDatasource } from "@/infrastructure/datasource/CoursesCsvDatasource";
import { FilterImpl } from "@/infrastructure/datasource/FilterImpl";
import { useEffect, useState } from "react";
import Category from "@/domain/entities/Category";
import { Course } from "@/domain/entities/Course";
import Pagination from "../components/Pagination";
import { DegreesCsvDataSource } from "@/infrastructure/datasource/DegreesCsvDataSource";
import { SubjectsCsvDataSource } from "@/infrastructure/datasource/SubjectsCSvDataSource";
import { ProfessorsCsvDataSource } from "@/infrastructure/datasource/ProfessorsCsvDataSource";
import { Degree } from "@/domain/entities/Degree";
import { Subject } from "@/domain/entities/Subject";
import { Professor } from "@/domain/entities/Professor";
import DegreeCategory from "@/domain/entities/DegreeCategory";
import ProfessorCategory from "@/domain/entities/ProfessorCategory";
import SubjectCategory from "@/domain/entities/SubjectCategory";
import SemesterCategory from "@/domain/entities/SemesterCategory";

const CalendarPage = () => {
  const [events, setEvents] = useState<
    { color: string; title: string; start: string; end: string }[]
  >([]);
  const [currentCategories, setCurrentCategories] = React.useState<Category[]>([]);
  const [schedule, setSchedule] = React.useState<Course[][]>([]);
  const [page, setPage] = useState(0);
  const [isFilterCoursesEmpty, setIsFilterCoursesEmpty] = useState(false);

  const [selectedValue, setSelectedValue] = useState<number | number[]>(0);

  const handleSliderChange = (value: number | number[]) => {
    setSelectedValue(value);
    console.log('Valor seleccionado:', value);
  };
  const mapCategories = async () => {

    const professors: Professor[] = await (new ProfessorsCsvDataSource()).getAll();
    const professorsCategory: Category = new ProfessorCategory("Profesor", professors);
    const degrees: Degree[] = await (new DegreesCsvDataSource()).getAll();
    const degreesCategory: Category = new DegreeCategory("Carrera", degrees);
    const subjects: Subject[] = await (new SubjectsCsvDataSource()).getAll();
    const subjectsCategory: Category = new SubjectCategory("Materia", subjects);
    const semesters: number[] = new Array(9).fill(0).map((_, index) => index + 1);
    const semestersCategory: Category = new SemesterCategory("Semestre", semesters);
    setCurrentCategories([degreesCategory, semestersCategory, professorsCategory, subjectsCategory]);
  };

  const filterCourses = async (categories: Category[]) => {
    setPage(0)
    const data = new CoursesCsvDatasource();
    const filter = new FilterImpl(categories.map((category) => category.toCourseFilter()));
    const courses = await data.getCoursesByFilter(filter)

    if (courses.length === 0) {
      setSchedule([]);
      setEvents([]);
      setIsFilterCoursesEmpty(true);
      return;
    }

    const generator = new ScheduleGenerator();
    const schedule = generator.generateSchedules(courses);
    setSchedule(schedule);
    const eventsData = getEvents(schedule, 0);
    setEvents(eventsData);
  }

  const getEvents = (schedule: Course[][], index: number) => {
    if (schedule.length === 0) {
      return [];
    }
    return schedule[index].flatMap((course) => {
      return mapEvents(course);
    });
  };

  const onChangeSchedulePage = (page: number) => {
    const eventsData = getEvents(schedule, page);
    setEvents(eventsData);
    setPage(page);
  };

  const handleClickFilter = (category: Category[]) => {
    setCurrentCategories(category);
  }

  useEffect(() => {
    if (isFilterCoursesEmpty) {
      alert('No hay cursos disponibles con los filtros seleccionados')
      setIsFilterCoursesEmpty(false)
    }
  }, [isFilterCoursesEmpty])

  // const handleShare = () => {
  //   const shareText =
  //     "Mira la carga academica que me encontré: " + window.location.href;
  //   const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  //   window.open(url, "_blank");
  // };

  useEffect(() => {
    mapCategories();
  }, []);

  return (
    <div className="bg-white min-h-screen text-black flex flex-row">
      <SideBar>
        <FilterSelector
          categories={currentCategories}
          onClick={handleClickFilter}
          onSubmit={() => filterCourses(currentCategories)}
          onChanceSliderValue={handleSliderChange}
        />
      </SideBar>
      <div className="w-4/6 flex flex-col p-5 h-full">
        <div className="flex justify-between p-2">
          <p className={`${schedule.length == 0 ? "opacity-0" : ""}`}>
            Posibles horarios:{schedule.length}
          </p>
          <Pagination
            onNext={() => onChangeSchedulePage(page + 1)}
            onPrevious={() => onChangeSchedulePage(page - 1)}
            isNextDisabled={page >= schedule.length - 1}
            isPreviousDisabled={page == 0}
          />
        </div>

        <Calendar events={events} />
        {/* <button
          onClick={handleShare}
          className="mt-4 p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          Compartir por WhatsApp
        </button> */}
      </div>
      <div className="w-1/6 m-5 ml-0 px-4">
        <h2 className="text-center text-xl font-bold my-4">Horario Actual</h2>
        {schedule.length > 0 ? (
          schedule[page].map((course, index) => (
            <div key={index} className="mb-4 border-2 p-4 rounded-lg border-gray-300">
              <h3 className="text-lg font-semibold">{course.subject.name}</h3>
              <p>Grupo: {course.group}</p>
              <p>Profesor: {course.professor.fullName}</p>
              <p>Carrera: {course.subject.degreeResume}</p>
              <p>Semestre: {course.subject.semestre}</p>
            </div>
          ))
        ) : (
          <p className="text-center">Sin cursos disponibles</p>
        )}
      </div>
    </div>
  );
};
function mapEvents(course: Course) {
  const days = {
    "Lunes": "16",
    "Martes": "17",
    "Miercoles": "18",
    "Jueves": "19",
    "Viernes": "20",
  };
  const color = '#' + Math.floor(Math.random() * 16777215).toString(16);

  return course.sessions.map((session) => ({
    borderColor: "black",
    color: color,
    title: course.subject.name,
    start:
      "2024-12-" +
      days[session.day as keyof typeof days] +
      "T" +
      session.startHour.format("HH:mm:ss"),
    end:
      "2024-12-" +
      days[session.day as keyof typeof days] +
      "T" +
      session.endHour.format("HH:mm:ss"),
  }));
}

export default CalendarPage;
