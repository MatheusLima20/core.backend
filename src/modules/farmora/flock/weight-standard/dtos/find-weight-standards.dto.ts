import { WeightStandardEntity } from "../entities/weight-standard.entity";

export interface FindWeightStandardsDTO {
    breed?: string;

    week?: number;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<
        WeightStandardEntity,
        "breed" | "week" | "minWeight" | "targetWeight" | "maxWeight" | "createdAt" | "updatedAt"
    >;

    order?: "asc" | "desc";
}
