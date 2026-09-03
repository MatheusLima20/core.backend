import { NutritionEntity } from "../entities/nutrition.entity";

export interface FindNutritionDTO {
    page?: number;
    limit?: number;

    name?: string;

    startWeek?: number;
    endWeek?: number;

    orderBy?: keyof Pick<
        NutritionEntity,
        | "name"
        | "createdAt"
        | "updatedAt"
        | "minimumCrudeProtein"
        | "maximumCrudeProtein"
        | "startWeek"
        | "endWeek"
    >;

    order?: "asc" | "desc";
}
