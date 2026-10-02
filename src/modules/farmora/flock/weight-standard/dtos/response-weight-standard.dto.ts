import { WeightStandardEntity } from "../entities/weight-standard.entity";

export type ResponseWeightStandardDTO = Pick<
    WeightStandardEntity,
    | "uid"
    | "breed"
    | "week"
    | "minWeight"
    | "targetWeight"
    | "maxWeight"
    | "createdAt"
    | "updatedAt"
>;
