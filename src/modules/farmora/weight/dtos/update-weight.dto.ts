import { WeightEntity } from "../entities/weight.entity";

export type UpdateWeightDTO = Pick<WeightEntity, "uid"> &
    Partial<
        Pick<WeightEntity, "flockUID" | "weighingDate" | "averageWeight" | "sampleSize" | "notes">
    >;

export type UpdateWeightResponseDTO = Pick<
    WeightEntity,
    | "uid"
    | "flockUID"
    | "weighingDate"
    | "averageWeight"
    | "sampleSize"
    | "notes"
    | "updatedBy"
    | "updatedAt"
>;
