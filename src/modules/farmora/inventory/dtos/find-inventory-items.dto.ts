import { InventoryItemProps } from "../entities/inventory-item.props";

export interface FindInventoryItemsDTO {
    name?: string;

    category?: string;

    unit?: string;

    trackStock?: boolean;

    page?: number;
    limit?: number;

    orderBy?: keyof Pick<
        InventoryItemProps,
        "name" | "category" | "unit" | "createdAt" | "updatedAt"
    >;

    order?: "asc" | "desc";
}
