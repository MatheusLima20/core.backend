import { PlatformProps } from "../entities/platform.props";

export type PlatformResponseDTO = Pick<
    PlatformProps,
    | "uid"
    | "name"
    | "isActivated"
    | "createdBy"
    | "slug"
    | "category"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;
