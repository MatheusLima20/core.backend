import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryTransactionCategoryRepository } from "../../../repositories/implementations/in-memory-transaction-category.repository";
import { TransactionCategoryUsecase } from "../../transaction-category.usecase";

export class TestTransactionCategoryContext {
    userRepository = new InMemoryUserRepository();

    transactionCategoryRepository = new InMemoryTransactionCategoryRepository();

    users: AuthUser[] = [];

    usecases: TransactionCategoryUsecase[] = [];
}
