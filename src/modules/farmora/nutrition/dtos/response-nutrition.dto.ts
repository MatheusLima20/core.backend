import { NutritionProps } from "../entities/nutrition.props";

export type ResponseNutritionDTO = Pick<
    NutritionProps,
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
