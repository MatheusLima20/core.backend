import { PlatformEntity } from "../entities/platform.entity";

export type PlatformResponseDTO = Pick<
    PlatformEntity,
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
