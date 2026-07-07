import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryOrderRepository } from "../../repositories/implementations/in-memory-order.repository";
import { OrderUsecase } from "../order.usecase";

export function makeOrderUsecase(
    user: AuthUser,
    orderRepository: InMemoryOrderRepository,
) {
    const context = { user };

    return {
        usecase: new OrderUsecase(context, orderRepository),
    };
}
