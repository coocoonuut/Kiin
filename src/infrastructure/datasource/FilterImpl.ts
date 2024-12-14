import { Course } from "@/domain/entities/Course";
import { Subject } from "@/domain/entities/Subject";
import { CoursesCsvDatasource } from "./CoursesCsvDatasource";
import { Filter } from "@/domain/entities/Filter";
import { CoursesRepositoryImpl } from "../repositories/CoursesRepositoryImpl";
import FilterModel from "../models/FilterModel";

export class FilterImpl implements Filter {

  private _model: FilterModel;
  constructor(
    model: FilterModel
  ) {
    this._model = model;
  }

  //union filter
  async filter(

  ) {
    const coursesDataSource = new CoursesRepositoryImpl(new CoursesCsvDatasource());
    const allCourses: Course[] = await coursesDataSource.getAll();
    const filtered: Course[] = [];

    const degreeFiltered = this.filterByDegree(allCourses, parseInt(this._model.degrees[0]));
    const semesterFiltered = this.filterBySemester(degreeFiltered, this._model.semesters[0]);

    filtered.push(...semesterFiltered);
    return filtered;
  }

  matchDegree(course: Course, degrees: number[]): boolean {
    for (const degree of degrees) {
      if (course.subject.degrees.includes(degree)) {
        return true;
      }
    }
    return false;
  }
  matchSemester(course: Course, semesters: number[]): boolean {
    for (const semester of semesters) {
      return course.subject.semestre.find((s) => s == semester) != undefined;
    }
    return false;
  }
  matchProfessor(course: Course, professors: string[]): boolean {
    for (const professor of professors) {
      if (course.professor.fullName == professor) {
        return true;
      }
    }
    return false;
  }
  matchSubjects(course: Course, subjects: string[]): boolean {
    for (const subject of subjects) {
      if (course.subject.name == subject) {
        return true;
      }
    }
    return false;
  }

  //intersection filters
  filterByModality(list: Course[], value: string): Course[] {
    return list.filter((course) => course.modality === value);
  }
  filterBySubjectAtributte(
    list: Course[],
    atributte: keyof Subject,
    value: string
  ): Course[] {
    return list.filter((course) => course.subject[atributte] == value);
  }
  filterByProfessor(list: Course[], value: string) {
    return list.filter((course) => course.professor.fullName == value);
  }
  filterBySubjects(list: Course[], value: number) {
    return list.filter((course) => {
      const degrees = course.subject.degrees;
      return degrees.includes(value);
    });
  }
  filterBySemester(list: Course[], value: number) {
    return list.filter((course) =>
      course.subject.semestre.find((s) => s == value) != undefined
    );
  }
  filterByDegree(list: Course[], value: number) {
    return list.filter((course) => course.subject.degrees.includes(value));
  }
}
