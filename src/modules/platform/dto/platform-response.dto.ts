import { PlatformEntity } from "../entities/platform.entities";

export type PlatformResponseDTO = Pick<
    PlatformEntity,
    "uid" | "name" | "isActivated" | "createdAt" | "updatedAt"
>;
