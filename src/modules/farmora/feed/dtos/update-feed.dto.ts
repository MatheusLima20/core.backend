import { FeedProps } from "../entities/feed.props";
import { ResponseFeedItemDTO } from "./response-feed.dto";

export type UpdateFeedItemDTO = {
    uid?: string;

    inventoryItemUID: string;

    inclusionPercentage: number;
};

export type UpdateFeedDTO = Pick<FeedProps, "uid"> &
    Partial<Pick<FeedProps, "name" | "description">> & {
        items?: UpdateFeedItemDTO[];
    };

export type UpdateFeedResponseDTO = Pick<
    FeedProps,
    "uid" | "name" | "platformUID" | "description" | "updatedBy" | "updatedAt"
> & {
    items: ResponseFeedItemDTO[];
};
