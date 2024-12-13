import { NextApiRequest, NextApiResponse } from "next";
import { CoursesModelDao } from "../data/CoursesModelDAO";
import { CourseCSV } from "@/infrastructure/models/CourseModel";
import { Subject } from "@/domain/entities/Subject";
import { Degrees } from "../degrees/all";
import { globalInitialLoad } from "../data/initialLoad";

export class Subjects {

    private static _subjects: Subject[] = [];

    public static get subjects(): Subject[] {
        return Subjects._subjects;
    }
    public static set subjects(value: Subject[]) {
        Subjects._subjects = value;
    }

    public static async initialLoad() {


        const results = await CoursesModelDao.getCourses();
        let count = 0;

        for (const result of results) {
            if (this.findSubject(result) === undefined) {
                count++;
                const semesters = result.Semestre.split(",").map((semester) => parseInt(semester));
                this.subjects.push(new Subject(count, result.Asignatura, result.PE, result.Modelo, result.Tipo, semesters));

                const degreesString = result.PE.split("-");

                degreesString.forEach((degreeString) => {
                    const degree = Degrees.findDegree(degreeString.trim());
                    if (degree) {
                        degree.addSubject(this.subjects[count - 1]);
                        this.subjects[count - 1].addDegree(degree.id);
                    }
                })
            }
        }
    }

    public static findSubject(result: CourseCSV): Subject | undefined {
        return this.subjects.find(
            (subject) =>
                subject.name === result.Asignatura &&
                subject.degreeResume === result.PE
        )
    }

    public static async getAll() {

        if (this._subjects.length === 0) {
            await globalInitialLoad();
        }

        return this._subjects;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

    const subjects = await Subjects.getAll();
    return res.status(200).json(subjects);
}


