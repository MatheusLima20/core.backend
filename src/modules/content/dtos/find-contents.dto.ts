import { ContentEntity } from "../entities/content.entity";

export interface FindContentsDTO {
    type?: ContentEntity["type"];

    name?: string;

    mimeType?: string;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<ContentEntity, "name" | "type" | "createdAt">;

    order?: "asc" | "desc";
}
