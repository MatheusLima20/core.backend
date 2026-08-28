import { FeedEntity } from "../entities/feed.entity";

export interface FindFeedsDTO {
    name?: string;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<FeedEntity, "name" | "createdAt" | "updatedAt">;

    order?: "asc" | "desc";
}
