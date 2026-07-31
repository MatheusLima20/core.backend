import { VaccinationProps } from "../entities/vaccination.props";

export interface FindVaccinationsDTO {
    flockUID?: string;

    vaccineName?: string;

    applicationDate?: Date;

    startDate?: Date;
    endDate?: Date;

    nextDoseDate?: Date;

    manufacturer?: string;

    batch?: string;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<
        VaccinationProps,
        "applicationDate" | "vaccineName" | "manufacturer" | "batch" | "createdAt" | "updatedAt"
    >;

    order?: "asc" | "desc";
}
