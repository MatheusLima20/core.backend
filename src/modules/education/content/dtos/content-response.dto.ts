import { ContentProps } from "../entities/content.props";

export type ContentResponseDTO = Pick<
    ContentProps,
    | "uid"
    | "platformUID"
    | "title"
    | "description"
    | "isPreview"
    | "lessonUID"
    | "order"
    | "type"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;
