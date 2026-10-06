import { MortalityEntity } from "../entities/mortality.entity";

export type UpdateMortalityDTO = Pick<MortalityEntity, "uid"> &
    Partial<Pick<MortalityEntity, "flockUID" | "mortalityDate" | "quantity" | "cause" | "notes">>;

export type UpdateMortalityResponseDTO = Pick<
    MortalityEntity,
    | "uid"
    | "flockUID"
    | "mortalityDate"
    | "quantity"
    | "cause"
    | "notes"
    | "updatedBy"
    | "updatedAt"
>;
