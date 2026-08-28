import { InventoryItemEntity } from "../entities/inventory-item.entity";

export type ResponseInventoryItemDTO = Pick<
    InventoryItemEntity,
    | "uid"
    | "platformUID"
    | "name"
    | "category"
    | "unit"
    | "crudeProtein"
    | "crudeFiber"
    | "metabolizableEnergy"
    | "calcium"
    | "trackStock"
    | "minimumStock"
    | "description"
    | "createdBy"
    | "updatedBy"
    | "createdAt"
    | "updatedAt"
>;
