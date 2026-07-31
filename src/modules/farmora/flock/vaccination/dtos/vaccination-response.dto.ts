import { VaccinationProps } from "../entities/vaccination.props";

export type ResponseVaccinationDTO = Pick<
    VaccinationProps,
    | "uid"
    | "platformUID"
    | "flockUID"
    | "vaccineName"
    | "applicationDate"
    | "dose"
    | "manufacturer"
    | "batch"
    | "nextDoseDate"
    | "notes"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;
