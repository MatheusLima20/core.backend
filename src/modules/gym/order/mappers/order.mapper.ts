import { OrderResponseDTO } from "../dtos/order-response.dto";
import { UpdateOrderResponseDTO } from "../dtos/update-order.dto";
import { OrderProps } from "../entities/order.props";

export const OrderMapper = {
    toOrderUIDResponse: (order: OrderProps): OrderResponseDTO => {
        return {
            uid: order.uid,
            description: order.description,
            platformUID: order.platformUID,
            createdBy: order.createdBy,
            updatedBy: order.updatedBy,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        };
    },

    toOrderUIDResponseList: (orders: OrderProps[]): OrderResponseDTO[] => {
        return orders.map(OrderMapper.toOrderUIDResponse);
    },

    toUpdatedResponseDTO: (product: OrderProps): UpdateOrderResponseDTO => {
            return {
                uid: product.uid,
                description: product.description,
                updatedBy: product.updatedBy,
                updatedAt: product.updatedAt,
            };
        },
};
