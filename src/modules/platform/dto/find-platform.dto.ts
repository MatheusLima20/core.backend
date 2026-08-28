import { PlatformEntity } from "../entities/platform.entity";

export interface FindPlatformsDTO {
    name?: string;

    category?: string;

    isActivated?: boolean;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<PlatformEntity, "name" | "category" | "createdAt" | "updatedAt">;

    order?: "asc" | "desc";
}
