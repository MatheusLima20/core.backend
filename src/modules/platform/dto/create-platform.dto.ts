import { PlatformProps } from "../entities/platform.props";

export type CreatePlatformDTO = Pick<
    PlatformProps,
    | "name" | "createdBy"
>;

export type CreatePlatformResponseDTO = Pick<
    PlatformProps,
    "uid" | "name"
>;
