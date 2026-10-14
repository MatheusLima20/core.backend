import { WeightEntity } from "../entities/weight.entity";

export type ResponseWeightDTO = Pick<
    WeightEntity,
    | "uid"
    | "platformUID"
    | "flockUID"
    | "breedUID"
    | "weighingDate"
    | "averageWeight"
    | "sampleSize"
    | "notes"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;
