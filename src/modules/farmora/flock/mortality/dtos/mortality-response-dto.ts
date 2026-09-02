import { MortalityEntity } from "../entities/mortality.entity";

export type ResponseMortalityDTO = Pick<
    MortalityEntity,
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
