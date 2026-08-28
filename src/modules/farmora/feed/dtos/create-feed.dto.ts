import { FeedEntity } from "../entities/feed.entity";
import { FeedItemEntity } from "../entities/feed-item.entity";
import { ResponseFeedItemDTO } from "./response-feed.dto";

export type CreateFeedItemDTO = Pick<FeedItemEntity, "inventoryItemUID" | "inclusionPercentage">;

export type CreateFeedDTO = Pick<FeedEntity, "name" | "description"> & {
    items: CreateFeedItemDTO[];
} & Partial<Pick<FeedEntity, "createdAt">>;

export type CreateFeedResponseDTO = Pick<
    FeedEntity,
    "uid" | "platformUID" | "name" | "description" | "createdBy" | "createdAt"
> & {
    items: ResponseFeedItemDTO[];
};
