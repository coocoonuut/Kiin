import { ProfessorsDataSource } from "@/domain/datasources/ProfessorsDataSource";
import { Professor } from "@/domain/entities/Professor";
import { Mapper } from "../mappers/Mapper";

export class ProfessorsCsvDataSource implements ProfessorsDataSource {
  private professors: Professor[] = [];

  async getAll(): Promise<Professor[]> {
    if (this.professors.length > 0) {
      return this.professors;
    }

    const storedData = localStorage.getItem("professor-info");

    if (storedData) {
      console.log("Profesores recuperados de local storage");
      const convertedDegrees = Mapper.toProfessors(JSON.parse(storedData));
      const professors = convertedDegrees as Professor[];

      this.professors = professors;
    } else {
      console.log("Profesores recuperados de la API");
      const response = await fetch("/api/professors/all");

      const convertedDegrees = Mapper.toProfessors(await response.json());
      const professors = convertedDegrees as Professor[];

      this.professors = professors;

      localStorage.setItem("professor-info", JSON.stringify(this.professors));
    }

    return this.professors;

  }
}
