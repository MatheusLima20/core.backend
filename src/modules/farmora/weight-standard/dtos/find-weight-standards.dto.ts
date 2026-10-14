import { WeightStandardEntity } from "../entities/weight-standard.entity";

export interface FindWeightStandardsDTO {
    breedUID?: string;

    week?: number;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<
        WeightStandardEntity,
        "breedUID" | "week" | "minWeight" | "targetWeight" | "maxWeight" | "createdAt" | "updatedAt"
    >;

    order?: "asc" | "desc";
}
