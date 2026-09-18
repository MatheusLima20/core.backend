import { ContentEntity } from "../entities/content.entity";

export type UpdateContentDTO = Partial<
    Pick<ContentEntity, "type" | "url" | "alt" | "name" | "mimeType" | "size">
> &
    Pick<ContentEntity, "uid">;

export type UpdateContentResponseDTO = Pick<
    ContentEntity,
    "uid" | "type" | "url" | "alt" | "name" | "mimeType" | "size" | "updatedAt" | "updatedBy"
>;
