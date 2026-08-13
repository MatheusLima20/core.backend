import { NutritionProps } from "../entities/nutrition.props";

export type CreateNutritionDTO = Pick<
    NutritionProps,
    "minimumCrudeProtein" | "maximumCrudeProtein" | "startWeek" | "endWeek"
> &
    Partial<Pick<NutritionProps, "createdAt">>;

export type CreateNutritionResponseDTO = Pick<
    NutritionProps,
    "uid" | "minimumCrudeProtein" | "maximumCrudeProtein" | "startWeek" | "endWeek" | "createdAt"
>;
