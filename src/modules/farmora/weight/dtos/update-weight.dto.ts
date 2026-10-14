import { WeightEntity } from "../entities/weight.entity";

export type UpdateWeightDTO = Pick<WeightEntity, "uid"> &
    Partial<
        Pick<
            WeightEntity,
            "flockUID" | "breedUID" | "weighingDate" | "averageWeight" | "sampleSize" | "notes"
        >
    >;

export type UpdateWeightResponseDTO = Pick<
    WeightEntity,
    | "uid"
    | "flockUID"
    | "breedUID"
    | "weighingDate"
    | "averageWeight"
    | "sampleSize"
    | "notes"
    | "updatedBy"
    | "updatedAt"
>;
