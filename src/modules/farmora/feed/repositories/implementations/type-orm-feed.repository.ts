import { In, Repository } from "typeorm";

import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindFeedsDTO } from "../../dtos/find-feeds.dto";
import { FeedEntity } from "../../entities/feed.entity";
import { FeedItemEntity } from "../../entities/feed-item.entity";
import { IFeedRepository } from "../feed-repository.interface";

export class TypeORMFeedRepository implements IFeedRepository {
    constructor(
        private readonly feedRepository: Repository<FeedEntity>,
        private readonly feedItemRepository: Repository<FeedItemEntity>
    ) {}

    async findByUID(
        platformUID: string,
        uid: string
    ): Promise<Result<{ feed: FeedEntity; items: FeedItemEntity[] } | null>> {
        const feed = await this.feedRepository.findOne({
            where: {
                uid,
                platformUID,
            },
        });

        if (!feed) {
            return ResultFactory.success(null);
        }

        const items = await this.feedItemRepository.find({
            where: {
                feedUID: feed.uid,
            },
        });

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
        const page = Math.max(1, Math.floor(filters?.page ?? 1));
        const limit = Math.min(100, Math.max(1, Math.floor(filters?.limit ?? 10)));

        const query = this.feedRepository
            .createQueryBuilder("feed")
            .where("feed.platformUID = :platformUID", {
                platformUID,
            });

        const name = filters?.name?.trim();

        if (name) {
            query.andWhere("LOWER(feed.name) LIKE LOWER(:name)", {
                name: `%${name}%`,
            });
        }

        const allowedOrderFields = ["name", "createdAt", "updatedAt"] as const;

        const orderBy =
            filters?.orderBy &&
            allowedOrderFields.includes(filters.orderBy as (typeof allowedOrderFields)[number])
                ? filters.orderBy
                : "createdAt";

        const order = filters?.order?.toUpperCase() === "ASC" ? "ASC" : "DESC";

        query.orderBy(`feed.${orderBy}`, order);

        const total = await query.getCount();

        const feeds = await query
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();

        const feedUIDs = feeds.map((feed) => feed.uid);

        const items = feedUIDs.length
            ? await this.feedItemRepository
                  .createQueryBuilder("item")
                  .where("item.feedUID IN (:...feedUIDs)", {
                      feedUIDs,
                  })
                  .getMany()
            : [];

        const itemsByFeedUID = new Map<string, FeedItemEntity[]>();

        for (const item of items) {
            const feedItems = itemsByFeedUID.get(item.feedUID) ?? [];

            feedItems.push(item);
            itemsByFeedUID.set(item.feedUID, feedItems);
        }

        const data = feeds.map((feed) => ({
            feed,
            items: itemsByFeedUID.get(feed.uid) ?? [],
        }));

        return ResultFactory.success({
            data,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
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
        const savedFeed = await this.feedRepository.save(feed);

        const savedItems = await this.feedItemRepository.save(items);

        return ResultFactory.success({
            feed: savedFeed,
            items: savedItems,
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
        await this.feedRepository.save(feed);

        await this.feedItemRepository.delete({
            feedUID: feed.uid,
        });

        const savedItems = await this.feedItemRepository.save(items);

        return ResultFactory.success({
            feed,
            items: savedItems,
        });
    }

    async deleteItems(feedUID: string, itemUIDs: string[]): Promise<Result<void>> {
        await this.feedItemRepository.delete({
            feedUID,
            uid: In(itemUIDs),
        });

        return ResultFactory.ok();
    }

    async delete(uid: string): Promise<Result<void>> {
        await this.feedItemRepository.delete({
            feedUID: uid,
        });

        await this.feedRepository.delete(uid);

        return ResultFactory.ok();
    }
}
