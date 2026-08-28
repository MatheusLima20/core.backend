import { InventoryItemEntity } from "../entities/inventory-item.entity";

export type CreateInventoryItemDTO = Pick<
    InventoryItemEntity,
    | "name"
    | "category"
    | "unit"
    | "trackStock"
    | "crudeProtein"
    | "crudeFiber"
    | "metabolizableEnergy"
    | "calcium"
    | "minimumStock"
    | "description"
> &
    Partial<Pick<InventoryItemEntity, "createdAt">>;

export type CreateInventoryItemResponseDTO = Pick<
    InventoryItemEntity,
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
