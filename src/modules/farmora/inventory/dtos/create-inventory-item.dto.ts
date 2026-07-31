import { InventoryItemProps } from "../entities/inventory-item.props";

export type CreateInventoryItemDTO = Pick<
    InventoryItemProps,
    "name" | "category" | "unit" | "trackStock" | "minimumStock" | "description"
> &
    Partial<Pick<InventoryItemProps, "createdAt">>;

export type CreateInventoryItemResponseDTO = Pick<
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
    | "createdAt"
>;
