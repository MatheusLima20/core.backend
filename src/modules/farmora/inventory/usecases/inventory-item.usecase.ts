import { randomUUID } from "crypto";

import { RequestContext } from "@/shared/context/request-context";
import { PersistenceError } from "@/shared/errors/persistence.error";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { isFailure } from "@/shared/result/result.guard";
import { ResultMapper } from "@/shared/result/result.mapper";

import {
    CreateInventoryItemDTO,
    CreateInventoryItemResponseDTO,
} from "../dtos/create-inventory-item.dto";
import { FindInventoryItemsDTO } from "../dtos/find-inventory-items.dto";
import { ResponseInventoryItemDTO } from "../dtos/inventory-item-response.dto";
import {
    UpdateInventoryItemDTO,
    UpdateInventoryItemResponseDTO,
} from "../dtos/update-inventory-item.dto";
import { InventoryItemEntity } from "../entities/inventory-item.entity";
import { DuplicateInventoryItemError } from "../errors/duplicate-inventory-item.error";
import { InventoryItemNotFoundError } from "../errors/inventory-item-not-found.error";
import { InventoryItemMapper } from "../mappers/inventory-item.mapper";
import { IInventoryItemRepository } from "../repositories/inventory-item-repository.interface";

export class InventoryItemUsecase {
    constructor(
        private readonly context: RequestContext,
        private readonly inventoryItemRepository: IInventoryItemRepository
    ) {}

    async create(data: CreateInventoryItemDTO): Promise<Result<CreateInventoryItemResponseDTO>> {
        const duplicated = await this.inventoryItemRepository.exists(
            this.context.user.platformUID,
            {
                name: data.name,
                category: data.category,
                unit: data.unit,
            }
        );

        if (isFailure(duplicated)) {
            return duplicated;
        }

        if (duplicated.data) {
            return ResultFactory.failure(
                new DuplicateInventoryItemError({
                    name: data.name,
                    category: data.category,
                    unit: data.unit,
                })
            );
        }

        const inventoryItem = new InventoryItemEntity({
            uid: randomUUID(),

            platformUID: this.context.user.platformUID,

            createdBy: this.context.user.uid,
            updatedBy: undefined,

            createdAt: new Date(),
            updatedAt: new Date(),

            ...data,
        });

        const created = await this.inventoryItemRepository.register(inventoryItem);

        if (isFailure(created)) {
            return ResultFactory.failure(new PersistenceError("Failed to create inventory item."));
        }

        return ResultMapper.map(created, InventoryItemMapper.toCreateResponseDTO);
    }

    async findByUID(uid: string): Promise<Result<ResponseInventoryItemDTO | null>> {
        const result = await this.inventoryItemRepository.findByUID(
            this.context.user.platformUID,
            uid
        );

        if (isFailure(result)) {
            return ResultFactory.success(null);
        }

        if (!result.data) {
            return ResultFactory.success(null);
        }

        return ResultMapper.map(
            ResultFactory.success(result.data),
            InventoryItemMapper.toResponseDTO
        );
    }

    async find(filters?: FindInventoryItemsDTO): Promise<Result<ResponseInventoryItemDTO[]>> {
        const result = await this.inventoryItemRepository.find(
            this.context.user.platformUID,
            filters
        );

        if (isFailure(result)) {
            return ResultFactory.failure(new PersistenceError("Failed to fetch inventory items."));
        }

        return ResultMapper.map(result, InventoryItemMapper.toResponseDTOList);
    }

    async update(data: UpdateInventoryItemDTO): Promise<Result<UpdateInventoryItemResponseDTO>> {
        const existing = await this.findByUID(data.uid);

        if (isFailure(existing)) {
            return existing;
        }

        const requiredInventoryItem = ResultMapper.requireData(
            existing,
            new InventoryItemNotFoundError({
                uid: data.uid,
            })
        );

        if (isFailure(requiredInventoryItem)) {
            return requiredInventoryItem;
        }

        const inventoryItem = new InventoryItemEntity({
            ...requiredInventoryItem.data,
            ...data,

            updatedBy: this.context.user.uid,
            updatedAt: new Date(),
        });

        const duplicated = await this.inventoryItemRepository.exists(
            this.context.user.platformUID,
            {
                name: inventoryItem.name,
                category: inventoryItem.category,
                unit: inventoryItem.unit,
                ignoreUID: inventoryItem.uid,
            }
        );

        if (isFailure(duplicated)) {
            return duplicated;
        }

        if (duplicated.data) {
            return ResultFactory.failure(
                new DuplicateInventoryItemError({
                    name: inventoryItem.name,
                    category: inventoryItem.category,
                    unit: inventoryItem.unit,
                })
            );
        }

        const updated = await this.inventoryItemRepository.update(inventoryItem);

        if (isFailure(updated)) {
            return ResultFactory.failure(new PersistenceError("Failed to update inventory item."));
        }

        return ResultMapper.map(updated, InventoryItemMapper.toUpdatedResponseDTO);
    }

    async delete(uid: string): Promise<Result<void>> {
        const existing = await this.findByUID(uid);

        if (isFailure(existing)) {
            return ResultFactory.failure(
                new InventoryItemNotFoundError({
                    uid,
                })
            );
        }

        if (existing.data === null) {
            return ResultFactory.failure(
                new InventoryItemNotFoundError({
                    uid,
                })
            );
        }

        const deleted = await this.inventoryItemRepository.delete(uid);

        if (isFailure(deleted)) {
            return ResultFactory.failure(new PersistenceError("Failed to delete inventory item."));
        }

        return ResultFactory.ok();
    }
}
