import { InventoryItemEntity } from "../entities/inventory-item.entity";

export interface FindInventoryItemsDTO {
    name?: string;

    category?: string;

    unit?: string;

    trackStock?: boolean;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<
        InventoryItemEntity,
        "name" | "category" | "unit" | "createdAt" | "updatedAt"
    >;

    order?: "asc" | "desc";
}
