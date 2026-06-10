import { OrderItemResponseDTO } from "../dtos/order-item-response.dto";
import { OrderItemProps } from "../entities/order-item.props";

export const OrderItemMapper = {

    toItemUIDResponse: (
        item: OrderItemProps,
    ): OrderItemResponseDTO => {

        return {
            uid: item.uid,
            orderUID: item.orderUID,
            platformUID: item.platformUID,
            unitPrice: item.unitPrice,
            amount: item.amount,
            productUID: item.productUID,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
        };
    },

    toItemUIDResponseList: (
        items: OrderItemProps[],
    ): OrderItemResponseDTO[] => {

        return items.map(
            OrderItemMapper.toItemUIDResponse
        );
    },
};