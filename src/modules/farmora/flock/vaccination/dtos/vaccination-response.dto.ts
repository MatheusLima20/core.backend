import { VaccinationProps } from "../entities/vaccination.props";

export type ResponseVaccinationDTO = Pick<
    VaccinationProps,
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
