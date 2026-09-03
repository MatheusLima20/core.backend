import { InMemoryInventoryItemRepository } from "@/modules/farmora/inventory/repositories/implementations/in-memory-inventory-item.repository";
import { InMemoryTransactionRepository } from "@/modules/finance/transaction/repositories/implementations/in-memory-transaction.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryLossRepository } from "../../../repositories/implementations/in-memory-loss.repository";
import { LossUsecase } from "../../loss.usecase";

export function makeLossUsecase(
    user: AuthUser,
    lossRepository: InMemoryLossRepository,
    inventoryItemRepository: InMemoryInventoryItemRepository,
    transactionRepository: InMemoryTransactionRepository
) {
    const context = { user };

    return {
        usecase: new LossUsecase(
            context,
            lossRepository,
            inventoryItemRepository,
            transactionRepository
        ),
    };
}
