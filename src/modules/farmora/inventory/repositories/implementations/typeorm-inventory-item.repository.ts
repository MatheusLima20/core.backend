import { Repository } from "typeorm";

import { PersistenceError } from "@/shared/errors/persistence.error";
import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";

import { FindInventoryItemsDTO } from "../../dtos/find-inventory-items.dto";
import { InventoryItemEntity } from "../../entities/inventory-item.entity";
import { IInventoryItemRepository } from "../inventory-item-repository.interface";

export class TypeORMInventoryItemRepository implements IInventoryItemRepository {
    constructor(private readonly repository: Repository<InventoryItemEntity>) {}

    async findByUID(platformUID: string, uid: string): Promise<Result<InventoryItemEntity | null>> {
        try {
            const inventoryItem = await this.repository.findOne({
                where: {
                    platformUID,
                    uid,
                },
            });

            return ResultFactory.success(inventoryItem);
        } catch {
            return ResultFactory.failure(new PersistenceError("Failed to find inventory item."));
        }
    }

    async find(
        platformUID: string,
        filters?: FindInventoryItemsDTO
    ): Promise<Result<PaginationResult<InventoryItemEntity>>> {
        try {
            const page = filters?.page ?? 1;
            const limit = filters?.limit ?? 10;

            const query = this.repository
                .createQueryBuilder("inventoryItem")
                .where("inventoryItem.platformUID = :platformUID", {
                    platformUID,
                });

            if (filters?.name) {
                query.andWhere("LOWER(inventoryItem.name) = LOWER(:name)", {
                    name: filters.name,
                });
            }

            if (filters?.category) {
                query.andWhere("inventoryItem.category = :category", {
                    category: filters.category,
                });
            }

            if (filters?.unit) {
                query.andWhere("inventoryItem.unit = :unit", {
                    unit: filters.unit,
                });
            }

            if (filters?.trackStock !== undefined) {
                query.andWhere("inventoryItem.trackStock = :trackStock", {
                    trackStock: filters.trackStock,
                });
            }

            const orderByMap = {
                name: "inventoryItem.name",
                category: "inventoryItem.category",
                unit: "inventoryItem.unit",
                createdAt: "inventoryItem.createdAt",
                updatedAt: "inventoryItem.updatedAt",
            } as const;

            if (filters?.orderBy) {
                query.orderBy(
                    orderByMap[filters.orderBy],
                    filters.order === "asc" ? "ASC" : "DESC"
                );
            }

            query.skip((page - 1) * limit);
            query.take(limit);

            const [data, total] = await query.getManyAndCount();

            const totalPages = Math.ceil(total / limit);

            return ResultFactory.success({
                data,
                page,
                limit,
                total,
                totalPages,
            });
        } catch {
            return ResultFactory.failure(new PersistenceError("Failed to find inventory items."));
        }
    }

    async exists(
        platformUID: string,
        data: {
            name: string;
            category: string;
            unit: string;
            ignoreUID?: string;
        }
    ): Promise<Result<boolean>> {
        try {
            const query = this.repository
                .createQueryBuilder("inventoryItem")
                .where("inventoryItem.platformUID = :platformUID", {
                    platformUID,
                })
                .andWhere("LOWER(inventoryItem.name) = LOWER(:name)", {
                    name: data.name,
                })
                .andWhere("inventoryItem.category = :category", {
                    category: data.category,
                })
                .andWhere("inventoryItem.unit = :unit", {
                    unit: data.unit,
                });

            if (data.ignoreUID) {
                query.andWhere("inventoryItem.uid != :ignoreUID", {
                    ignoreUID: data.ignoreUID,
                });
            }

            const exists = await query.getExists();

            return ResultFactory.success(exists);
        } catch {
            return ResultFactory.failure(
                new PersistenceError("Failed to check inventory item existence.")
            );
        }
    }

    async register(inventoryItem: InventoryItemEntity): Promise<Result<InventoryItemEntity>> {
        try {
            const saved = await this.repository.save(inventoryItem);

            return ResultFactory.success(saved);
        } catch {
            return ResultFactory.failure(
                new PersistenceError("Failed to register inventory item.")
            );
        }
    }

    async update(inventoryItem: InventoryItemEntity): Promise<Result<InventoryItemEntity>> {
        try {
            const saved = await this.repository.save(inventoryItem);

            return ResultFactory.success(saved);
        } catch {
            return ResultFactory.failure(new PersistenceError("Failed to update inventory item."));
        }
    }

    async delete(uid: string): Promise<Result<void>> {
        try {
            await this.repository.delete({
                uid,
            });

            return ResultFactory.success(undefined);
        } catch {
            return ResultFactory.failure(new PersistenceError("Failed to delete inventory item."));
        }
    }
}
