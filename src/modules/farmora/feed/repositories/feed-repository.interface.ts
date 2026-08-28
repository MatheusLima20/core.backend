import { Result } from "@/shared/result";

import { FindFeedsDTO } from "../dtos/find-feeds.dto";
import { FeedEntity } from "../entities/feed.entity";
import { FeedItemEntity } from "../entities/feed-item.entity";

export interface IFeedRepository {
    findByUID(
        platformUID: string,
        uid: string
    ): Promise<Result<{ feed: FeedEntity; items: FeedItemEntity[] } | null>>;

    find(
        platformUID: string,
        filters?: FindFeedsDTO
    ): Promise<Result<{ feed: FeedEntity; items: FeedItemEntity[] }[]>>;

    register(
        feed: FeedEntity,
        items: FeedItemEntity[]
    ): Promise<
        Result<{
            feed: FeedEntity;
            items: FeedItemEntity[];
        }>
    >;

    update(
        feed: FeedEntity,
        items: FeedItemEntity[]
    ): Promise<
        Result<{
            feed: FeedEntity;
            items: FeedItemEntity[];
        }>
    >;

    delete(uid: string): Promise<Result<void>>;
}
