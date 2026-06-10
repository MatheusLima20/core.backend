import { ContentProps } from "../entities/content.props";

export type ContentResponseDTO = Pick<
    ContentProps,
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
