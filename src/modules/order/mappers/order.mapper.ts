import { OrderResponseDTO } from "../dtos/order-response.dto";
import { OrderEntity } from "../entities/order.entity";


export const OrderMapper = {

    toOrderUIDResponse: (
        order: OrderEntity,
    ): OrderResponseDTO => {

        return {
            uid: order.uid,
            description: order.description,
            platformUID: order.platformUID,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
        };
    },

    toOrderUIDResponseList: (
        orders: OrderEntity[],
    ): OrderResponseDTO[] => {

        return orders.map(
            OrderMapper.toOrderUIDResponse
        );
    },
};