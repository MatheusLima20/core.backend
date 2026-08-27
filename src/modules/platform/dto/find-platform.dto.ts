import { PlatformProps } from "../entities/platform.props";

export interface FindPlatformsDTO {
    name?: string;

    category?: string;

    isActivated?: boolean;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<PlatformProps, "name" | "category" | "createdAt" | "updatedAt">;

    order?: "asc" | "desc";
}
