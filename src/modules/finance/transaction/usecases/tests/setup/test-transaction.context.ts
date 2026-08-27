import { InMemoryMembershipRepository } from "@/modules/membership/repositories/implementations/in-memory-membership.repository";
import { InMemoryUserRepository } from "@/modules/user/repositories/implementations/in-memory-user.repository";
import { AuthUser } from "@/shared/context/auth.user";

import { InMemoryTransactionRepository } from "../../../repositories/implementations/in-memory-transaction.repository";
import { TransactionUsecase } from "../../transaction.usecase";

export class TestTransactionContext {
    userRepository = new InMemoryUserRepository();

    transactionRepository = new InMemoryTransactionRepository();

    membershipRepository = new InMemoryMembershipRepository();

    users: AuthUser[] = [];

    usecases: TransactionUsecase[] = [];
}
