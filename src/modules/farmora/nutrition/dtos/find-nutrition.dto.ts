import { NutritionProps } from "../entities/nutrition.props";

export interface FindNutritionDTO {
    page?: number;
    limit?: number;

    name?: string;

    startWeek?: number;
    endWeek?: number;

    orderBy?: keyof Pick<
        NutritionProps,
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
