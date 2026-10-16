import { RequestContext } from "@/shared/context/request-context";
import { ITransactionContext } from "@/shared/database/transaction/transaction-context.interface";
import { ITransactionManager } from "@/shared/database/transaction/transaction-manager.interface";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";

import { IFlockRepository } from "../../flock/repositories/flock-repository.interface";
import { InventoryItemNotFoundError } from "../../inventory/errors/inventory-item-not-found.error";
import { CreateFeedDTO, CreateFeedResponseDTO } from "../dtos/create-feed.dto";
import { FindFeedsDTO } from "../dtos/find-feeds.dto";
import { ResponseFeedDTO } from "../dtos/response-feed.dto";
import { UpdateFeedDTO, UpdateFeedResponseDTO } from "../dtos/update-feed.dto";
import { FeedEntity } from "../entities/feed.entity";
import { FeedItemEntity } from "../entities/feed-item.entity";
import { FeedItemAlreadyExistsError } from "../errors/feed-item-already-exists.error";
import { FeedItemNotFoundError } from "../errors/feed-item-not-found.error";
import { FeedNotFoundError } from "../errors/feed-not-found.error";
import { InvalidFeedCompositionError } from "../errors/invalid-feed-composition.error";
import { FeedMapper } from "../mappers/feed.mapper";
import { IFeedRepository } from "../repositories/feed-repository.interface";

