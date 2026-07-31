import { Result } from "@/shared/result";

import { FindInventoryItemsDTO } from "../dtos/find-inventory-items.dto";
import { InventoryItemProps } from "../entities/inventory-item.props";

export interface IInventoryItemRepository {
    findByUID(platformUID: string, uid: string): Promise<Result<InventoryItemProps | null>>;

    find(
        platformUID: string,
        filters?: FindInventoryItemsDTO
    ): Promise<Result<InventoryItemProps[]>>;

    exists(
        platformUID: string,
        data: {
            name: string;
            category: string;
            unit: string;
            ignoreUID?: string;
        }
    ): Promise<Result<boolean>>;

    register(inventoryItem: InventoryItemProps): Promise<Result<InventoryItemProps>>;

    update(inventoryItem: InventoryItemProps): Promise<Result<InventoryItemProps>>;

    delete(uid: string): Promise<Result<void>>;
}
