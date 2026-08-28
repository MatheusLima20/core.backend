import { ResponseFeedItemDTO } from "../dtos/response-feed.dto";
import { FeedItemEntity } from "../entities/feed-item.entity";

export const FeedItemMapper = {
    toResponseDTO: (feedItem: FeedItemEntity): ResponseFeedItemDTO => {
        return {
            uid: feedItem.uid,
            inventoryItemUID: feedItem.inventoryItemUID,
            inclusionPercentage: feedItem.inclusionPercentage,
        };
    },

    toResponseDTOList: (feedItems: FeedItemEntity[]): ResponseFeedItemDTO[] => {
        return feedItems.map(FeedItemMapper.toResponseDTO);
    },
};
