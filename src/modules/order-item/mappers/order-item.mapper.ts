import { OrderItemResponseDTO } from "../dtos/order-item-response.dto";
import { OrderItemProps } from "../entities/order-item.props";

export const OrderItemMapper = {
    toResponseDTO: (item: OrderItemProps): OrderItemResponseDTO => {
        return {
            uid: item.uid,
            orderUID: item.orderUID,
            platformUID: item.platformUID,
            unitPrice: item.unitPrice,
            amount: item.amount,
            productUID: item.productUID,
            createdBy: item.createdBy,
            updatedBy: item.updatedBy,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        };
    },

    toResponseDTOList: (items: OrderItemProps[]): OrderItemResponseDTO[] => {
        return items.map(OrderItemMapper.toResponseDTO);
    },
};
