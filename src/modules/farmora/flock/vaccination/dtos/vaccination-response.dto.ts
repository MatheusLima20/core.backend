import { VaccinationEntity } from "../entities/vaccination.entity";

export type ResponseVaccinationDTO = Pick<
    VaccinationEntity,
    | "uid"
    | "platformUID"
    | "flockUID"
    | "itemUID"
    | "applicationDate"
    | "status"
    | "dose"
    | "batch"
    | "nextDoseDate"
    | "notes"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;
