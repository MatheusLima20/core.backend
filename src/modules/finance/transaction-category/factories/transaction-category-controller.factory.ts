import { dataSource } from "@/services/database/database";
import { RequestContext } from "@/shared/context/request-context";

import { TransactionCategoryController } from "../controllers/transaction-category.controller";
import { TransactionCategoryEntity } from "../entities/transaction-category.entity";
import { TypeORMTransactionCategoryRepository } from "../repositories/implementations/type-orm-transaction-category.repository";
import { TransactionCategoryUsecase } from "../usecases/transaction-category.usecase";

export function makeTransactionCategoryController(context: RequestContext) {
    const transactionCategoryRepository = new TypeORMTransactionCategoryRepository(
        dataSource.getRepository(TransactionCategoryEntity)
    );

    const usecase = new TransactionCategoryUsecase(context, transactionCategoryRepository);

    return new TransactionCategoryController(usecase);
}
