import { NutritionEntity } from "../entities/nutrition.entity";

export type ResponseNutritionDTO = Pick<
    NutritionEntity,
    | "uid"
    | "name"
    | "minimumCrudeProtein"
    | "maximumCrudeProtein"
    | "startWeek"
    | "endWeek"
    | "calcium"
    | "crudeFiber"
    | "lysine"
    | "metabolizableEnergy"
    | "methionine"
    | "phosphorus"
    | "sodium"
    | "createdAt"
    | "updatedAt"
>;
