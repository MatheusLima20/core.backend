import { InventoryCategory } from "../enums/inventory-category.enum";
import { InventoryUnit } from "../enums/inventory-unit.enum";
import { InventoryItemProps } from "./inventory-item.props";

export class InventoryItemEntity implements InventoryItemProps {
    uid!: string;

    platformUID?: string;

    name!: string;

    category!: InventoryCategory;

    trackStock!: boolean;

    unit!: InventoryUnit;

    minimumStock?: number;

    description?: string;

    createdBy?: string;
    updatedBy?: string;

    createdAt!: Date;
    updatedAt!: Date;

    constructor(props: InventoryItemProps) {
        Object.assign(this, props);
    }
}
