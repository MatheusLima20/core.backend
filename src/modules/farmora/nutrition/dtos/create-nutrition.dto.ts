import { NutritionEntity } from "../entities/nutrition.entity";

export type CreateNutritionDTO = Pick<
    NutritionEntity,
    "minimumCrudeProtein" | "maximumCrudeProtein" | "startWeek" | "endWeek"
> &
    Partial<Pick<NutritionEntity, "createdAt">>;

export type CreateNutritionResponseDTO = Pick<
    NutritionEntity,
    "uid" | "minimumCrudeProtein" | "maximumCrudeProtein" | "startWeek" | "endWeek" | "createdAt"
>;
