import { MortalityProps } from "../entities/mortality.props";

export type CreateMortalityDTO = Pick<
    MortalityProps,
    "flockUID" | "mortalityDate" | "quantity" | "cause" | "notes"
> &
    Partial<Pick<MortalityProps, "createdAt">>;

export type CreateMortalityResponseDTO = Pick<
    MortalityProps,
    | "uid"
    | "platformUID"
    | "flockUID"
    | "mortalityDate"
    | "quantity"
    | "cause"
    | "notes"
    | "createdBy"
    | "createdAt"
>;
