import { VaccinationEntity } from "../entities/vaccination.entity";

export type CreateVaccinationDTO = Pick<
    VaccinationEntity,
    "flockUID" | "itemUID" | "applicationDate" | "dose" | "batch" | "nextDoseDate" | "notes"
> &
    Partial<Pick<VaccinationEntity, "createdAt">>;

export type CreateVaccinationResponseDTO = Pick<
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
    | "createdAt"
>;
