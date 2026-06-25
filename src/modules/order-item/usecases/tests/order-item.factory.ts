import { makeLoggedUser } from "@/modules/auth/usecases/tests/auth.factory";
import { InMemoryOrderRepository } from "@/modules/order/repositories/implementations/in-memory-order.repository";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { RequestContext } from "@/shared/context/request-context";

import { InMemoryOrderItemRepository } from "../../repositories/implementations/in-memory-item.repository";
import { ItemUsecase } from "../item.usecase";

export async function makeItemUsecase() {
    const itemRepository = new InMemoryOrderItemRepository();

    const orderRepository = new InMemoryOrderRepository();

    const userRepository = new InMemoryUserRepository();

    const authUser = await makeLoggedUser(userRepository);

    const context: RequestContext = {
        user: authUser,
    };

    const usecase = new ItemUsecase(context, itemRepository, orderRepository);

    return {
        usecase,
        context,
        itemRepository,
        orderRepository,
        userRepository,
    };
}
