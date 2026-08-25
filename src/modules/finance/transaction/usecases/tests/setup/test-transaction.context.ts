import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryTransactionRepository } from "../../../repositories/implementations/in-memory-transaction.repository";
import { TransactionUsecase } from "../../transaction.usecase";

export class TestTransactionContext {
    userRepository = new InMemoryUserRepository();

    transactionRepository = new InMemoryTransactionRepository();

    users: AuthUser[] = [];

    usecases: TransactionUsecase[] = [];
}
