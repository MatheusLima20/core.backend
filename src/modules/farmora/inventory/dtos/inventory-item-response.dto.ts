import { InventoryItemProps } from "../entities/inventory-item.props";

export type ResponseInventoryItemDTO = Pick<
    InventoryItemProps,
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
