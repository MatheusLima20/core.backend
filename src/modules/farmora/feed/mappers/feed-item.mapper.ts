import { ResponseFeedItemDTO } from "../dtos/response-feed.dto";
import { FeedItemEntity } from "../entities/feed-item.entity";

export const FeedItemMapper = {
    toResponseDTO: (feedItem: FeedItemEntity, itemName?: string): ResponseFeedItemDTO => {
        return {
            uid: feedItem.uid,
            inventoryItemUID: feedItem.inventoryItemUID,
            itemName,
            inclusionPercentage: Number(feedItem.inclusionPercentage),
        };
    },

    toResponseDTOList: (
        feedItems: FeedItemEntity[],
        itemNames?: Map<string, string>
    ): ResponseFeedItemDTO[] => {
        return feedItems.map((feedItem) =>
            FeedItemMapper.toResponseDTO(feedItem, itemNames?.get(feedItem.inventoryItemUID))
        );
    },
};
