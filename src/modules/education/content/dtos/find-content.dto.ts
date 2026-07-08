import { ContentProps } from "../entities/content.props";
import { ContentType } from "../enums/content-type.enum";

export interface FindContentsDTO {
    title?: string;
    description?: string;
    type?: ContentType;
    createdAt?: Date;
    updatedAt?: Date;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<
        ContentProps,
        "title" | "description" | "type" | "order" | "createdAt" | "updatedAt"
    >;

    order?: "asc" | "desc";
}
