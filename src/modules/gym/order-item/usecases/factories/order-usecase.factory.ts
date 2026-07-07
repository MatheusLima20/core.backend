import { InMemoryOrderRepository } from "@/modules/gym/order/repositories/implementations/in-memory-order.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryOrderItemRepository } from "../../repositories/implementations/in-memory-order-item.repository";
import { OrderItemUsecase } from "../order-item.usecase";

export function makeOrderItemUsecase(
    user: AuthUser,
    itemOrderRepository: InMemoryOrderItemRepository,
    orderRepository: InMemoryOrderRepository
) {
    const context = { user };

    return {
        usecase: new OrderItemUsecase(context, itemOrderRepository, orderRepository),
    };
}
