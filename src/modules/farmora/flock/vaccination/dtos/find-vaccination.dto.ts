import { VaccinationProps } from "../entities/vaccination.props";

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
        VaccinationProps,
        "applicationDate" | "itemUID" | "batch" | "createdAt" | "updatedAt"
    >;

    order?: "asc" | "desc";
}
