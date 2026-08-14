import { Result } from "@/shared/result";

import { FindFeedsDTO } from "../dtos/find-feeds.dto";
import { FeedProps } from "../entities/feed.props";
import { FeedItemProps } from "../entities/feed-item.props";

export interface IFeedRepository {
    findByUID(
        platformUID: string,
        uid: string
    ): Promise<Result<{ feed: FeedProps; items: FeedItemProps[] } | null>>;

    find(
        platformUID: string,
        filters?: FindFeedsDTO
    ): Promise<Result<{ feed: FeedProps; items: FeedItemProps[] }[]>>;

    register(
        feed: FeedProps,
        items: FeedItemProps[]
    ): Promise<
        Result<{
            feed: FeedProps;
            items: FeedItemProps[];
        }>
    >;

    update(
        feed: FeedProps,
        items: FeedItemProps[]
    ): Promise<
        Result<{
            feed: FeedProps;
            items: FeedItemProps[];
        }>
    >;

    delete(uid: string): Promise<Result<void>>;
}
