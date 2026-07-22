import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryTransactionRepository } from "../../../repositories/implementations/in-memory-transaction.repository";
import { TransactionUsecase } from "../../transaction.usecase";

export function makeTransactionUsecase(
    user: AuthUser,
    transactionRepository: InMemoryTransactionRepository
) {
    const context = { user };

    return {
        usecase: new TransactionUsecase(context, transactionRepository),
    };
}
