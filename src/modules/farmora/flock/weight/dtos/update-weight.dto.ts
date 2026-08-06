import { WeightProps } from "../entities/weight.props";

export type UpdateWeightDTO = Pick<WeightProps, "uid"> &
    Partial<
        Pick<WeightProps, "flockUID" | "weighingDate" | "averageWeight" | "sampleSize" | "notes">
    >;

export type UpdateWeightResponseDTO = Pick<
    WeightProps,
    | "uid"
    | "flockUID"
    | "weighingDate"
    | "averageWeight"
    | "sampleSize"
    | "notes"
    | "updatedBy"
    | "updatedAt"
>;
