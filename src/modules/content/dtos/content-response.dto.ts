import { ContentEntity } from "../entities/content.entity";

export type ContentResponseDTO = Pick<
    ContentEntity,
    | "uid"
    | "description"
    | "platformUID"
    | "type"
    | "userUID"
    | "value"
    | "amount"
    | "photo"
    | "createdAt"
    | "updatedAt"
>;
