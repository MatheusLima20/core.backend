import { WeightProps } from "../entities/weight.props";

export type ResponseWeightDTO = Pick<
    WeightProps,
    | "uid"
    | "platformUID"
    | "flockUID"
    | "weighingDate"
    | "averageWeight"
    | "sampleSize"
    | "notes"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;
