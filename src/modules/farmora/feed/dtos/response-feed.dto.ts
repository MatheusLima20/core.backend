import { FeedProps } from "../entities/feed.props";
import { FeedItemProps } from "../entities/feed-item.props";

export type ResponseFeedItemDTO = Pick<
    FeedItemProps,
    "uid" | "inventoryItemUID" | "inclusionPercentage"
>;

export type ResponseFeedDTO = Pick<
    FeedProps,
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
