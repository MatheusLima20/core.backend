import { VaccinationEntity } from "../entities/vaccination.entity";

export type ResponseVaccinationDTO = Pick<
    VaccinationEntity,
    | "uid"
    | "platformUID"
    | "flockUID"
    | "itemUID"
    | "applicationDate"
    | "dose"
    | "batch"
    | "nextDoseDate"
    | "notes"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;
