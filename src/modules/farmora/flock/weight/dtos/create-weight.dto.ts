import { WeightProps } from "../entities/weight.props";

export type CreateWeightDTO = Pick<
    WeightProps,
    "flockUID" | "weighingDate" | "averageWeight" | "sampleSize" | "notes"
> &
    Partial<Pick<WeightProps, "createdAt">>;

export type CreateWeightResponseDTO = Pick<
    WeightProps,
    | "uid"
    | "platformUID"
    | "flockUID"
    | "weighingDate"
    | "averageWeight"
    | "sampleSize"
    | "notes"
    | "createdBy"
    | "createdAt"
>;
