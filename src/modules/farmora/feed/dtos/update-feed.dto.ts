import { FeedEntity } from "../entities/feed.entity";
import { ResponseFeedItemDTO } from "./response-feed.dto";

export type UpdateFeedItemDTO = {
    uid?: string;

    inventoryItemUID: string;

    inclusionPercentage: number;
};

export type UpdateFeedDTO = Pick<FeedEntity, "uid"> &
    Partial<Pick<FeedEntity, "name" | "description">> & {
        items?: UpdateFeedItemDTO[];
    };

export type UpdateFeedResponseDTO = Pick<
    FeedEntity,
    "uid" | "name" | "platformUID" | "description" | "updatedBy" | "updatedAt"
> & {
    items: ResponseFeedItemDTO[];
};
