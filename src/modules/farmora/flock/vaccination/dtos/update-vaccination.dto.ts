import { VaccinationEntity } from "../entities/vaccination.entity";

export type UpdateVaccinationDTO = Pick<VaccinationEntity, "uid"> &
    Partial<
        Pick<
            VaccinationEntity,
            "flockUID" | "itemUID" | "applicationDate" | "dose" | "batch" | "nextDoseDate" | "notes"
        >
    >;

export type UpdateVaccinationResponseDTO = Pick<
    VaccinationEntity,
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
