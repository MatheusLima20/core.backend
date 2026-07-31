import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryInventoryItemRepository } from "../../../repositories/implementations/in-memory-inventory-item.repository";
import { InventoryItemUsecase } from "../../inventory-item.usecase";

export class TestInventoryItemContext {
    userRepository = new InMemoryUserRepository();

    inventoryItemRepository = new InMemoryInventoryItemRepository();

    users: AuthUser[] = [];

    inventoryItemUsecases: InventoryItemUsecase[] = [];
}
