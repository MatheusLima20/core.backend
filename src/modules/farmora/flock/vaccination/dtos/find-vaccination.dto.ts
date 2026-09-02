import { VaccinationEntity } from "../entities/vaccination.entity";

export interface FindVaccinationsDTO {
    flockUID?: string;

    itemUID?: string;

    applicationDate?: Date;

    startDate?: Date;
    endDate?: Date;

    nextDoseDate?: Date;

    batch?: string;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<
        VaccinationEntity,
        "applicationDate" | "itemUID" | "batch" | "createdAt" | "updatedAt"
    >;

    order?: "asc" | "desc";
}
