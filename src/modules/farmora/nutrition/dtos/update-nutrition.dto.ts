import { NutritionEntity } from "../entities/nutrition.entity";

export type UpdateNutritionDTO = Pick<NutritionEntity, "uid"> &
    Partial<
        Pick<
            NutritionEntity,
            "minimumCrudeProtein" | "maximumCrudeProtein" | "startWeek" | "endWeek"
        >
    >;

export type UpdateNutritionResponseDTO = Pick<
    NutritionEntity,
    "uid" | "minimumCrudeProtein" | "maximumCrudeProtein" | "startWeek" | "endWeek" | "updatedAt"
>;
