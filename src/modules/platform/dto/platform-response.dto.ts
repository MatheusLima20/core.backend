import { PlatformProps } from "../entities/platform.props";

export type PlatformResponseDTO = Pick<
    PlatformProps,
    "uid" | "name" | "isActivated" | "createdAt" | "updatedAt"
>;
