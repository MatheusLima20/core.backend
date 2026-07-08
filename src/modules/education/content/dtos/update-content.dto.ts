import { ContentProps } from "../entities/content.props";

export type UpdateContentDTO = Pick<
    ContentProps,
    "uid" | "title" | "description" | "order" | "isPreview" | "type" | "lessonUID"
>;

export type UpdateContentResponseDTO = Pick<
    ContentProps,
    | "uid"
    | "platformUID"
    | "title"
    | "description"
    | "order"
    | "lessonUID"
    | "type"
    | "isPreview"
    | "updatedBy"
    | "updatedAt"
>;
