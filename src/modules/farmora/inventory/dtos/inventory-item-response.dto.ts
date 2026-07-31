import { InventoryItemProps } from "../entities/inventory-item.props";

export type ResponseInventoryItemDTO = Pick<
    InventoryItemProps,
    | "uid"
    | "platformUID"
    | "name"
    | "category"
    | "unit"
    | "trackStock"
    | "minimumStock"
    | "description"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;
