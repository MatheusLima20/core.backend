import { VaccinationProps } from "../entities/vaccination.props";

export type UpdateVaccinationDTO = Pick<VaccinationProps, "uid"> &
    Partial<
        Pick<
            VaccinationProps,
            "flockUID" | "itemUID" | "applicationDate" | "dose" | "batch" | "nextDoseDate" | "notes"
        >
    >;

export type UpdateVaccinationResponseDTO = Pick<
    VaccinationProps,
    | "uid"
    | "flockUID"
    | "itemUID"
    | "applicationDate"
    | "dose"
    | "batch"
    | "nextDoseDate"
    | "notes"
    | "updatedBy"
    | "updatedAt"
>;
