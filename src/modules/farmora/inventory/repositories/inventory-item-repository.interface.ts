import { PaginationResult } from "@/shared/pagination/pagination.result";
import { Result } from "@/shared/result";

import { FindInventoryItemsDTO } from "../dtos/find-inventory-items.dto";
import { InventoryItemEntity } from "../entities/inventory-item.entity";

export interface IInventoryItemRepository {
    findByUID(platformUID: string, uid: string): Promise<Result<InventoryItemEntity | null>>;

    find(
        platformUID: string,
        filters?: FindInventoryItemsDTO
    ): Promise<Result<PaginationResult<InventoryItemEntity>>>;

    exists(
        platformUID: string,
        data: {
            name: string;
            category: string;
            unit: string;
            ignoreUID?: string;
        }
    ): Promise<Result<boolean>>;

    register(inventoryItem: InventoryItemEntity): Promise<Result<InventoryItemEntity>>;

    update(inventoryItem: InventoryItemEntity): Promise<Result<InventoryItemEntity>>;

    delete(uid: string): Promise<Result<void>>;
}
