import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryInventoryItemRepository } from "../../../repositories/implementations/in-memory-inventory-item.repository";
import { InventoryItemUsecase } from "../../inventory-item.usecase";

export function makeInventoryItemUsecase(
    user: AuthUser,
    inventoryItemRepository: InMemoryInventoryItemRepository
) {
    const context = { user };

    return {
        usecase: new InventoryItemUsecase(context, inventoryItemRepository),
    };
}
