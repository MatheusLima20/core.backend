import { VaccinationEntity } from "../entities/vaccination.entity";

export type UpdateVaccinationDTO = Pick<VaccinationEntity, "uid"> &
    Partial<
        Pick<
            VaccinationEntity,
            | "flockUID"
            | "itemUID"
            | "applicationDate"
            | "status"
            | "dose"
            | "batch"
            | "nextDoseDate"
            | "notes"
        >
    >;

export type UpdateVaccinationResponseDTO = Pick<
    VaccinationEntity,
    | "uid"
    | "flockUID"
    | "itemUID"
    | "applicationDate"
    | "status"
    | "dose"
    | "batch"
    | "nextDoseDate"
    | "notes"
    | "updatedBy"
    | "updatedAt"
>;
