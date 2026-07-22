import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryTransactionCategoryRepository } from "../../../repositories/implementations/in-memory-transaction-category.repository";
import { TransactionCategoryUsecase } from "../../transaction-category.usecase";

export function makeTransactionCategoryUsecase(
    user: AuthUser,
    transactionCategoryRepository: InMemoryTransactionCategoryRepository
) {
    const context = { user };

    return {
        usecase: new TransactionCategoryUsecase(context, transactionCategoryRepository),
    };
}
