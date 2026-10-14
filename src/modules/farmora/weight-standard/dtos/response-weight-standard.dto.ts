import { WeightStandardEntity } from "../entities/weight-standard.entity";

export type ResponseWeightStandardDTO = Pick<
    WeightStandardEntity,
    | "uid"
    | "breedUID"
    | "week"
    | "minWeight"
    | "targetWeight"
    | "maxWeight"
    | "createdAt"
    | "updatedAt"
>;
