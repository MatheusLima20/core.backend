import { FeedProps } from "../entities/feed.props";
import { FeedItemProps } from "../entities/feed-item.props";
import { ResponseFeedItemDTO } from "./response-feed.dto";

export type CreateFeedItemDTO = Pick<FeedItemProps, "inventoryItemUID" | "inclusionPercentage">;

export type CreateFeedDTO = Pick<FeedProps, "name" | "description"> & {
    items: CreateFeedItemDTO[];
} & Partial<Pick<FeedProps, "createdAt">>;

export type CreateFeedResponseDTO = Pick<
    FeedProps,
    "uid" | "platformUID" | "name" | "description" | "createdBy" | "createdAt"
> & {
    items: ResponseFeedItemDTO[];
};
