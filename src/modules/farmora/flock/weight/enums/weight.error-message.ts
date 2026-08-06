import { WeightErrorCode } from "./weight.error-code.enum";

export const WeightErrorMessage: Record<WeightErrorCode, string> = {
    [WeightErrorCode.INVALID_AVERAGE_WEIGHT]: "Average weight must be greater than zero.",

    [WeightErrorCode.INVALID_SAMPLE_SIZE]: "Sample size must be greater than zero.",
};
