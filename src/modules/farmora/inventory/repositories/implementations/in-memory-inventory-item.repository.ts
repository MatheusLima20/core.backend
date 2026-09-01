import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";
import { ResultFactory } from "@/shared/result/result.factory";
import { PaginationUtil } from "@/shared/utils/pagination/pagination.util";
import { SortUtil } from "@/shared/utils/sort/sort.util";
import { StringUtil } from "@/shared/utils/string/string.util";

import { FindInventoryItemsDTO } from "../../dtos/find-inventory-items.dto";
import { InventoryItemEntity } from "../../entities/inventory-item.entity";
import { IInventoryItemRepository } from "../inventory-item-repository.interface";

export class InMemoryInventoryItemRepository implements IInventoryItemRepository {
    private inventoryItems: InventoryItemEntity[] = [];

    async findByUID(platformUID: string, uid: string): Promise<Result<InventoryItemEntity | null>> {
        const inventoryItem =
            this.inventoryItems.find(
                (item) =>
                    StringUtil.equals(item.platformUID!, platformUID) &&
                    StringUtil.equals(item.uid, uid)
            ) ?? null;

        return ResultFactory.success(inventoryItem);
    }

    async find(
        platformUID: string,
        filters?: FindInventoryItemsDTO
    ): Promise<Result<PaginationResult<InventoryItemEntity>>> {
        let inventoryItems = this.inventoryItems.filter((item) =>
            StringUtil.equals(item.platformUID!, platformUID)
        );

        if (filters?.name) {
            inventoryItems = inventoryItems.filter((item) =>
                StringUtil.equalsIgnoreCase(item.name, filters.name!)
            );
        }

        if (filters?.category) {
            inventoryItems = inventoryItems.filter((item) => item.category === filters.category);
        }

        if (filters?.unit) {
            inventoryItems = inventoryItems.filter((item) => item.unit === filters.unit);
        }

        if (filters?.trackStock !== undefined) {
            inventoryItems = inventoryItems.filter(
                (item) => item.trackStock === filters.trackStock
            );
        }

        if (filters?.orderBy) {
            inventoryItems = SortUtil.sort({
                items: inventoryItems,
                orderBy: filters.orderBy,
                order: filters.order,
            });
        }

        const total = inventoryItems.length;

        const page = filters?.page ?? 1;
        const limit = filters?.limit ?? 10;

        const totalPages = Math.ceil(total / limit);

        const data = PaginationUtil.paginate(inventoryItems, page, limit);

        return ResultFactory.success({
            data,
            page,
            limit,
            total,
            totalPages,
        });
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
        const exists = this.inventoryItems.some(
            (item) =>
                StringUtil.equals(item.platformUID!, platformUID) &&
                StringUtil.equalsIgnoreCase(item.name, data.name) &&
                item.category === data.category &&
                item.unit === data.unit &&
                item.uid !== data.ignoreUID
        );

        return ResultFactory.success(exists);
    }

    async register(inventoryItem: InventoryItemEntity): Promise<Result<InventoryItemEntity>> {
        this.inventoryItems.push(inventoryItem);

        return ResultFactory.success(inventoryItem);
    }

    async update(inventoryItem: InventoryItemEntity): Promise<Result<InventoryItemEntity>> {
        const index = this.inventoryItems.findIndex((item) =>
            StringUtil.equals(item.uid, inventoryItem.uid)
        );

        this.inventoryItems[index] = inventoryItem;

        return ResultFactory.success(inventoryItem);
    }

    async delete(uid: string): Promise<Result<void>> {
        const index = this.inventoryItems.findIndex((item) => StringUtil.equals(item.uid, uid));

        if (index !== -1) {
            this.inventoryItems.splice(index, 1);
        }

        return ResultFactory.success(undefined);
    }
}
