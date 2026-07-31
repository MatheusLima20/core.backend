import { InventoryCategory } from "../enums/inventory-category.enum";
import { InventoryUnit } from "../enums/inventory-unit.enum";

export interface InventoryItemProps {
    uid: string;

    platformUID?: string;

    name: string;

    category: InventoryCategory;

    trackStock: boolean;

    unit: InventoryUnit;

    minimumStock?: number;

    description?: string;

    createdBy?: string;
    updatedBy?: string;

    createdAt: Date;
    updatedAt: Date;
}
