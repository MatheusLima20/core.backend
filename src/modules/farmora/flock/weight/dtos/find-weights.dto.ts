import { WeightProps } from "../entities/weight.props";

export interface FindWeightsDTO {
    flockUID?: string;

    weighingDate?: Date;

    startDate?: Date;
    endDate?: Date;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<WeightProps, "weighingDate" | "averageWeight" | "createdAt" | "updatedAt">;

    order?: "asc" | "desc";
}
