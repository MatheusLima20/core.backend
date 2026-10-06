import { WeightEntity } from "../entities/weight.entity";

export interface FindWeightsDTO {
    flockUID?: string;

    weighingDate?: Date;

    startDate?: Date;
    endDate?: Date;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<
        WeightEntity,
        "weighingDate" | "averageWeight" | "createdAt" | "updatedAt"
    >;

    order?: "asc" | "desc";
}
