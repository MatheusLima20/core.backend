import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { PaginationUtil } from "@/shared/utils/pagination/pagination.util";
import { SortUtil } from "@/shared/utils/sort/sort.util";
import { StringUtil } from "@/shared/utils/string/string.util";

import { FindFeedsDTO } from "../../dtos/find-feeds.dto";
import { FeedEntity } from "../../entities/feed.entity";
import { FeedItemEntity } from "../../entities/feed-item.entity";
import { IFeedRepository } from "../feed-repository.interface";

export class InMemoryFeedRepository implements IFeedRepository {
    private feeds: FeedEntity[] = [];

    private feedItems: FeedItemEntity[] = [];

    async findByUID(
        platformUID: string,
        uid: string
    ): Promise<Result<{ feed: FeedEntity; items: FeedItemEntity[] } | null>> {
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
    ): Promise<
        Result<
            PaginationResult<{
                feed: FeedEntity;
                items: FeedItemEntity[];
            }>
        >
    > {
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

        const total = feeds.length;

        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const totalPages = Math.ceil(total / limit);

        const paginatedFeeds = PaginationUtil.paginate(feeds, page, limit);

        const data = paginatedFeeds.map((feed) => ({
            feed,
            items: this.feedItems.filter((item) => StringUtil.equals(item.feedUID, feed.uid)),
        }));

        return ResultFactory.success({
            data,
            total,
            page,
            limit,
            totalPages,
        });
    }

    async register(
        feed: FeedEntity,
        items: FeedItemEntity[]
    ): Promise<
        Result<{
            feed: FeedEntity;
            items: FeedItemEntity[];
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
        feed: FeedEntity,
        items: FeedItemEntity[]
    ): Promise<
        Result<{
            feed: FeedEntity;
            items: FeedItemEntity[];
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

    async deleteItems(feedUID: string, itemUIDs: string[]): Promise<Result<void>> {
        this.feedItems = this.feedItems.filter(
            (item) => item.feedUID !== feedUID || !itemUIDs.includes(item.uid)
        );

        return ResultFactory.ok();
    }
}
