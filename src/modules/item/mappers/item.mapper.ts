import { ItemResponseDTO } from "../dtos/item-response.dto";
import { ItemEntity } from "../entities/item.entity";

export const ItemMapper = {

    toItemUIDResponse: (
        item: ItemEntity,
    ): ItemResponseDTO => {

        return {
            uid: item.uid,
            name: item.name,
            orderUID: item.orderUID,
            platformUID: item.platformUID,
            description: item.description,
            value: item.value,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        };
    },

    toItemUIDResponseList: (
        items: ItemEntity[],
    ): ItemResponseDTO[] => {

        return items.map(
            ItemMapper.toItemUIDResponse
        );
    },
};