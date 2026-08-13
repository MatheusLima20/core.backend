import { CreateInventoryItemResponseDTO } from "../dtos/create-inventory-item.dto";
import { ResponseInventoryItemDTO } from "../dtos/inventory-item-response.dto";
import { UpdateInventoryItemResponseDTO } from "../dtos/update-inventory-item.dto";
import { InventoryItemProps } from "../entities/inventory-item.props";

export const InventoryItemMapper = {
    toResponseDTO: (inventoryItem: InventoryItemProps): ResponseInventoryItemDTO => {
        return {
            uid: inventoryItem.uid,
            platformUID: inventoryItem.platformUID,
            name: inventoryItem.name,
            category: inventoryItem.category,
            unit: inventoryItem.unit,
            trackStock: inventoryItem.trackStock,
            crudeProtein: inventoryItem.crudeProtein,
            crudeFiber: inventoryItem.crudeFiber,
            metabolizableEnergy: inventoryItem.metabolizableEnergy,
            calcium: inventoryItem.calcium,
            minimumStock: inventoryItem.minimumStock,
            description: inventoryItem.description,
            createdBy: inventoryItem.createdBy,
            updatedBy: inventoryItem.updatedBy,
            createdAt: inventoryItem.createdAt,
            updatedAt: inventoryItem.updatedAt,
        };
    },

    toResponseDTOList: (inventoryItems: InventoryItemProps[]): ResponseInventoryItemDTO[] => {
        return inventoryItems.map(InventoryItemMapper.toResponseDTO);
    },

    toCreateResponseDTO: (inventoryItem: InventoryItemProps): CreateInventoryItemResponseDTO => {
        return {
            uid: inventoryItem.uid,
            platformUID: inventoryItem.platformUID,
            name: inventoryItem.name,
            category: inventoryItem.category,
            unit: inventoryItem.unit,
            trackStock: inventoryItem.trackStock,
            minimumStock: inventoryItem.minimumStock,
            description: inventoryItem.description,
            createdBy: inventoryItem.createdBy,
            createdAt: inventoryItem.createdAt,
        };
    },

    toUpdatedResponseDTO: (inventoryItem: InventoryItemProps): UpdateInventoryItemResponseDTO => {
        return {
            uid: inventoryItem.uid,
            name: inventoryItem.name,
            category: inventoryItem.category,
            unit: inventoryItem.unit,
            trackStock: inventoryItem.trackStock,
            minimumStock: inventoryItem.minimumStock,
            description: inventoryItem.description,
            updatedBy: inventoryItem.updatedBy,
            updatedAt: inventoryItem.updatedAt,
        };
    },
};
