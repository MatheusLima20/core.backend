import { InventoryItemProps } from "../entities/inventory-item.props";

export type UpdateInventoryItemDTO = Pick<InventoryItemProps, "uid"> &
    Partial<
        Pick<
            InventoryItemProps,
            "name" | "category" | "unit" | "trackStock" | "minimumStock" | "description"
        >
    >;

export type UpdateInventoryItemResponseDTO = Pick<
    InventoryItemProps,
    | "uid"
    | "name"
    | "category"
    | "unit"
    | "trackStock"
    | "minimumStock"
    | "description"
    | "updatedBy"
    | "updatedAt"
>;
