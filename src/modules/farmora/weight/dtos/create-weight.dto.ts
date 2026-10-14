import { WeightEntity } from "../entities/weight.entity";

export type CreateWeightDTO = Pick<
    WeightEntity,
    "flockUID" | "breedUID" | "weighingDate" | "averageWeight" | "sampleSize" | "notes"
> &
    Partial<Pick<WeightEntity, "createdAt">>;

export type CreateWeightResponseDTO = Pick<
    WeightEntity,
    | "uid"
    | "platformUID"
    | "breedUID"
    | "flockUID"
    | "weighingDate"
    | "averageWeight"
    | "sampleSize"
    | "notes"
    | "createdBy"
    | "createdAt"
>;
