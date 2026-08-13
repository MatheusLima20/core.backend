import { NutritionProps } from "../entities/nutrition.props";

export type UpdateNutritionDTO = Pick<NutritionProps, "uid"> &
    Partial<
        Pick<
            NutritionProps,
            "minimumCrudeProtein" | "maximumCrudeProtein" | "startWeek" | "endWeek"
        >
    >;

export type UpdateNutritionResponseDTO = Pick<
    NutritionProps,
    "uid" | "minimumCrudeProtein" | "maximumCrudeProtein" | "startWeek" | "endWeek" | "updatedAt"
>;
