import { PlatformEntity } from "../entities/platform.entity";

export type UpdatePlatformDTO = Pick<PlatformEntity, "uid"> &
    Partial<Pick<PlatformEntity, "slug" | "category" | "isActivated" | "name">>;

export type UpdatePlatformResponseDTO = Pick<
    PlatformEntity,
    "uid" | "name" | "slug" | "category" | "isActivated" | "updatedBy" | "updatedAt"
>;
