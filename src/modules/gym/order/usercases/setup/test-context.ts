import { InMemoryMembershipRepository } from "@/modules/membership/repositories/implementations/in-memory-membership.repository";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryOrderRepository } from "../../repositories/implementations/in-memory-order.repository";
import { OrderUsecase } from "../order.usecase";

export class TestContext {
    userRepository = new InMemoryUserRepository();
    orderRepository = new InMemoryOrderRepository();

    membershipRepository = new InMemoryMembershipRepository();

    users: AuthUser[] = [];
    usecases: OrderUsecase[] = [];
}
