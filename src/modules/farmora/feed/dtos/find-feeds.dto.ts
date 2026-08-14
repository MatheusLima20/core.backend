import { FeedProps } from "../entities/feed.props";

export interface FindFeedsDTO {
    name?: string;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<FeedProps, "name" | "createdAt" | "updatedAt">;

    order?: "asc" | "desc";
}
