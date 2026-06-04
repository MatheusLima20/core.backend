import { PlatformEntity } from "../entities/platform.entities";

export type CreatePlatformDTO = Pick<
    PlatformEntity,
    | "name"
>;

export type CreatePlatformResponseDTO = Pick<
    PlatformEntity,
    "uid" | "name"
>;
