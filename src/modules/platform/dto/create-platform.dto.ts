import { PlatformEntity } from "../entities/platform.entity";

export type CreatePlatformDTO = Pick<PlatformEntity, "name" | "category">;

export type CreatePlatformResponseDTO = Pick<PlatformEntity, "uid" | "name" | "category">;
