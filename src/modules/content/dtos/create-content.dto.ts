import { ContentEntity } from "../entities/content.entity";

export type CreateContentDTO = Pick<
    ContentEntity,
    "type" | "url" | "alt" | "name" | "mimeType" | "size"
>;

export type CreateContentResponseDTO = Pick<
    ContentEntity,
    "uid" | "type" | "url" | "alt" | "name" | "mimeType" | "size" | "createdAt" | "createdBy"
>;
