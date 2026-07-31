import { MortalityProps } from "../entities/mortality.props";

export type UpdateMortalityDTO = Pick<MortalityProps, "uid"> &
    Partial<Pick<MortalityProps, "flockUID" | "mortalityDate" | "quantity" | "cause" | "notes">>;

export type UpdateMortalityResponseDTO = Pick<
    MortalityProps,
    | "uid"
    | "flockUID"
    | "mortalityDate"
    | "quantity"
    | "cause"
    | "notes"
    | "updatedBy"
    | "updatedAt"
>;
