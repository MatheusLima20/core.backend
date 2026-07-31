import { MortalityProps } from "../entities/mortality.props";

export type ResponseMortalityDTO = Pick<
    MortalityProps,
    | "uid"
    | "platformUID"
    | "flockUID"
    | "mortalityDate"
    | "quantity"
    | "cause"
    | "notes"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;
