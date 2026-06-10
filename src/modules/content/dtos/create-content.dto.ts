import { ContentProps } from "../entities/content.props";


export type CreateContentDTO = Pick<
    ContentProps,
    | "description"
    | "platformUID"
    | "value"
    | "amount"
    | "photo"
    | "type"
    | "userUID"
>;

export type CreateContentResponseDTO = Pick<
    ContentProps,
    "uid" | "description" | "type" | "value" | "updatedAt"
>;
