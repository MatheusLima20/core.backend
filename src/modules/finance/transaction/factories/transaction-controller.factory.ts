import { dataSource } from "@/services/database/database";
import { RequestContext } from "@/shared/context/request-context";

import { TransactionController } from "../controllers/transaction.controller";
import { TransactionEntity } from "../entities/transaction.entity";
import { TypeORMTransactionRepository } from "../repositories/implementations/type-orm-transaction.repository";
import { TransactionUsecase } from "../usecases/transaction.usecase";

export function makeTransactionController(context: RequestContext) {
    const transactionRepository = new TypeORMTransactionRepository(
        dataSource.getRepository(TransactionEntity)
    );

    const usecase = new TransactionUsecase(context, transactionRepository);

    return new TransactionController(usecase);
}
