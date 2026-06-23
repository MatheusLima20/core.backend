import { PlatformProps } from "../entities/platform.props";

export type UpdatePlatformDTO = Pick<PlatformProps, "uid" | "isActivated" | "name" | "updatedBy">;

export type UpdatePlatformResponseDTO = Pick<
    PlatformProps,
    "uid" | "name" | "createdBy" | "updatedAt"
>;
