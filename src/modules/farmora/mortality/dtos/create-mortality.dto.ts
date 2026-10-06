import { MortalityEntity } from "../entities/mortality.entity";

export type CreateMortalityDTO = Pick<
    MortalityEntity,
    "flockUID" | "mortalityDate" | "quantity" | "cause" | "notes"
> &
    Partial<Pick<MortalityEntity, "createdAt">>;

export type CreateMortalityResponseDTO = Pick<
    MortalityEntity,
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
