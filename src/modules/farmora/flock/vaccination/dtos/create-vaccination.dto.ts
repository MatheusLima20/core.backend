import { VaccinationProps } from "../entities/vaccination.props";

export type CreateVaccinationDTO = Pick<
    VaccinationProps,
    | "flockUID"
    | "vaccineName"
    | "applicationDate"
    | "dose"
    | "manufacturer"
    | "batch"
    | "nextDoseDate"
    | "notes"
> &
    Partial<Pick<VaccinationProps, "createdAt">>;

export type CreateVaccinationResponseDTO = Pick<
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
    | "createdAt"
>;
