import { ContentProps } from "../entities/content.props";

export type UpdateContentDTO = Pick<
    ContentProps,
    "uid" | "description" | "value" | "amount"
>;

export type UpdateContentResponseDTO = Pick<
    ContentProps,
    "uid" | "description" | "photo" | "amount" | "value" | "updatedAt"
>;
