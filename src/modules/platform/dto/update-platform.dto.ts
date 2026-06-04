import { PlatformEntity } from "../entities/platform.entities";

export type UpdatePlatformDTO = Pick<PlatformEntity, "uid" | "name">;

export type UpdatePlatformResponseDTO = Pick<
    PlatformEntity,
    "uid" | "name" | "updatedAt"
>;
