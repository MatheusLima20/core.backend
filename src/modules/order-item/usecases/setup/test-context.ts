import { InMemoryOrderRepository } from "@/modules/order/repositories/implementations/in-memory-order.repository";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryOrderItemRepository } from "../../repositories/implementations/in-memory-order-item.repository";
import { OrderItemUsecase } from "../order-item.usecase";

export class TestContext {
    userRepository = new InMemoryUserRepository();
    orderItemRepository = new InMemoryOrderItemRepository();
    orderRepository = new InMemoryOrderRepository();

    users: AuthUser[] = [];
    usecases: OrderItemUsecase[] = [];
}
