import { In, Repository } from "typeorm";

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
    ): Promise<Result<{ feed: FeedEntity; items: FeedItemEntity[] }[]>> {
        const query = this.feedRepository
            .createQueryBuilder("feed")
            .where("feed.platformUID = :platformUID", { platformUID });

        if (filters?.name) {
            query.andWhere("LOWER(feed.name) = LOWER(:name)", {
                name: filters.name,
            });
        }

        if (filters?.orderBy) {
            query.orderBy(
                `feed.${filters.orderBy}`,
                filters.order?.toUpperCase() === "DESC" ? "DESC" : "ASC"
            );
        }

        if (filters?.page && filters?.limit) {
            query.skip((filters.page - 1) * filters.limit);
            query.take(filters.limit);
        }

        const feeds = await query.getMany();

        const result = await Promise.all(
            feeds.map(async (feed) => {
                const items = await this.feedItemRepository.find({
                    where: {
                        feedUID: feed.uid,
                    },
                });

                return {
                    feed,
                    items,
                };
            })
        );

        return ResultFactory.success(result);
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
