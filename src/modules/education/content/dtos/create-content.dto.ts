import { ContentProps } from "../entities/content.props";

export type CreateContentDTO = Pick<
    ContentProps,
    "title" | "description" | "isPreview" | "lessonUID" | "order" | "type"
>;

export type CreateContentResponseDTO = Pick<
    ContentProps,
    | "uid"
    | "platformUID"
    | "title"
    | "isPreview"
    | "description"
    | "lessonUID"
    | "order"
    | "type"
    | "createdBy"
    | "createdAt"
    | "updatedAt"
>;
