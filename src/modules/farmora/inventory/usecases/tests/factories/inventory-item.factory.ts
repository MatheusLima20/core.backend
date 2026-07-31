import { CreateInventoryItemDTO } from "../../../dtos/create-inventory-item.dto";
import { InventoryCategory } from "../../../enums/inventory-category.enum";
import { InventoryUnit } from "../../../enums/inventory-unit.enum";

export const inventoryItem1: CreateInventoryItemDTO = {
    name: "Newcastle Vaccine",
    category: InventoryCategory.VACCINE,
    unit: InventoryUnit.DOSE,
    trackStock: true,
    minimumStock: 20,
    description: "Vaccination for Newcastle disease.",
};

export const inventoryItem2: CreateInventoryItemDTO = {
    name: "Corn",
    category: InventoryCategory.FEED,
    unit: InventoryUnit.KG,
    trackStock: true,
    minimumStock: 100,
    description: "Corn used for feed formulation.",
};

export const inventoryItem3: CreateInventoryItemDTO = {
    name: "Soybean Meal",
    category: InventoryCategory.FEED,
    unit: InventoryUnit.KG,
    trackStock: true,
    minimumStock: 50,
    description: "Protein source for poultry feed.",
};

export const inventoryItem4: CreateInventoryItemDTO = {
    name: "Vitamin Supplement",
    category: InventoryCategory.MEDICINE,
    unit: InventoryUnit.LITER,
    trackStock: true,
    minimumStock: 5,
    description: "Vitamin supplementation.",
};

export function makeInventoryItem(data?: Partial<CreateInventoryItemDTO>): CreateInventoryItemDTO {
    return {
        ...inventoryItem1,
        ...data,
    };
}
