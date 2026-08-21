import { PlatformProps } from "../entities/platform.props";

export type UpdatePlatformDTO = Pick<PlatformProps, "uid" | "updatedBy"> &
    Partial<Pick<PlatformProps, "slug" | "category" | "isActivated" | "name">>;

export type UpdatePlatformResponseDTO = Pick<
    PlatformProps,
    "uid" | "name" | "slug" | "category" | "isActivated" | "updatedBy" | "updatedAt"
>;
