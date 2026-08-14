import { ResponseFeedItemDTO } from "../dtos/response-feed.dto";
import { FeedItemProps } from "../entities/feed-item.props";

export const FeedItemMapper = {
    toResponseDTO: (feedItem: FeedItemProps): ResponseFeedItemDTO => {
        return {
            uid: feedItem.uid,
            inventoryItemUID: feedItem.inventoryItemUID,
            inclusionPercentage: feedItem.inclusionPercentage,
        };
    },

    toResponseDTOList: (feedItems: FeedItemProps[]): ResponseFeedItemDTO[] => {
        return feedItems.map(FeedItemMapper.toResponseDTO);
    },
};
