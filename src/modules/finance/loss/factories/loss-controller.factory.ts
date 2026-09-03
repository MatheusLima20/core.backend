import { InventoryItemEntity } from "@/modules/farmora/inventory/entities/inventory-item.entity";
import { TypeORMInventoryItemRepository } from "@/modules/farmora/inventory/repositories/implementations/typeorm-inventory-item.repository";
import { dataSource } from "@/services/database/database";
import { RequestContext } from "@/shared/context/request-context";

import { TransactionEntity } from "../../transaction/entities/transaction.entity";
import { TypeORMTransactionRepository } from "../../transaction/repositories/implementations/type-orm-transaction.repository";
import { LossController } from "../controllers/loss.controller";
import { LossEntity } from "../entities/loss.entity";
import { TypeORMLossRepository } from "../repositories/implementations/type-orm-loss.repository";
import { LossUsecase } from "../usecases/loss.usecase";

export function makeLossController(context: RequestContext) {
    const lossRepository = new TypeORMLossRepository(dataSource.getRepository(LossEntity));

    const inventoryItemRepository = new TypeORMInventoryItemRepository(
        dataSource.getRepository(InventoryItemEntity)
    );

    const transactionRepository = new TypeORMTransactionRepository(
        dataSource.getRepository(TransactionEntity)
    );

    const usecase = new LossUsecase(
        context,
        lossRepository,
        inventoryItemRepository,
        transactionRepository
    );

    return new LossController(usecase);
}
