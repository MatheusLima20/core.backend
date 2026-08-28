import { FeedEntity } from "../entities/feed.entity";
import { FeedItemEntity } from "../entities/feed-item.entity";

export type ResponseFeedItemDTO = Pick<
    FeedItemEntity,
    "uid" | "inventoryItemUID" | "inclusionPercentage"
>;

export type ResponseFeedDTO = Pick<
    FeedEntity,
    | "uid"
    | "platformUID"
    | "name"
    | "description"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
> & {
    items: ResponseFeedItemDTO[];
};
