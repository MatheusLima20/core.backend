import { CreateFeedResponseDTO } from "../dtos/create-feed.dto";
import { ResponseFeedDTO } from "../dtos/response-feed.dto";
import { UpdateFeedResponseDTO } from "../dtos/update-feed.dto";
import { FeedProps } from "../entities/feed.props";
import { FeedItemProps } from "../entities/feed-item.props";
import { FeedItemMapper } from "./feed-item.mapper";

export const FeedMapper = {
    toResponseDTO: (feed: FeedProps, items: FeedItemProps[]): ResponseFeedDTO => {
        return {
            uid: feed.uid,
            platformUID: feed.platformUID,

            name: feed.name,
            description: feed.description,

            items: FeedItemMapper.toResponseDTOList(items),

            createdBy: feed.createdBy,
            updatedBy: feed.updatedBy,

            createdAt: feed.createdAt,
            updatedAt: feed.updatedAt,
        };
    },

    toResponseDTOList: (
        feeds: {
            feed: FeedProps;
            items: FeedItemProps[];
        }[]
    ): ResponseFeedDTO[] => {
        return feeds.map(({ feed, items }) => FeedMapper.toResponseDTO(feed, items));
    },

    toCreateResponseDTO: (feed: FeedProps, items: FeedItemProps[]): CreateFeedResponseDTO => {
        return {
            uid: feed.uid,
            platformUID: feed.platformUID,

            name: feed.name,
            description: feed.description,

            items: FeedItemMapper.toResponseDTOList(items),

            createdBy: feed.createdBy,
            createdAt: feed.createdAt,
        };
    },

    toUpdatedResponseDTO: (feed: FeedProps, items: FeedItemProps[]): UpdateFeedResponseDTO => {
        return {
            uid: feed.uid,

            platformUID: feed.platformUID,

            name: feed.name,
            description: feed.description,

            items: FeedItemMapper.toResponseDTOList(items),

            updatedBy: feed.updatedBy,
            updatedAt: feed.updatedAt,
        };
    },
};
