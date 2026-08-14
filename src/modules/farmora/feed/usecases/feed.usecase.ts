import { randomUUID } from "crypto";

import { RequestContext } from "@/shared/context/request-context";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";

import { CreateFeedDTO, CreateFeedResponseDTO } from "../dtos/create-feed.dto";
import { FindFeedsDTO } from "../dtos/find-feeds.dto";
import { ResponseFeedDTO } from "../dtos/response-feed.dto";
import { UpdateFeedDTO, UpdateFeedResponseDTO } from "../dtos/update-feed.dto";
import { FeedEntity } from "../entities/feed.entity";
import { FeedItemEntity } from "../entities/feed-item.entity";
import { FeedNotFoundError } from "../errors/feed-not-found.error";
import { FeedMapper } from "../mappers/feed.mapper";
import { IFeedRepository } from "../repositories/feed-repository.interface";

export class FeedUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly feedRepository: IFeedRepository
    ) {}

    async create(data: CreateFeedDTO): Promise<Result<CreateFeedResponseDTO>> {
        const feed = new FeedEntity({
            uid: randomUUID(),

            platformUID: this.context.user.platformUID,

            createdBy: this.context.user.uid,
            updatedBy: undefined,

            createdAt: new Date(),
            updatedAt: new Date(),

            name: data.name,
            description: data.description,
        });

        const items = data.items.map(
            (item) =>
                new FeedItemEntity({
                    uid: randomUUID(),

                    feedUID: feed.uid,

                    inventoryItemUID: item.inventoryItemUID,

                    inclusionPercentage: item.inclusionPercentage,
                })
        );

        const created = await this.feedRepository.register(feed, items);

        if (isFailure(created)) {
            return ResultFactory.failure(new PersistenceError("Failed to create feed."));
        }

        return ResultFactory.success(
            FeedMapper.toCreateResponseDTO(created.data.feed, created.data.items)
        );
    }

    async findByUID(uid: string): Promise<Result<ResponseFeedDTO | null>> {
        const result = await this.feedRepository.findByUID(this.context.user.platformUID, uid);

        if (isFailure(result)) {
            return ResultFactory.success(null);
        }

        if (!result.data) {
            return ResultFactory.success(null);
        }

        return ResultFactory.success(FeedMapper.toResponseDTO(result.data.feed, result.data.items));
    }

    async find(filters?: FindFeedsDTO): Promise<Result<ResponseFeedDTO[]>> {
        const result = await this.feedRepository.find(this.context.user.platformUID, filters);

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch feeds."));
        }

        return ResultFactory.success(
            result.data.map(({ feed, items }) => FeedMapper.toResponseDTO(feed, items))
        );
    }

    async update(data: UpdateFeedDTO): Promise<Result<UpdateFeedResponseDTO>> {
        const existing = await this.findByUID(data.uid);

        if (isFailure(existing)) {
            return existing;
        }

        const requiredFeed = ResultMapper.requireData(
            existing,
            new FeedNotFoundError({
                uid: data.uid,
            })
        );

        if (isFailure(requiredFeed)) {
            return requiredFeed;
        }

        const feed = new FeedEntity({
            ...requiredFeed.data,

            ...data,

            updatedBy: this.context.user.uid,
            updatedAt: new Date(),
        });

        const items =
            data.items?.map(
                (item) =>
                    new FeedItemEntity({
                        uid: item.uid ?? randomUUID(),

                        feedUID: feed.uid,

                        inventoryItemUID: item.inventoryItemUID,

                        inclusionPercentage: item.inclusionPercentage,
                    })
            ) ??
            requiredFeed.data.items.map(
                (item) =>
                    new FeedItemEntity({
                        ...item,
                        feedUID: feed.uid,
                    })
            );

        const updated = await this.feedRepository.update(feed, items);

        if (isFailure(updated)) {
            return ResultFactory.failure(new PersistenceError("Failed to update feed."));
        }

        return ResultFactory.success(
            FeedMapper.toUpdatedResponseDTO(updated.data.feed, updated.data.items)
        );
    }

    async delete(uid: string): Promise<Result<void>> {
        const existing = await this.findByUID(uid);

        if (isFailure(existing)) {
            return ResultFactory.failure(
                new FeedNotFoundError({
                    uid,
                })
            );
        }

        if (existing.data === null) {
            return ResultFactory.failure(
                new FeedNotFoundError({
                    uid,
                })
            );
        }

        const deleted = await this.feedRepository.delete(uid);

        if (isFailure(deleted)) {
            return ResultFactory.failure(new PersistenceError("Failed to delete feed."));
        }

        return ResultFactory.ok();
    }
}
