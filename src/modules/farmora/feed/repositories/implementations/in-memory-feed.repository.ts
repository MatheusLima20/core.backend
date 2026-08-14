import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { PaginationUtil } from "@/shared/utils/pagination/pagination.util";
import { SortUtil } from "@/shared/utils/sort/sort.util";
import { StringUtil } from "@/shared/utils/string/string.util";

import { FindFeedsDTO } from "../../dtos/find-feeds.dto";
import { FeedProps } from "../../entities/feed.props";
import { FeedItemProps } from "../../entities/feed-item.props";
import { IFeedRepository } from "../feed-repository.interface";

export class InMemoryFeedRepository implements IFeedRepository {
    private feeds: FeedProps[] = [];

    private feedItems: FeedItemProps[] = [];

    async findByUID(
        platformUID: string,
        uid: string
    ): Promise<Result<{ feed: FeedProps; items: FeedItemProps[] } | null>> {
        const feed =
            this.feeds.find(
                (item) =>
                    StringUtil.equals(item.platformUID, platformUID) &&
                    StringUtil.equals(item.uid, uid)
            ) ?? null;

        if (!feed) {
            return ResultFactory.success(null);
        }

        const items = this.feedItems.filter((item) => StringUtil.equals(item.feedUID, feed.uid));

        return ResultFactory.success({
            feed,
            items,
        });
    }

    async find(
        platformUID: string,
        filters?: FindFeedsDTO
    ): Promise<Result<{ feed: FeedProps; items: FeedItemProps[] }[]>> {
        let feeds = this.feeds.filter((item) => StringUtil.equals(item.platformUID, platformUID));

        if (filters?.name) {
            feeds = feeds.filter((item) => StringUtil.equalsIgnoreCase(item.name, filters.name!));
        }

        if (filters?.orderBy) {
            feeds = SortUtil.sort({
                items: feeds,
                orderBy: filters.orderBy,
                order: filters.order,
            });
        }

        if (filters?.page && filters?.limit) {
            feeds = PaginationUtil.paginate(feeds, filters.page, filters.limit);
        }

        const result = feeds.map((feed) => ({
            feed,
            items: this.feedItems.filter((item) => StringUtil.equals(item.feedUID, feed.uid)),
        }));

        return ResultFactory.success(result);
    }

    async register(
        feed: FeedProps,
        items: FeedItemProps[]
    ): Promise<
        Result<{
            feed: FeedProps;
            items: FeedItemProps[];
        }>
    > {
        this.feeds.push(feed);

        this.feedItems.push(...items);

        return ResultFactory.success({
            feed,
            items,
        });
    }

    async update(
        feed: FeedProps,
        items: FeedItemProps[]
    ): Promise<
        Result<{
            feed: FeedProps;
            items: FeedItemProps[];
        }>
    > {
        const index = this.feeds.findIndex((item) => StringUtil.equals(item.uid, feed.uid));

        if (index !== -1) {
            this.feeds[index] = feed;
        }

        this.feedItems = this.feedItems.filter(
            (item) => !StringUtil.equals(item.feedUID, feed.uid)
        );

        this.feedItems.push(...items);

        return ResultFactory.success({
            feed,
            items,
        });
    }

    async delete(uid: string): Promise<Result<void>> {
        const index = this.feeds.findIndex((item) => StringUtil.equals(item.uid, uid));

        if (index !== -1) {
            this.feeds.splice(index, 1);
        }

        this.feedItems = this.feedItems.filter((item) => !StringUtil.equals(item.feedUID, uid));

        return ResultFactory.success(undefined);
    }
}
