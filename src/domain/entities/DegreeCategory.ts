import Category from "@/domain/entities/Category";
// import CategoryFilter from "@/domain/entities/CategoryFilter";
import CourseFilter from "@/domain/entities/CourseFilter";
import { Degree } from "@/domain/entities/Degree";
import DegreeFilter from "@/domain/entities/DegreeFilter";

export default class DegreeCategory implements Category {
    title: string;
    values: {label: string, id: number, value: Degree}[];
    private _selectedValues: Degree[] = [];

    constructor(title: string, values: Degree[]) {
        this.title = title;
        this.values = values.map(degree => ({label: degree.name, id: degree.id, value: degree}));
    }
    
    filterWithCategories(categories: Category[]): void {
        // NOT IMPLEMENTED
        console.log(categories);
    }

    onClick(id: number): void {
        const selectedDegreeIndex = this._selectedValues.findIndex(degree => degree.id === id);
        if (selectedDegreeIndex === -1) {
            const newSelectedDegree = this.values.find(degree => degree.id === id);
            if (!newSelectedDegree) return

            this._selectedValues.push(newSelectedDegree.value);
            return;
        }
        this._selectedValues.splice(selectedDegreeIndex, 1);
    }

    get selectedValues(): Degree[] {
        return this._selectedValues;
    }

    toCourseFilter(): CourseFilter {
        return new DegreeFilter(this._selectedValues);
    }

}