import { VaccinationProps } from "../entities/vaccination.props";

export type UpdateVaccinationDTO = Pick<VaccinationProps, "uid"> &
    Partial<
        Pick<
            VaccinationProps,
            | "flockUID"
            | "vaccineName"
            | "applicationDate"
            | "dose"
            | "manufacturer"
            | "batch"
            | "nextDoseDate"
            | "notes"
        >
    >;

export type UpdateVaccinationResponseDTO = Pick<
    VaccinationProps,
    | "uid"
    | "flockUID"
    | "vaccineName"
    | "applicationDate"
    | "dose"
    | "manufacturer"
    | "batch"
    | "nextDoseDate"
    | "notes"
    | "updatedBy"
    | "updatedAt"
>;
