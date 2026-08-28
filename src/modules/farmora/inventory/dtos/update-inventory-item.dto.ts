import { InventoryItemEntity } from "../entities/inventory-item.entity";

export type UpdateInventoryItemDTO = Pick<InventoryItemEntity, "uid"> &
    Partial<
        Pick<
            InventoryItemEntity,
            | "name"
            | "category"
            | "unit"
            | "trackStock"
            | "minimumStock"
            | "description"
            | "crudeProtein"
            | "crudeFiber"
            | "metabolizableEnergy"
            | "calcium"
        >
    >;

export type UpdateInventoryItemResponseDTO = Pick<
    InventoryItemEntity,
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
