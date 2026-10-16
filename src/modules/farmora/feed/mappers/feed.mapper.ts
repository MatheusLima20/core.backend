import { CreateFeedResponseDTO } from "../dtos/create-feed.dto";
import { ResponseFeedDTO } from "../dtos/response-feed.dto";
import { UpdateFeedResponseDTO } from "../dtos/update-feed.dto";
import { FeedEntity } from "../entities/feed.entity";
import { FeedItemEntity } from "../entities/feed-item.entity";
import { FeedItemMapper } from "./feed-item.mapper";

export const FeedMapper = {
    toResponseDTO(
        feed: FeedEntity,
        items: FeedItemEntity[],
        flockName: string,
        itemNames: Map<string, string>
    ): ResponseFeedDTO {
        return {
            uid: feed.uid,
            platformUID: feed.platformUID,

            flockUID: feed.flockUID,
            flockName,

            name: feed.name,
            description: feed.description,

            items: FeedItemMapper.toResponseDTOList(items, itemNames),

            createdBy: feed.createdBy,
            updatedBy: feed.updatedBy,

            createdAt: feed.createdAt,
            updatedAt: feed.updatedAt,
        };
    },

    toResponseDTOList: (
        feeds: {
            feed: FeedEntity;
            items: FeedItemEntity[];
        }[],
        flockNames: Map<string, string>,
        itemNames: Map<string, string>
    ): ResponseFeedDTO[] => {
        return feeds.map(({ feed, items }) => {
            const flockName = flockNames.get(feed.flockUID);

            if (!flockName) {
                throw new Error(`Flock name not found for UID: ${feed.flockUID}`);
            }

            return FeedMapper.toResponseDTO(feed, items, flockName, itemNames);
        });
    },

    toCreateResponseDTO: (feed: FeedEntity, items: FeedItemEntity[]): CreateFeedResponseDTO => {
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

    toUpdatedResponseDTO: (feed: FeedEntity, items: FeedItemEntity[]): UpdateFeedResponseDTO => {
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