export class FeedUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly transactionManager: ITransactionManager,
        private readonly feedRepository: IFeedRepository,
        private readonly flockRepository: IFlockRepository
    ) {}

    async create(data: CreateFeedDTO): Promise<Result<CreateFeedResponseDTO>> {
        const compositionValidation = this.validateComposition(data.items);

        if (isFailure(compositionValidation)) {
            return compositionValidation;
        }

        const duplicatedItemsValidation = this.validateDuplicatedItems([], data.items);

        if (isFailure(duplicatedItemsValidation)) {
            return duplicatedItemsValidation;
        }

        const created = await this.transactionManager.execute(async (transaction) => {
            const inventoryValidation = await this.validateInventoryItems(data.items, transaction);

            if (isFailure(inventoryValidation)) {
                return inventoryValidation;
            }

            const feed = new FeedEntity({
                platformUID: this.context.user.platformUID,
                createdBy: this.context.user.uid,
                updatedBy: undefined,

                createdAt: new Date(),
                updatedAt: new Date(),

                name: data.name,
                flockUID: data.flockUID,
                description: data.description,
            });

            const items = data.items.map(
                (item) =>
                    new FeedItemEntity({
                        feedUID: feed.uid,
                        inventoryItemUID: item.inventoryItemUID,
                        inclusionPercentage: item.inclusionPercentage,
                    })
            );

            return transaction.feedRepository.register(feed, items);
        });

        if (isFailure(created)) {
            return ResultFactory.failure(created.error);
        }

        return ResultFactory.success(
            FeedMapper.toCreateResponseDTO(created.data.feed, created.data.items)
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

        const updated = await this.transactionManager.execute(async (transaction) => {
            const feed = new FeedEntity({
                ...requiredFeed.data,

                name: data.name ?? requiredFeed.data.name,
                description: data.description ?? requiredFeed.data.description,

                updatedBy: this.context.user.uid,
                updatedAt: new Date(),
            });

            const items = requiredFeed.data.items.map(
                (item) =>
                    new FeedItemEntity({
                        ...item,
                        feedUID: feed.uid,
                    })
            );

            if (data.items) {
                const inventoryValidation = await this.validateInventoryItems(
                    data.items,
                    transaction
                );

                if (isFailure(inventoryValidation)) {
                    return inventoryValidation;
                }

                const duplicatedItemsValidation = this.validateDuplicatedItems(
                    requiredFeed.data.items,
                    data.items
                );

                if (isFailure(duplicatedItemsValidation)) {
                    return duplicatedItemsValidation;
                }

                for (const item of data.items) {
                    const index = items.findIndex((existingItem) => existingItem.uid === item.uid);

                    const feedItem = new FeedItemEntity({
                        uid: item.uid,
                        feedUID: feed.uid,
                        inventoryItemUID: item.inventoryItemUID,
                        inclusionPercentage: item.inclusionPercentage,
                    });

                    if (index === -1) {
                        items.push(feedItem);
                    } else {
                        items[index] = feedItem;
                    }
                }
            }

            // Valida sempre a composição final do Feed.
            const compositionValidation = this.validateComposition(items);

            if (isFailure(compositionValidation)) {
                return compositionValidation;
            }

            return transaction.feedRepository.update(feed, items);
        });

        if (isFailure(updated)) {
            return ResultFactory.failure(updated.error);
        }

        return ResultFactory.success(
            FeedMapper.toUpdatedResponseDTO(updated.data.feed, updated.data.items)
        );
    }

    async findByUID(uid: string): Promise<Result<ResponseFeedDTO | null>> {
        const result = await this.feedRepository.findByUID(this.context.user.platformUID, uid);

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch feed."));
        }

        if (!result.data) {
            return ResultFactory.success(null);
        }

        const { feed, items } = result.data;

        const [flockResult, itemNamesResult] = await Promise.all([
            this.flockRepository.findByUID(this.context.user.platformUID, feed.flockUID),
            this.findInventoryItemNames(items.map((item) => item.inventoryItemUID)),
        ]);

        if (isFailure(flockResult)) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch flock for feed."));
        }

        if (!flockResult.data) {
            return ResultFactory.failure(new PersistenceError("Flock not found for feed."));
        }

        if (isFailure(itemNamesResult)) {
            return ResultFactory.failure(itemNamesResult.error);
        }

        return ResultFactory.success(
            FeedMapper.toResponseDTO(feed, items, flockResult.data.name, itemNamesResult.data)
        );
    }

    async find(filters?: FindFeedsDTO): Promise<Result<PaginationResult<ResponseFeedDTO>>> {
        const result = await this.feedRepository.find(this.context.user.platformUID, filters);

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch feeds."));
        }

        const pagination = result.data;

        const flockUIDs = [...new Set(pagination.data.map(({ feed }) => feed.flockUID))];

        const inventoryItemUIDs = [
            ...new Set(
                pagination.data.flatMap(({ items }) => items.map((item) => item.inventoryItemUID))
            ),
        ];

        const [flocksResult, itemNamesResult] = await Promise.all([
            this.flockRepository.findByUIDs(this.context.user.platformUID, flockUIDs),
            this.findInventoryItemNames(inventoryItemUIDs),
        ]);

        if (isFailure(flocksResult)) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch flocks for feeds."));
        }

        if (isFailure(itemNamesResult)) {
            return ResultFactory.failure(itemNamesResult.error);
        }

        const flockNames = new Map(flocksResult.data.map((flock) => [flock.uid, flock.name]));

        const feeds = FeedMapper.toResponseDTOList(
            pagination.data,
            flockNames,
            itemNamesResult.data
        );

        return ResultFactory.success({
            ...pagination,
            data: feeds,
        });
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

        const deleted = await this.transactionManager.execute(async (transaction) => {
            return transaction.feedRepository.delete(uid);
        });

        if (isFailure(deleted)) {
            return ResultFactory.failure(new PersistenceError("Failed to delete feed."));
        }

        return ResultFactory.ok();
    }

    async deleteItems(feedUID: string, itemUIDs: string[]): Promise<Result<void>> {
        const existing = await this.findByUID(feedUID);

        if (isFailure(existing)) {
            return existing;
        }

        const requiredFeed = ResultMapper.requireData(
            existing,
            new FeedNotFoundError({
                uid: feedUID,
            })
        );

        if (isFailure(requiredFeed)) {
            return requiredFeed;
        }

        const itemsToDelete = requiredFeed.data.items.filter((item) => itemUIDs.includes(item.uid));

        if (itemsToDelete.length !== itemUIDs.length) {
            return ResultFactory.failure(
                new FeedItemNotFoundError({
                    uid: "One or more requested items",
                })
            );
        }

        const deleted = await this.transactionManager.execute(async (transaction) => {
            return transaction.feedRepository.deleteItems(feedUID, itemUIDs);
        });

        if (isFailure(deleted)) {
            return ResultFactory.failure(new PersistenceError("Failed to delete feed items."));
        }

        return ResultFactory.ok();
    }

    private validateComposition(items: Array<{ inclusionPercentage: number }>): Result<void> {
        const total = items.reduce((sum, item) => sum + item.inclusionPercentage, 0);

        if (total > 100) {
            return ResultFactory.failure(
                new InvalidFeedCompositionError({
                    total,
                    expected: 100,
                })
            );
        }

        return ResultFactory.success(undefined);
    }

    private async validateInventoryItems(
        items: Array<{ inventoryItemUID: string }>,
        transaction: ITransactionContext
    ): Promise<Result<void>> {
        for (const item of items) {
            const inventoryItem = await transaction.inventoryItemRepository.findByUID(
                this.context.user.platformUID,
                item.inventoryItemUID
            );

            if (isFailure(inventoryItem)) {
                return ResultFactory.failure(
                    new PersistenceError("Failed to validate inventory item.")
                );
            }

            if (!inventoryItem.data) {
                return ResultFactory.failure(
                    new InventoryItemNotFoundError({
                        uid: item.inventoryItemUID,
                    })
                );
            }
        }

        return ResultFactory.success(undefined);
    }

    private validateDuplicatedItems(
        existingItems: Array<{
            uid: string;
            inventoryItemUID: string;
        }>,
        newItems: Array<{
            uid?: string;
            inventoryItemUID: string;
        }>
    ): Result<void> {
        const existingInventoryItems = new Map(
            existingItems.map((item) => [item.inventoryItemUID, item.uid])
        );

        const requestedInventoryItems = new Set<string>();

        for (const item of newItems) {
            const existingItemUID = existingInventoryItems.get(item.inventoryItemUID);

            if (existingItemUID && existingItemUID !== item.uid) {
                return ResultFactory.failure(
                    new FeedItemAlreadyExistsError({
                        inventoryItemUID: item.inventoryItemUID,
                    })
                );
            }

            if (requestedInventoryItems.has(item.inventoryItemUID)) {
                return ResultFactory.failure(
                    new FeedItemAlreadyExistsError({
                        inventoryItemUID: item.inventoryItemUID,
                    })
                );
            }

            requestedInventoryItems.add(item.inventoryItemUID);
        }

        return ResultFactory.success(undefined);
    }

    private async findInventoryItemNames(
        inventoryItemUIDs: string[]
    ): Promise<Result<Map<string, string>>> {
        const uniqueUIDs = [...new Set(inventoryItemUIDs)];

        if (uniqueUIDs.length === 0) {
            return ResultFactory.success(new Map<string, string>());
        }

        return this.transactionManager.execute(async (transaction) => {
            const itemNames = new Map<string, string>();

            for (const inventoryItemUID of uniqueUIDs) {
                const result = await transaction.inventoryItemRepository.findByUID(
                    this.context.user.platformUID,
                    inventoryItemUID
                );

                if (isFailure(result)) {
                    return ResultFactory.failure(
                        new PersistenceError("Failed to fetch inventory item for feed.")
                    );
                }

                if (!result.data) {
                    return ResultFactory.failure(
                        new InventoryItemNotFoundError({
                            uid: inventoryItemUID,
                        })
                    );
                }

                itemNames.set(result.data.uid, result.data.name);
            }

            return ResultFactory.success(itemNames);
        });
    }
}
