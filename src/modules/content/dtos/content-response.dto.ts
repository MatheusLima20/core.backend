import { ContentEntity } from "../entities/content.entity";

export type ContentResponseDTO = Pick<
    ContentEntity,
    | "uid"
    | "platformUID"
    | "type"
    | "url"
    | "alt"
    | "name"
    | "mimeType"
    | "size"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;
