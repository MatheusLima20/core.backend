import { VaccinationProps } from "../entities/vaccination.props";

export type CreateVaccinationDTO = Pick<
    VaccinationProps,
    "flockUID" | "itemUID" | "applicationDate" | "dose" | "batch" | "nextDoseDate" | "notes"
> &
    Partial<Pick<VaccinationProps, "createdAt">>;

export type CreateVaccinationResponseDTO = Pick<
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
    | "createdAt"
>;
