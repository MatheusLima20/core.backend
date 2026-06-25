import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryOrderRepository } from "../../repositories/implementations/in-memory-order.repository";
import { OrderUsecase } from "../order.usecase";

export class TestContext {
    userRepository = new InMemoryUserRepository();
    orderRepository = new InMemoryOrderRepository();

    users: AuthUser[] = [];
    usecases: OrderUsecase[] = [];
}
