import { ContentEntity } from "../entities/content.entity";

export type CreateContentDTO = Pick<
    ContentEntity,
    | "description"
    | "platformUID"
    | "value"
    | "amount"
    | "photo"
    | "type"
    | "userUID"
>;

export type CreateContentResponseDTO = Pick<
    ContentEntity,
    "uid" | "description" | "type" | "value" | "updatedAt"
>;
